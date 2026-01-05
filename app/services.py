# ---------------------------------------------------------
# GOOGLE GENERATIVE AI IMPLEMENTATION (Standard SDK)
# Reference: Uses google-generativeai instead of the experimental SDK
# ---------------------------------------------------------
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from google.ai.generativelanguage import Content, Part
from pypdf import PdfReader
import os
import json
import re
import polars as pl
import numpy as np
import time
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY is missing in .env")
else:
    try:
        genai.configure(api_key=api_key)
    except Exception as e:
        print(f"Failed to configure API: {e}")

# MODELS CONFIGURATION
# Using the stable name from your reference
PRIMARY_MODEL = "gemini-2.0-flash"
FALLBACK_MODEL = "gemini-1.5-flash"

# ==========================================
# 🛠️ HELPER: ROBUST RETRY LOGIC
# ==========================================

def generate_with_retry(model_name, prompt, generation_config=None):
    """
    Wraps the Gemini generation call with smart rate-limit handling using the standard SDK.
    """
    max_retries = 3
    base_delay = 5
    
    models_to_try = [model_name, FALLBACK_MODEL] if model_name != FALLBACK_MODEL else [model_name]

    for current_model_name in models_to_try:
        print(f"🤖 Analyzing with model: {current_model_name}...")
        try:
            model = genai.GenerativeModel(current_model_name)
        except Exception as e:
            print(f"❌ Failed to initialize model {current_model_name}: {e}")
            continue
        
        for attempt in range(max_retries):
            try:
                response = model.generate_content(
                    prompt,
                    generation_config=generation_config
                )
                return response
            
            except google_exceptions.ResourceExhausted as e:
                wait_time = base_delay * (2 ** attempt) # 5s, 10s, 20s...
                print(f"⚠️ Rate limit (429) hit for {current_model_name}. Retrying in {wait_time}s...")
                time.sleep(wait_time)
                continue
                
            except Exception as e:
                print(f"❌ Error with {current_model_name} (Attempt {attempt+1}): {e}")
                # If it's not a rate limit (e.g. 404, 500), break retry loop for this model and try next model
                if "429" not in str(e) and "ResourceExhausted" not in str(e):
                    break
                time.sleep(2) # Short sleep for other errors
    
    raise Exception("Max retries exceeded for all available models.")

# ==========================================
# 🚀 FAST CSV PIPELINE (Polars + Vectorized)
# ==========================================

def normalize_columns(df: pl.DataFrame) -> pl.DataFrame:
    cols = df.columns
    mapping = {}
    for col in cols:
        c = col.lower().strip()
        if "vendor" in c or "merchant" in c: mapping[col] = "vendor"
        elif "desc" in c or "detail" in c: mapping[col] = "description"
        elif "amount" in c or "cost" in c or "price" in c: mapping[col] = "amount"
        elif "date" in c or "time" in c: mapping[col] = "date"
    if mapping: df = df.rename(mapping)
    return df

def load_csv_fast(file_path: str) -> pl.DataFrame:
    try:
        df = pl.read_csv(file_path, infer_schema_length=1000, ignore_errors=True, null_values=["NA", "null", "None"])
        df = normalize_columns(df)
        expected_cols = ["vendor", "description", "amount", "date"]
        selected_cols = [c for c in expected_cols if c in df.columns]
        
        if "amount" in selected_cols:
            df = df.with_columns(
                pl.col("amount").cast(pl.Utf8).str.replace_all(r"[$,]", "").cast(pl.Float64, strict=False).alias("amount")
            )
        return df.select(selected_cols)
    except Exception as e:
        print(f"Polars Load Error: {e}")
        return pl.DataFrame()

def get_suspicious_transactions(df: pl.DataFrame) -> pl.DataFrame:
    if df.is_empty(): return df
    # Filters
    round_txns = df.filter((pl.col("amount") % 1000 == 0) & (pl.col("amount") > 0)) if "amount" in df.columns else pl.DataFrame()
    amount_txns = df.filter(pl.col("amount") > 5000) if "amount" in df.columns else pl.DataFrame()
    
    # Frequency Filter
    freq_txns = pl.DataFrame()
    if "vendor" in df.columns:
        vendor_counts = df.group_by("vendor").len().filter(pl.col("len") >= 5).select("vendor")
        freq_txns = df.join(vendor_counts, on="vendor", how="inner")

    try:
        # Combine filters
        suspicious = pl.concat([round_txns, freq_txns, amount_txns], how="vertical").unique()
        return suspicious
    except Exception:
        return df.head(10)

def process_csv_fast(file_path: str):
    df = load_csv_fast(file_path)
    if df.is_empty(): return {"total_rows": 0, "suspicious_rows": 0, "llm_payload": []}
    
    suspicious_df = get_suspicious_transactions(df)
    llm_payload = suspicious_df.head(50).to_dicts() # Limit to 50 for AI

    return {
        "total_rows": df.height,
        "suspicious_rows": suspicious_df.height,
        "llm_payload": llm_payload
    }

# ==========================================
# 📄 FILE HANDLERS
# ==========================================

def extract_text_from_file(file_path: str):
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    if ext == '.pdf': return extract_text_from_pdf(file_path)
    elif ext in ['.txt', '.md', '.json']: return extract_text_from_csv(file_path)
    return ""

def extract_text_from_pdf(file_path: str):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += (page.extract_text() or "") + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def extract_text_from_csv(file_path: str):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f: return f.read()
    except Exception: return ""

# ==========================================
# 🧠 AI ANALYSIS (Standard SDK Implementation)
# ==========================================

def analyze_with_gemini(text: str):
    prompt = f"""
    Analyze the following financial/audit data.
    DATA: {text[:30000]}
    
    OUTPUT JSON FORMAT ONLY: 
    {{ "score": 0-100, "status": "PASSED/FAILED", "summary": "...", "risks": [], "recommendations": [] }}
    """
    
    try:
        # REMOVED: generation_config with response_mime_type to fix compatibility error.
        # The prompt "OUTPUT JSON FORMAT ONLY" + regex cleaning below is sufficient.

        # Call with retry logic
        response = generate_with_retry(
            model_name=PRIMARY_MODEL,
            prompt=prompt
        )
        
        # Clean and parse response
        cleaned_text = response.text.strip()
        # Remove any markdown code blocks if present
        cleaned_text = re.sub(r"```json\s*", "", cleaned_text)
        cleaned_text = re.sub(r"```\s*$", "", cleaned_text).strip()
        
        return json.loads(cleaned_text)

    except Exception as e:
        print(f"Gemini Analysis Error (All retries failed): {e}")
        return {
            "score": 0, "status": "ERROR", 
            "summary": f"AI Error: {str(e)}", "risks": [], "recommendations": []
        }

def answer_user_question(question: str, context_text: str):
    prompt = f"Context: {context_text}\nQuestion: {question}"
    try:
        response = generate_with_retry(
            model_name=PRIMARY_MODEL,
            prompt=prompt
        )
        return response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"

def split_text_into_chunks(text: str, chunk_size: int = 1000, overlap: int = 200):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
import json
from datetime import datetime
from chromadb.api.models.Collection import Collection

# Relative imports to find files in the same folder
from .chroma_connection import get_chroma_collection
from .services import (
    extract_text_from_file, 
    analyze_with_gemini, 
    answer_user_question, 
    split_text_into_chunks,
    process_csv_fast
)
from .schemas import AuditResponse

app = FastAPI(title="Audit Auto Backend")

# Allow all origins to prevent CORS errors on localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def root():
    return {"message": "Audit Auto AI Backend is Running"}

@app.post("/audit-file/", response_model=AuditResponse)
async def audit_file(
    file: UploadFile = File(...), 
    collection: Collection = Depends(get_chroma_collection)
):
    # 1. Save File
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    final_text_for_ai = ""
    ai_result = None
    
    try:
        # 2. Process based on File Type
        _, ext = os.path.splitext(file.filename)
        ext = ext.lower()
        
        if ext == '.csv':
            print(f"Processing CSV: {file.filename}")
            csv_result = process_csv_fast(file_path)
            
            # Smart Skip: If no suspicious rows, pass automatically
            if csv_result['suspicious_rows'] == 0:
                ai_result = {
                    "score": 100,
                    "status": "PASSED",
                    "summary": f"Scanned {csv_result['total_rows']} rows. No anomalies found.",
                    "risks": [],
                    "recommendations": ["No action needed."]
                }
                final_text_for_ai = f"Clean CSV Audit: {file.filename}. {csv_result['total_rows']} rows checked."
            else:
                payload_str = json.dumps(csv_result['llm_payload'], indent=2)
                final_text_for_ai = (
                    f"AUDIT REPORT: {file.filename}\n"
                    f"Total Rows: {csv_result['total_rows']}\n"
                    f"Suspicious: {csv_result['suspicious_rows']}\n"
                    f"DATA:\n{payload_str}"
                )
        else:
            # PDF / Text processing
            final_text_for_ai = extract_text_from_file(file_path)
            if not final_text_for_ai:
                raise HTTPException(status_code=400, detail="Empty or unreadable file.")

        # 3. AI Analysis (Only if not already skipped)
        if ai_result is None:
            ai_result = analyze_with_gemini(final_text_for_ai)

        # 4. Store in ChromaDB (Batching to prevent crash)
        chunks = split_text_into_chunks(final_text_for_ai)
        if chunks:
            ids = [f"{file.filename}_{uuid.uuid4()}_{i}" for i in range(len(chunks))]
            metadatas = [{
                "filename": file.filename,
                "score": ai_result.get("score", 0),
                "status": ai_result.get("status", "UNKNOWN"),
                "upload_time": str(datetime.now()),
                "chunk_index": i
            } for i in range(len(chunks))]

            # Batch Insert (5000 items per batch)
            batch_size = 5000
            for i in range(0, len(chunks), batch_size):
                collection.add(
                    documents=chunks[i:i+batch_size],
                    metadatas=metadatas[i:i+batch_size],
                    ids=ids[i:i+batch_size]
                )

    except Exception as e:
        print(f"Processing/Storage Error: {e}")
        # If AI failed, return a fallback error report instead of crashing
        if ai_result is None:
            ai_result = {
                "score": 0, "status": "ERROR", 
                "summary": "Processing failed.", "risks": [str(e)], "recommendations": []
            }

    return {
        "filename": file.filename,
        "score": ai_result.get("score", 0),
        "status": ai_result.get("status", "UNKNOWN"),
        "summary": ai_result.get("summary", "No summary"),
        "risks": ai_result.get("risks", []),
        "recommendations": ai_result.get("recommendations", [])
    }

@app.get("/ask/")
def ask_document(
    question: str, 
    collection: Collection = Depends(get_chroma_collection)
):
    try:
        results = collection.query(query_texts=[question], n_results=3)
        if not results['documents'] or not results['documents'][0]:
            return {"answer": "No relevant documents found."}

        context = " ".join(results['documents'][0])
        answer = answer_user_question(question, context)
        
        return {
            "question": question, 
            "answer": answer,
            "sources": results['metadatas'][0][0] if results['metadatas'][0] else {}
        }
    except Exception as e:
        return {"answer": f"Error searching database: {str(e)}"}
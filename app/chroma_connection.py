import chromadb
from chromadb.api import ClientAPI
from chromadb.api.models.Collection import Collection
from fastapi import Depends
import os
from dotenv import load_dotenv
from pathlib import Path

# 1. Force Python to find .env in the same folder as this file
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Debug: Print to terminal to prove it loaded
print(f"DEBUG: Connecting to Chroma Tenant: {os.getenv('CHROMA_TENANT')}")

_client: ClientAPI | None = None
_collection: Collection | None = None

def get_chroma_client() -> ClientAPI:
    global _client
    if _client is None:
        # Connect to Chroma Cloud
        try:
            _client = chromadb.CloudClient(
                api_key=os.getenv("CHROMA_API_KEY"),
                tenant=os.getenv("CHROMA_TENANT"),
                database=os.getenv("CHROMA_DATABASE")
            )
            print("DEBUG: Chroma Cloud Client initialized successfully")
        except Exception as e:
            print(f"ERROR: Failed to connect to Chroma: {e}")
            raise e
    return _client

def get_chroma_collection(client: ClientAPI = Depends(get_chroma_client)) -> Collection:
    global _collection
    if _collection is None:
        _collection = client.get_or_create_collection(
            name="audit_docs", 
            metadata={"hnsw:space": "cosine"}
        )
    return _collection
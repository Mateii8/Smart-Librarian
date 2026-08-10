from dotenv import load_dotenv
import os

load_dotenv() # Încarcă variabilele din fișierul .env

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") # Citește cheia OpenAI din variabilele de mediu

GPT_MODEL = "gpt-5.5"

EMBEDDING_MODEL = "text-embedding-3-small" # transforma textul in vectori pentru ChromaDB

CHROMA_PATH = "chroma_db" # Directorul unde ChromaDB își va salva datele

DATA_PATH = "data"
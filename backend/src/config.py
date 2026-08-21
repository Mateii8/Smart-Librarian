from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

GPT_MODEL = "gpt-5.5"

EMBEDDING_MODEL = "text-embedding-3-small"

CHROMA_PATH = "chroma_db"

DATA_PATH = "data"
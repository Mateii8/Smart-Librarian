from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.chatbot import ask
from src.data_loader import load_book_summaries
from src.vector_store import index_books, collection_is_empty


app = FastAPI(
    title="Smart Librarian API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str


@app.get("/")
def root():
    return {
        "message": "Smart Librarian API is running"
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    result = ask(request.message)

    return result


@app.post("/api/index")
def index_books_endpoint():
    if not collection_is_empty():
        return {
            "message": "Books are already indexed."
        }

    books = load_book_summaries()
    index_books(books)

    return {
        "message": f"{len(books)} books indexed successfully."
    }
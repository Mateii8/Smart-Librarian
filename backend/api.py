from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from src.config import OPENAI_API_KEY
from src.chatbot import ask
from src.data_loader import load_book_summaries
from src.vector_store import index_books, collection_is_empty


app = FastAPI(
    title="Smart Librarian API",
    version="1.0.0"
)

openai_client = OpenAI(api_key=OPENAI_API_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    title: str

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
    title: str


@app.get("/")
def root():
    return {
        "message": "Smart Librarian API is running"
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    result = ask(request.message)

    return ChatResponse(
        answer=result["answer"],
        title=result["title"]
    )


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

@app.post("/api/image")
def generate_image(request: ImageRequest):
    response = openai_client.images.generate(
        model="gpt-image-1",
        prompt=(
            "Create an original fantasy illustration for a book recommendation app. "
            "Use a magical school atmosphere, glowing books, candles, an old library, "
            "mysterious corridors, friendship and adventure. "
            "Do not depict copyrighted characters, logos, book covers, "
            "or recognizable elements from an existing franchise."
        ),
        size="1024x1024"
    )

    return {
        "image": response.data[0].b64_json
    }
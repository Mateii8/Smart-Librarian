from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic import BaseModel
from openai import BadRequestError
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
    try:
        response = openai_client.images.generate(
            model="gpt-image-1",
            prompt=(
                "Create an original fantasy illustration for a book "
                "recommendation application. "
                "Show an atmospheric library, glowing books, magical light, "
                "adventure and mystery. "
                "Do not depict existing characters, logos, book covers, "
                "celebrities or recognizable copyrighted characters."
            ),
            size="1024x1024"
        )

        return {
            "image": response.data[0].b64_json
        }

    except BadRequestError as error:
        print(f"Image generation error: {error}")

        raise HTTPException(
            status_code=400,
            detail="The image could not be generated. Please try again."
        )
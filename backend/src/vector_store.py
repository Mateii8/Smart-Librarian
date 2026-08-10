from openai import OpenAI
import chromadb

from src.config import (
    OPENAI_API_KEY,
    EMBEDDING_MODEL,
    CHROMA_PATH
)

client = OpenAI(api_key=OPENAI_API_KEY)

chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)


def get_collection():
    collection = chroma_client.get_or_create_collection(
        name="book_summaries"
    )

    return collection


def create_embedding(text):
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text
    )

    return response.data[0].embedding


def index_books(books):
    collection = get_collection()

    for book in books:

        document = f"""
Title: {book["title"]}

Description:
{book["description"]}

Themes:
{", ".join(book["themes"])}
"""

        embedding = create_embedding(document)

        collection.upsert(
            ids=[book["title"]],
            documents=[document],
            embeddings=[embedding],
            metadatas=[
                {
                    "title": book["title"]
                }
            ]
        )

    print(f"Books stored in ChromaDB: {collection.count()}")


def search_books(query, n_results=3):
    collection = get_collection()

    query_embedding = create_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    found_books = []

    for index in range(len(results["ids"][0])):

        book = {
            "id": results["ids"][0][index],
            "title": results["metadatas"][0][index]["title"],
            "document": results["documents"][0][index],
            "distance": results["distances"][0][index]
        }

        found_books.append(book)

    return found_books

def collection_is_empty():
    collection = get_collection()

    return collection.count() == 0
import json

from openai import OpenAI

from src.config import (
    OPENAI_API_KEY,
    GPT_MODEL
)
from src.tools import (
    GET_SUMMARY_TOOL,
    get_summary_by_title
)
from src.vector_store import search_books


client = OpenAI(api_key=OPENAI_API_KEY)


def build_context(books: list[dict]) -> str:
    context_parts = []

    for book in books:
        context_parts.append(book["document"])

    return "\n\n---\n\n".join(context_parts)


def ask(question: str) -> str:
    books = search_books(question)

    if not books:
        return "I could not find a suitable book in the database."

    context = build_context(books)

    first_response = client.responses.create(
        model=GPT_MODEL,
        tools=[GET_SUMMARY_TOOL],
        input=[
            {
                "role": "system",
                "content": (
                    "You are Smart Librarian, a helpful book recommendation assistant. "
                    "Use only the books provided in the retrieved context. "
                    "Choose exactly one book that best matches the user's request. "
                    "After choosing the book, call get_summary_by_title using the exact title. "
                    "Do not invent book titles."
                )
            },
            {
                "role": "user",
                "content": f"""
User question:

{question}

Books retrieved from ChromaDB:

{context}
"""
            }
        ]
    )

    tool_outputs = []

    for item in first_response.output:
        if item.type != "function_call":
            continue

        if item.name != "get_summary_by_title":
            continue

        arguments = json.loads(item.arguments)

        title = arguments["title"]

        summary = get_summary_by_title(title)

        tool_outputs.append(
            {
                "type": "function_call_output",
                "call_id": item.call_id,
                "output": json.dumps(
                    {
                        "title": title,
                        "summary": summary
                    },
                    ensure_ascii=False
                )
            }
        )

    if not tool_outputs:
        return "The model did not call the summary tool."

    final_response = client.responses.create(
        model=GPT_MODEL,
        tools=[GET_SUMMARY_TOOL],
        previous_response_id=first_response.id,
        input=tool_outputs
    )

    return final_response.output_text
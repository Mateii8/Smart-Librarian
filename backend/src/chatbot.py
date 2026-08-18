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

    question_lower = question.lower().strip()

    greetings = [
        "salut",
        "buna",
        "bună",
        "hello",
        "hi",
        "hey",
        "neata",
        "bună dimineața",
        "buna dimineata",
        "bună seara",
        "buna seara",
    ]

    if question_lower in greetings:
        return {
            "answer": (
                "Salut! 👋 Eu sunt Smart Librarian.\n\n"
                "Te pot ajuta să găsești cărți în funcție de genul, tema sau subiectul care te interesează și îți pot oferi un rezumat detaliat al cărților recomandate.\n\n"
                "Spune-mi ce fel de carte cauți!"
            ),
            "title": None
        }

    if question_lower in [
        "ce faci",
        "ce faci?",
        "cum esti",
        "cum ești",
        "cum esti?",
        "cum ești?"
    ]:
        return {
            "answer": (
                "Sunt bine, mulțumesc! 😊\n\n"
                "Sunt gata să te ajut să găsești următoarea carte pe care să o citești."
            ),
            "title": None
        }

    if question_lower in [
        "ce poti face",
        "ce poți face",
        "ce poti face?",
        "ce poți face?"
    ]:
        return {
            "answer": (
                "Pot să îți recomand cărți în funcție de preferințele tale, "
                "să găsesc cărți pe baza temelor sau genurilor și să îți ofer "
                "rezumate detaliate ale cărților recomandate."
            ),
            "title": None
        }

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
        "You are Smart Librarian, an AI assistant that ONLY answers questions related to books. "
        "Use only the books provided in the retrieved context. "
        "Recommend exactly one book that best matches the user's request. "
        "After selecting a book, call get_summary_by_title using the exact title. "
        "Do not answer questions unrelated to books. "
        "If the user asks about any other topic (food, sports, politics, programming, etc.), "
        "reply only with: "
        "'I'm sorry, I can only answer questions related to books and book recommendations.'"
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

    return {
        "answer": final_response.output_text,
        "title": title
    }
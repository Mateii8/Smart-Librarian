import json
from pathlib import Path

from backend.src.config import DATA_PATH


def load_summaries() -> dict:
    summaries_file = Path(DATA_PATH) / "book_summaries.json"

    with open(summaries_file, "r", encoding="utf-8") as file:
        return json.load(file)


def get_summary_by_title(title: str) -> str:
    summaries = load_summaries()

    normalized_title = title.strip().lower()

    for stored_title, summary in summaries.items():
        if stored_title.strip().lower() == normalized_title:
            return summary

    return f"Summary not found for the book '{title}'."


GET_SUMMARY_TOOL = {
    "type": "function",
    "name": "get_summary_by_title",
    "description": (
        "Returns the complete detailed summary of a book using its exact title. "
        "Call this function after choosing the recommended book."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "The exact title of the recommended book."
            }
        },
        "required": ["title"],
        "additionalProperties": False
    },
    "strict": True
}
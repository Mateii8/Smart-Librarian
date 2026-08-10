from pathlib import Path

from backend.src.config import DATA_PATH


def load_book_summaries():
    book_file = Path(DATA_PATH) / "book_summaries.md"

    with open(book_file, "r", encoding="utf-8") as file:
        content = file.read()

    books = content.split("## Title:")

    parsed_books = []

    for book in books:

        if not book.strip():
            continue

        lines = book.splitlines()

        title = lines[0].strip()

        themes = []

        description = []

        for line in lines[1:]:

            if line.startswith("Themes:"):
                themes_text = line.replace("Themes:", "").strip()
                themes = [
                    theme.strip().rstrip(".")
                    for theme in themes_text.split(",")
                ]
                break

            if line.strip():
                description.append(line)

        description = "\n".join(description)

        book_data = {
            "title": title,
            "description": description,
            "themes": themes
        }

        parsed_books.append(book_data)

    return parsed_books
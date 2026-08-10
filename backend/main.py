from src.chatbot import ask
from src.data_loader import load_book_summaries
from src.vector_store import (
    index_books,
    collection_is_empty
)


def main():
    books = load_book_summaries()

    if collection_is_empty():
        print("Indexing books...")
        index_books(books)
    else:
        print("Books are already indexed.")

    print("Smart Librarian")
    print("Type 'exit' to close the application.")

    while True:
        question = input("\nYou: ").strip()

        if question.lower() == "exit":
            print("Goodbye!")
            break

        if not question:
            print("Please enter a question.")
            continue

        try:
            answer = ask(question)

            print("\nSmart Librarian:")
            print(answer)

        except Exception as error:
            print(f"\nAn error occurred: {error}")


if __name__ == "__main__":
    main()
# 📚 Smart Librarian

Smart Librarian is an AI-powered book recommendation system built with Python, OpenAI, and ChromaDB.

The application uses Retrieval-Augmented Generation (RAG) together with OpenAI Function Calling to recommend books based on user interests and provide detailed summaries.

---

# Features

- Semantic search using ChromaDB
- OpenAI Embeddings (`text-embedding-3-small`)
- AI book recommendations using GPT
- Function Calling for detailed summaries
- Local JSON knowledge base
- Command Line Interface (CLI)

---

# Technologies

- Python 3.13+
- OpenAI API
- ChromaDB
- Streamlit (optional)
- JSON
- Markdown

---

# Project Structure

```
Smart Librarian
│
├── data/
│   ├── book_summaries.md
│   └── book_summaries.json
│
├── src/
│   ├── chatbot.py
│   ├── config.py
│   ├── data_loader.py
│   ├── tools.py
│   └── vector_store.py
│
├── chroma_db/
│
├── main.py
├── requirements.txt
├── README.md
└── .env.example
```

---

# How it works

1. Books are loaded from `book_summaries.md`.
2. OpenAI generates embeddings for every book.
3. Embeddings are stored in ChromaDB.
4. The user's question is converted into an embedding.
5. ChromaDB retrieves the most relevant books.
6. GPT recommends the best matching book.
7. GPT automatically calls `get_summary_by_title()`.
8. The detailed summary is returned to the user.

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key
```

Run:

```bash
python main.py
```

---

# Example Questions

- I want a fantasy adventure.
- Recommend a book about war.
- I like books about justice.
- I want a story about friendship and magic.
- Recommend a dystopian novel.

---

# AI Workflow

```
User Question
        │
        ▼
OpenAI Embedding
        │
        ▼
ChromaDB Search
        │
        ▼
Relevant Books
        │
        ▼
GPT Recommendation
        │
        ▼
Function Calling
        │
        ▼
Detailed Summary
        │
        ▼
Final Response
```

---


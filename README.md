#  Smart Librarian

Smart Librarian is an AI-powered book recommendation application built with **Python, FastAPI, React, OpenAI and ChromaDB**.

The application recommends books based on the user's interests using **Retrieval-Augmented Generation (RAG)** and uses **Tool Calling** to retrieve a detailed summary of the recommended book.

##  Features

- Semantic book search with ChromaDB
- OpenAI embeddings using `text-embedding-3-small`
- GPT-powered book recommendations
- RAG (Retrieval-Augmented Generation)
- Tool Calling with `get_summary_by_title()`
- Detailed summaries stored locally in JSON
- FastAPI REST backend
- React + Vite frontend

##  Technologies

**Backend**
- Python
- FastAPI
- OpenAI API
- ChromaDB

**Frontend**
- React
- Vite
- JavaScript
- CSS

##  How it works

```text
User Question
      ↓
OpenAI Embedding
      ↓
ChromaDB Semantic Search
      ↓
Relevant Books
      ↓
GPT Recommendation
      ↓
get_summary_by_title()
      ↓
Detailed Summary
      ↓
Final Response
```

Short book descriptions and themes are stored in `book_summaries.md` and used for semantic search.

Detailed summaries are stored in `book_summaries.json` and retrieved through Tool Calling after GPT selects a book.

##  Project Structure

```text
Smart-Librarian/
│
├── backend/
│   ├── data/
│   │   ├── book_summaries.md
│   │   └── book_summaries.json
│   │
│   ├── src/
│   │   ├── chatbot.py
│   │   ├── config.py
│   │   ├── data_loader.py
│   │   ├── tools.py
│   │   └── vector_store.py
│   │
│   ├── api.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

##  Running the project

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Start FastAPI:

```bash
python -m uvicorn api:app --reload
```

Backend:

```text
localhost
```

Swagger:

```text
localhost/docs
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Both backend and frontend must be running at the same time.

##  Example questions

- `I want a fantasy story with magic and friendship.`
- `Recommend a book about war.`
- `I like books about justice.`
- `I want something about freedom and social control.`
- `Recommend a dystopian novel.`

##  Environment

The OpenAI API key is stored in the backend `.env` file and is never exposed to the React frontend.

Use `.env.example` as a template:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

##  Assignment Requirements

The project implements the main requirements of the Smart Librarian assignment:

- 50 books knowledge base
- ChromaDB vector store
- OpenAI embeddings
- Semantic retrieval
- GPT integration
- RAG
- `get_summary_by_title()` tool
- OpenAI Tool Calling
- Browser interface with React + FastAPI

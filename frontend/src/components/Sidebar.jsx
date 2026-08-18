import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";

function Sidebar({
  chats,
  activeChatId,
  selectChat,
  createNewChat,
  deleteChat,
}) {
  const [search, setSearch] = useState("");
  const [bookCount, setBookCount] = useState(0);
  
  useEffect(() => {
  const getBookCount = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/books/count"
      );

      const data = await response.json();

      setBookCount(data.count);
    } catch (error) {
      console.error("Could not load book count:", error);
    }
  };

  getBookCount();
}, []);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>
          Smart
          <br />
          Librarian
        </h2>

        <p className="sidebar-subtitle">Discover your next favorite book</p>
      </div>

      <div className="search-container">
        <FiSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <button className="new-chat-button" onClick={createNewChat}>
        + New Chat
      </button>

      <div className="sidebar-stats">
        <div className="stat-card">
          <span>{bookCount}</span>
          <p>Books</p>
        </div>

        <div className="stat-card">
          <span>{chats.length}</span>
          <p>Chats</p>
        </div>
      </div>

      <h3 className="sidebar-section-title">Recent chats</h3>

      <div className="chat-history">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`history-item ${
              chat.id === activeChatId ? "active" : ""
            }`}
          >
            <button
              className="history-title"
              onClick={() => selectChat(chat.id)}
            >
              {chat.title}
            </button>

            <button
              className="delete-button"
              onClick={() => deleteChat(chat.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;

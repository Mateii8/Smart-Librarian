import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";

function Sidebar({
  chats,
  activeChatId,
  selectChat,
  createNewChat,
  deleteChat,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [search, setSearch] = useState("");
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    const getBookCount = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/books/count"
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        setBookCount(data.count);
      } catch (error) {
        console.error(
          "Could not load book count:",
          error
        );
      }
    };

    getBookCount();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.title
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const handleNewChat = () => {
    createNewChat();
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId) => {
    selectChat(chatId);
    setSidebarOpen(false);
  };

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <button
        className="sidebar-close-button"
        onClick={() => setSidebarOpen(false)}
      >
        Close
      </button>

      <div className="sidebar-brand">
        <h2>
          Smart
          <br />
          Librarian
        </h2>

        <p className="sidebar-subtitle">
          Discover your next favorite book
        </p>
      </div>

      <div className="search-container">
        <FiSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      <button
        className="new-chat-button"
        onClick={handleNewChat}
      >
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

      <h3 className="sidebar-section-title">
        Recent chats
      </h3>

      <div className="chat-history">
        {filteredChats.length === 0 && search && (
          <p className="no-chats-found">
            No conversations found
          </p>
        )}

        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`history-item ${
              chat.id === activeChatId
                ? "active"
                : ""
            }`}
          >
            <button
              className="history-title"
              onClick={() =>
                handleSelectChat(chat.id)
              }
            >
              {chat.title}
            </button>

            <button
              className="delete-button"
              onClick={() =>
                deleteChat(chat.id)
              }
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
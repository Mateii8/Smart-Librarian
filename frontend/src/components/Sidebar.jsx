import { FiSearch } from "react-icons/fi";
import { useState } from "react";

function Sidebar({
  chats,
  activeChatId,
  setActiveChatId,
  createNewChat,
  deleteChat,
}) {
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="sidebar">

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
        onClick={createNewChat}
      >
        + New Chat
      </button>

      <div className="sidebar-stats">

        <div className="stat-card">
          <span>12</span>
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
                setActiveChatId(chat.id)
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
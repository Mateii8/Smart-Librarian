function Sidebar({
  chats,
  activeChatId,
  setActiveChatId,
  createNewChat,
  deleteChat,
}) {
  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <span>📚</span>
        <h2>Smart Librarian</h2>
      </div>

      <button
        className="new-chat-button"
        onClick={createNewChat}
      >
        + New Chat
      </button>

      <div className="chat-history">

        {chats.map((chat) => (

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
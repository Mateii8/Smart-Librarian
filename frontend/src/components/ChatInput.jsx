function ChatInput({ message, setMessage, sendMessage, loading }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={message}
        placeholder="Ask for a book recommendation..."
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <button onClick={sendMessage} disabled={loading || !message.trim()}>
        Send
      </button>
    </div>
  );
}

export default ChatInput;

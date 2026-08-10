import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: trimmedMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmedMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Smart Librarian</h1>
        <p>Your AI book recommendation assistant</p>
      </header>

      <main className="chat-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <h2>What would you like to read?</h2>
            <p>
              Tell me what themes, genres, or stories you enjoy.
            </p>
          </div>
        )}

        {messages.map((chatMessage, index) => (
          <div
            key={index}
            className={`message ${chatMessage.role}`}
          >
            <div className="message-content">
              {chatMessage.role === "assistant" ? (
                <ReactMarkdown>
                  {chatMessage.content}
                </ReactMarkdown>
              ) : (
                chatMessage.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="message-content">
              Thinking...
            </div>
          </div>
        )}
      </main>

      <div className="input-container">
        <input
          type="text"
          value={message}
          placeholder="Ask for a book recommendation..."
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>📚 Smart Librarian</h1>

      <input
        type="text"
        value={message}
        placeholder="Ask for a book recommendation..."
        onChange={(event) => setMessage(event.target.value)}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      {answer && (
        <div>
          <h2>Smart Librarian</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
function EmptyState({ setMessage, sendMessage }) {
  const suggestions = [
    "Recommend a fantasy book",
    "Recommend a dystopian novel",
    "Recommend a mystery book",
    "Recommend a romance novel",
    "Recommend an adventure story",
    "Recommend a classic book",
  ];

  return (
    <div className="empty-state">
      <h1>Smart Librarian</h1>

      <p className="subtitle">Find your next favorite book.</p>
      <p className="subtitle">
        Choose one of the categories below or ask your own question
      </p>

      <div className="suggestions">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            className="suggestion-button"
            onClick={() => {
              setMessage(suggestion);
              sendMessage(suggestion);
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptyState;

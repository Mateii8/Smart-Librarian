function EmptyState({ setMessage }) {
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

      <p className="subtitle">
        Discover your next favorite book using AI-powered recommendations.
      </p>

      <div className="suggestions">

        {suggestions.map((suggestion) => (

          <button
            key={suggestion}
            className="suggestion-button"
            onClick={() => setMessage(suggestion)}
          >
            {suggestion}
          </button>

        ))}

      </div>

      <p className="hint">
        Or type your own request below.
      </p>

    </div>
  );
}

export default EmptyState;
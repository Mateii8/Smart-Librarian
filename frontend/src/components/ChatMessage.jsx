import ReactMarkdown from "react-markdown";

function ChatMessage({
  chatMessage,
  index,
  activeChat,
  imageLoading,
  generateImage,
}) {
  return (
    <div className={`message ${chatMessage.role}`}>
      <div className="message-content">
        {chatMessage.role === "assistant" ? (
          <>
            <ReactMarkdown>{chatMessage.content}</ReactMarkdown>

            {chatMessage.title && (
              <button
                className="generate-image-button"
                disabled={imageLoading === `${activeChat.id}-${index}`}
                onClick={() =>
                  generateImage(activeChat.id, index, chatMessage.title)
                }
              >
                {imageLoading === `${activeChat.id}-${index}`
                  ? "Generating..."
                  : "Generate image"}
              </button>
            )}

            {chatMessage.image && (
              <img
                className="generated-image"
                src={`data:image/png;base64,${chatMessage.image}`}
                alt={chatMessage.title}
              />
            )}
          </>
        ) : (
          chatMessage.content
        )}
      </div>
    </div>
  );
}

export default ChatMessage;

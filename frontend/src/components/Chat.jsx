import ChatMessage from "./ChatMessage";
import EmptyState from "./EmptyState";

function Chat({
  activeChat,
  loading,
  imageLoading,
  generateImage,
  messagesEndRef,
  setMessage,
  sendMessage,
}) {
  return (
    <main className="chat-container">
      {!activeChat || activeChat.messages.length === 0 ? (
        <EmptyState setMessage={setMessage} sendMessage={sendMessage} />
      ) : (
        activeChat.messages.map((chatMessage, index) => (
          <ChatMessage
            key={index}
            chatMessage={chatMessage}
            index={index}
            activeChat={activeChat}
            imageLoading={imageLoading}
            generateImage={generateImage}
          />
        ))
      )}

      {loading && (
        <div className="message assistant">
          <div className="message-content">Thinking...</div>
        </div>
      )}

      <div ref={messagesEndRef}></div>
    </main>
  );
}

export default Chat;

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(null);

  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("smart-librarian-chats");

    return savedChats ? JSON.parse(savedChats) : [];
  });

  const [activeChatId, setActiveChatId] = useState(null);

  const activeChat = chats.find(
    (chat) => chat.id === activeChatId
  );

  useEffect(() => {
    localStorage.setItem(
      "smart-librarian-chats",
      JSON.stringify(chats)
    );
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New conversation",
      messages: [],
    };

    setChats((previousChats) => [
      newChat,
      ...previousChats,
    ]);

    setActiveChatId(newChat.id);
    setMessage("");
  };

  const deleteChat = (chatId) => {
    setChats((previousChats) =>
      previousChats.filter((chat) => chat.id !== chatId)
    );

    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    let currentChatId = activeChatId;

    if (!currentChatId) {
      const newChat = {
        id: Date.now(),
        title: trimmedMessage.slice(0, 30),
        messages: [],
      };

      currentChatId = newChat.id;

      setChats((previousChats) => [
        newChat,
        ...previousChats,
      ]);

      setActiveChatId(currentChatId);
    }

    const userMessage = {
      role: "user",
      content: trimmedMessage,
    };

    setChats((previousChats) =>
      previousChats.map((chat) => {
        if (chat.id !== currentChatId) {
          return chat;
        }

        return {
          ...chat,

          title:
            chat.messages.length === 0
              ? trimmedMessage.slice(0, 30)
              : chat.title,

          messages: [
            ...chat.messages,
            userMessage,
          ],
        };
      })
    );

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
        throw new Error(
          `HTTP error: ${response.status}`
        );
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.answer,
        title: data.title,
        image: null,
      };


      setChats((previousChats) =>
        previousChats.map((chat) => {
          if (chat.id !== currentChatId) {
            return chat;
          }

          return {
            ...chat,

            messages: [
              ...chat.messages,
              assistantMessage,
            ],
          };
        })
      );
    } catch (error) {
      console.error(error);

      setChats((previousChats) =>
        previousChats.map((chat) => {
          if (chat.id !== currentChatId) {
            return chat;
          }

          return {
            ...chat,

            messages: [
              ...chat.messages,
              {
                role: "assistant",
                content:
                  "Something went wrong. Please try again.",
              },
            ],
          };
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async (
    chatId,
    messageIndex,
    title
  ) => {
    if (!title) {
      return;
    }

    const loadingId = `${chatId}-${messageIndex}`;

    setImageLoading(loadingId);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/image",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: title,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status}`
        );
      }

      const data = await response.json();

      setChats((previousChats) =>
        previousChats.map((chat) => {
          if (chat.id !== chatId) {
            return chat;
          }

          return {
            ...chat,

            messages: chat.messages.map(
              (chatMessage, index) => {
                if (index !== messageIndex) {
                  return chatMessage;
                }

                return {
                  ...chatMessage,
                  image: data.image,
                };
              }
            ),
          };
        })
      );
    } catch (error) {
      console.error(
        "Image generation failed:",
        error
      );
    } finally {
      setImageLoading(null);
    }
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="layout">


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


      <div className="app">

        <header className="header">
          <h1>Smart Librarian</h1>

          <p>
            Your AI book recommendation assistant
          </p>
        </header>

        <main className="chat-container">


          {!activeChat ||
          activeChat.messages.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📖
              </div>

              <h2>
                What would you like to read?
              </h2>

              <p>
                Tell me what kind of story,
                genre or theme you're interested
                in and I'll recommend a book.
              </p>

            </div>

          ) : (


            activeChat.messages.map(
              (chatMessage, index) => (

                <div
                  key={index}
                  className={`message ${chatMessage.role}`}
                >

                  <div className="message-content">

                    {chatMessage.role ===
                    "assistant" ? (

                      <>
                        <ReactMarkdown>
                          {chatMessage.content}
                        </ReactMarkdown>


                        {chatMessage.title && (
                          <button
                            className="generate-image-button"
                            disabled={
                              imageLoading ===
                              `${activeChat.id}-${index}`
                            }
                            onClick={() =>
                              generateImage(
                                activeChat.id,
                                index,
                                chatMessage.title
                              )
                            }
                          >
                            {imageLoading ===
                            `${activeChat.id}-${index}`
                              ? "Generating..."
                              : "Generate image"}
                          </button>
                        )}


                        {chatMessage.image && (
                          <img
                            className="generated-image"
                            src={`data:image/png;base64,${chatMessage.image}`}
                            alt={`Generated illustration for ${chatMessage.title}`}
                          />
                        )}

                      </>

                    ) : (

                      chatMessage.content

                    )}

                  </div>

                </div>
              )
            )
          )}


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
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={
              loading || !message.trim()
            }
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;
import { useEffect, useRef, useState } from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import ChatInput from "./components/ChatInput";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(null);

  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("smart-librarian-chats");

    return savedChats ? JSON.parse(savedChats) : [];
  });

  const [activeChatId, setActiveChatId] = useState(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const chatsWithoutImages = chats
      .filter((chat) => chat.messages.length > 0)
      .map((chat) => ({
        ...chat,
        messages: chat.messages.map((message) => ({
          ...message,
          image: null,
        })),
      }));

    localStorage.setItem(
      "smart-librarian-chats",
      JSON.stringify(chatsWithoutImages),
    );
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat]);

  const removeEmptyChat = (chatId) => {
    if (!chatId) return;

    setChats((previousChats) =>
      previousChats.filter(
        (chat) => chat.id !== chatId || chat.messages.length > 0,
      ),
    );
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New conversation",
      messages: [],
    };

    setChats((previousChats) => [
      newChat,
      ...previousChats.filter(
        (chat) => chat.id !== activeChatId || chat.messages.length > 0,
      ),
    ]);

    setActiveChatId(newChat.id);
    setMessage("");
  };

  const selectChat = (chatId) => {
    if (activeChatId && activeChatId !== chatId) {
      removeEmptyChat(activeChatId);
    }

    setActiveChatId(chatId);
    setMessage("");
  };

  const deleteChat = (chatId) => {
    setChats((previousChats) =>
      previousChats.filter((chat) => chat.id !== chatId),
    );

    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const sendMessage = async (customMessage = null) => {
    const trimmedMessage = (customMessage ?? message).trim();

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

      setChats((previousChats) => [newChat, ...previousChats]);

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

          messages: [...chat.messages, userMessage],
        };
      }),
    );

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
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

            messages: [...chat.messages, assistantMessage],
          };
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async (chatId, messageIndex, title) => {
    if (!title) return;

    const loadingId = `${chatId}-${messageIndex}`;

    setImageLoading(loadingId);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/image", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Image generation failed.");
      }

      setChats((previousChats) =>
        previousChats.map((chat) => {
          if (chat.id !== chatId) {
            return chat;
          }

          return {
            ...chat,

            messages: chat.messages.map((message, index) => {
              if (index !== messageIndex) {
                return message;
              }

              return {
                ...message,

                image: data.image,
              };
            }),
          };
        }),
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setImageLoading(null);
    }
  };

  return (
    <div className="layout">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        selectChat={selectChat}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
      />

      <div className="app">
        <header className="header">
          <h1>Smart Librarian</h1>

          <p>Your AI book recommendation assistant</p>
        </header>

        <Chat
          activeChat={activeChat}
          loading={loading}
          imageLoading={imageLoading}
          generateImage={generateImage}
          messagesEndRef={messagesEndRef}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />

        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
}
export default App;

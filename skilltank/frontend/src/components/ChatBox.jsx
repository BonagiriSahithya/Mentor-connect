import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Make sure this matches your backend

const ChatBox = () => {
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const chatEndRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  const receiverId = otherUserId;
  const chatKey = `chat-${user?.id}-${receiverId}`;

  useEffect(() => {
    if (!user) {
      alert("Please login to access chat.");
      navigate("/login");
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chats/${user.id}/${receiverId}`);
        setChats(res.data);
        localStorage.setItem(chatKey, JSON.stringify(res.data));
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [receiverId]);

  useEffect(() => {
    const handleReceiveMessage = (newMsg) => {
      const isRelevant =
        (newMsg.senderId === user.id && newMsg.receiverId === receiverId) ||
        (newMsg.senderId === receiverId && newMsg.receiverId === user.id);

      if (isRelevant) {
        setChats((prev) => {
          const exists = prev.some((c) => c._id === newMsg._id);
          if (!exists) {
            const updated = [...prev, newMsg];
            localStorage.setItem(chatKey, JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [receiverId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/chats/send", {
        senderId: user.id,
        receiverId,
        senderName: user.name,
        message,
      });

      const newMsg = res.data;
      socket.emit("sendMessage", newMsg);

      setChats((prev) => {
        const updated = [...prev, newMsg];
        localStorage.setItem(chatKey, JSON.stringify(updated));
        return updated;
      });

      setMessage("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const deleteMessage = async (chatId) => {
    try {
      await axios.delete(`http://localhost:5000/api/chats/delete/${chatId}/${user.id}`);
      const updatedChats = chats.filter((chat) => chat._id !== chatId);
      setChats(updatedChats);
      localStorage.setItem(chatKey, JSON.stringify(updatedChats));
    } catch (err) {
      console.error("Delete message error:", err);
    }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>Chat with {receiverId}</div>
      <div style={styles.chatWindow}>
        {chats.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>No messages yet.</p>
        ) : (
          chats.map((chat) => {
            const isMe = chat.senderId === user.id;
            return (
              <div
                key={chat._id}
                style={{
                  ...styles.messageBubble,
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? "#dcf8c6" : "#fff",
                }}
              >
                <div style={styles.name}>{chat.senderName}</div>
                <div>{chat.message}</div>
                {isMe && (
                  <button onClick={() => deleteMessage(chat._id)} style={styles.deleteBtn}>
                    🗑️
                  </button>
                )}
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={styles.inputArea}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontFamily: "Arial",
    background: "#e5ddd5",
    display: "flex",
    flexDirection: "column",
    height: "90vh",
  },
  header: {
    backgroundColor: "#075e54",
    color: "#fff",
    padding: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  messageBubble: {
    maxWidth: "60%",
    padding: "10px 15px",
    borderRadius: "7.5px",
    position: "relative",
    wordBreak: "break-word",
  },
  name: {
    fontSize: "0.7rem",
    fontWeight: "bold",
    color: "#555",
    marginBottom: "5px",
  },
  deleteBtn: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "transparent",
    border: "none",
    color: "red",
    cursor: "pointer",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "20px",
    border: "1px solid #ccc",
  },
  sendBtn: {
    marginLeft: "10px",
    padding: "10px 20px",
    backgroundColor: "#128c7e",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default ChatBox;




























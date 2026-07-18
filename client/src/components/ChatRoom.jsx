import { useEffect, useState } from "react";
import { socket } from "../socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UserList from "./UserList";

export default function ChatRoom({ username, roomId, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [aiTyping, setAiTyping] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.emit("join_room", { roomId, username });

    socket.on("room_history", (history) => setMessages(history));
    socket.on("new_message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("user_list", (list) => setUsers(list));
    socket.on("ai_typing", (isTyping) => setAiTyping(isTyping));
    socket.on("user_typing", ({ username: who, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping ? [...new Set([...prev, who])] : prev.filter((u) => u !== who)
      );
    });

    return () => {
      socket.off("room_history");
      socket.off("new_message");
      socket.off("user_list");
      socket.off("ai_typing");
      socket.off("user_typing");
      socket.disconnect();
    };
  }, [roomId, username]);

  function handleSend(text) {
    socket.emit("send_message", { text });
  }

  return (
    <div className="chat-room">
      <header className="chat-header">
        <h2>AI Chat Rooms</h2>
        <button className="leave-btn" onClick={onLeave}>
          Leave
        </button>
      </header>

      <div className="chat-body">
        <UserList users={users} typingUsers={typingUsers} roomId={roomId} />
        <div className="chat-main">
          <MessageList messages={messages} username={username} aiTyping={aiTyping} />
          <MessageInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

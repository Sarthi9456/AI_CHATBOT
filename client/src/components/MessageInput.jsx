import { useRef, useState } from "react";
import { socket } from "../socket";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const typingTimeout = useRef(null);

  function handleChange(e) {
    setText(e.target.value);
    socket.emit("typing", true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socket.emit("typing", false), 1200);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
    socket.emit("typing", false);
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={handleChange}
        placeholder="Type a message… try @ai what's the capital of France?"
      />
      <button type="submit">Send</button>
    </form>
  );
}

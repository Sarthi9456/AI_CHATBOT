import { useState } from "react";

export default function JoinScreen({ onJoin }) {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("general");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return;
    onJoin({ username: username.trim(), roomId: roomId.trim() || "general" });
  }

  return (
    <div className="join-screen">
      <form className="join-card" onSubmit={handleSubmit}>
        <h1>AI Chat Rooms</h1>
        <p className="subtitle">
          Real-time group chat with a built-in AI assistant. Mention{" "}
          <code>@ai</code> anywhere in a message to ask a question.
        </p>

        <label>
          Your name
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Priya"
            autoFocus
          />
        </label>

        <label>
          Room
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="e.g. general"
          />
        </label>

        <button type="submit">Join room</button>
      </form>
    </div>
  );
}

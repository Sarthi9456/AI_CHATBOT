import { useEffect, useRef } from "react";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageList({ messages, username, aiTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  return (
    <div className="message-list">
      {messages.map((m) => {
        if (m.type === "system") {
          return (
            <div key={m.id} className="message system">
              {m.text}
            </div>
          );
        }

        const isMine = m.username === username;
        const isAI = m.type === "ai";

        return (
          <div
            key={m.id}
            className={`message-row ${isMine ? "mine" : ""} ${isAI ? "ai" : ""}`}
          >
            <div className="bubble">
              <div className="bubble-header">
                <span className="bubble-name">{isAI ? "🤖 " + m.username : m.username}</span>
                <span className="bubble-time">{formatTime(m.timestamp)}</span>
              </div>
              <div className="bubble-text">{m.text}</div>
            </div>
          </div>
        );
      })}

      {aiTyping && (
        <div className="message-row ai">
          <div className="bubble typing-bubble">🤖 Claude is thinking…</div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

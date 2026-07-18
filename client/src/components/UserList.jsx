export default function UserList({ users, typingUsers, roomId }) {
  return (
    <aside className="user-list">
      <h3>Room: {roomId}</h3>
      <p className="user-count">{users.length} online</p>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <span className="dot" /> {u.name}
            {typingUsers.includes(u.name) && <span className="typing-hint"> typing…</span>}
          </li>
        ))}
      </ul>
      <div className="ai-hint">
        <strong>🤖 AI Assistant</strong>
        <p>Mention <code>@ai</code> in any message to ask a question.</p>
      </div>
    </aside>
  );
}

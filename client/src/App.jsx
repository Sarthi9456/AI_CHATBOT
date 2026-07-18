import { useState } from "react";
import JoinScreen from "./components/JoinScreen";
import ChatRoom from "./components/ChatRoom";

export default function App() {
  const [session, setSession] = useState(null); // { username, roomId }

  if (!session) {
    return <JoinScreen onJoin={setSession} />;
  }

  return (
    <ChatRoom
      username={session.username}
      roomId={session.roomId}
      onLeave={() => setSession(null)}
    />
  );
}

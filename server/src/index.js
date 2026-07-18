import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import store from "./store.js";
import { askAI, AI_BOT_NAME } from "./aiAssistant.js";

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/rooms", (_req, res) => res.json(store.listRooms()));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_URL, methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  let currentRoom = null;
  let currentUser = null;

  socket.on("join_room", ({ roomId, username }) => {
    currentRoom = roomId;
    currentUser = username;

    socket.join(roomId);
    store.addUser(roomId, socket.id, username);

    // send history + user list to the joining client
    socket.emit("room_history", store.getMessages(roomId));
    io.to(roomId).emit("user_list", store.getUsers(roomId));

    const joinMsg = store.addMessage(roomId, {
      type: "system",
      text: `${username} joined the room`,
    });
    io.to(roomId).emit("new_message", joinMsg);
  });

  socket.on("send_message", async ({ text }) => {
    if (!currentRoom || !text?.trim()) return;

    const message = store.addMessage(currentRoom, {
      type: "user",
      username: currentUser,
      text: text.trim(),
    });
    io.to(currentRoom).emit("new_message", message);

    // If someone @-mentions the AI, ask Claude and broadcast the reply.
    const mentionsAI = /@ai\b/i.test(text);
    if (mentionsAI) {
      io.to(currentRoom).emit("ai_typing", true);
      const question = text.replace(/@ai/i, "").trim();
      const history = store.getMessages(currentRoom).map((m) => ({
        username: m.username || "system",
        text: m.text,
      }));

      const answer = await askAI(question || text, history);

      const aiMessage = store.addMessage(currentRoom, {
        type: "ai",
        username: AI_BOT_NAME,
        text: answer,
      });
      io.to(currentRoom).emit("ai_typing", false);
      io.to(currentRoom).emit("new_message", aiMessage);
    }
  });

  socket.on("typing", (isTyping) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit("user_typing", { username: currentUser, isTyping });
  });

  socket.on("disconnect", () => {
    if (!currentRoom) return;
    store.removeUser(currentRoom, socket.id);
    io.to(currentRoom).emit("user_list", store.getUsers(currentRoom));
    if (currentUser) {
      const leaveMsg = store.addMessage(currentRoom, {
        type: "system",
        text: `${currentUser} left the room`,
      });
      io.to(currentRoom).emit("new_message", leaveMsg);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

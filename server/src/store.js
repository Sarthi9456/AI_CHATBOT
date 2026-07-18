import { nanoid } from "nanoid";

// Simple in-memory store. Swap this for MongoDB/Postgres later if you want
// persistence across server restarts — the API surface below is small
// enough to re-implement with a real DB without touching socket logic.

const rooms = new Map(); // roomId -> { id, name, users: Map<socketId, {id, name}>, messages: [] }

function ensureRoom(roomId, roomName) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      name: roomName || roomId,
      users: new Map(),
      messages: [],
    });
  }
  return rooms.get(roomId);
}

function addUser(roomId, socketId, username) {
  const room = ensureRoom(roomId);
  room.users.set(socketId, { id: socketId, name: username });
  return room;
}

function removeUser(roomId, socketId) {
  const room = rooms.get(roomId);
  if (!room) return null;
  room.users.delete(socketId);
  if (room.users.size === 0 && room.messages.length === 0) {
    rooms.delete(roomId);
  }
  return room;
}

function addMessage(roomId, message) {
  const room = ensureRoom(roomId);
  const fullMessage = {
    id: nanoid(8),
    timestamp: Date.now(),
    ...message,
  };
  room.messages.push(fullMessage);
  // keep last 200 messages per room to bound memory
  if (room.messages.length > 200) room.messages.shift();
  return fullMessage;
}

function getMessages(roomId) {
  return ensureRoom(roomId).messages;
}

function getUsers(roomId) {
  return Array.from(ensureRoom(roomId).users.values());
}

function listRooms() {
  return Array.from(rooms.values()).map((r) => ({
    id: r.id,
    name: r.name,
    userCount: r.users.size,
  }));
}

export default {
  ensureRoom,
  addUser,
  removeUser,
  addMessage,
  getMessages,
  getUsers,
  listRooms,
};

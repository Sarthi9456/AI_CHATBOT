# AI Chat Rooms 💬🤖

A real-time, multi-room chat app built with **React + Node/Express + Socket.io**,
with a built-in **AI assistant** (powered by Claude) that anyone can summon
mid-conversation by typing `@ai <question>`.

This is a genuinely full-stack build: WebSocket-based real-time messaging,
presence/typing indicators, room-based architecture, and a live third-party
AI API integration — a strong portfolio piece because it touches so many
real engineering concerns at once.

## Features

- 🔴 Real-time messaging across multiple chat rooms (Socket.io)
- 👀 Live user presence list + "X is typing…" indicators
- 🤖 `@ai` mention triggers a Claude-powered response, with the last 10
  messages sent as context so answers feel like part of the conversation
- 🕓 Room message history (in-memory, last 200 messages per room)
- 🎨 A distinctive dark UI, fully responsive down to mobile

## Project structure

```
ai-chat-app/
├── server/            Node/Express + Socket.io backend
│   └── src/
│       ├── index.js        Express app + socket event handlers
│       ├── store.js        In-memory room/user/message store
│       └── aiAssistant.js  Anthropic API integration
└── client/            React (Vite) frontend
    └── src/
        ├── App.jsx
        ├── socket.js
        └── components/
```

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# then edit .env and add your ANTHROPIC_API_KEY
npm run dev
```

The server runs on `http://localhost:4000`.

Get an API key at https://console.anthropic.com/ if you don't have one.
The app works fine without a key too — the `@ai` command will just reply
with a friendly message telling you it's not configured yet.

### 2. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173`. Open it in two browser tabs
(or two browsers) to see the real-time sync in action.

## How the AI integration works

Any message containing `@ai` is intercepted server-side before broadcast.
The server pulls the last 10 messages from that room as context, sends
the question to Claude via the Anthropic SDK, and broadcasts the answer
back into the room as a message from "Claude" — visible to everyone in
the room, not just the person who asked.

See `server/src/aiAssistant.js` for the exact prompt.

## Ideas to extend this (great for a portfolio writeup)

- Swap the in-memory store for MongoDB/Postgres so history survives restarts
- Add auth (JWT) so usernames are verified, not just typed in
- Add file/image sharing
- Let the AI assistant use tools (e.g. web search) via the API's tool-use feature
- Deploy: frontend to Vercel/Netlify, backend to Render/Railway (Socket.io
  needs a host that supports persistent WebSocket connections)

## Tech stack

React 18, Vite, Socket.io, Express, Node.js, Anthropic SDK (Claude Sonnet).

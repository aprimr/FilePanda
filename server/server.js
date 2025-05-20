import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("create-room", (roomCode) => {
    socket.join(roomCode);
  });

  socket.on("check-room", (roomCode, callback) => {
    const exists = io.sockets.adapter.rooms.has(roomCode);
    callback(exists);
  });

  socket.on("join-room", (roomCode) => {
    socket.join(roomCode);
  });

  socket.on("send-files", ({ roomCode, files }) => {
    io.to(roomCode).emit("receive-files", files);
  });
});

app.get("/keep-alive", (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

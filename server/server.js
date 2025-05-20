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
  console.log("Client connected", socket.id);

  socket.on("create-room", (roomCode) => {
    socket.join(roomCode);
  });

  socket.on("check-room", (roomCode, callback) => {
    const exists = io.sockets.adapter.rooms.has(roomCode);
    console.log(exists);
    callback(exists);
  });

  socket.on("join-room", (roomCode) => {
    console.log("Joined to room ", roomCode);
    socket.join(roomCode);
  });

  socket.on("send-files", ({ roomCode, files }) => {
    console.log(files);
    io.to(roomCode).emit("receive-files", files);
  });
});

app.get("/keep-alive", (req, res) => {
  res.sendStatus(200);
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

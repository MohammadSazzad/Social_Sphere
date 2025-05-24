import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export const getRecieverSocketId = (userId) => {
  return userSocketMap[userId];
}

const userSocketMap =  {}

export const injectSocketIO = (req, res, next) => {
  req.io = io; 
  next();
};

io.use(async (socket, next) => {
  try {
    const userId = socket.handshake.auth.userId; 
    if (!userId) throw new Error("Unauthorized");
    socket.userId = userId; 
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.userId; 
  userSocketMap[userId] = socket.id; 

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
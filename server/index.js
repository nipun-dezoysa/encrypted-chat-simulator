const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("login", (username) => {
    if (users[username]) {
      socket.emit("logged", { error: true });
      return;
    }
    users[username] = socket.id;
    socket.username = username;
    console.log(`${username} connected`);
    socket.emit("logged", {username, error: false});
  });

  socket.on("request", ({ computes, to }) => {
    const targetSocketId = users[to];
    console.log(`Request from ${socket.username} to ${to}: ${computes}`);

    if (targetSocketId) {
      io.to(targetSocketId).emit("request", {
        computes,
        from: socket.username,
      });
      socket.emit("sentreqres", { error: false });
    } else {
      socket.emit("sentreqres", { error: true });
    }
  });

  socket.on("accept_request", ({ computes, to }) => {
    const targetSocketId = users[to];
    console.log(`Confirm from ${socket.username} to ${to}: ${computes}`);
    if (targetSocketId) {
      io.to(targetSocketId).emit("accept_request", {
        computes,
        from: socket.username,
      });
      socket.emit("sentconres", { error: false });
    } else {
      socket.emit("sentconres", { error: true });
    }
  });

  socket.on("send_message", ({ to, message, iv }) => {
    const targetSocketId = users[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive_message", {
        message,
        from: socket.username,
        iv,
      });
      socket.emit("sent_message", { error: false });
    } else {
      socket.emit("sent_message", { error: true });
    }
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      //send to all users that this user has disconnected
      socket.broadcast.emit("user_disconnected", socket.username);

      delete users[socket.username];
      console.log(`${socket.username} disconnected`);
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

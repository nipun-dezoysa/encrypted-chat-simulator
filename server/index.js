const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
// const crypto = require("crypto");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {}; // username -> socket.id
const SECRET = "myencryptionkey123";

// function encrypt(text) {
//   const cipher = crypto.createCipher("aes-256-ctr", SECRET);
//   return cipher.update(text, "utf8", "hex") + cipher.final("hex");
// }

// function decrypt(text) {
//   const decipher = crypto.createDecipher("aes-256-ctr", SECRET);
//   return decipher.update(text, "hex", "utf8") + decipher.final("utf8");
// }

io.on("connection", (socket) => {
  socket.on("login", (username) => {
    users[username] = socket.id;
    socket.username = username;
    console.log(`${username} connected`);
    socket.emit("login_success", username);
  });

  socket.on("send_message", ({ to, message }) => {
    // const encrypted = encrypt(`${socket.username}: ${message}`);
    const targetSocketId = users[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive_message", message);
    }
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      delete users[socket.username];
      console.log(`${socket.username} disconnected`);
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

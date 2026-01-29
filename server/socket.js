import { Server } from "socket.io";

let users = [];

/* ================== HELPERS ================== */

const addUser = (userData, socketId) => {
  // userData = { sub, name, picture, ... }
  const existingUser = users.find(user => user.sub === userData.sub);

  if (!existingUser) {
    users.push({ ...userData, socketId });
  } else {
    // reconnect / refresh case
    existingUser.socketId = socketId;
  }
};

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find(user => user.sub === userId);
};

/* ================== SOCKET SETUP ================== */

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // ✅ ADD USER
    socket.on("addUser", (userData) => {
      addUser(userData, socket.id);
      io.emit("getUsers", users); // broadcast active users
    });

    // ✅ SEND MESSAGE
    socket.on("sendMessage", (data) => {
      const user = getUser(data.receiverId);

      if (user) {
        io.to(user.socketId).emit("getMessage", data);
      }
    });

    // ✅ DISCONNECT
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

export default setupSocket;

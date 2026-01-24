import { Server } from "socket.io";
import http from "http";

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userData, socketId) => {
  if (!users.some((user) => user.sub === userData.sub)) {
    users.push({ ...userData, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

io.on("connection", (socket) => {
  console.log("🔌 user connected:", socket.id);

  socket.on("addUser", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ user disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

httpServer.listen(9000, () => {
  console.log("🚀 Socket server running on port 9000");
});

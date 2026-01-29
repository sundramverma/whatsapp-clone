import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

let users = [];

const addUser = (userData, socketId) => {
    const userExists = users.some(user => user.sub === userData.sub);
    if (!userExists) {
        users.push({ ...userData, socketId });
        console.log(`User added: ${userData.name || userData.sub}`);
    }
};

const removeUser = (socketId) => {
    const user = users.find(user => user.socketId === socketId);
    if (user) {
        users = users.filter(user => user.socketId !== socketId);
        console.log(`User removed: ${user.name || user.sub}`);
    }
};

const getUser = (userId) => {
    return users.find(user => user.sub === userId);
};

const getUserBySocketId = (socketId) => {
    return users.find(user => user.socketId === socketId);
};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Connect user
    socket.on("addUser", (userData) => {
        if (!userData || !userData.sub) {
            console.error('Invalid user data received');
            return;
        }
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    });

    // Send message
    socket.on('sendMessage', (data) => {
        try {
            const user = getUser(data.receiverId);
            if (user) {
                io.to(user.socketId).emit('getMessage', {
                    ...data,
                    timestamp: new Date().toISOString()
                });
                console.log(`Message sent from ${data.senderId} to ${data.receiverId}`);
            } else {
                console.log(`User ${data.receiverId} not found online`);
                // Optionally notify sender that user is offline
                socket.emit('messageStatus', {
                    receiverId: data.receiverId,
                    status: 'offline',
                    messageId: data.id
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    // Typing indicator
    socket.on('typing', (data) => {
        const user = getUser(data.receiverId);
        if (user) {
            io.to(user.socketId).emit('userTyping', {
                senderId: data.senderId,
                isTyping: data.isTyping
            });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        removeUser(socket.id);
        io.emit('getUsers', users);
    });

    // Error handling
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
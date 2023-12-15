const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "https://skillandchill-dev.outsystemsenterprise.com"
    },
});
const port = 5000;


server.listen(port, () => {
    console.log("Server listening at port ", port);
});

const connectedUsers = new Set();

io.on("connection", socket => {
    const userId = socket.handshake.query['userId'];
    connectedUsers.add(userId);
    const data = JSON.stringify(Array.from(connectedUsers));
    console.log("Użytkownik " + userId + " został zalogowany.");
    io.emit('receive-connected-users', data);
    
    socket.on('disconnect', () => {
        const rooms = Object.keys(socket.rooms);
        rooms.forEach((room) => {
            socket.leave(room);
        });
        connectedUsers.delete(userId);
        const data = JSON.stringify(Array.from(connectedUsers));
        console.log("Użytkownik " + userId + " został wylogowany.");
        io.emit('receive-connected-users', data);
    });
    
    socket.on('join-initial-chats', data => {
        const chatIds = JSON.parse(data);
        chatIds.forEach(id => {
            socket.join(id);
        });
    });

    socket.on("join-chat", data => {
        const obj = JSON.parse(data);
        socket.join(obj.ChatId);
    });

    socket.on("leave-chat", data => {
        const obj = JSON.parse(data);
        socket.leave(obj.ChatId);
    });
    
    socket.on("send-message", data => {
        const obj = JSON.parse(data);
        socket.broadcast.to(obj.ChatMessage.ChatId).emit("receive-message", data);
        console.log("Zalogowani użytkownicy: " + connectedUsers);
        console.log("Użytkownik " + obj.ChatMessage.UserName + " (Id: " + obj.ChatMessage.CreatedByUserId + ") wysłał wiadomość o treści: `" + obj.ChatMessage.Content + "` do czatu o Id: " + obj.ChatMessage.ChatId);
    });

    socket.on("send-new-chat-message", data => {
        const obj = JSON.parse(data);
        
        socket.join(obj.ChatMessage.ChatId);
        socket.broadcast.emit("receive-new-chat-message", data);
    });

    socket.on("add-user-to-group", data => {
        const obj = JSON.parse(data);
        
        socket.broadcast.emit("receive-add-user-to-group", data);
        io.to(obj.ChatId).emit("receive-group-notification", data);
    });

    socket.on("remove-user-from-group", data => {
        const obj = JSON.parse(data);
        
        io.to(obj.ChatId).emit("receive-remove-user-from-group", data);
        io.to(obj.ChatId).emit("receive-group-notification", data);
    });
});

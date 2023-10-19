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

io.on("connection", socket => {
    socket.on('join-initial-chats', data => {
        const chatIds = JSON.parse(data);
        chatIds.forEach(id => {
            socket.join(id);
        });
    });

    socket.on("join-chat", data => {
        const chatId = JSON.parse(data);
        socket.join(chatId);
    });

    socket.on("leave-chat", data => {
        const chatId = JSON.parse(data);
        socket.leave(chatId);
    });
    
    socket.on("send-message", data => {
        const obj = JSON.parse(data);

        if (obj.NewChat) {
            socket.join(obj.ChatMessage.ChatId);
            socket.broadcast.emit("receive-new-chat-message", data);
        }
        socket.broadcast.to(obj.ChatMessage.ChatId).emit("receive-message", data);
    });

    socket.on("add-user-to-group", data => {
        socket.broadcast.emit("receive-add-user-to-group", data);
    });

    socket.on("remove-user-from-group", data => {
        const obj = JSON.parse(data);
        
        socket.to(obj.ChatId).emit("receive-remove-user-from-group", data);
    });

    socket.on("user-connection", async (data) => {
        const obj = JSON.parse(data);
        
        console.log(obj);
        
        const sockets = await io.in(obj.ChatId).fetchSockets();
        const socketsAll = await io.local.fetchSockets();

        console.log(sockets);
        console.log(socketsAll);
    });
});

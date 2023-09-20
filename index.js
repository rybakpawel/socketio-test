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
        const dataArray = JSON.parse(data);
        dataArray.forEach(data => {
            socket.join(data.Id);
        });
    });

    socket.on("join-chat", data => {
        const obj = JSON.parse(data);
        socket.join(obj.ChatMessage.ChatId);
    });
    
    socket.on("send-message", data => {
        const obj = JSON.parse(data);

        if (obj.NewChat) {
            socket.join(obj.ChatMessage.ChatId);
            socket.broadcast.emit("receive-new-chat-message", data);
        }
        socket.broadcast.to(obj.ChatMessage.ChatId).emit("receive-message", data);
    });
});

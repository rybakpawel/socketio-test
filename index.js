const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    },
});
const port = 5000;

server.listen(port, () => {
    console.log("Server listening at port ", port);
});

io.on("connection", socket => {
    socket.join(socket.handshake.query.userId)
    
    socket.on("send-message", data => {
        socket.to(data.chatGroupId).broadcast.emit("receive-message", {
            message: data.message,
            chatGroupId: data.chatGroupId
        });
    });
});

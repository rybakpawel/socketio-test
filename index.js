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
    console.log(socket.handshake.query.userId)
    socket.join(socket.handshake.query.userId)
    
    socket.on("send-message", data => {
        socket.broadcast.emit("receive-message", {
            message: data.message,
            chatGroupId: data.chatGroupId
        });
    });
});

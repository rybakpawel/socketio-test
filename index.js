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
    socket.on('join-initial-groups', data => {
        const dataArray = JSON.parse(data);
        dataArray.forEach(data => {
            socket.join(data.Id)
        });
    })
    
    socket.on("send-message", data => {
        const obj = JSON.parse(data);
        socket.broadcast.to(obj.ChatGroupId).emit("receive-message", data);
    });
});

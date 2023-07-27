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
    // socket.on('join-initial-groups', (room, name) => {
    //     socket.join(room)
    //     rooms[room].users[socket.id] = name
    //     socket.to(room).broadcast.emit('user-connected', name)
    // })
    
    socket.on("send-message", data => {
        console.log(data);
        const obj = JSON.parse(data);
        console.log(obj)
        socket.broadcast.to(data.chatGroupId).emit("receive-message", {
            message: data.message,
            chatGroupId: data.chatGroupId
        });
    });
});

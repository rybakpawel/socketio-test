const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        transports : ['websocket']
    },
});
const port = 5000;

server.listen(port, () => {
    console.log("Server listening at port ", port);
});

io.on("connection", (socket) => {
    
    socket.on("send-message", (data) => {
        io.broadcast.emit("receive-message", {
            message: "Wiadomość odebrana",
        });
    });
});

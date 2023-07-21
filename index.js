const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});
const port = 5000;

server.listen(port, () => {
    console.log("Server listening at port ", port);
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("Połączono")

    socket.emit("hello", "world")
    
    socket.on("send-message", (data) => {
        console.log("Nowa wiadomość")
        socket.broadcast.emit("receive-message", {
            message: "Wiadomość odebrana",
        });
        console.log("Po Receive")
    });
});

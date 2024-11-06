import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

// Config
const app = express();
const serverPort = 4000;
const server = createServer(app);

// Integración de Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

// Routes
app.use("/", (_req, res) => res.send("Server is running"));

let listMessages = [];

io.on("connection", (socket) => {
  console.log("Cliente conectado ->", socket.id);

  socket.emit("get-messages", listMessages);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  socket.on("new-message", (newMessage) => {
    console.log("Nuevo mensaje ->", newMessage);
    listMessages.push(newMessage);

    io.emit("new-message", listMessages);
  });
});

// Listener
server.listen(serverPort, () => {
  console.log(`Server running on port ${serverPort}`);
});

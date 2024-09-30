const express = require("express");
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connection = require("./config/db");
const userRouter = require("./routes/user.route");
const taskRouter = require("./routes/task.route");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/task", taskRouter(io));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(8080, () => {
  console.log("Server Successfully Running on 8080");
  connection();
});

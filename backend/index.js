const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dczjt7vop",
  api_key: "359194889441278",
  api_secret: "jlyddcdaAwM2WoRGsCE0P-STdoQ",
  upload_preset: {
    folder: "uploads/",
    tags: ["user_avatar"],
    allowed_formats: ["jpg", "jpeg", "png"],
    max_file_size: 10e6, // 10 MB
    transformation: {
      width: 500,
      height: 500,
      crop: "fill",
      gravity: "auto",
      quality: 80,
    },
  },
});

require("dotenv").config();
console.log(process.env.REACT_APP_LOCALHOST_KEY);

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    process.env.MONGO_URL,
    { bufferCommands: false },
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/userRoutes", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads/images", express.static("uploads/imges"));

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

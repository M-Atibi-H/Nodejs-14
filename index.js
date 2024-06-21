const socketio = require("socket.io");
const express = require("express");
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});

const io = socketio(server);

io.on("connection", function(socket) {
  console.log("Connected to " + socket.id);

  fs.readFile("text.txt", 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    socket.emit("history", data);
  });

  socket.on("chat", function(message) {
    io.emit("chat", message);

    fs.appendFile('text.txt', message.name + ": " + message.msg + "<br>", function(err) {
      if (err) {
        console.log(err);
      }
    });
  });

  socket.on("disconnect", function() {
    console.log("Disconnected from " + socket.id);
  });
});

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.static('public'));

let users = {};

io.on('connection', (socket) => {
  const username = `User${Math.floor(Math.random() * 1000)}`;
  users[socket.id] = username;

  io.emit('status update', `${username} is online`);

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', {
      message: msg,
      sender: username,
      status: '✓✓',
    });
  });

  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('typing', { username, isTyping });
  });

  socket.on('message received', () => {
    // placeholder for message delivery logic
  });

  socket.on('disconnect', () => {
    io.emit('status update', `${username} left`);
    delete users[socket.id];
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));

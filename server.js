const express = require('express');
const path = require('path');
const http = require('http');
// under the hood socket.io uses http createserver function, so we require the same function for using with socket.io that is why i have included the http module.
const socket = require('socket.io');

const formatMessage = require('./utils/messages');
const { text } = require('express');


const app = express();
const server = http.createServer(app);
const ioS = socket(server);
const botName = 'TCS Bot'

// setting the public folder as static folder.
app.use(express.static(path.join(__dirname, 'public')));

// runs when a client connects.
ioS.on('connection', (socket)=>{
      console.log('New Connection');
      socket.emit('message', formatMessage(botName, 'Welcome To TCS, message from server'));
      // this emit will be caught in client side js that is main.js present in public folder.


      // welcome => send message from server when a user connects.
      socket.broadcast.emit('message',formatMessage(botName, 'A user has joined the chat')); // this will emit to everybody excepts the user that has logged in or connected.

      //welcome => send message from server when a user disconnects.
      socket.on('disconnect', (message)=>{
            ioS.emit('message', formatMessage(botName,'A user has left the chat'));
      });
      // emiting the message from the form to the server.
      socket.on('chat-message', (message)=>{
            // console.log(message);
            ioS.emit('message', formatMessage('user',message));
      })
})
const PORT = 3000;

server.listen(PORT, ()=>{
      console.log(`Server running on port: ${PORT}`);
})
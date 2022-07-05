
const express = require('express');
const path = require('path');
const http = require('http');
// under the hood socket.io uses http createserver function, so we require the same function for using with socket.io that is why i have included the http module.
const socket = require('socket.io');

const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const { text } = require('express');

const app = express();
const server = http.createServer(app);
const ioS = socket(server);
const botName = 'TCS Bot'

// setting the public folder as static folder.
app.use(express.static(path.join(__dirname, 'public')));

// runs when a client connects.
ioS.on('connection', (socket)=>{

      // joining the room.
      socket.on('joinRoom', ({username, room})=>{
            const user = userJoin(socket.id,username, room);
            socket.join(user.room);


            socket.emit('message', formatMessage(botName, 'Welcome To TCS, message from server'));
            // this emit will be caught in client side js that is main.js present in public folder.
            // welcome => send message from server when a user connects.
            socket.broadcast.to(user.room).emit('message',formatMessage(botName, ` ${user.username} has joined the chat`)); // this will emit to everybody excepts the user that has logged in or connected.


            // sending users in room details 
            ioS.to(user.room).emit('roomUsers', {
                 room: user.room,
                 users: getRoomUsers(user.room) 
            });
      
      });


      console.log('New Connection');

      // emiting the message from the form to the server.
      socket.on('chat-message', (message)=>{
            const user = getCurrentUser(socket.id);
            // console.log(message);
            // ioS.emit('message', formatMessage(user.username,message));
            ioS.to(user.room).emit('message', formatMessage(user.username, message));
      });

      //disconnect => send message from server when a user disconnects.
      socket.on('disconnect', (message)=>{
            const user = userLeave(socket.id);
            if(user){
                  ioS.to(user.room).emit('message', formatMessage(botName, ` ${user.username} has left the chat`));
                  ioS.to(user.room).emit('roomUsers', {
                        room: user.room,
                        users: getRoomUsers(user.room) 
                   });
            }
      });
      
      
})



/* trying for sound effects */



const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>{
      console.log(`Server running on port: ${PORT}`);
})
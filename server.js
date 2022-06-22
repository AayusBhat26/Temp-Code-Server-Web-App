const express = require('express');
const path = require('path');
const http = require('http');
// under the hood socket.io uses http createserver function, so we require the same function for using with socket.io that is why i have included the http module.
const socket = require('socket.io');


const app = express();
const server = http.createServer(app);
const ioS = socket(server);


// setting the public folder as static folder.
app.use(express.static(path.join(__dirname, 'public')));

// runs when a client connects.
ioS.on('connection', (socket)=>{
      console.log('New Connection');
})
const PORT = 3000;

server.listen(PORT, ()=>{
      console.log(`Server running on port: ${PORT}`);
})
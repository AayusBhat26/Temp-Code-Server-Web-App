const socket = io();

const chatForm = document.querySelector('#chat-form');

socket.on('message', (message)=>{
      // console.log('message');
      console.log(message);
})

// On submission of message.
chatForm.addEventListener('submit', (e)=>{
      e.preventDefault();// when the form submits, it submits to a file, so in order to prevent that from happening, we have to use preventDefault.

      // getting the message.
      const msg = e.target.elements.msg.value;
      // console.log(msg);
      // emitting the message to the server.
      socket.emit('chat-message', msg)
})
const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.querySelector('#chat-form');

// Message from server. 
socket.on('message', (message)=>{
      // console.log('message');
      outputMessage(message);

      // scroll down when a new message arrives.
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
})

// On submission of message.
chatForm.addEventListener('submit', (e)=>{
      e.preventDefault();// when the form submits, it submits to a file, so in order to prevent that from happening, we have to use preventDefault.

      // getting the message.
      const msg = e.target.elements.msg.value;
      // console.log(msg);
      // emitting the message to the server.
      socket.emit('chat-message', msg);
      
      // clear input
      // message = '';
      e.target.elements.msg.value = '';
      e.target.elements.msg.focus(); // adding the focus back to input field
})

// displaying message to DOM.
function outputMessage(message){
      console.log(message);
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
      <p class="text">${message.text}
      </p>`;
      document.querySelector('.chat-messages').appendChild(div);
}
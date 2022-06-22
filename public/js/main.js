const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.querySelector('#chat-form');
const roomName = document.querySelector('#room-name')
const userList = document.getElementById('users')

// getting username and room name from the url. 

const {username, room} = Qs.parse(location.search, {
      ignoreQueryPrefix: true, 
});
// console.log(username, room);
// chat room joining,.
socket.emit('joinRoom', {username, room})

// get room and users
socket.on('roomUsers', ({room, users})=>{
      outputRoomNames(room);
      outputUserNames(users);
})

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

// adding roomname to DOm using function

function outputRoomNames(room){
      console.log(room);
      // roomName.innerHTML += room;
      roomName.innerHTML = room;
}

// add users to DOM using fucntion
function outputUserNames(users) {
      // userList.innerHTML = '';
      // users.forEach((user) => {
      //       const li = document.createElement('li');
      //       li.innerText = user.username;
      //       userList.appendChild(li);
      //     });


      userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
      
    }
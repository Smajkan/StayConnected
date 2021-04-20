const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const msg = document.getElementById('btn');

// Username i soba iz URL-a
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Pridruzuje se chatroomu
socket.emit('joinRoom', { username, room });

// Odavde dobijamo listu user-a i soba
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
//delay

// Poruke od strane servera
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  //Skrolanje
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Kad se poruka posalje
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Tekst poruke
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Prikazivanje poruke
  socket.emit('chatMessage', msg);

  // Ciscenje unosa
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// DOM ispis poruke
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}



// DOM - Dodavanje imena sobe
function outputRoomName(room) {
  roomName.innerText = room;
}

// DOM - Dodavanje user-a
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//P
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Da li si siguran da zelis napustiti sobu?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

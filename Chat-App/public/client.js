const socket = io();
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const typingDiv = document.getElementById('typing-indicator');
const statusBar = document.getElementById('status');
const themeToggle = document.getElementById('theme-toggle');

let username = "You";
let typing = false;
let timeout;

function stopTyping() {
  typing = false;
  socket.emit('typing', false);
}

function updateTyping() {
  if (!typing) {
    typing = true;
    socket.emit('typing', true);
    timeout = setTimeout(stopTyping, 2000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(stopTyping, 2000);
  }
}

function addMessage(msg, sender, status = '✓') {
  const div = document.createElement('div');
  div.classList.add('message');
  div.classList.add(sender === username ? 'you' : 'other');
  div.innerHTML = `${msg}<div class="meta">${status}</div>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

messageInput.addEventListener('input', updateTyping);

messageInput.addEventListener('keypress', e => {
  if (e.key === 'Enter' && messageInput.value.trim()) {
    const message = messageInput.value.trim();
    addMessage(message, username, '✓');
    socket.emit('chat message', message);
    messageInput.value = '';
    stopTyping();
  }
});

socket.on('chat message', ({ message, sender, status }) => {
  if (sender !== username) {
    addMessage(message, sender, '✓✓');
    socket.emit('message received');
  }
});

socket.on('typing', ({ username, isTyping }) => {
  typingDiv.textContent = isTyping ? `${username} is typing...` : '';
});

socket.on('status update', (status) => {
  statusBar.textContent = status;
});

socket.on('connect', () => statusBar.textContent = 'You are Online');
socket.on('disconnect', () => statusBar.textContent = 'Disconnected');

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '🌙' : '🌞';
});

const socket = new WebSocket("ws://localhost:3000");

const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");

const myId = Math.random().toString(36).substr(2, 9);

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value.trim()) {
    const msgObj = {
      sender: myId,
      message: input.value
    };
    socket.send(JSON.stringify(msgObj));
    input.value = "";
  }
});

socket.addEventListener("message", function (event) {
  const { sender, message } = JSON.parse(event.data);
  const item = document.createElement("li");
  item.textContent = message;
  item.classList.add(sender === myId ? "you" : "other");
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

const socket = io.connect();

// listen messages
socket.on('update-data', data => {
  updateMessages(data);
});

socket.on('check-data', () => {
  socket.emit('check-user', { email: username.value });
});

// Emit events
const username = document.querySelector('#input-userName');
socket.emit('check-user', { email: username.value });

// functions
const addMsg = () => {
  let dataMessage = {};
  if (document.querySelector('#input-response') === null) {
    dataMessage = {
      email: document.querySelector('#input-userName').value,
      message: document.querySelector('#input-message').value,
      responseTo: null,
    };
  } else {
    dataMessage = {
      email: document.querySelector('#input-userName').value,
      message: document.querySelector('#input-message').value,
      responseTo: document.querySelector('#input-response').value,
    };
  }

  socket.emit('add-message', dataMessage);
};

const updateMessages = data => {
  let html = data
    .map(obj => {
      if (obj.responseTo !== null) {
        return `
          <div class="container-message">
            <p> <span class='user'>${obj.email}</span>: ${obj.message} </p>
            <p> <span class='user'>Responde a: </span>: ${obj.responseTo} </p>
            <div><span class="time"> ${obj.createdAt} </span></div>
          </div>
        `;
      } else {
        return `
          <div class="container-message">
            <p> <span class='user'>${obj.email}</span>: ${obj.message} </p>
            <div><span class="time"> ${obj.createdAt} </span></div>
          </div>
        `;
      }
    })
    .join(' ');
  document.querySelector('#containerMessages').innerHTML = html;
};

// Interactions
document.querySelector('#messageForm').addEventListener('submit', function (e) {
  e.preventDefault();
  addMsg();
  this.reset();
});

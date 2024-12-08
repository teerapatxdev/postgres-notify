document.addEventListener('DOMContentLoaded', () => {
  const socket = io('http://localhost:3333/userNotify');

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('INSERT', (data) => {
    const alertBox = createAlertBox(
      `User ${data.newFirstname} ${data.newLastname ? data.newLastname : ''} has been added.`,
      'alert-success',
    );
    document.body.appendChild(alertBox);
  });

  socket.on('UPDATE', (data) => {
    let message = '';
    if (data.newRewardPoint > data.oldRewardPoint) {
      message = `User ${data.oldFirstname} ${data.oldFirstname ? data.oldLastname : ''} has received an additional ${data.newRewardPoint - data.oldRewardPoint} points.`;
    } else if (data.newRewardPoint < data.oldRewardPoint) {
      message = `User ${data.oldFirstname} ${data.oldFirstname ? data.oldLastname : ''} has used ${data.oldRewardPoint - data.newRewardPoint} points.`;
    } else {
      message = `User ${data.oldFirstname} ${data.oldFirstname ? data.oldLastname : ''} has updated their profile.`;
    }
    const alertBox = createAlertBox(message, 'alert-primary');
    document.body.appendChild(alertBox);
  });

  socket.on('DELETE', (data) => {
    const alertBox = createAlertBox(
      `User ${data.oldFirstname} ${data.oldFirstname ? data.oldLastname : ''} has been deleted.`,
      'alert-danger',
    );
    document.body.appendChild(alertBox);
  });
});

function createAlertBox(message, alertType) {
  const alertBox = document.createElement('div');
  alertBox.classList.add(
    'alert-box',
    'alert',
    alertType,
    'alert-dismissible',
    'fade',
    'show',
  );
  alertBox.setAttribute('role', 'alert');
  alertBox.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
  return alertBox;
}

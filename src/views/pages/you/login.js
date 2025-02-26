import { APIPostRequest } from '/resources/modules/request.js';

const element = {
  form: document.querySelector('#auth-login > .wrapper'),
  front: document.querySelector('#auth-login > .wrapper > .front'),
  back: document.querySelector('#auth-login > .wrapper > .back'),
};

const input = {
  username: document.querySelector('#input-auth-login-username'),
  password: document.querySelector('#input-auth-login-password'),
};

const button = {
  login: document.querySelector('#button-auth-login'),
  resetpassword: document.querySelector('#button-auth-reset-password'),
};

let runtask = false;
async function login() {
  if (runtask) {
    return;
  }
  runtask = true;

  if (!input.username.value) {
    input.username.focus();
    runtask = false;
    return;
  }

  if (!input.password.value) {
    input.password.focus();
    runtask = false;
    return;
  }

  flipBack();

  await wait(1000);

  await task().catch((error) => {
    flipFront();
    setTimeout(() => {
      shake();
      button.resetpassword.removeAttribute('hide');
      runtask = false;
    }, 250);
    throw error;
  });

  goaway();

  setTimeout(() => {
    const redir = getQuery('redir') || getQuery('r');
    window.location.href = redir ? redir : '/';
  }, 1000);
}

async function task() {
  throw 'a';
}

function flipBack() {
  element.front.style.transform = 'rotateX(-180deg)';
  element.back.style.transform = 'rotateX(-360deg)';
  element.front.style.transition = 'transform 0.25s linear';
  element.back.style.transition = 'transform 0.25s linear';
  setTimeout(() => {
    element.front.style.opacity = 0;
    element.back.style.opacity = 1;
  }, 125);
  setTimeout(() => {
    element.back.style.transition = 'all 0s';
    element.back.style.transform = 'rotateX(0deg)';
  }, 250);
}

function flipFront() {
  element.front.style.transform = 'rotateX(-360deg)';
  element.back.style.transform = 'rotateX(-180deg)';
  element.front.style.transition = 'transform 0.25s linear';
  element.back.style.transition = 'transform 0.25s linear';
  setTimeout(() => {
    element.front.style.opacity = 1;
    element.back.style.opacity = 0;
  }, 125);
  setTimeout(() => {
    element.front.style.transition = 'all 0s';
    element.front.style.transform = 'rotateX(0deg)';
  }, 250);
}

function shake() {
  element.form.setAttribute('shake', '');
  setTimeout(() => {
    element.form.removeAttribute('shake');
  }, 500);
}

function goaway() {
  element.form.setAttribute('goaway', '');
}

button.login.addEventListener('click', login);
document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key === 'Enter') {
    login();
  }
});

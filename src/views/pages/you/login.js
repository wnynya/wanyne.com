const element = {
  form: document.querySelector('#form'),
};

const input = {
  username: document.querySelector('#input-username'),
  password: document.querySelector('#input-password'),
};

const button = {
  login: document.querySelector('#button-login'),
  resetpassword: document.querySelector('#button-reset-password'),
};

function flipBack(form) {
  const front = form.querySelector('.front');
  const back = form.querySelector('.back');
  front.style.transform = 'rotateX(-180deg)';
  back.style.transform = 'rotateX(-360deg)';
  front.style.transition = 'transform 0.25s linear';
  back.style.transition = 'transform 0.25s linear';
  setTimeout(() => {
    front.style.opacity = 0;
    back.style.opacity = 1;
  }, 125);
  setTimeout(() => {
    back.style.transition = 'all 0s';
    back.style.transform = 'rotateX(0deg)';
  }, 250);
}

function flipFront(form) {
  const front = form.querySelector('.front');
  const back = form.querySelector('.back');
  front.style.transform = 'rotateX(-360deg)';
  back.style.transform = 'rotateX(-180deg)';
  front.style.transition = 'transform 0.25s linear';
  back.style.transition = 'transform 0.25s linear';
  setTimeout(() => {
    front.style.opacity = 1;
    back.style.opacity = 0;
  }, 125);
  setTimeout(() => {
    front.style.transition = 'all 0s';
    front.style.transform = 'rotateX(0deg)';
  }, 250);
}

function shake(form) {
  form.setAttribute('shake', '');
  setTimeout(() => {
    form.removeAttribute('shake');
  }, 500);
}

function goaway(form) {
  form.setAttribute('goaway', '');
}

let whileLogin = false;
async function login() {
  if (whileLogin) {
    return;
  }
  whileLogin = true;

  if (!input.username.value) {
    input.username.focus();
    whileLogin = false;
    return;
  }

  if (!input.password.value) {
    input.password.focus();
    whileLogin = false;
    return;
  }

  flipBack(element.form);

  await wait(1000);

  await task().catch((error) => {
    flipFront(element.form);
    setTimeout(() => {
      shake(element.form);
      button.resetpassword.removeAttribute('hide');
      whileLogin = false;
    }, 250);
    throw error;
  });

  goaway(element.form);

  setTimeout(() => {
    const redir = getQuery('redir') || getQuery('r');
    window.location.href = redir ? redir : '/';
  }, 1000);
}
login();

async function task() {
  throw 'a';
}

button.login.addEventListener('click', login);

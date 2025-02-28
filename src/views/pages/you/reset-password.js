const element = {
  form1: document.querySelector('#form1'),
  form2: document.querySelector('#form2'),
  form3: document.querySelector('#form3'),
};

const input = {
  username: document.querySelector('#input-username'),
  email: document.querySelector('#input-email'),
  code: document.querySelector('#input-code'),
  newpassword: document.querySelector('#input-new-password'),
  newpasswordre: document.querySelector('#input-new-password-retype'),
};

const button = {
  sendCode: document.querySelector('#button-send-code'),
  verifyCode: document.querySelector('#button-verify-code'),
  changePassword: document.querySelector('#button-change-password'),
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

function focusable(form) {
  for (const e of form.querySelectorAll('a, button, input, textarea')) {
    e.removeAttribute('tabindex', '-1');
  }
}

function unfocusable(form) {
  for (const e of form.querySelectorAll('a, button, input, textarea')) {
    e.setAttribute('tabindex', '-1');
  }
}

let whileSendCode = false;
async function sendCode() {
  if (whileSendCode) {
    return;
  }
  whileSendCode = true;

  if (!input.username.value) {
    input.username.focus();
    whileSendCode = false;
    return;
  }

  if (!input.email.value) {
    input.email.focus();
    whileSendCode = false;
    return;
  }

  if (!input.email.value.match(/[^@]+@.+\.[^\.]+/)) {
    input.email.focus();
    whileSendCode = false;
    return;
  }

  flipBack(element.form1);

  await wait(1000);

  await task().catch((error) => {
    flipFront(element.form1);
    setTimeout(() => {
      shake(element.form1);
      whileSendCode = false;
    }, 250);
    throw error;
  });

  element.form1.setAttribute('left', '');
  element.form2.removeAttribute('right');
  unfocusable(element.form1);
  focusable(element.form2);

  setTimeout(() => {
    verifyCode();
  }, 1000);
}

button.sendCode.addEventListener('click', sendCode);

focusable(element.form1);
unfocusable(element.form2);
unfocusable(element.form3);
sendCode();

let whileVerifyCode = false;
async function verifyCode() {
  if (whileVerifyCode) {
    return;
  }
  whileVerifyCode = true;

  if (!input.code.value) {
    input.code.focus();
    whileVerifyCode = false;
    return;
  }

  if (!input.code.value.match(/[0-9]{6}/)) {
    input.code.focus();
    whileVerifyCode = false;
    return;
  }

  flipBack(element.form2);

  await wait(1000);

  await task().catch((error) => {
    flipFront(element.form2);
    setTimeout(() => {
      shake(element.form2);
      whileVerifyCode = false;
    }, 250);
    throw error;
  });

  element.form2.setAttribute('left', '');
  element.form3.removeAttribute('right');
  unfocusable(element.form2);
  focusable(element.form3);

  setTimeout(() => {
    changePassword();
  }, 1000);
}

button.verifyCode.addEventListener('click', verifyCode);

let whileChangePassword = false;
async function changePassword() {
  if (whileChangePassword) {
    return;
  }
  whileChangePassword = true;

  if (!input.newpassword.value) {
    input.newpassword.focus();
    whileChangePassword = false;
    return;
  }

  if (!input.newpasswordre.value) {
    input.newpasswordre.focus();
    whileChangePassword = false;
    return;
  }

  if (input.newpassword.value !== input.newpasswordre.value) {
    input.newpasswordre.focus();
    whileChangePassword = false;
    return;
  }

  flipBack(element.form3);

  await wait(1000);

  await task().catch((error) => {
    flipFront(element.form3);
    setTimeout(() => {
      shake(element.form3);
      whileChangePassword = false;
    }, 250);
    throw error;
  });

  goaway(element.form3);
}

button.changePassword.addEventListener('click', changePassword);

async function task() {}

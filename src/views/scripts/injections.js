/*

  🥺 와니가ー 좋아하는ー 프론트ー 인젝션ー 🥵

  ＿人人人人人人人人人人人人人人人＿
  ＞　グローバルで「汚染」させる　＜
  ￣Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y￣

*/

console.log(
  '%cwanyne.com — 와니네',
  'background: #d2b0dd; color: black; font-weight: bold; padding: 1rem; border-radius: 0.75rem;'
);

window.Math.rem = (n = 1) => {
  return n * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

function vh() {
  document.documentElement.style.setProperty(
    '--vh',
    window.innerHeight * 0.01 + 'px'
  );
}
window.addEventListener('resize', vh);
vh();

window.getCookie = (name) => {
  let cookies = document.cookie
    ? ((s) => {
        const o = {};
        for (const c of s.split(';')) {
          const v = c.split('=');
          o[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        }
        return o;
      })(document.cookie)
    : {};
  return cookies[name];
};

window.setCookie = (name, value, expire) => {
  var expires = '';
  if (expire) {
    var date = new Date();
    date.setTime(date.getTime() + expire);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

window.getQuery = (name) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params[name];
};

Date.prototype.toJSONLocal = (function () {
  function addZ(n) {
    return (n < 10 ? '0' : '') + n;
  }
  return function () {
    return (
      this.getFullYear() +
      '-' +
      addZ(this.getMonth() + 1) +
      '-' +
      addZ(this.getDate())
    );
  };
})();

window.hash = async (algo = 'SHA-512', message) => {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(algo, new TextEncoder().encode(message))
    ),
    (byte) => byte.toString(16).padStart(2, '0')
  ).join('');
};

window.wait = (ms = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

window.asyncs = new (class {
  constructor() {
    this.timeouts = [];
    this.intervals = [];
  }

  setTimeout(f, t) {
    const s = setTimeout(f, t);
    this.timeouts.push(s);
    return s;
  }

  clearTimeout(s) {
    clearTimeout(s);
    this.timeouts.splice(this.timeouts.indexOf(s), 1);
  }

  setInterval(f, t) {
    const s = setInterval(f, t);
    this.intervals.push(s);
    return s;
  }

  clearInterval(s) {
    clearInterval(s);
    this.timeouts.splice(this.intervals.indexOf(s), 1);
  }

  clear() {
    for (const a of this.timeouts) {
      this.clearTimeout(a);
    }
    for (const a of this.intervals) {
      this.clearInterval(a);
    }
    this.timeouts = [];
    this.intervals = [];
  }
})();

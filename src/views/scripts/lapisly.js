'use strict';

const Lapisly = new (class {
  constructor() {
    this.prefetched = [];

    const _this = this;
    this.aEvent = (event) => {
      event.preventDefault();
      let a = event.target;
      while (a.nodeName != 'A') {
        a = a.parentElement;
      }
      const href = a.href;
      const target = a.target;
      _this.goto(href, a.getAttribute('effect'), true, target);
    };
    this.aUpdate = () => {
      for (const e of document.querySelectorAll('a[href]')) {
        e.removeEventListener('click', _this.aEvent);
        e.addEventListener('click', _this.aEvent);
      }
    };
    this.observer = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const href = entry.target.href;
          const uid = btoa(href);
          if (this.prefetched.includes(uid)) {
            continue;
          }
          this.prefetched.push(uid);
          this.prefetch(href);
        }
      }
    }, {});
    this.update();

    window.addEventListener('load', () => {
      _this.update();
    });
    window.addEventListener('popstate', () => {
      _this.goto(window.location.href, false);
    });
  }

  goto(url, effect, pushHistory = true, target = '_blank') {
    const _this = this;

    if (url.startsWith('/')) {
      url = `https://${window.location.host}${url}`;
    }

    const matches = url.match(/https?:\/?\/?([^/]+)(\/[^?]*)?(\?.+)?/);
    let host = matches[1];
    if (host !== window.location.host) {
      window.open(url, target);
      return;
    }

    if (url === window.location.href) {
      pushHistory = false;
    }
    const tempHistory = [];
    if (pushHistory) {
      window.history.pushState(tempHistory, window.location.host, url);
    }

    window.asyncs ? window.asyncs.clear() : null;

    this.get(url).then(go).catch(go);

    function go(res) {
      if (res.url !== url) {
        tempHistory.push(res.url);
        window.history.replaceState(tempHistory, window.location.host, res.url);
      }
      _this.display(res.body);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    /*
    if (effect == 'bar') {
      let effector = new Loadingbar();
      function go(res) {
        if (res.uri != href) {
          tempHistory.push(res.uri);
          window.history.replaceState(
            tempHistory,
            window.location.host,
            res.uri
          );
        }
        _this.display(res.body);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        effector.end();
        window.Cursor ? window.Cursor.lapisGoto() : null;
        window.Inputs ? window.Inputs.lapisGoto() : null;
      }
      GetRequest(href).then(go).catch(go);
    } else if (effect == 'curtain') {
      let effector = new Curtain();
      let result = null;
      let shaded = false;
      function go(res) {
        if (res.uri != href) {
          tempHistory.push(res.uri);
          window.history.replaceState(
            tempHistory,
            window.location.host,
            res.uri
          );
        }
        _this.display(res.body);
        window.scrollTo({ top: 0 /*behavior: 'smooth'* });
        effector.end();
        window.Cursor ? window.Cursor.lapisGoto() : null;
        window.Inputs ? window.Inputs.lapisGoto() : null;
      }
      setTimeout(() => {
        shaded = true;
        if (result) {
          go(result);
        }
      }, effector.timeblock * effector.div + 200);
      function after(res) {
        result = res;
        if (shaded) {
          go(result);
        }
      }
      GetRequest(href).then(after).catch(after);
    }
    */
  }

  async get(url) {
    return new Promise((resolve, reject) => {
      window
        .fetch(url)
        .then((res) => {
          res.text().then((text) => {
            const data = {};
            const headers = {};
            for (const key of res.headers.keys()) {
              headers[key] = res.headers.get(key);
            }
            data.url = res.url;
            data.status = res.status;
            data.header = headers;
            data.body = text;
            resolve(data);
          });
        })
        .catch(reject);
    });
  }

  display(html) {
    const temp = document.createElement('template');
    temp.innerHTML = html;
    const doc = temp.content;

    for (const script of doc.querySelectorAll('script')) {
      script.remove();
    }

    // head
    copyHTML(doc, document, 'title');
    copyHTML(doc, document, 'style#theme');
    copyContent(doc, document, 'meta[name="description"]');
    copyHTML(doc, document, 'script[type="application/ld+json"]');
    copyContent(doc, document, 'link[rel=canonical]');
    copyContent(doc, document, 'meta[name="og:title"]');
    copyContent(doc, document, 'meta[name="og:description"]');
    copyContent(doc, document, 'meta[name="og:image"]');
    copyContent(doc, document, 'meta[name="twitter:title"]');
    copyContent(doc, document, 'meta[name="twitter:description"]');
    copyContent(doc, document, 'meta[name="twitter:image"]');

    // body
    copyHTML(doc, document, 'lapisly');

    this.update();

    function copyHTML(from, to, selector) {
      if (to.querySelector(selector) && from.querySelector(selector)) {
        to.querySelector(selector).innerHTML =
          from.querySelector(selector).innerHTML;
      } else if (to.querySelector(selector)?.innerHTML) {
        to.querySelector(selector).innerHTML = '';
      }
    }

    function copyContent(from, to, selector) {
      if (to.querySelector(selector) && from.querySelector(selector)) {
        to.querySelector(selector).content =
          from.querySelector(selector).content;
      } else if (to.querySelector(selector)?.content) {
        to.querySelector(selector).content = '';
      }
    }

    const scriptTemp = document.createElement('template');
    scriptTemp.innerHTML = html;
    const scriptDoc = scriptTemp.content;

    for (const oldScript of scriptDoc.querySelectorAll('lapisly script')) {
      const newScript = document.createElement('script');
      [...oldScript.attributes].forEach(({ name, value }) =>
        newScript.setAttribute(name, value)
      );
      newScript.textContent = oldScript.textContent;
      document.querySelector('lapisly').appendChild(newScript);
    }

    window.mixedtypo(document.body);
  }

  prefetch(href) {
    return;
    if (href == window.location.href) {
      return;
    }
    fetch(href, {
      method: 'GET',
    })
      .then((res) => {
        res.text().then((text) => {
          const temp = document.createElement('template');
          temp.innerHTML = text;
          for (const element of temp.content
            .querySelector('main')
            .querySelectorAll('lapis-script[src], lapis-style[src]')) {
            document.body.appendChild(element);
            document.body.removeChild(element);
          }
        });
      })
      .catch((error) => {});
  }

  update() {
    this.aUpdate();
    this.observer.disconnect();
    for (const e of document.querySelectorAll('a[href][lapisly]')) {
      this.observer.observe(e);
    }
  }
})();

class Loadingbar {
  constructor() {
    this.bar = document.createElement('div');
    this.bar.style.position = 'fixed';
    this.bar.style.top = 0;
    this.bar.style.left = 0;
    this.bar.style.height = '2px';
    this.bar.style.boxShadow = '0 0 3px 0 var(--th-tl)';
    this.bar.style.background = 'var(--th)';
    this.bar.style.zIndex = 200000000;
    this.bar.style.transition = 'width ease-out 0.2s';
    this.state = 'ready';
    this.percent = 0.0;
    this.progress(this.percent);

    document.body.appendChild(this.bar);

    this.update = () => {
      if (this.state == 'ready') {
        this.percent += 0.01;
        this.percent = Math.min(90.0, this.percent);
        window.requestAnimationFrame(this.update);
      }
      this.progress(this.percent);
    };
    window.requestAnimationFrame(this.update);

    setTimeout(() => {
      this.percent = 20.0;
    }, 10);
  }

  progress(percent) {
    this.bar.style.width = percent + '%';
  }

  end() {
    this.state = 'end';
    this.percent = 100;
    this.progress(this.percent);

    setTimeout(() => {
      this.destroy();
    }, 250);
  }

  destroy() {
    this.bar.style.left = null;
    this.bar.style.right = 0;
    this.bar.style.width = '0%';
    setTimeout(() => {
      document.body.removeChild(this.bar);
    }, 250);
  }
}

class Curtain {
  constructor(direction) {
    this.curtain = document.createElement('div');
    this.curtain.style.zIndex = '2100000000';
    this.curtain.style.position = 'fixed';
    this.curtain.style.top = '0';
    this.curtain.style.left = '0';
    this.curtain.style.width = '100vw';
    this.curtain.style.height = '100vh';

    document.body.appendChild(this.curtain);

    this.div = Math.floor(window.innerWidth / Math.rem(4));
    this.timeblock = 10;
    this.block = window.innerWidth / this.div;

    for (let i = 0; i < this.div; i++) {
      const bar = document.createElement('div');
      bar.style.position = 'absolute';
      bar.style.top = '0';
      bar.style.right = i * this.block - 2 + 'px';
      bar.style.height = '100%';
      bar.style.width = '0px';
      bar.style.background = 'var(--fg)';
      bar.style.transition = 'width 0.2s ease-out, background 0.5s ease-out';
      this.curtain.appendChild(bar);
    }
    const bars = this.curtain.querySelectorAll('div');
    let c = 0;
    const interval = setInterval(() => {
      const bar = bars[c];
      bar.style.width = this.block + 4 + 'px';
      c++;
      if (c >= this.div) {
        clearInterval(interval);
      }
    }, this.timeblock);
  }

  end() {
    setTimeout(() => {
      const bars = this.curtain.querySelectorAll('div');
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];
        bar.style.right = 'unset';
        bar.style.left = window.innerWidth - ((i + 1) * this.block + 2) + 'px';
      }
      let c = 0;
      const interval = setInterval(() => {
        const bar = bars[c];
        bar.style.width = '0px';
        c++;
        if (c >= this.div) {
          clearInterval(interval);
        }
      }, this.timeblock);
    }, 200);
    setTimeout(() => {
      document.body.removeChild(this.curtain);
    }, this.timeblock * this.div + 500 + 200);
  }
}

window.Curtain = Curtain;

window.Lapisly = Lapisly;

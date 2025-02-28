'use strict';

window.Cursor = new (class {
  constructor() {
    if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      this.mobile = true;
      return;
    }

    this.pressed = false;
    this.overbtn = false;
    this.enabled = true;

    this.cursor = document.createElement('div');

    this.cursor.style.position = 'fixed';
    this.cursor.style.width = '20rem';
    this.cursor.style.height = '20rem';
    this.cursor.style.top = '-20rem';
    this.cursor.style.left = '-20rem';
    this.cursor.style.display = 'flex';
    this.cursor.style.alignItems = 'center';
    this.cursor.style.justifyContent = 'center';
    this.cursor.style.pointerEvents = 'none';
    this.cursor.style.zIndex = '2000000000';
    this.cursor.style.transition = 'all 0s ease-out';
    this.cursor.style.display = 'flex';
    this.cursor.style.alignItems = 'center';
    this.cursor.style.justifyContent = 'center';
    this.cursor.id = 'cursor';

    var html = '';
    html += '<div layer style="z-index: 16000">';
    html += '  <style>';
    html +=
      '    @keyframes rotate{ from{ transform: rotate(360deg); } to{ transform: rotate(-360deg); } }';
    html += '  </style>';
    html += '  <div layer id="cursor-circle-message">';
    html +=
      '  <div layer id="cursor-circle-background" style="display: flex; align-items: center; justify-content: center;">';
    html +=
      '    <div id="cursor-circle-center" style="display: flex; align-items: center; justify-content: center; width: 12rem; height: 12rem; border-radius: 100%; background:black;"></div>';
    html += '  </div>';
    html +=
      '  <svg layer xmlns="http://www.w3.org/2000/svg" viewbox="0 0 300 300" style="animation: 10s linear infinite running rotate;">';
    html += '    <defs>';
    html += '    </defs>';
    html +=
      '    <path id="cursor-circle-path" style="fill:none;stroke:none;stroke-miterlimit:10;" d="M 80 150 A 50 50 0 1 1 220 150 A 50 50 0 1 1 80 150 " />';
    html +=
      '    <text><textPath id="cursor-circle-text" href="#cursor-circle-path"></textPath></text>';
    html += '  </svg>';
    html += '  </div>';
    html += '</div>';

    html +=
      '<div layer style="display: flex; align-items: center; justify-content: center; z-index: 17000">';
    html += '  <div id="cursor-tooltip-message"><div class="text"></div></div>';
    html += '</div>';

    this.cursor.innerHTML = html;

    this.tooltip = {
      element: this.cursor.querySelector('#cursor-tooltip-message'),
      text: this.cursor.querySelector('#cursor-tooltip-message .text'),
    };

    this.circle = {
      element: this.cursor.querySelector('#cursor-circle-message'),
      text: this.cursor.querySelector('#cursor-circle-text'),
      back: this.cursor.querySelector('#cursor-circle-center'),
    };

    this.tooltip.element.style.position = 'absolute';
    this.tooltip.element.style.display = 'inline-block';
    this.tooltip.element.style.textAlign = 'left';
    this.tooltip.element.style.left = '12rem';
    this.tooltip.element.style.right = 'unset';
    this.tooltip.element.style.width = '50vw';
    this.tooltip.element.style.opacity = '1';
    this.tooltip.element.style.transition = 'opacity 0.1s ease';

    this.tooltip.text.style.display = 'inline-block';
    this.tooltip.text.style.padding = '0 0.5rem';
    this.tooltip.text.style.borderRadius = '0.45rem';
    this.tooltip.text.style.fontFamily = 'var(--font-family)';
    this.tooltip.text.style.fontSize = '1rem';
    this.tooltip.text.style.fontWeight = '400';
    this.tooltip.text.style.fontStyle = 'normal';
    this.tooltip.text.style.lineHeight = '1.6rem';
    this.tooltip.text.style.background = 'var(--dark3)';
    this.tooltip.text.style.color = 'var(--light1)';

    this.circle.element.style.transform = 'scale(0.0)';
    //this.circle.element.style.transition = 'transform ease-out 0.1s';
    this.circle.text.style.fontFamily = 'var(--font-family)';
    this.circle.text.style.fontSize = '1rem';
    this.circle.text.style.fontWeight = '400';
    this.circle.text.style.fontStyle = 'normal';
    this.circle.text.style.fill = 'var(--dark3)';
    this.circle.text.style.stroke = 'transparent';
    this.circle.text.style.letterSpacing = '0.05rem';
    this.circle.back.style.transform = 'rotate(-22.5deg)';
    this.circle.back.style.fontFamily = 'var(--font-family)';
    this.circle.back.style.fontSize = '4rem';
    this.circle.back.style.fontWeight = '900';
    this.circle.back.style.fontStyle = 'normal';
    this.circle.back.style.lineHeight = '100%';

    document.body.appendChild(this.cursor);

    var _this = this;

    document.addEventListener('mousemove', function (event) {
      var x = event.clientX;
      var y = event.clientY;
      _this.cursor.style.left = 'calc(' + x + 'px - 10rem)';
      _this.cursor.style.top = 'calc(' + y + 'px - 10rem)';
      if (x < window.innerWidth / 1.5) {
        _this.tooltip.element.style.textAlign = 'left';
        _this.tooltip.element.style.left = '12rem';
        _this.tooltip.element.style.right = 'unset';
      } else {
        _this.tooltip.element.style.textAlign = 'right';
        _this.tooltip.element.style.left = 'unset';
        _this.tooltip.element.style.right = '12rem';
      }
    });

    document.addEventListener('mouseenter', function (event) {
      _this.tooltip.element.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function (event) {
      _this.tooltip.element.style.opacity = '0';
    });

    document.querySelector('body').addEventListener('mouseenter', () => {
      _this.tooltip.element.style.opacity = '1';
    });
    document.querySelector('body').addEventListener('mouseleave', () => {
      _this.tooltip.element.style.opacity = '0';
    });

    this.mouseover = false;

    this.onMouseOver = (event) => {
      let target = event.target;
      while (
        !(
          target &&
          (target.nodeName == 'BUTTON' ||
            target.type == 'button' ||
            target.classList.contains('button') ||
            target.getAttribute('tooltip') ||
            target.getAttribute('circle'))
        )
      ) {
        target = target.parentElement;
      }
      if (target.getAttribute('tooltip')) {
        this.showTooltip(target.getAttribute('tooltip'));
      } else if (target.getAttribute('circle')) {
        this.showCircle(target.getAttribute('circle'));
      }
    };

    this.onMouseOut = (event) => {
      this.hideTooltip();
      this.hideCircle();
    };

    this.addEventListener();

    this.hideTooltip();
    this.hideCircle();

    this.lastCircle = 0;
  }

  addEventListener() {
    for (const element of document.querySelectorAll(
      'button, [type="button"], .button, *[tooltip], *[circle]'
    )) {
      element.removeEventListener('mouseover', this.onMouseOver);
      element.removeEventListener('mouseout', this.onMouseOut);
      element.addEventListener('mouseover', this.onMouseOver);
      element.addEventListener('mouseout', this.onMouseOut);
    }
  }

  showTooltip(content) {
    this.tooltip.text.innerHTML = content;
    mixedtypo(this.tooltip.text);
  }

  hideTooltip() {
    this.tooltip.text.innerHTML = '';
  }

  showCircle(content) {
    this.lastCircle = Date.now();
    let split = content.split(';');
    if (split.length >= 4) {
      this.circle.back.style.background = split[0];
      this.circle.back.innerHTML = split[2];
      this.circle.text.style.fill = split[1];
      this.circle.text.innerHTML = split[3];
    } else {
      this.circle.text.innerHTML = content;
    }
    //this.circle.element.style.transform = 'scale(1.0)';
    this.circle.element
      .transform()
      .spring(0.35, 5)
      .to({ transform: 'scale(1.0)' }, 750);
  }

  hideCircle() {
    const dn = Date.now();
    setTimeout(() => {
      if (!(dn - 1 <= this.lastCircle && this.lastCircle <= dn + 1)) {
        this.circle.element
          .transform()
          .easeout()
          .to({ transform: 'scale(0.0)' }, 150);
      }
    }, 1);
  }

  setMessage(message) {
    if (this.mobile || !this.enabled) {
      return;
    }
    this.tooltip.text.innerHTML = message;
  }

  btnMouseover(event) {
    if (this.mobile || !this.enabled) {
      return;
    }
    this.overbtn = true;
    var target = event.target;
    var n = 0;
    while (n < 20 && target && !target.getAttribute('message')) {
      target = target.parentElement;
      if (!target) {
        return;
      }
      n++;
    }
    var message = target.getAttribute('message') || target.getAttribute('msg');
    if (message) {
      this.tooltip.text.innerHTML = message;
    }
  }

  btnMouseout(event) {
    if (this.mobile || !this.enabled) {
      return;
    }
    this.overbtn = false;
    this.tooltip.text.innerHTML = '';
  }

  lapislyGoto() {
    if (this.mobile || !this.enabled) {
      return;
    }
    this.addEventListener();
    this.onMouseOut();
  }
})();

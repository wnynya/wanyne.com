(() => {
  const element = {
    nav: document.querySelector('#nav'),
    always: document.querySelector('#nav-always'),
    drawer: document.querySelector('#nav-drawer'),
    dropdown: document.querySelector('#nav-dropdown'),
    cover: document.querySelector('#nav-cover'),
  };

  const button = {
    index: document.querySelector('#button-nav-index'),
  };

  let dropdownHeight = 12 + 2;
  element.drawer.style.height = `${dropdownHeight + 10}rem`;
  element.drawer.style.top = `-${dropdownHeight + 10 + 2}rem`;

  function freezeCover() {
    element.cover.setAttribute('freeze', '');
    document.body.style.overflow = 'hidden';
  }

  function meltCover() {
    element.cover.removeAttribute('freeze');
    document.body.style.overflow = '';
    closeDropdown();
  }

  element.cover.addEventListener('click', meltCover);

  let navState = '';
  function topNav() {
    if (navState === 'top') {
      return;
    }
    navState = 'top';
    element.nav.setAttribute('top', '');
  }

  function fixedNav() {
    if (navState === 'fixed') {
      return;
    }
    navState = 'fixed';
    element.nav.removeAttribute('top');
  }

  let alwaysState = '';
  function topAlways() {
    if (alwaysState === 'top') {
      return;
    }
    alwaysState = 'top';
    element.always.transform().spring().to({
      top: '0rem',
    });
    element.drawer
      .transform()
      .spring()
      .to({
        top: `-${dropdownHeight + 12}rem`,
      });
  }

  function openAlways() {
    if (alwaysState === 'open') {
      return;
    }
    alwaysState = 'open';
    element.always.transform().spring().to({
      top: '0rem',
    });
    element.drawer
      .transform()
      .spring()
      .to({
        top: `-${dropdownHeight + 6}rem`,
      });
  }

  function closeAlways() {
    if (alwaysState === 'close') {
      return;
    }
    alwaysState = 'close';
    element.always.transform().spring().to({
      top: '-6rem',
    });
    element.drawer
      .transform()
      .spring()
      .to({
        top: `-${dropdownHeight + 12}rem`,
      });
  }

  let dropdownState = '';
  function openDropdown() {
    if (dropdownState === 'open') {
      return;
    }
    dropdownState = 'open';
    button.index.setAttribute('selected', '');
    element.drawer.transform().spring().to({
      top: `-6rem`,
    });
    element.dropdown
      .transform()
      .spring()
      .to({
        height: `${dropdownHeight}rem`,
      });
    element.dropdown.style.pointerEvents = 'all';
    freezeCover();
  }

  function closeDropdown() {
    if (dropdownState === 'close') {
      return;
    }
    dropdownState = 'close';
    button.index.removeAttribute('selected');
    if (alwaysState === 'open') {
      element.drawer
        .transform()
        .spring(0.3, 12)
        .to({
          top: `-${dropdownHeight + 6}rem`,
        });
    } else {
      element.drawer
        .transform()
        .spring(0.3, 12)
        .to({
          top: `-${dropdownHeight + 12}rem`,
        });
    }
    element.dropdown.transform().spring(0.3, 12).to({
      height: '0rem',
    });
    element.dropdown.style.pointerEvents = '';
    meltCover();
  }

  button.index.addEventListener('click', () => {
    if (!button.index.hasAttribute('selected')) {
      openDropdown();
    } else {
      closeDropdown();
    }
  });

  let lastScrollY = Infinity;
  let upDirStart = 1;
  let upDirTime = 5000;
  function onScroll() {
    if (document.body.style.overflow == 'hidden') {
      return;
    }
    const y = window.scrollY;
    let dir;

    if (y > lastScrollY) {
      dir = 'down';
    } else if (y < lastScrollY) {
      dir = 'up';
    }

    let yn = 200;
    let dt = 150;

    if (y <= yn) {
      topNav();
      topAlways();
    } else if (yn < y && y <= yn * 2) {
      closeAlways();
    } else if (yn * 2 < y) {
      fixedNav();
      if (dir === 'down') {
        closeAlways();
        upDirStart = 0;
        upDirTime = 0;
      } else if (dir === 'up') {
        if (upDirStart !== 0) {
          upDirTime += Date.now() - upDirStart;
          if (upDirTime > dt) {
            openAlways();
          }
        }
        upDirStart = Date.now();
      }
    }

    lastScrollY = y;
  }
  window.addEventListener('scroll', () => {
    onScroll();
  });
  window.addEventListener('load', () => {
    onScroll();
  });
})();

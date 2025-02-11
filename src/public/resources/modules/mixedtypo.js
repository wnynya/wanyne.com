function doom(element) {
  const textNodes = [];
  function findTextNodes(parent) {
    for (const node of parent.childNodes) {
      if (node.nodeName === '#text') {
        textNodes.push(node);
      } else if (!['SCRIPT'].includes(node.nodeName)) {
        findTextNodes(node);
      }
    }
  }
  findTextNodes(element);

  for (const node of textNodes) {
    let value = node.nodeValue;
    value = value.replace(/\r|\n/g, '');
    if (!value) {
      continue;
    }

    let bufferType = '';
    let buffer = '';
    for (let i = 0; i < value.length; i++) {
      const char = value.charAt(i);
      const type = getType(char);
      if (bufferType && bufferType != type) {
        const span = document.createElement('span');
        span.setAttribute('text', bufferType);
        span.innerText = buffer;
        node.parentNode.insertBefore(span, node);
        buffer = char;
      } else {
        buffer += char;
      }
      bufferType = type;
    }
    node.parentNode.removeChild(node);
  }
}

const typeMatchers = {
  latin: /[A-Za-zÀ-ÖØ-žſ-ʯЀ-ԯ]/,
  number: /[0-9]/,
  hangul: /[ㄱ-ㅎㅏ-ㅣ가-힣ㅥ-ㆎ]/,
  hanja: /[⺀-⿕㐀-䶵一-鿦豈-龎]/,
  gana: /[ぁ-ヿㇰ-ㇿ]/,
  braket: /[(){}\[\]]/,
};

function getType(char) {
  for (const type in typeMatchers) {
    if (char.match(typeMatchers[type])) {
      return type;
    }
  }
  return 'others';
}

window.addEventListener('load', doom(document.body));

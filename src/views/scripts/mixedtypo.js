window.mixedtypo = (element) => {
  const textNodes = [];
  function findTextNodes(parent) {
    for (const node of parent.childNodes) {
      if (node.nodeName === '#text') {
        textNodes.push(node);
      } else if (
        !['HEAD', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(
          node.nodeName
        ) &&
        !node.hasAttribute('text') &&
        !node.classList.contains('material-symbols-outlined')
      ) {
        findTextNodes(node);
      }
    }
  }
  findTextNodes(element);

  function replaceNode(node, buffer, type) {
    const span = document.createElement('span');
    span.setAttribute('text', type);
    span.innerText = buffer;
    node.parentNode.insertBefore(span, node);
  }

  for (const node of textNodes) {
    let value = node.nodeValue;
    value = value.replace(/\r|\n/g, '');
    if (!value.replace(/ /g, '')) {
      continue;
    }

    let bufferType = '';
    let buffer = '';
    for (let i = 0; i < value.length; i++) {
      const char = value.charAt(i);
      const type = getType(char);
      if (bufferType && bufferType != type) {
        replaceNode(node, buffer, bufferType);
        buffer = char;
      } else {
        buffer += char;
      }
      bufferType = type;
    }
    replaceNode(node, buffer, bufferType);
    node.parentNode.removeChild(node);
  }
};

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

mixedtypo(document.body);

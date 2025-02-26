'use strict';

import fs from 'node:fs';
import path from 'node:path';

import { parse as parseHTML } from 'node-html-parser';
const HTML = {
  parse: parseHTML,
};

class TemplateEngine {
  #cache = {};
  options;
  templates;

  constructor(options) {
    this.views = options.views;
    this.options = options;
    this.templates = {};
    this.resources = {};
  }

  render(file, scope, callback) {
    try {
      const template = this.getTemplate(file);

      const document = HTML.parse(template);
      this.processDocument(file, document, scope);
      const parsed = document.toString();

      callback(null, parsed);
    } catch (error) {
      callback(error, null);
    }
  }

  use(req, res, next) {
    res.page = (page, title, scope) => {
      res.render('index', {
        client: req.client,
        page: page,
        title: title,
      });
    };

    next();

    /*try {
      const file = path.resolve(this.views, req.path.substring(1));

      if (!file.startsWith(this.views)) {
        throw 403;
      }

      if (!fs.existsSync(file)) {
        throw 404;
      }

      res.sendFile(file);
    } catch (e) {
      next();
    }*/
  }

  getTemplate(file) {
    const key = Buffer.from(file).toString('base64');

    if (!this.#cache[key]) {
      this.#cache[key] = fs.readFileSync(file).toString();
    }

    return this.#cache[key];
  }

  processDocument(file, document, scope = {}) {
    this.processRepeatTag(file, document, scope);
    this.processInjection(file, document, scope);
    this.processIfTag(file, document, scope);
    this.processImportTag(file, document, scope);
    this.processUri(file, document, scope);
  }

  processInjection(file, document, scope = {}) {
    let content = document.innerHTML;
    const injections = content.match(/#{([^}]+)}/g);
    for (const injection of injections || []) {
      const code = injection.match(/#{([^}]+)}/)[1];
      const value = this.eval(code, scope);
      content = content.replace(injection, value);
    }
    document.innerHTML = content;
  }

  processImportTag(file, document, scope = {}) {
    let elements = document.querySelectorAll('import');
    for (const element of elements) {
      let src = element.getAttribute('src');
      if (!/\.[^\.]+/.test(src)) {
        src += '.html';
      }
      let dir = path.dirname(file);
      if (src.startsWith('/')) {
        dir = this.views;
        src = src.substring(1);
      }
      const importFile = path.resolve(dir, src);
      const ext = importFile.match(/\.([^\.]+)$/)[1];
      const data = this.getTemplate(importFile);
      let importDocument;
      if (['html', 'htm', 'svg'].includes(ext)) {
        importDocument = HTML.parse(data);
      } else if (['js', 'mjs'].includes(ext)) {
        importDocument = HTML.parse(`<script>${data}</script>`);
      } else if (['css'].includes(ext)) {
        importDocument = HTML.parse(`<style>${data}</style>`);
      }
      this.processDocument(importFile, importDocument, scope);
      if (importDocument.childNodes.length === 1) {
        const attrs = element.attributes;
        delete attrs.src;
        for (const key of Object.keys(attrs)) {
          importDocument.childNodes[0].setAttribute(key, attrs[key]);
        }
      }
      element.replaceWith(...importDocument.childNodes);
    }
  }

  processIfTag(file, document, scope = {}) {
    const elements = document.querySelectorAll('if');

    for (const element of elements) {
      let conditions = [element];
      let sibling = element;
      while (true) {
        sibling = sibling.nextElementSibling;
        if (!sibling) {
          break;
        } else if (sibling.tagName === 'ELIF') {
          conditions.push(sibling);
        } else if (sibling.tagName === 'ELSE') {
          conditions.push(sibling);
          break;
        } else {
          break;
        }
      }

      let checked = false;
      for (const condition of conditions) {
        if (checked) {
          condition.remove();
        } else if (condition.tagName === 'IF' || condition.tagName === 'ELIF') {
          let code = condition.getAttribute('condition');
          if (this.eval(code, scope)) {
            condition.replaceWith(...condition.childNodes);
            checked = true;
          } else {
            condition.remove();
          }
        } else {
          condition.replaceWith(...condition.childNodes);
          checked = true;
        }
      }
    }
  }

  processRepeatTag(file, document, scope = {}) {
    let elements = document.querySelectorAll('repeat');

    for (const element of elements) {
      let times = this.eval(element.getAttribute('times'), scope);
      let from = this.eval(element.getAttribute('from'), scope);
      let to = this.eval(element.getAttribute('to'), scope);
      if (times) {
        from = 0;
        to = times - 1;
      }

      let content = element.innerHTML;
      let indexKey = element.getAttribute('index');
      let repeatedContent = '';
      for (let i = from; i <= to; i++) {
        if (indexKey) {
          scope[indexKey] = i;
        }
        const contentDocument = parse(content);
        this.processDocument(contentDocument, scope);
        repeatedContent += contentDocument.toString();
      }
      element.innerHTML = repeatedContent;
    }
  }

  processUri(file, document, scope = {}) {
    let srcElements = document.querySelectorAll('[src]');
    for (const element of srcElements) {
      const src = element.getAttribute('src');
      if (!src || src.startsWith('/') || src.match(/^https?:\/?\/?/)) {
        continue;
      } else {
        let newUri = path.resolve(path.dirname(file), src);
        newUri = newUri.replace(/\\/g, '/');
        newUri = newUri.substring(scope.settings.views.length);
        element.setAttribute('src', newUri);
      }
    }
    let hrefElements = document.querySelectorAll('[href]');
    for (const element of hrefElements) {
      if (element.tagName === 'A') {
        continue;
      }
      const href = element.getAttribute('href');
      if (!href || href.startsWith('/') || href.match(/^https?:\/?\/?/)) {
        continue;
      } else {
        let newUri = path.resolve(path.dirname(file), href);
        newUri = newUri.replace(/\\/g, '/');
        newUri = newUri.substring(scope.settings.views.length);
        element.setAttribute('href', newUri);
      }
    }
  }

  eval(code, scope) {
    return new Function(`with (this) { return ${code} }`).call(scope);
  }

  nodes(string) {
    return HTML.parse(string).childNodes;
  }
}

export default TemplateEngine;

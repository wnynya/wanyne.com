'use strict';

import fs from 'node:fs';
import path from 'node:path';

import { parse as parseHTML } from 'node-html-parser';
const HTML = {
  parse: parseHTML,
};
import { minify } from 'html-minifier';

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
    res.page = (page, title, scope = {}) => {
      const data = {};
      data.client = req.client;
      data.page = page;
      data.title = title;

      data.meta = {};
      data.meta.desc = scope?.meta?.desc;
      data.meta.keywords = scope?.meta?.keywords;
      data.meta.author = scope?.meta?.author;
      data.meta.image = scope?.meta?.image;

      data.meta.og = {};
      data.meta.og.sitename = scope?.meta?.og?.sitename || '와니네';
      data.meta.og.title = scope?.meta?.og?.title || title;
      if (data.meta.og.title) {
        let titlematch = data.meta.og.title.match(/^(.*) — ([^—]*)$/);
        if (titlematch) {
          data.meta.og.sitename = titlematch[2];
          data.meta.og.title = titlematch[1];
        }
      }
      data.meta.og.desc = scope?.meta?.og?.desc || data.meta.desc;
      data.meta.og.image = scope?.meta?.og?.image || data.meta.image;

      data.meta.jsonld = scope?.meta?.jsonld;

      for (const key in scope) {
        if (!data[key]) {
          data[key] = scope[key];
        }
      }

      res.render('index', data);
    };

    res.error403 = () => {
      res.status(403).page('error/403', '403 — 와니네');
    };
    res.error404 = () => {
      res.status(404).page('error/404', '404 — 와니네');
    };
    res.error418 = () => {
      res.status(418).page('error/418', '418 — 와니네');
    };
    res.error500 = () => {
      res.status(500).page('error/500', '500 — 와니네');
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

  getTemplate(file, prefix = '', suffix = '') {
    const key = Buffer.from(file).toString('base64');

    if (!this.#cache[key]) {
      const data = `${prefix}${fs.readFileSync(file).toString()}${suffix}`;
      const minifiedData = minify(data, {
        minifyCSS: {
          level: {
            2: {
              all: true,
              removeUnusedAtRules: false,
            },
          },
        },
        minifyJS: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
      });
      this.#cache[key] = minifiedData;
    }

    return this.#cache[key];
  }

  processDocument(file, document, scope = {}) {
    this.processIfTag(file, document, scope);
    this.processRepeatTag(file, document, scope);
    this.processInjection(file, document, scope);
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
      let importDocument;
      if (['html', 'htm', 'svg'].includes(ext)) {
        const data = this.getTemplate(importFile);
        importDocument = HTML.parse(data);
      } else if (['js', 'mjs'].includes(ext)) {
        const data = this.getTemplate(importFile, '<script>', '</script>');
        importDocument = HTML.parse(data);
      } else if (['css'].includes(ext)) {
        const data = this.getTemplate(importFile, '<style>', '</style>');
        importDocument = HTML.parse(data);
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

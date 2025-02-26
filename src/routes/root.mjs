'use strict';

import express from 'express';
const router = express.Router();

import sitemap from '../modules/seo/sitemap.mjs';
import jsonld from '../modules/seo/jsonld.mjs';

router.get('/', (req, res) => {
  res.page('root', '와니네', {
    meta: {
      desc: '와니네: 아무젝트 · 블로그 · 작업물 — 와니네',
      jsonld: jsonld.gen(jsonld.breadcrumb({ name: '와니네' }), {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://wanyne.com/',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://wanyne.com/b/index/{query}',
          },
          'query-input': 'required name=query',
        },
      }),
      //image: '/resources/root-og-image.png',
    },
  });
});

router.get('/sitemap.xml', (req, res) => {
  sitemap()
    .then((data) => {
      res.set('Content-Type', 'text/xml');
      res.send(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

router.get('/ping', (req, res) => {
  res.send('pong!');
});

router.get('/ip', (req, res) => {
  res.send(req.client.ip);
});

router.get('/teapot', (req, res) => {
  res.error418();
});

router.get('/give-me-an-internal-server-error', (req, res) => {
  res.error500();
});

router.get('/terms-of-use', (req, res) => {
  res.render('pages/terms-of-use');
});

router.get('/privacy-policy', (req, res) => {
  res.render('pages/privacy-policy');
});

import youRouter from './you.mjs';
router.use('/u', youRouter);

import projectsRouter from './projects.mjs';
router.use('/p', projectsRouter);

import docsRouter from './docs.mjs';
router.use('/d', docsRouter);

import blogRouter from './blog.mjs';
router.use('/b', blogRouter);

export default router;

'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.page('root', '와니네');
});

router.get('/a', (req, res) => {
  res.page('a', 'a');
});

router.get('/b', (req, res) => {
  res.page('b', 'b');
});

router.get('/ip', (req, res) => {
  res.send(req.client.ip);
});

router.get('/ping', (req, res) => {
  res.send('pong!');
});

router.get('/terms-of-use', (req, res) => {
  res.render('terms-of-use');
});

router.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy');
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

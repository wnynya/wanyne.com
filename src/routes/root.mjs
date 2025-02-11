'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.page('root', '와니네');
});

router.get('/ip', (req, res) => {
  res.send(req.client.ip);
});

router.get('/ping', (req, res) => {
  res.send('pong!');
});

export default router;

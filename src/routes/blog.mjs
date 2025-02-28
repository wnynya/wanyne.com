'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.page('blog/index', '게시글 목록 — 와니네');
});

export default router;

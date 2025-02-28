'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.page('root', '와니네');
});

router.get('/login', (req, res) => {
  res.page('you/login', '로그인 — 와니네');
});

router.get('/register', (req, res) => {
  res.page('you/register', '계정 등록 — 와니네');
});

router.get('/reset-password', (req, res) => {
  res.page('you/reset-password', '비밀번호 재설정 — 와니네');
});

export default router;

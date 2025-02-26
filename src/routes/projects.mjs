'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.page('root', '와니네');
});

export default router;

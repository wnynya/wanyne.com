'use strict';

import express from 'express';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import config from './config.mjs';
import middlewares from '@wanyne/express-middlewares';
import engine from './modules/engine.mjs';

const app = express();

/* 헤더 설정 */
app.disable('x-powered-by');
app.use(middlewares.headers(config.headers));
/* 퍼블릭 디렉터리 설정 */
app.use(express.static(path.resolve(__dirname, './public')));
/* 쿠키 분석기 설정 */
app.use(middlewares.cookies());
/* 클라이언트 분석기 설정 */
app.use(middlewares.client());
/* 엔진 설정 */
engine(app, path.resolve(__dirname, './views'));

/* 루트 라우터 불러오기 */
import router from './routes/index.mjs';
app.use('/', router);

/* 404 처리 */
app.all('*', (req, res) => {
  res.error404();
});

export default app;

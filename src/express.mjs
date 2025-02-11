'use strict';

import express from 'express';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import config from './config.mjs';
import middlewares from './modules/middlewares/index.mjs';
import TemplateEngine from './modules/engine.mjs';

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
/* 렌더링 엔진 설정 */
const engine = new TemplateEngine({
  views: path.resolve(__dirname, './views'),
});
app.engine('html', engine.render.bind(engine));
app.set('view engine', 'html');
app.set('views', engine.views);
app.use(engine.use.bind(engine));

/* 루트 라우터 불러오기 */
import router from './routes/root.mjs';
app.use('/', router);

/* 404 처리 */
app.all('*', (req, res) => {
  res.status(404).page('error/404', '404');
});

export default app;

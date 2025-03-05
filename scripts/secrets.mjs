'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configSrc = path.resolve(__dirname, '../secrets/config');
const configDest = path.resolve(__dirname, '../config');
fs.rmSync(configDest, { recursive: true, force: true });
fs.mkdirSync(configDest, { recursive: true });
fs.cpSync(configSrc, configDest, { recursive: true });

const fontsSrc = path.resolve(__dirname, '../secrets/fonts');
const fontsDest = path.resolve(__dirname, '../src/public/resources/fonts');
fs.rmSync(fontsDest, { recursive: true, force: true });
fs.mkdirSync(fontsDest, { recursive: true });
fs.cpSync(fontsSrc, fontsDest, { recursive: true });

/**
 * 作品集静态服务（零依赖）
 * ------------------------------------------------------------
 * 用法：
 *   node server.js           # 默认 http://127.0.0.1:8080
 *   node server.js 3000      # 指定端口
 *   node server.js --port=3000
 *
 * 特性：
 *   - 把整个项目目录当站点根，/ 默认打开 tv.html（作品集主页）
 *   - 正确的 MIME（含 .jpg/.png/.svg/.woff2/.md/.pdf/.docx）
 *   - 目录自动找 index.html；找不到就返回 404 页
 *   - 禁用缓存（改完页面刷新即生效）
 *   - 只监听 127.0.0.1，局域网内其他设备访问不到
 *   - 带路径穿越防护（../ 不会被读到项目外）
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = __dirname;

/* 默认首页：作品集主页面 */
const DEFAULT_PAGE = 'tv.html';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.zip': 'application/zip'
};

function parsePort() {
  const args = process.argv.slice(2);
  for (const a of args) {
    const m = /^--port=(\d+)$/.exec(a);
    if (m) return Number(m[1]);
  }
  const n = Number(args[0]);
  return Number.isInteger(n) && n > 0 && n < 65536 ? n : 8080;
}

const PORT = parsePort();

function noCacheHeaders(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

function send404(res, reqPath) {
  const body =
    '<!doctype html><meta charset="utf-8"><title>404</title>' +
    '<body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;' +
    'background:#070c1a;color:#e8f0ec;font:15px/1.8 system-ui,\'Microsoft YaHei\',sans-serif">' +
    '<div style="text-align:center">' +
    '<div style="font-size:64px;color:#6ee7a8;font-weight:700">404</div>' +
    '<p style="color:#8aa094">找不到 <code style="color:#cfe8d9">' + escapeHtml(reqPath) + '</code></p>' +
    '<p><a href="/" style="color:#6ee7a8;text-decoration:none;border-bottom:1px solid rgba(110,231,168,.4)">回到作品集首页</a></p>' +
    '</div></body>';
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* 把 URL 路径解析到项目内的真实文件，越界返回 null */
function resolveSafe(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch (e) {
    return null;
  }
  const rel = decoded.replace(/^\/+/, '');
  const abs = path.resolve(ROOT, rel);
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) return null;
  return abs;
}

function tryFiles(abs, cb) {
  fs.stat(abs, (err, st) => {
    if (err) return cb(null);
    if (st.isDirectory()) {
      const idx = path.join(abs, 'index.html');
      return fs.stat(idx, (e2, s2) => cb(e2 || !s2.isFile() ? null : idx));
    }
    cb(st.isFile() ? abs : null);
  });
}

const server = http.createServer((req, res) => {
  const started = Date.now();
  const urlPath = req.url || '/';

  const finish = (code) => {
    const ms = Date.now() - started;
    const flag = code >= 400 ? '✗' : '·';
    console.log(`${flag} ${code} ${req.method} ${urlPath}  ${ms}ms`);
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD' });
    res.end('Method Not Allowed');
    return finish(405);
  }

  /* 浏览器要的 favicon：直接 204，不刷 404 日志 */
  if (urlPath === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return finish(204);
  }

  let abs = resolveSafe(urlPath);
  if (!abs) {
    send404(res, urlPath);
    return finish(404);
  }

  /* / 与目录：优先 index.html；根目录没有 index.html 就用作品集主页 */
  const isRootOrDir = urlPath === '/' || /\/$/.test(urlPath);
  if (isRootOrDir) {
    /* 站点根优先用作品集主页，其次才是 index.html */
    const first = abs === ROOT ? path.join(ROOT, DEFAULT_PAGE) : path.join(abs, 'index.html');
    tryFiles(first, (hit) => {
      if (hit) return serveFile(hit, res, finish, urlPath);
      if (abs === ROOT) {
        return tryFiles(path.join(ROOT, 'index.html'), (hit2) => {
          if (hit2) return serveFile(hit2, res, finish, urlPath);
          send404(res, urlPath);
          finish(404);
        });
      }
      send404(res, urlPath);
      finish(404);
    });
    return;
  }

  tryFiles(abs, (hit) => {
    if (!hit) {
      send404(res, urlPath);
      return finish(404);
    }
    serveFile(hit, res, finish, urlPath);
  });
});

function serveFile(file, res, finish, urlPath) {
  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';

  noCacheHeaders(res);
  res.setHeader('Content-Type', type);
  if (ext === '.html') res.setHeader('X-Content-Type-Options', 'nosniff');

  const stream = fs.createReadStream(file);
  stream.on('error', () => {
    res.destroy();
    finish(500);
  });
  res.writeHead(200);
  stream.pipe(res);
  finish(200);
}

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`\n端口 ${PORT} 已被占用。换一个：node server.js ${PORT + 1}\n`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, '127.0.0.1', () => {
  const line = '─'.repeat(52);
  console.log('\n' + line);
  console.log('  作品集服务已启动（仅本机可访问）');
  console.log('  地址：  http://127.0.0.1:' + PORT + '/');
  console.log('  目录：  ' + ROOT);
  console.log('  停止：  Ctrl + C');
  console.log(line + '\n');
});

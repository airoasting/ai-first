const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json'};
http.createServer((req, res) => {
  let p = path.join(dir, decodeURIComponent(req.url === '/' ? '/index.html' : req.url).split('?')[0]);
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': mime[path.extname(p)] || 'application/octet-stream'});
    res.end(data);
  });
}).listen(3456);

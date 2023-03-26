const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 11817;

const server = http.createServer((req, res) => {
    try {
        const { headers } = req;
        const clientHost = headers['x-forwarded-for'] || req.socket.remoteAddress

        const reqUrl = url.parse(req.url);
        if (reqUrl.pathname === '/') {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: Missing target URL');
            return;
        }
        // output Clinet and Target host
        const targetUrl = reqUrl.pathname.slice(1);
    
        const yellow = "\x1b[33m";
        const reset = "\x1b[0m";
        const green = "\x1b[32m"
        console.log(`${formattedTime()}:   ${yellow}${clientHost}${reset} --> ${green}${targetUrl}${reset}`);
        let proxyReq;
        if (targetUrl.indexOf('https') == -1) {
            proxyReq = http.request(targetUrl, proxyRes => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res);
            });
        } else {
            proxyReq = https.request(targetUrl, proxyRes => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res);
            });
        }
        proxyReq.on('error', err => {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });

        req.pipe(proxyReq);
    } catch (e) {
        console.log(String(e))
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Proxy server listening on port ${PORT}`);
});

function formattedTime(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const formattedTime = `${year}.${month}.${day}.${hour}:${minute}`;
    return formattedTime
}

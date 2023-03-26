const http = require('http');
const https = require('https');
const url = require('url');

// 服务端口
const port = 11817;


const proxy = (req, res) => {
    // output Clinet and Target host
    const proxyUrl = req.url.slice(1);
    if (proxyUrl === '/') {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Missing target URL');
        return;
    }
    const parsedUrl = url.parse(proxyUrl);
    const yellow = "\x1b[33m";
    const reset = "\x1b[0m";
    const green = "\x1b[32m"
    const { headers } = req;
    const clientHost = headers['x-forwarded-for'] || req.socket.remoteAddress

    console.log(`${formattedTime()}-[${req.method}]-${yellow}${clientHost}${reset} --> ${green}${proxyUrl}${reset}`);
    
    const proxyReq = (parsedUrl.protocol === 'https:') ? https.request : http.request;
    const options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.path,
        method: req.method,
        headers: req.headers,
      };
    // console.log(options)
    const proxyRequest = proxyReq(options, (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.pipe(res);
      });
      req.pipe(proxyRequest);

    proxyRequest.on('error', (err) => {
        console.error(`Error: ${err.message}`);
        res.end();
    });
};

const server = http.createServer(proxy)
server.listen(port,() => {
    console.log(`HTTP proxy server is listening on port ${port}`);
});


function formattedTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const formattedTime = `${year}.${month}.${day}.${hour}:${minute}`;
    return formattedTime
}

const axios = require('axios');

const http = require('http');
const https = require('https');
const url = require('url');

// 服务端口
const port = 7860;


const proxy = (req, res) => {
    // output Clinet and Target host
    
    const parsedUrl = req.url;
    const yellow = "\x1b[33m";
    const reset = "\x1b[0m";
    const green = "\x1b[32m"
    const { headers } = req;
    const clientHost = headers['x-forwarded-for'] || req.socket.remoteAddress

    console.log(`${formattedTime()}-[${req.method}]-${yellow}${clientHost}${reset} --> ${green}${proxyUrl}${reset}`);

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
      });
      
    req.on('end', () => {
        const data = JSON.parse(body);
        const payload = data["paloady"]
        const resData = axios()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: '接收到了你的POST请求', data }));
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const http_1 = __importDefault(require("http"));
// 服务端口
const port = 7860;
const proxy = async (req, res) => {
    // output Clinet and Target host
    const parsedUrl = req.url;
    const proxyUrl = req.url.slice(1);
    if (proxyUrl === '/') {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Missing target URL');
        return;
    }
    const yellow = "\x1b[33m";
    const reset = "\x1b[0m";
    const green = "\x1b[32m";
    const { headers } = req;
    const clientHost = headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`${formattedTime()}-[${req.method}]-${yellow}${clientHost}${reset} --> ${green}${parsedUrl}${reset}`);
    try {
        if (req.method === "GET") {
            const myURL = new URL(req.url, `http://${req.headers.host}`);
            const query = myURL.searchParams;
            const targetUrl = query.get("url");
            const targetMethod = query.get("method");
            if (!targetUrl) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request: Missing target URL');
                return;
            }
            if (!targetMethod) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request: Missing target Method');
                return;
            }
            let payload = {
                url: targetUrl,
                method: targetMethod,
                headers: {
                    Date: getCurrentGMTTimeString()
                }
            };
            if (query.get("data")) {
                payload['data'] = JSON.parse(query.get('data'));
            }
            if (query.get('headers')) {
                payload['headers'] = JSON.parse(query.get('headers'));
            }
            console.log(payload);
            const resData = await (0, axios_1.default)(payload);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(resData.data);
        }
        else if (req.method === "POST") {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                const data = JSON.parse(body);
                const payload = data["payload"];
                console.log(payload);
                const resData = await (0, axios_1.default)(payload);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(resData.data);
            });
        }
    }
    catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Unknow Error');
        return;
    }
};
const server = http_1.default.createServer(proxy);
server.listen(port, () => {
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
    return formattedTime;
}
function getCurrentGMTTimeString() {
    // 获取当前时间
    const currentDate = new Date();
    // 将日期格式化为 "Thu, 16 Nov 2023 16:18:21 GMT" 的格式
    const formattedDate = currentDate.toUTCString();
    return formattedDate;
}
// 调用方法并输出结果
const currentGMTTimeString = getCurrentGMTTimeString();
console.log(currentGMTTimeString);

import axios from 'axios';
import url from 'url';
import http from 'http';
import querystring from 'querystring'

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
    const green = "\x1b[32m"
    const { headers } = req;
    const clientHost = headers['x-forwarded-for'] || req.socket.remoteAddress

    console.log(`${formattedTime()}-[${req.method}]-${yellow}${clientHost}${reset} --> ${green}${parsedUrl}${reset}`);

    try {
        if (req.method === "GET") {
            const myURL = new URL(req.url, `http://${req.headers.host}`);
            const query = myURL.searchParams;
            const targetUrl = query.get("url")
            const targetMethod = query.get("method")
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
            }
            if (query.get("data")) {
                payload['data'] = JSON.parse(query.get('data'))
            }
            if (query.get('headers')) {
                payload['headers'] = JSON.parse(query.get('headers'))
            }
            console.log(payload)

            const resData = await axios(payload)
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
                const payload = data["payload"]
                console.log(payload)
                const resData = await axios(payload)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(resData.data);
            });
        }
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Unknow Error');
        return;
    }
};

const server = http.createServer(proxy)
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
    return formattedTime
}

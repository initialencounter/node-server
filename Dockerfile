FROM node:lts-alpine

# RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# RUN echo 'Asia/Shanghai' >/etc/timezone


# 安装 

RUN mkdir node-server

RUN cd node-server; npm init -f

RUN cd node-server; npm i @initencounter/node-server@1.0.1 -f

# 设置工作目录
WORKDIR "/node-server"

# 设置启动命令
CMD ["node", "/node-server/node_modules/@initencounter/node-server/lib/app.js"]
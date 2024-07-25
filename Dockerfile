# 使用官方 Node.js 作为基础镜像
FROM node:14 AS build

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install --registry=https://registry.npmmirror.com

# 将应用程序源代码复制到工作目录
COPY . .

# 构建 Vue 应用
RUN npm run build

# 使用 Nginx 作为生产环境的 Web 服务器
FROM nginx:alpine

# 将构建好的应用程序复制到 Nginx 的 html 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露 Nginx 默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
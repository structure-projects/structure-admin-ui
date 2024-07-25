# 使用 Nginx 作为生产环境的 Web 服务器
FROM nginx:alpine

# 将构建好的应用程序复制到 Nginx 的 html 目录
COPY ./dist /usr/share/nginx/html

# 暴露 Nginx 默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
# 安装依赖
RUN npm install --registry=https://registry.npmmirror.com

# 构建 Vue 应用
RUN npm run build
# Structure Admin

一个现代化的企业级后台管理系统，基于 Vue 3 + TypeScript + Element Plus 构建。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| TypeScript | 5.3+ | 类型安全 |
| Element Plus | 2.5+ | UI组件库 |
| Pinia | 2.1+ | 状态管理 |
| Vue Router | 4.2+ | 路由管理 |
| Vite | 5.1+ | 构建工具 |
| UnoCSS | 0.58+ | CSS框架 |

## 功能特性

- ✅ **响应式布局** - 支持多种布局模式（侧边栏/混合/顶部导航）
- ✅ **主题切换** - 支持亮色/暗色主题，自定义主题色
- ✅ **国际化** - 支持中英文切换
- ✅ **权限管理** - 基于角色的访问控制
- ✅ **动态路由** - 根据用户权限动态生成菜单
- ✅ **标签页管理** - 支持多标签页切换和关闭
- ✅ **数据表格** - 基于 Avue 的高级表格组件
- ✅ **图表可视化** - 基于 ECharts 的数据可视化
- ✅ **富文本编辑器** - 基于 WangEditor

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 类型检查

```bash
npm run typecheck
```

## 项目结构

```
src/
├── api/           # API接口定义
│   ├── auth/      # 认证相关接口
│   └── system/    # 系统管理接口
├── assets/        # 静态资源
│   ├── css/       # 全局样式
│   ├── font/      # 字体文件
│   ├── icons/     # 图标资源
│   └── images/    # 图片资源
├── components/    # 通用组件
├── config/        # 配置文件
├── directive/     # 自定义指令
├── enums/         # 枚举定义
├── hooks/         # 组合式函数
├── lang/          # 国际化配置
├── layout/        # 布局组件
├── plugins/       # 插件配置
├── router/        # 路由配置
├── store/         # 状态管理
├── styles/        # 样式文件
├── types/         # 类型定义
├── utils/         # 工具函数
├── views/         # 页面视图
├── App.vue        # 根组件
├── main.ts        # 入口文件
└── settings.ts    # 应用设置
```

## 核心模块

### 系统管理

- **用户管理** - 用户列表、新增、编辑、删除
- **角色管理** - 角色权限配置
- **菜单管理** - 动态菜单配置
- **部门管理** - 组织架构管理
- **字典管理** - 数据字典配置
- **配置管理** - 系统参数配置

### 数据展示

- **仪表盘** - 数据可视化大屏
- **图表组件** - 柱状图、饼图、雷达图、漏斗图

### 用户中心

- **基本设置** - 用户个人信息
- **账户绑定** - 第三方账号绑定
- **钱包账户** - 资金管理
- **团队管理** - 成员管理

## 配置说明

### 环境变量

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

### 主要配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| VITE_APP_TITLE | 应用标题 | Structure Admin |
| VITE_APP_API_URL | API基础地址 | /api |
| VITE_APP_PORT | 开发端口 | 5173 |

## 开发规范

### Git 提交规范

使用 `cz-git` 进行标准化提交：

```bash
git add .
npm run commit
```

### 代码风格

- ESLint + Prettier 代码检查
- Stylelint CSS 检查
- 遵循 Vue 官方风格指南

## 许可证

MIT License
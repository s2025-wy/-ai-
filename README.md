# 基于AI的大学生职业规划智能体

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Vue](https://img.shields.io/badge/vue-3.5+-green.svg)
![FastAPI](https://img.shields.io/badge/fastapi-0.104+-orange.svg)

## 项目简介

本项目是一个基于AI的大学生职业规划智能体平台，旨在帮助大学生进行职业规划、岗位探索、简历分析等功能。项目采用前后端分离架构，集成了大语言模型、知识图谱等先进技术，为用户提供个性化的职业规划建议和岗位推荐。

## 技术栈

### 前端
- Vue 3 + TypeScript
- Element Plus (UI组件库)
- Pinia (状态管理)
- Vue Router (路由)
- ECharts (数据可视化)

### 后端
- Python 3.10+
- FastAPI (Web框架)
- SQLAlchemy (ORM)
- SQLite (数据库)
- Neo4j (图数据库)
- LangChain (LLM集成)
- DashScope API (大语言模型)

### 移动端
- uni-app (多端框架)
- 支持微信小程序、App等

## 项目结构

```
a13/
├── 前端/                 # 前端项目
│   └── vue-A13/          # Vue 3 + TypeScript项目
│       ├── public/       # 静态资源
│       ├── src/          # 源代码
│       │   ├── api/      # API请求模块
│       │   ├── assets/   # 静态资源
│       │   ├── components/ # 组件
│       │   ├── composables/ # 组合式API
│       │   ├── router/   # 路由配置
│       │   ├── stores/   # Pinia状态管理
│       │   ├── types/    # TypeScript类型定义
│       │   ├── utils/    # 工具函数
│       │   ├── views/    # 页面组件
│       │   ├── App.vue   # 根组件
│       │   └── main.ts   # 入口文件
│       └── package.json  # 依赖配置
├── 后端/                 # 后端项目
│   ├── crud/             # 数据操作层
│   ├── models/           # 数据模型
│   ├── routers/          # 路由
│   ├── schemas/          # 数据验证
│   ├── uploads/          # 上传文件
│   ├── main.py           # 后端入口
│   └── requirements.txt  # 依赖配置
├── app端/                # 移动端项目 (uni-app)
└── shuju/                # 数据文件目录
```

## 核心功能

1. **用户认证**：登录、注册、验证码验证
2. **岗位探索**：岗位搜索、筛选、申请、收藏
3. **学生画像**：个人信息管理、简历上传、能力分析
4. **职业规划**：职业路径规划、行动计划制定
5. **智能问答**：基于大模型的职业咨询
6. **知识图谱**：岗位关系可视化
7. **管理后台**：用户管理、岗位管理

## 快速开始

### 环境要求

- Python 3.10+
- Node.js 20.19.0+
- SQLite (内置，无需额外安装)
- Neo4j (可选，用于知识图谱功能)

### 后端部署

```bash
# 进入后端目录
cd 后端

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
# 创建 .env 文件，配置以下内容：
# SECRET_KEY=your-secret-key
# DASHSCOPE_API_KEY=your-dashscope-api-key (可选)
# NEO4J_URI=bolt://localhost:7687 (可选)
# NEO4J_USER=neo4j (可选)
# NEO4J_PASSWORD=your-password (可选)

# 初始化数据库
python migrate_db.py

# 创建管理员账户
python init_admin.py

# 启动服务
python main.py
```

后端服务启动后访问：http://localhost:8000

### 前端部署

```bash
# 进入前端目录
cd 前端/vue-A13

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产环境构建
npm run build
```

前端服务启动后访问：http://localhost:5173

### 移动端部署

1. 使用 HBuilderX 打开 `app端` 目录
2. 配置网络地址
3. 运行到微信小程序或打包发布

## API文档

后端启动后，API文档可访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 默认账户

- **管理员账户**:
  - 用户名: `admin`
  - 密码: `123456`
  - 邮箱: `admin@example.com`

- **普通用户**: 需要自行注册

## 功能模块说明

### 用户模块
- 用户注册、登录、个人信息管理
- 密码修改、权限验证

### 岗位管理模块
- 岗位列表展示、搜索、筛选
- 岗位详情查看、申请、收藏
- 岗位画像分析、知识图谱可视化

### 学生画像模块
- 个人信息管理、简历上传
- 能力分析、职业目标设定

### 管理后台模块
- 用户管理、岗位管理
- 权限控制

## 项目特色

1. **AI驱动**：集成大语言模型提供智能职业咨询
2. **知识图谱**：使用Neo4j构建岗位关系网络
3. **个性化推荐**：基于学生画像提供定制化建议
4. **全栈架构**：前后端分离，技术栈现代化
5. **多端支持**：同时支持Web端和移动端

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: admin@example.com
- GitHub: https://github.com/s2025-wy/-ai-

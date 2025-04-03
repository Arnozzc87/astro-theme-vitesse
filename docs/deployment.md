# 自动化内容发布系统部署指南

本文档提供了如何部署和配置卫培教育网站自动化内容发布系统的详细步骤。

## 系统架构

整个系统由两部分组成：

1. **API服务**：接收飞书Webhook，处理内容，生成SEO数据
2. **Astro网站**：静态网站，由GitHub Actions自动构建和部署

## 1. API服务部署

### 系统要求

- Node.js v16+
- NPM 或 Yarn
- 可公网访问的服务器（建议使用云服务器或云函数）

### 部署步骤

#### 方案1：直接部署到云服务器

1. 克隆代码仓库
   ```bash
   git clone https://github.com/weipei-edu/webhook-api.git
   cd webhook-api
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量
   ```bash
   cp .env.example .env
   # 编辑.env文件填写相关配置
   ```

4. 使用PM2启动服务
   ```bash
   npm install -g pm2
   pm2 start webhook.js
   pm2 startup
   pm2 save
   ```

#### 方案2：部署到Vercel

1. Fork代码仓库到自己的GitHub账号

2. 在Vercel中导入该项目

3. 配置环境变量（在Vercel项目设置中）

4. 部署项目

#### 方案3：部署到阿里云函数计算

1. 准备代码包
   ```bash
   npm install
   zip -r function.zip .
   ```

2. 创建函数计算实例
   - 运行环境：Node.js 16
   - 触发器类型：HTTP触发器
   - 函数类型：Web应用
   - 入口文件：webhook.js

3. 上传代码包并配置环境变量

## 2. Astro网站部署

### 系统要求

- Node.js v16+
- NPM 或 Yarn
- GitHub账号

### 部署步骤

1. Fork Astro主题仓库
   ```bash
   git clone https://github.com/weipei-edu/website.git
   cd website
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 修改站点配置
   - 编辑`src/site-config.ts`文件
   - 更新主题颜色和样式

4. 配置GitHub Secrets
   在GitHub仓库的Settings > Secrets中添加以下密钥：
   - `DEPLOY_HOST`: 部署服务器主机名
   - `DEPLOY_USER`: 部署服务器用户名
   - `DEPLOY_PATH`: 部署路径
   - `DEPLOY_KEY`: SSH私钥
   - `SITE_URL`: 网站URL
   - `FEISHU_WEBHOOK`: 飞书通知Webhook地址

5. 配置GitHub Actions
   - `.github/workflows/auto-build.yml`文件已包含在代码中
   - 确保GitHub Actions已启用

## 3. 内容模型扩展

如果需要扩展更多内容类型：

1. 在`src/content/config.ts`中添加新的内容集合
2. 在`api/processors/feishu.js`中添加对应的处理逻辑
3. 在飞书多维表格中创建相应的数据表

## 4. SEO优化配置

默认系统使用OpenAI API自动生成SEO相关内容，您需要：

1. 在`.env`文件中配置`OPENAI_API_KEY`
2. 调整`api/processors/seo.js`中的提示词以满足特定需求

如果不想使用OpenAI，可以修改`generateSEO`函数，使用规则或模板生成SEO内容。

## 5. 故障排除

### API服务常见问题

- **Webhook未触发**：检查飞书自动化规则配置
- **处理错误**：查看服务器日志，确保环境变量正确配置
- **OpenAI API错误**：检查API密钥和额度

### 构建部署常见问题

- **构建失败**：检查GitHub Actions日志
- **部署失败**：检查SSH配置和目标服务器权限
- **图片显示问题**：确保图片URL可公开访问

## 6. 维护与更新

- 定期检查API服务日志
- 更新Node.js和依赖包版本
- 监控OpenAI API使用量
- 备份重要的内容数据

## 获取支持

如有任何问题，请联系：

- 技术支持：tech@weipei.edu.cn
- 文档更新：docs@weipei.edu.cn

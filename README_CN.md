# KResearch - 智能深度研究助手

> 一款先进的 AI 驱动深度研究应用，能够从多个来源综合信息，为复杂主题生成全面的研究报告。

<!-- 徽章 -->  
![许可证](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)

## 📑 目录
- [项目介绍](#项目介绍)
  - [核心特性](#核心特性)
  - [技术栈](#技术栈)
- [快速开始](#快速开始)
  - [环境要求](#环境要求)
  - [安装步骤](#安装步骤)
- [使用方法](#使用方法)
- [配置指南](#配置指南)
  - [多服务商支持](#多服务商支持)
  - [代理配置](#代理配置)
- [常见问题](#常见问题)
- [技术架构](#技术架构)
- [贡献指南](#贡献指南)
- [许可证](#许可证)
- [联系方式](#联系方式)

## 🎯 项目介绍

KResearch 是一款智能研究助手，专为解决复杂研究问题而设计。它利用多智能体 AI 系统，通过规划、执行和综合网络信息，自动化深度研究过程。最终输出是包含完整引用和可视化知识图谱的全面结构化报告，是学生、分析师和需要快速深入理解任何主题人士的宝贵工具。

### ✨ 核心特性

🤖 **对话式 AI 智能体**
- Alpha（策略师）和 Beta（战术师）协作制定最优研究计划
- 实时展示 AI 思维过程

🔄 **迭代研究循环**
- 多轮规划、搜索和阅读，收集全面见解
- 可配置研究深度和时间成本

📊 **实时进度跟踪**
- 详细的逐步时间线可视化
- 可中断研究过程

⚡ **可配置研究模式**
- **平衡模式**：标准研究深度和时间
- **深度探索**：最大化研究质量
- **快速模式**：快速获取关键信息  
- **极速模式**：最小时间成本

📈 **知识图谱可视化**
- 自动生成 Mermaid.js 关系图
- 可视化关键实体及其关系

📚 **完整引用系统**
- 基于 Google 搜索的可靠来源
- 完整的参考文献列表
- Markdown 格式报告

🎨 **现代响应式界面**
- 玻璃拟态设计风格
- 支持明暗主题切换
- 移动端友好

🌐 **多服务商支持**
- Google Gemini（默认）
- OpenAI GPT 系列
- 自定义 AI 服务商

🔧 **完整代理支持**
- 绕过地理限制
- 自定义 API 端点
- 教育代理一键配置

### 🛠️ 技术栈

- **前端框架**: [React 19](https://react.dev/)
- **编程语言**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **样式框架**: [Tailwind CSS](https://tailwindcss.com/)
- **AI 集成**: [OpenAI SDK](https://github.com/openai/openai-node)（兼容多服务商）
- **可视化**: [Mermaid.js](https://mermaid.js.org/)
- **构建工具**: [Vite](https://vitejs.dev/)

## 🚀 快速开始

### 环境要求

需要以下任一 AI 服务商的 API 密钥：
- **Google Gemini API**: 从 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取
- **OpenAI API**: 从 [OpenAI 平台](https://platform.openai.com/api-keys) 获取
- **Node.js**: 推荐使用最新的 LTS 版本
- **包管理器**: npm 或 yarn

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/KuekHaoYang/KResearch.git
   cd KResearch
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   访问终端提供的本地地址（通常是 `http://localhost:5173`）

## 📖 使用方法

### 基础使用

1. **选择研究模式**：从四种模式中选择适合的深度
2. **配置 AI 服务商**：进入设置选择提供商（Gemini、OpenAI或自定义）
3. **输入研究主题**：在文本框中输入您的问题或主题
4. **开始研究**：点击"开始研究"按钮或按回车键
5. **监控进度**：观察研究日志，可随时中断
6. **查看结果**：获取完整报告、知识图谱和引用

### 高级功能

#### 多 API 密钥管理
- 支持多个密钥轮换使用
- 自动保存和本地存储
- 环境变量优先级

#### 自定义模型
- 手动输入任意模型名称
- 支持本地部署模型
- 灵活配置研究参数

## ⚙️ 配置指南

### 多服务商支持

#### 支持的提供商

| 提供商 | API 密钥来源 | 默认端点 | 特点 |
|--------|-------------|----------|------|
| **Google Gemini** | Google AI Studio | `https://generativelanguage.googleapis.com/v1beta/openai/` | 免费额度大 |
| **OpenAI** | OpenAI 平台 | `https://api.openai.com/v1` | 功能强大 |
| **自定义** | 任意 | 用户配置 | 灵活性最高 |

#### 模型映射表

| Gemini 模型 | OpenAI 等价 | 用途 |
|-------------|-------------|------|
| gemini-2.5-pro | gpt-4o | 高质量研究 |
| gemini-2.5-flash | gpt-4o-mini | 平衡性能 |
| gemini-2.5-flash-lite | gpt-3.5-turbo | 快速响应 |

### 代理配置

#### 方法1：界面配置
1. 点击右上角设置按钮
2. 选择"API Key"标签页
3. 选择提供商并配置相关参数
4. 可选：配置代理 URL

#### 方法2：环境变量
创建 `.env` 文件：
```bash
# Google Gemini 配置
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_BASE_URL=https://api.genai.gd.edu.kg/google  # 可选代理

# OpenAI 配置  
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1  # 可选代理
```

#### 常用代理示例
- **教育代理**: `https://api.genai.gd.edu.kg/google`
- **自建代理**: `https://your-proxy.com/gemini`
- **本地服务**: `http://localhost:8080/v1`

## ❓ 常见问题

### Q1: 出现 "Agent Alpha:[object Object]" 错误
**原因**: 某些情况下 AI 返回了对象而非字符串
**解决**: 已修复，现在会自动将对象转为 JSON 字符串显示

### Q2: 研究过程中断
**可能原因**:
- API 密钥无效或额度用尽
- 网络连接问题
- 代理配置错误

**解决方法**:
1. 检查 API 密钥有效性
2. 验证网络连接
3. 检查代理配置

### Q3: 知识图谱不显示
**检查**: 确保浏览器支持 JavaScript 和 Mermaid.js
**解决**: 刷新页面或尝试使用不同浏览器

### Q4: 中文搜索结果质量
**优化**: 使用中文关键词，选择"深度探索"模式
**配置**: 在高级设置中调整搜索参数

## 🏗️ 技术架构

### 系统架构
```
用户界面 (React + TypeScript)
    ↓
状态管理 (Hooks + Context)
    ↓
服务层 (AI 客户端工厂)
    ↓
多 AI 提供商接口
    ↓
网络请求 (OpenAI SDK)
```

### 研究流程
1. **查询澄清**: AI 与用户对话明确研究范围
2. **研究规划**: 制定多轮研究策略
3. **信息收集**: 搜索和阅读相关内容
4. **内容合成**: 生成综合分析报告
5. **可视化**: 创建知识图谱

### 错误处理
- 自动重试机制
- 多密钥轮换
- 优雅降级
- 详细错误日志

## 🤝 贡献指南

欢迎任何形式的贡献！

### 贡献方式
1. **报告问题**: 使用 GitHub Issues
2. **功能建议**: 先开 Issue 讨论
3. **代码贡献**: Fork → 开发 → Pull Request
4. **文档改进**: 修正或补充文档

### 开发环境
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- **作者**: Kuek Hao Yang ([@KuekHaoYang](https://github.com/KuekHaoYang))
- **项目地址**: [https://github.com/KuekHaoYang/KResearch](https://github.com/KuekHaoYang/KResearch)
- **问题反馈**: [GitHub Issues](https://github.com/KuekHaoYang/KResearch/issues)

---

## 🌏 国际化

- [English README](./README.md)
- [中文 README](./README_CN.md)

> 让 AI 研究更简单、更高效、更智能！
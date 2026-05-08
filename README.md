# light-llm

基于 LangChain（JavaScript）的轻量示例：**对话模型**、**工具调用**、简易「类 Cursor」多工具 Agent，以及一个独立的 Vite + React 示例应用。

## 环境要求

- Node.js 18+
- [pnpm](https://pnpm.io/)

## 安装

```bash
pnpm install
```

在项目根目录创建 `.env`（勿提交到 Git），例如兼容 OpenAI API 的服务：

```env
OPENAI_API_KEY=你的密钥
OPENAI_BASE_URL=https://api.example.com/v1
# 可选，脚本里各有默认值
MODEL_NAME=qwen-plus
```

## 运行示例（根目录）

以下均在仓库根目录执行：

| 文件 | 说明 |
|------|------|
| `node src/hello-langchain.mjs` | 最小 Chat 调用 |
| `node src/tool-file-read.mjs` | 绑定单个 `read_file` 工具 |
| `node src/mini-cursor.mjs` | 读/写/执行命令/列目录的多工具循环 Agent |
| `node src/node-exec.mjs` | 子进程执行命令演示（`spawn` + `stdio: inherit`） |

## `react-todo-app`

Vite + React + TypeScript 示例，与根目录脚本相互独立：

```bash
cd react-todo-app
pnpm install
pnpm build
```

本地开发请自行执行 `pnpm dev`（本仓库说明不代替你的终端习惯）。

## 目录结构

```
.
├── src/                 # LangChain 与 Node 小脚本
├── react-todo-app/      # 前端示例应用
├── package.json
└── pnpm-lock.yaml
```

## 依赖摘要

- `@langchain/core`、`@langchain/openai`：对话与工具
- `dotenv`：加载 `.env`
- `zod`：工具参数校验

更完整的 MCP 相关依赖已写在 `package.json` 中，可按需扩展。

## 许可证

ISC（见 `package.json`）。

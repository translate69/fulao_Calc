# AGENTS.md

## 项目概览
火锅套餐毛利率计算器 —— 面向餐饮从业者的 Web 应用，帮助快速核算多套餐的成本结构与利润率，数据持久化存储在数据库中。

## 技术栈
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Supabase 数据库（Postgres）
- 原生 CSS 变量 + 内联样式（保留原设计风格）

## 项目结构
```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 主页面（计算器）
│   │   ├── globals.css         # 全局样式
│   │   └── api/
│   │       └── meals/
│   │           └── route.ts    # 套餐数据 API（GET/POST）
│   ├── components/             # shadcn/ui 组件（未使用）
│   └── storage/database/
│       ├── shared/schema.ts    # Drizzle schema 定义
│       └── supabase-client.ts  # Supabase 客户端
├── DESIGN.md                   # 设计规范
├── AGENTS.md                   # 本文档
└── .coze                       # 项目配置
```

## 核心功能
1. **5 个套餐默认数据**：双人餐、2-3人餐、3-4人餐、5-6人餐、7-8人餐，内置完整菜品明细
2. **毛利率计算**：理论毛利率、实际毛利率（含损耗+餐具）、净利率
3. **成本结构可视化**：彩色进度条展示食材/餐具/人工/水电/租金占比
4. **编辑/只读模式**：默认只读防误改，点「编辑」解锁输入
5. **数据库同步**：一键保存/加载套餐数据到 Supabase 数据库
6. **套餐横向对比**：5 个套餐的核心指标对比表

## 关键文件说明

### src/app/page.tsx
- Client Component，所有计算和渲染逻辑
- `MEALS` 常量：5 个套餐的默认数据
- `compute(m)`：核心计算逻辑
- `calc()`：触发重新计算
- `renderItems(m)`：渲染食材明细表格
- `startEdit() / cancelEdit() / saveMeal()`：编辑模式控制
- `saveToDb() / loadFromDb()`：数据库对接（通过 `/api/meals`）

### src/app/api/meals/route.ts
- `GET /api/meals`：获取所有套餐数据
- `POST /api/meals`：批量保存/更新套餐数据（upsert）
- 使用 service role key 绕过 RLS，直接操作数据库

### 数据库表 hotpot_meals
- `id` (serial, PK)
- `meal_id` (varchar, unique)：套餐唯一标识
- `name` (varchar)：套餐名称
- `data` (jsonb)：完整套餐数据对象
- `created_at` / `updated_at`：时间戳

## 本地开发与预览
- 开发服务：`pnpm run dev`（端口 5000）
- 访问地址：http://localhost:5000
- 修改代码后自动热更新

## 部署说明
- 通过 `.coze` 配置的 build 和 run 命令自动部署
- 数据库连接通过环境变量自动注入

## 常见问题
- **数据库为空**：首次打开页面加载默认数据，点「保存到数据库」后才会持久化
- **成本价未填**：输入框红框提示，不影响计算但毛利率会虚高
- **零售价锁定**：手动修改零售价后行标黄，不再随分量/单价自动计算

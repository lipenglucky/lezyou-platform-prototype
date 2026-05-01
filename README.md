# 乐自由 · 工程设计服务对接平台 · 高保真原型

> 建筑 / 景观 / 室内三大设计专业的双向对接平台。
> 委托人定向下单或悬赏招标,设计师在线交付,资金由平台分阶段托管。

本项目为 **可点击 UI 高保真原型**(Phase A),用于产品演示与客户/投资人评审。
所有数据为 mock,登录、支付、短信、电子合同、文件上传等动作均给出 UI 反馈但不真实发生。

---

## 快速开始

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

也可以执行 `npm run build && npm run start` 体验生产构建。

环境要求：Node.js ≥ 18(已在 Node 22 + Windows 11 + npm 11 验证通过)。

---

## 演示主线(端到端走一遍)

1. **首页** `/` → 看品牌叙事 + 三大专业入口 + 热门设计师 + 悬赏 + 平台流程。
2. **找设计师** `/designers` → 多维度筛选(专业 / 负荷 / 城市 / 在线 / 出差 / 手改图)。
3. **设计师主页** `/designers/designer_chen` → 三大状态指示灯、作品集、档期、下单 CTA。
4. **三步下单** `/order/new?designer=designer_chen` →
   - Step 1 选服务模式(线上 / 上门) + 计费模式(按天 / 按月)。
   - Step 2 填项目名称 / 子专业 / 类型 / 描述。
   - Step 3 看 30/40/30 分阶段付款方案,合同自动生成提示。
5. **委托人工作台** `/client` → 看到刚才的新订单出现在「我的订单」。
6. **订单详情(委托人视角)** `/client/orders/order_001` → 阶段付款时间线、文件预览/下载锁、合同入口、返修按钮、消息记录。
7. 右下角 **演示身份切换器** → 切到「设计师 · 陈牧之」。
8. **设计师工作台** `/designer` → 看忙闲负荷三档切换、状态控件、收入趋势。
9. **同一笔订单(设计师视角)** `/designer/orders/order_001` → 上传成果、接收返修按钮。
10. **设计师钱包** `/designer/wallet` → 可提现 / 冻结中 / 累计收入,提现弹窗。
11. 切到 **管理员** → `/admin` → 资质审核队列(设计师入驻 + 企业认证两 tab)、用户管理表格、手续费配置。

---

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Next.js 14 (App Router) + TypeScript |
| 样式 | Tailwind CSS + shadcn/ui 风格组件 + lucide-react 图标 |
| 状态 | Zustand(身份切换 + Toast + 草稿订单) |
| 表单 | react-hook-form + zod(预装,Phase B 用) |
| 图表 | recharts |
| 图片 | next/image + Unsplash CDN(已在 next.config.mjs 白名单) |
| Mock | `src/mocks/*.ts` |

---

## 目录结构

```
.
├── app/
│   ├── (public)/            公共域路由组(含顶部导航 + footer)
│   │   ├── page.tsx         首页
│   │   ├── designers/       设计师列表 + 主页
│   │   ├── bounties/        悬赏大厅 + 详情 + 发布
│   │   ├── order/new/       三步下单流程
│   │   └── login/           登录 + 身份选择
│   ├── client/              委托人控制台(共享 sidebar layout)
│   ├── designer/            设计师控制台(共享 sidebar layout)
│   ├── admin/               管理员后台(共享 sidebar layout)
│   ├── globals.css
│   └── layout.tsx           根 layout · 含 Toaster + 身份切换器 FAB
├── src/
│   ├── components/
│   │   ├── ui/              shadcn 风格原子组件(Button/Card/Tabs/Dialog/Switch/Select 等)
│   │   ├── domain/          业务组件(DesignerCard/OrderRow/StageTimeline/StatusControls 等)
│   │   └── layout/          PublicHeader/PublicFooter/ConsoleShell/RoleSwitcherFab
│   ├── lib/                 utils, types, constants
│   ├── mocks/               designers / clients / orders / bounties / wallet / reviews
│   └── store/               Zustand stores(role, session)
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## 关键产品要点(对照 PRD)

- **三大状态可视化**:在线状态(头像角标绿点)、负荷状态(胶囊标签三档)、活跃度指示灯(头像旁绿/黄/红)。
- **两种下单模式**:定向精准下单 + 悬赏发布招标。
- **两种计费模式**:按天计费(单价 × 天数)+ 按月雇佣(首月预付,20 号续约)。
- **分阶段付款**:30 / 40 / 30 默认方案,委托人付款后资金 30 天托管。
- **成果交付闭环**:设计师上传 → 委托人在线预览 → 付款解锁下载 → 资金进入设计师托管钱包。
- **返修与异议**:委托人申请返修,设计师接收并重传新版,循环到验收通过。
- **钱包与提现**:实时收入 / 冻结资金 / 可提现 / 平台手续费明细 / 6 月趋势图 / 一键提现。
- **资质审核**:设计师入驻 + 企业委托人营业执照,两 tab 队列管理。
- **手续费配置**:费率与冻结周期可在管理员后台调整。

---

## 演示用辅助功能

- **右下角浮动按钮 · 演示身份切换器**:一键在「访客 / 委托人 / 设计师 / 管理员」之间切换,
  无需输密码即可查看同一份订单在不同视角下的呈现。
- **登录页 mock 验证码**:任意手机号 + 验证码 `888888` 即可登录。
- **本地状态持久化**:身份选择 / 新建草稿订单 / 通知队列均存于浏览器 localStorage。

---

## Phase B 已完成扩展

| 路由 | 说明 |
|------|------|
| `/onboarding/designer` | 设计师入驻 5 步向导(基础 → 专业 → 作品 → 服务 → 档期 + 提交) |
| `/onboarding/enterprise` | 企业委托人注册 + 营业执照 mock 上传 |
| `/contracts/[id]` | 电子合同预览 + 双方签署 + 区块链存证提示 |
| `/pay/[id]` | 微信 / 支付宝 / 对公转账三种付款方式 + 二维码 mock |
| `/admin/disputes` | 三档纠纷处理(待受理/处理中/已解决)+ 三方裁决操作 |
| `/client/monthly` | 按月雇佣续约中心 + 20 号窗口期提醒 + 自动续约管理 |

## 真实化下一步(Production Ready)

- 接入 Prisma + PostgreSQL,把 `src/mocks/*.ts` 替换为 Prisma 模型与 API Routes
- 接入真实支付:微信支付、支付宝
- 接入阿里云 / 腾讯云短信
- 接入 e签宝 或 法大大 真实电子合同
- 接入阿里云 OSS 文件上传
- 引入 NextAuth.js 做真实手机号 OTP 鉴权
- 引入 Sentry + Vercel Analytics + 阿里云 RAM 做监控

---

## 常见问题

**Q. 首次启动很慢?**
A. Next.js 首次访问每条路由都会编译,平均 1-3 秒。后续访问从内存缓存秒级加载。生产构建后无此问题。

**Q. 图片加载失败?**
A. 演示图来自 Unsplash CDN,需要可访问国际网络。可在 `next.config.mjs` 中加入其他可访问的图片源,或本地化资源。

**Q. 修改 mock 数据后要重启吗?**
A. 不用。修改 `src/mocks/*.ts` 后保存,Next 热更新会自动刷新页面。

---

© 2026 乐自由原型 · 内部演示用

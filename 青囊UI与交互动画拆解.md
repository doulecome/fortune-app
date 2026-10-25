# 青囊（qingnang.cc）UI 与交互动画拆解

> 拆解时间：2026-09-03 ｜ 来源：qingnang.cc 生产环境 CSS（Next.js / Tailwind / CSS Variables）
> 目的：为「玄机阁」寻找可借鉴的视觉语言与交互动画。配合同目录 `qingnang-study.html` 可运行 demo 使用。
> 说明：仅提取设计/动效技术，未复制任何品牌素材。

---

## 一、视觉语言（与玄机阁高度同频）

青囊的基调是 **「黛青底 + 护魄金 + 宣纸字」**——这正是玄机阁已在走的「墨青＋鎏金」方向。差异在于它把这套语言**系统化、变量化**了。

### 1. 色彩令牌（语义命名，可直接复用）

| 令牌 | 值 | 用途 |
|---|---|---|
| `--color-dai-qing` | `#004d4d` | 黛青，主背景 |
| `--color-dai-qing-dark` | `#033` | 渐变收尾 |
| `--color-hu-po-jin` | `#d4af37` | 护魄金，主强调 |
| `--color-hu-po-jin-light/dark` | `#e8c84a` / `#b8960f` | 金的高光/暗部 |
| `--color-xuan-zhi` | `#f2ecda`（beige） | 宣纸，正文浅字 |
| `--color-lan-dian` | `#1b2a5e` | 蓝靛，装饰线/罗盘 |
| **五行色** | 木`#16a34a` 火`#dc2626` 土`#92400e` 金`#ca8a04` 水`#2563eb` | 五行可视化 |
| **模块色** | 八字`#004d4d` 紫微`#6a4ba8` 六爻`#5c6b3a` 奇门`#1e6b45` 三术合参`#e087a0` … | **每个术数一个专属色** |

> 🔑 最大亮点：**五行色 + 模块专属色** 全部是 CSS 变量。玄机阁目前配色散落写死，应改为 `var(--mod-bazi)` 等，换肤/暗亮主题只需覆盖一组变量。

### 2. 排版与质感
- 标题用 **衬线体（serif）**，字号极大（`text-8xl/9xl`），金色，字距收紧。
- 副标题用 **letter-spacing 0.35em** 的金色细字（「track」效果），制造仪式感。
- 卡片：`rounded-2xl`（16px 圆角）+ `linear-gradient(黛青→深黛青)` + 透明描边，**hover 时描边转金 + 上浮 3px**。
- 导航：固定磨砂（`backdrop-blur-md` + `bg-xuan-zhi/80` 半透明宣纸）。

### 3. 主题系统
通过 `data-theme="zen"` / `"zen-dark"` 整组覆盖所有颜色变量（含五行/模块色同步切换）。这是玄机阁「暗亮主题」该采用的工程形态，而非写两份 CSS。

---

## 二、交互动画体系（32 个 @keyframes 拆解）

按用途分四类。**统一缓动 `cubic-bezier(.16,1,.3,1)`**（expo-out 手感），情绪克制、不喧宾夺主。

### A. 进场 / 阅读（列表、结果、Hero）
| 动画 | 代码特征 | 用途 | 玄机阁移植 |
|---|---|---|---|
| `hero-title-in` | 1.05s `translateY(30px) scale(.92)`→0 | Hero 大标题落位 | 首页主标题 |
| `hero-track` | letter-spacing `.1em`→正常 | 副标题展开 | 标语 |
| `qn-rise` | .4s 上浮 10px，**延迟 .05/.1/.15s 错峰** | 列表项逐个浮现 | 结果列表 |
| `md-ink-in` | .55s 模糊+上浮「落墨」 | AI 文本逐段显入 | **AI 流式输出** |

### B. 微交互（按钮、卡片、选中态）
| 动画 | 代码特征 | 用途 | 玄机阁移植 |
|---|---|---|---|
| `gilt-sheen` / `btn-sheen-sweep` | 金色光带 skew(-18°) 4.8s 扫过 | 按钮/卡片扫光 | **鎏金按钮、塔罗卡** |
| `glow-breathe` | drop-shadow 8↔24px 3s 呼吸 | 金字/图标「活着」 | 标题、当前模块 |
| `anchor-radiate` | 外圈 2.8s 扩散淡出 | 选中态提示 | Tabs/导航当前项 |
| `tk-charm-swing` | hover 0.9s 钟摆回弹 | 挂件摆动 | 百宝袋/吉祥物 |
| `tk-pouch-sway` | 7s ±1.8° 极慢轻摆 | 布袋常驻微动 | 小工具图标 |

### C. 功能态（命理专属，最该抄）
| 动画 | 代码特征 | 用途 | 玄机阁移植 |
|---|---|---|---|
| `coin-flip` + `coin-bounce` | rotateY 0→720° 带 rotateX 微抖 1.2s | **掷钱起卦** | **六爻/梅花逐爻掷钱** |
| `trinity-flow` | SVG dasharray + dashoffset 流光 1.8s | 三盘互证连接 | 合盘/合参连接线 |
| `ink-spread` | 墨点 scale0→2.5 + blur 淡出 2.5s | 古籍质感涟漪 | 点击涟漪、卦象生成 |
| `qn-bar-grow` | scaleX(0)→1 .72s | 五行条生长 | 五行强弱 |
| `qn-ring-draw` | stroke-dashoffset 描绘 .9s | 圆环进度 | 信度/加载 |

### D. 环境装饰（几乎不可察，但让页面有生气）
- `ring-rotate` / `ring-rotate-rev`：双环反向**极慢旋转（60–160s）**。
- `glyph-float`：背景符文 10s 浮动。
- `marquee-scroll`：古籍名录横向滚动带（64s）。
- `float-particle`：上浮粒子。

---

## 三、最值得玄机阁落地的 6 项（按性价比）

| 优先级 | 项 | 来源动画 | 成本 | 说明 |
|---|---|---|---|---|
| 1 | 按钮金色扫光 | `btn-sheen-sweep` | 低 | 直接加 CSS 到鎏金按钮/塔罗卡 |
| 2 | 模块专属色令牌 | `--mod-*` 变量 | 低 | 把 19 模块配色变量化，顺手支持换肤 |
| 3 | 起卦铜钱翻转 | `coin-flip` | 低 | 六爻/梅花「逐爻掷钱」仪式感（用户已在做） |
| 4 | 进场错峰上浮 + 墨入 | `qn-rise`/`md-ink-in` | 低 | 列表与 AI 流式「落墨」 |
| 5 | 主题系统 data-theme | CSS 变量整组覆盖 | 中 | 暗亮主题统一形态 |
| 6 | 选中态辐射环 | `anchor-radiate` | 低 | 导航/Tabs 当前项 |

---

## 四、工程最佳实践（比动效本身更值钱）

1. **`prefers-reduced-motion` 全面门控**：几乎每一组动画都带 `@media (prefers-reduced-motion:reduce){ ... animation:none }`。无障碍不是事后补，是设计起点。→ 玄机阁所有动效应统一加这层开关。
2. **统一缓动变量**：`--ease-smooth: cubic-bezier(.16,1,.3,1)`，全站一致手感。
3. **alpha 用 `color-mix(in srgb, var(--gold) 55%, transparent)` 而非写死 rgba**：换主题时透明度自动跟随。
4. **`will-change` / `transform` 优先**：动画走 transform/opacity，不触发重排。
5. **主题用 `data-theme` 整组变量覆盖**，而非多套 CSS。

---

## 五、结论

青囊与玄机阁**视觉方向一致**（墨青＋鎏金＋宣纸），它领先的是**系统化程度**：语义色彩令牌、模块专属色、主题变量化、动效缓动统一、无障碍门控。玄机阁应在不换风格的前提下，把「散落写死」升级为「令牌驱动」，并把 `coin-flip / btn-sheen / qn-rise / md-ink-in / anchor-radiate` 五个动效直接并入现有组件。

> 运行 `qingnang-study.html` 可逐条体验上述动效（右上角可切换主题、模拟减弱动效）。

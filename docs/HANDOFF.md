# 项目交接说明

> 下次继续做这个网站之前，先读这一份。读完就知道现在到哪一步了、想改什么该动哪个文件、以及哪些决定是已经定过的（不要来回推翻）。
>
> 最后更新：2026-08-13（按客户 Copy Deck V1.0 重构后）

---

## 一、现状

| | |
|---|---|
| **线上网站** | https://great-lakes-sports.pages.dev |
| **代码仓库** | https://github.com/PengyiLiao/great-lakes-sports-website |
| **本地目录** | `~/Projects/great-lakes-sports-website` |
| **客户** | Great Lakes Sports Inc.（多伦多）／联系人：吴泽明（董事长）|
| **性质** | 志愿项目，无偿 |
| **未来域名** | gag.ca（客户规划中，尚未购买）|

### 网站是什么

**不是**母公司官网，而是 **GAG（Great Lakes Amateur Golf）青年高尔夫平台**的站点。
面向 **16–25 岁**的年轻球员，以及围绕他们的高校、教练、球会、赞助商和高尔夫组织。

品牌基调（客户原话）：**Young in Spirit. Professional in Competition. Serious in Standards.**
明确要求「不是传统协会网站，也不是单纯商业广告页」。

### 已完成的页面（英法双语，共 16 个路由）

| 路由 | 内容 |
|---|---|
| `/` `/fr` | Hero、GAG 是什么、三个年龄段、近期赛事、三大板块入口 |
| `/events` `/fr/events` | 首届赛事详情、三大常设赛事、未来赛事、赛事页将包含的栏目 |
| `/players` `/fr/players` | 年龄段、球员档案字段、**球员隐私政策** |
| `/university` `/fr/university` | 大学golf桥梁定位、三项合作内容 |
| `/community` `/fr/community` | 七类社群成员 |
| `/about` `/fr/about` | Who We Are / Vision / Mission / Story / Values / Governance / Youth Golf Fund |
| `/partners` `/fr/partners` | 合作类型与合作伙伴类别 |
| `/contact` `/fr/contact` | 六类访客对应入口 |
| `/register` `/fr/register` | 赛事详情、参赛条件、须准备的材料、未成年人规定、隐私说明、报名表单入口 |

**技术栈**：Astro 7（静态生成）+ Tailwind CSS v4 + TypeScript strict，托管在 Cloudflare Pages。

> **为什么是纯静态**：这个网站的工作是展示信息，不需要服务器在访客点开时算什么。全部预渲染的结果是：打开快、托管免费、而且**几乎没有可攻击的面**——没有数据库、没有登录、没有后端。以后要做报名和收款，会交给 Stripe 这类专门的服务，个人信息和支付数据永远不进我们自己的系统。

---

## 二、我想改 X，该动哪个文件

**这是最常用的一张表。**

| 想改什么 | 改这里 |
|---|---|
| 某个页面上的文字 | `src/content/` 下同名文件（`home` `about` `events` `players` `university` `community` `partners` `contact`），每个文件内分 `en` 和 `fr` 两块 |
| 导航栏、按钮、小标题这类界面文字 | `src/i18n/ui.ts` |
| 赛事日期 / 地点 / 参赛条件 | `src/content/events.ts` |
| 品牌颜色、字体、字号 | `src/styles/global.css` 顶部的 `@theme` 区块 |
| 导航栏有哪几项 | `src/config/site.ts` 的 `nav` |
| 公司名、所在地、联系邮箱 | `src/config/site.ts` |
| 页面的排版结构 | `src/components/pages/` 下对应的 `XxxPage.astro` |
| 页头 / 页脚 / 按钮样式 | `src/components/` 下的 `Header` `Footer` `Button` `PageHeader` |
| GAG 字标 | `src/components/GagLogo.astro`（矢量文字，不是图片）|
| 网页标签图标 | `public/favicon.svg` |
| 旧地址跳转 | `public/_redirects` |

### 常见操作

**改一句文案** → 找到 `src/content/` 里的那句话，直接改。**注意 `en` 和 `fr` 两处都要改**，否则会出现一种语言更新了、另一种没更新。

**加一场赛事** → 在 `src/content/events.ts` 的 `events` 数组里加一项，英法各填一份。数组为空时页面会自动显示「赛程即将公布」，不会留一个空框。

**填上联系邮箱** → 改 `src/config/site.ts` 里的 `contactEmail`，从 `null` 改成真实邮箱。Contact、Partners 页面上的按钮会自动出现（现在显示「联系方式即将公布」）。

**开放报名** → 建好 Google 表单后，把公开链接填进 `src/config/site.ts` 的 `registrationUrl`（从 `null` 改成链接）。页头、首页 Hero、Events 卡片、`/register` 页底部的四处按钮会同时亮起。**表单字段清单、表格列设计、隐私设置、邮件系统配置全在 [`REGISTRATION.md`](REGISTRATION.md)。**

**加一个新页面**（比如 News）：
1. 在 `src/content/` 建内容文件，导出 `Record<Lang, …>`
2. 在 `src/components/pages/` 建页面组件，接收 `lang` 参数
3. 在 `src/pages/` 和 `src/pages/fr/` 各建一个 2 行的路由文件
4. 在 `src/i18n/ui.ts` 加导航与标题文字（英法各一条）
5. 在 `src/config/site.ts` 的 `nav` 里加一项

---

## 三、本地怎么跑

```bash
cd ~/Projects/great-lakes-sports-website
npm install       # 只有第一次，或换了电脑时需要
npm run dev       # 打开 http://localhost:4321，改文件会自动刷新
npm run build     # 检查有没有错误（会先跑类型检查）
```

关掉开发服务器：`npx astro dev stop`

## 四、怎么发布

**`git push` 就是发布。**

```bash
git add -A
git commit -m "描述这次改了什么"
git push
```

推上去之后 Cloudflare 自动构建，约 1–2 分钟后线上生效。不需要登录 Cloudflare 后台。

> ⚠️ **验证上线时不要只看 HTTP 状态码。** Cloudflare Pages 对未匹配的路径会回落到首页并返回 200，看起来像成功了其实是旧内容。要 grep 页面里的具体文字来确认。

> 提交信息用英文，格式 `feat:` 新功能 / `fix:` 修问题 / `docs:` 改文档 / `refactor:` 重构 / `chore:` 杂项。这个仓库是公开的作品集，提交历史本身也是给人看的。

---

## 五、已经定过的决策（别推翻）

**1. 网站语言只有英文和法文，不出现中文。** 客户 README 明文：公开内容一律英文，中文只用于内部讨论。法文版是加拿大官方双语的延伸。**任何新增内容都必须同时提供英法两版。** 法文用加拿大惯例（赞助用 commandite，地名写 Toronto (Ontario)），`hreflang` 用 `fr-CA`。

**2. 标题字体用 Archivo（无衬线），不是衬线体。** 客户要求「年轻、朝气」「不是传统协会网站」。之前用的古典衬线 Cormorant 传达的恰好相反。**唯一的例外是 GAG 字标**，它保留衬线以匹配客户已经做好的奖杯、服装等实物。

**3. GAG 字标就是三个字母，不加图形。** 客户品牌说明原话：主商标只有 GAG，要非常干净，像 IBM 或 BMW 那样让字母本身成为识别物；旗杆果岭那类图形属于赛事物料，单独使用。枫叶是可选的次要加拿大标识。

**4. 文案和代码分开。** 所有文字都在 `src/content/` 和 `src/i18n/`，页面模板里不写死任何一句话。这样师兄以后要自己改字时，接一个可视化后台就行，不用重构。**新增内容时请保持这个习惯。**

**5. 颜色只在 `global.css` 里定义一次。** 页面里用 `bg-forest-900` 这样的名字，**不要直接写 `#12392c`**。品牌微调时改一处，全站同步。

**6. 不编造信息。** 没有的联系邮箱就写「即将公布」，不编一个假地址；客户没给赞助档位和金额，Partners 页就只讲合作是为了什么，不编价目表。**编出来的东西客户一眼能看出不是自己的意思，比留白更伤信任。**

**7. 网址不带结尾斜杠**（`/about` 而不是 `/about/`）。这样 canonical 标签、hreflang、站点地图里写的地址和实际访问的地址是同一个字符串，站内跳转也不用多绕一次。

**8. 手机端导航用 `<details>` 折叠，不用 JS。** 导航有 7 项，手机一行放不下。用原生 `<details>/<summary>` 实现：零 JavaScript、键盘可操作、屏幕阅读器自动识别，脚本加载失败也照常能用。

**9. 球员隐私单独成块，不塞进页脚。** 平台要公开 16 岁起球员的资料，决定要不要参加的是他们的家长和教练——这些人应该一眼看到承诺，而不是去翻法律条款。

### 已被推翻的旧决策（记录在此，避免有人翻旧账改回去）

- ~~「受众偏年长，正文 17px、导航不用汉堡菜单」~~ → 受众已改为 16–25 岁
- ~~「古典衬线 + 香槟金细线的老派贵气」~~ → 客户明确要年轻朝气
- ~~「Brand 独立成页」~~ → 已并入 About，旧地址 301 跳转
- ~~「首届赛事 10 月 5 日」~~ → 那是从奖杯效果图上抄的，**正确日期是 10 月 11 日**，地点 TPC Toronto at Osprey Valley 北场

---

## 六、下一步

按优先级：

1. **把待确认清单上的事项逐条改掉**（清单不在本仓库，见私有资料目录；代码里相关位置都有 `⚠️` 注释，`grep -rn "⚠️" src/` 可一次列出）
2. **报名系统** —— 网站侧已完成（`/register` 页 + `registrationUrl` 配置）。剩下的是在 Google 后台建表单、配表格权限、开一个专用 Gmail，**照 [`REGISTRATION.md`](REGISTRATION.md) 执行即可**。客户资料里写明网站目标日期 8 月 26 日
3. **News / Stories 栏目** —— Copy Deck 里列为第一版预留
4. **球员数据库与成绩系统** —— 客户参考的 IPSC Ontario 有完整的赛事日历、报名、排名、成绩查询，那是长期目标
5. **接可视化编辑后台** —— 兑现「师兄能自己改文字」这件事。因为文案早就和代码分开了，这一步改动不大。候选：Sveltia CMS / Pages CMS
6. **绑定 gag.golf 域名**（进行中，见下）
7. **隐私政策 / 使用条款 / 球员隐私三份法律文件** —— 页脚已列出但尚未链接。**平台会公开未成年人资料，这三份不是走过场**，建议客户找律师出

---

## 七、域名与已知问题

### 正式地址

**https://gag.golf** —— 不带 www。`www.gag.golf` 和旧的 `great-lakes-sports.pages.dev` 都应 301 跳到它。

> ⚠️ **这两条跳转不能写在 `public/_redirects` 里。** Cloudflare Pages 的 `_redirects` **只匹配路径，不匹配域名**——写成 `https://www.gag.golf/*` 会被静默忽略（不报错、也不生效）。路径跳转（`/brand → /about`）则正常。
>
> 域名级跳转要在 **Cloudflare 后台 → gag.golf → Rules → Redirect Rules** 里配。

改域名时要同步改三处，缺一处就会出现"页面说自己的正式地址是 A，实际却在 B"：

| 文件 | 字段 |
|---|---|
| `astro.config.mjs` | `site` |
| `src/config/site.ts` | `site.origin` |
| `public/robots.txt` | 站点地图地址 |

**顺序**：域名先解析成功，再改这三处。反过来的话，线上网站会有一段时间声称自己的正式地址是个打不开的域名。

### 微信拦截 pages.dev（已由换域名解决）

微信内置浏览器会对 `pages.dev` 整个域名报"该网页所属平台可能存在被他人恶意利用"。拦的不是我们——免费二级域名平台被大量用于钓鱼，微信按父域名一刀切。网站本身已核查无异常：无外部脚本、无 iframe、证书正常。

换到 `gag.golf` 后自动解决。那个警告页底部的「申请恢复访问」没有意义，要申诉也得由 Cloudflare 去申诉自己的域名。

## 八、安全须知

**这个仓库是公开的，任何人都能看到全部代码和历史。**

- **绝对不要把这些提交进来**：公司注册文件、赛事预算表、邀请名单、合同、任何密钥或密码。`.gitignore` 里已经设了安全网（`*.docx` `*.pdf` `*.xlsx` `.env` 等一律拦截，并且实测验证过），但**最终把关的是提交前看一眼 `git status`**。
- **git 历史是永久的。** 文件一旦提交，后面再删也还留在历史里。所以是「提交前挡住」，不是「提交后再删」。
- 以后接了需要密钥的服务（邮件、支付、统计），密钥填在 Cloudflare 后台的环境变量里，**不写进代码**。
- **客户资料里有敏感文件**：`2026 GAG Tournament Budget.xlsx`（成本结构）、`2026 Invitation List.xlsx`（人名）、公司注册 PDF。这些留在 OneDrive，不进仓库，网站上也不出现其中的数字。

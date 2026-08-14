# 报名系统 · 邮件 · 数据库 — 操作规格

> 这份文件说明第一版报名系统怎么搭。网站侧的代码我已经做好了，**这里列的是需要在 Google 和 Cloudflare 后台动手的部分**。
>
> 最后更新：2026-08-13

---

## 一、整体架构

```
访客 → 网站 /register 页（说明资格、须知、隐私）
                ↓ 点击按钮
        Google 表单（收集报名信息）
                ↓ 自动写入
        Google 表格（= 第一版数据库）
                ↓ 自动通知
        专用 Gmail（= 第一版邮件系统）
```

**三条设计原则：**

1. **网站不碰个人数据。** 网站是纯静态的，没有后端、没有数据库——这正是它几乎无法被攻击的原因。报名信息里有 16 岁起球员的姓名、电话、家长联系方式，交给 Google 保管，比为 72 行数据自建一套接口和数据库既快又安全得多。
2. **能不收的就不收。** 每多一个字段，就多一份泄漏时的责任。下面的清单已经按"办这场比赛真正需要"筛过。
3. **收集和公开严格分开。** 表格里存的东西，绝大部分永远不上网站。

---

## 二、Google 表单字段清单

> 💡 **不用手工敲。** [`google-form-setup.gs`](google-form-setup.gs) 这个脚本能一次生成整张表单——所有分节、题型、必填标记、邮箱格式校验、未成年人条件跳转全部配好。
>
> 用法：打开表单 → 右上角 ⋮ →「脚本编辑器」→ 清空原内容、粘贴脚本 → 选 `buildEntryForm` → 运行 → 授权 → 回表单刷新。
>
> 下面这份清单是脚本生成内容的说明，也供手工核对。

### 报名与收款分两步（重要）

**表单只收信息，不收钱。**

名额 72 个、差点须低于 10，这意味着会有人不合资格、也可能超额。如果报名时就收款，两种情况都要退钱——既麻烦又伤体验。

正确顺序：

```
提交表单 → 委员会核验差点、确认名额 → 确认邮件里告知付款方式
```

好处是**收款方式现在定不下来也不影响开放报名**。以后要加，改的是那封确认邮件，网站和表单一个字都不用动。

新建表单：https://forms.new — 标题 `2026 GAG Inaugural Tournament — Entry Form`

> ⚠️ 表单**用英文**（网站语言政策）。如果要法文版，Google 表单不支持一份表单双语，需要建第二份，链接填进 `registrationUrl` 的法文分支——需要的话告诉我，我改代码支持。

### 第 1 节 — Player Information

| # | 字段 | 类型 | 必填 | 备注 |
|---|---|---|---|---|
| 1 | Full name (as it should appear on results) | 简答 | ✅ | **会公开** |
| 2 | Email address | 简答 | ✅ | 不公开 |
| 3 | Mobile phone | 简答 | ✅ | 不公开 |
| 4 | Date of birth | 日期 | ✅ | **不公开**。用于确认年龄、触发未成年人流程、保险 |
| 5 | Gender | 单选 Male / Female | ✅ | 名额是 52 男 20 女，需要用来配额 |
| 6 | City, Province | 简答 | ✅ | 只公开省份 |

### 第 2 节 — Golf Credentials

| # | 字段 | 类型 | 必填 | 备注 |
|---|---|---|---|---|
| 7 | Current handicap index | 简答 | ✅ | **资格线：低于 10**。会公开 |
| 8 | Club or association where your handicap is maintained | 简答 | ✅ | 用于核验 |
| 9 | Golf Canada / Golf Ontario membership number | 简答 | ❌ | 用于核验，将来申请 WAGR 积分也要 |
| 10 | Club, university or team affiliation | 简答 | ❌ | **会公开** |
| 11 | Recent competitive experience | 段落 | ❌ | 名额超额时用于筛选 |

### 第 3 节 — Tournament Logistics

| # | 字段 | 类型 | 必填 | 备注 |
|---|---|---|---|---|
| 12 | Shirt size | 单选 S/M/L/XL/XXL | ✅ | 球员礼包 |
| 13 | Dietary requirements or allergies | 简答 | ❌ | 餐饮安排 |
| 14 | Preferred tee time window | 单选 8:05–9:30 / 9:30–11:00 / 11:00–11:59 / No preference | ❌ | 首组 8:05，末组 11:59 |
| 15 | Emergency contact — name | 简答 | ✅ | 不公开 |
| 16 | Emergency contact — phone | 简答 | ✅ | 不公开 |

### 第 4 节 — Players Under 18

> 表单设置里把第 17 题设为**「根据答案跳转到下一部分」**：选 Yes 进入本节，选 No 跳到第 5 节。

| # | 字段 | 类型 | 必填 | 备注 |
|---|---|---|---|---|
| 17 | Is the player under 18 on the day of the tournament? | 单选 Yes / No | ✅ | 分流用 |
| 18 | Parent or guardian — full name | 简答 | ✅ | 不公开 |
| 19 | Parent or guardian — email | 简答 | ✅ | 不公开 |
| 20 | Parent or guardian — phone | 简答 | ✅ | 不公开 |
| 21 | I am the parent or legal guardian. I authorize this entry and the publication of the player's competitive information (name, club or university, handicap, results). | 勾选 | ✅ | **法律上的关键一栏** |

### 第 5 节 — Confirmations

| # | 字段 | 类型 | 必填 | 备注 |
|---|---|---|---|---|
| 22 | I agree to abide by the Rules of Golf and the tournament regulations. | 勾选 | ✅ | |
| 23 | I understand that my name, club or university, handicap and results will be published, and that my contact details will not. | 勾选 | ✅ | |
| 24 | Photography and video consent | 单选 I consent / I do not consent | ✅ | **必须允许拒绝**。未成年人由家长选 |
| 25 | I would like to receive GAG tournament announcements by email. | 单选 Yes / No | ✅ | **邮件列表只能从这里来**，不能默认加人 |
| 26 | How did you hear about GAG? | 简答 | ❌ | 宣传效果参考 |

---

## 三、Google 表格（第一版数据库）

表单会自动生成一个表格。**再手动加这几列**给委员会用：

| 列 | 用途 |
|---|---|
| `Status` | Pending / Confirmed / Waitlist / Withdrawn |
| `Handicap verified` | Y / N |
| `Fee received` | Y / N |
| `Tee time` | 最终分组时间 |
| `Notes` | 内部备注 |

### 再建一个「Public」工作表

**只放将来要上网站的列**：`Name · Club/University · Province · Handicap · Status`

这一步现在做，是为了将来省事：比赛结束后加上成绩列，我可以直接写个脚本把这张表转成网站上的成绩页和球员档案，**不用重新录入一遍**。参考站 IPSC Ontario 的球员档案就是这个数据结构（Place / Competitor / Percent / Points / Class / Region）。

### ⚠️ 隐私设置（这一步不能省）

- 表格右上角「共享」→ **「仅限受邀人员」**，逐个加委员会成员
- **绝对不要**设成「知道链接的任何人可查看」——里面有未成年人的家庭联系方式
- 表单设置里勾选 **「向填写者发送回执副本」**，参赛者能留底
- 表单**不要**限制为「组织内用户」，参赛者是外部人

---

## 四、邮件系统

### 第一阶段：现在就能做（不需要域名）

注册一个**专用 Gmail**，例如 `gag.golf@gmail.com`。

> 这不是将就。参考站 **IPSC Ontario 是成熟的省级协会，赛事通知就是从 `ipsc.league@gmail.com` 发的**。72 人的首届赛事完全够用，而且零成本、零维护。

配好三件事：

1. **表单通知** — 表单「回复」标签页 → 开启「有新回复时通过电子邮件通知我」
2. **回执** — 表单设置 → 开启「向填写者发送回执副本」
3. **赛事通知群发** — 从表格里筛出第 25 题回答 Yes 的邮箱

> 🚨 **群发时必须用密送（BCC）。** 直接放在收件人栏，所有参赛者的邮箱会互相暴露给彼此——这是业余赛事最常见的隐私事故，一次就能毁掉信任。

### 第二阶段：gag.ca 到手之后

用 **Cloudflare Email Routing**（免费）：

1. 域名转入 Cloudflare（或购买时就选 Cloudflare Registrar）
2. 后台 → Email → Email Routing → 添加转发规则
   - `registration@gag.ca` → 那个 Gmail
   - `info@gag.ca` → 那个 Gmail
3. 想让**回信显示为 @gag.ca**：Gmail 设置 → 账号 → 「用这个地址发送邮件」，加上 `info@gag.ca`

这样对外全部是 `@gag.ca`，实际收发仍在 Gmail 里，不用维护邮件服务器。

---

## 五、表单建好之后，告诉我一件事

把表单的**公开填写链接**发给我（形如 `https://forms.gle/xxxxxxxx`），我改一行代码：

```ts
// src/config/site.ts
export const registrationUrl: string | null = "https://forms.gle/xxxxxxxx";
```

推送后约一分钟，网站上的报名按钮全部自动亮起：

- 页头的 **LET'S PLAY GAG** 按钮
- 首页 Hero 的 **ENTER THE TOURNAMENT**
- Events 页赛事卡片上的报名按钮
- `/register` 页底部的主按钮

**在此之前**，`/register` 页面照常可看——它会展示赛事详情、参赛条件、需要准备的材料、未成年人规定和隐私说明，只是把按钮换成「报名尚未开放」。**这一页本身就有用**，不是等表单的空壳。

---

## 六、还需要客户决定的

| 事项 | 为什么要先定 |
|---|---|
| **报名费金额** | 内部预算表里写的是 $50，但那份是内部文件，未必是终稿。网站和表单上都还没写 |
| **收款方式** | **不急**——按上面的两步流程，确认名额后才在邮件里告知，现在定不下来不影响开放报名。到时建议 e-Transfer（加拿大最省事）或 Stripe Payment Link；**不要自己写支付代码** |
| **报名截止日期** | 表单可以设定时间自动关闭 |
| **超额怎么办** | 72 个名额，超了是先到先得还是按差点排序？第 11 题就是为筛选准备的 |
| **隐私政策 / 使用条款 / 球员隐私三份文件** | 页脚已列出但还没链接。**平台要公开未成年人资料，这三份不是走过场，建议找律师出** |

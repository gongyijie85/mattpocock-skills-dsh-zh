---
name: wizard
description: 生成一个交互式 bash wizard,引导人类逐步完成只有他们才能执行的步骤。适用于配置基础设施、设置凭据或 CI secrets、操作陌生的第三方 dashboard,或执行一次性迁移或切换(cutover)。不要为 agent 自己能完成的步骤调用本技能。
---

# 向导(Wizard)

**wizard(向导)** 是一个 bash 脚本,它一步步引导人类完成一个手工做起来繁琐、每次都要向 AI 重新解释一遍更繁琐的手动流程。它打开每个 URL、精确说出要点什么和复制什么、捕获这些值、把它们写到该去的地方(`.env`、GitHub secrets)、在每一阶段确认,并显示还剩多少阶段。它可能配置第三方服务、运行一次性迁移,或把项目从一种状态迁到另一种。

令人愉悦的 UX 已经由 [template.sh](template.sh) 解决了——分阶段的进度、确认关卡、跨平台 URL 打开(包括 WSL)、隐藏的 secret 输入、幂等的 `.env` 更新(upsert)、`gh secret`/`gh variable` 写入,以及收尾总结。**你的工作只是界定流程范围并编写它的 stages。** `STAGES` 标记之上的库部分在每个 wizard 中都是相同的;这种一致性正是要点——永远不要手工改动它。

wizard 默认是临时的——为一次运行而构建,保存到 scratch 或 `scripts/` 路径,任务完成就删除。只有当用户想要一个应常驻仓库的可重复 setup 路径时才提交它。

## 流程

### 1. 界定流程范围

推演出人类必须执行的每一个手动步骤,以及沿途捕获的每一个值。先读仓库——不要上来就问:

- 对于 setup:`.env`、`.env.example`、`.env.*`、`README`、`docker-compose*`、框架配置,以及 `.github/workflows/*`(每个 `secrets.*` / `vars.*` 引用都是 wizard 必须产出的一个值)。
- 对于迁移或过渡:当前状态、目标状态,以及它们之间不可逆的动作。

然后把有序的 stages 列表以及每个 stage 产出的值展示给用户并确认——他们可以增删或重排。

**完成标准:** 每个 stage 都按顺序命名,并且对于每个捕获的值,你都知道(a)人类从哪里得到它,(b)它写到哪里(`.env`、某个 GitHub secret、两者,或哪里都不写——有些 stage 是纯动作),以及(c)它是 secret(隐藏输入)还是公开的。

### 2. 绘制每个 stage 的旅程

对每个 stage,写下人类遵循的精确路径:打开哪个 URL、在那里做什么、值在哪里显示、它填充哪个变量——例如 "Dashboard → Developers → API keys → Reveal test key → copy"。在你并不真正知道当前 UI 或确切命令的地方,明说并询问用户或查阅文档——绝不编造可能并不存在的步骤。

**完成标准:** 每个 stage 都能追溯到陌生人也能照做的具体指令。

### 3. 编写 wizard

把 `template.sh` 复制到目标路径。用每个步骤一个 `stage` 替换示例 stage,按依赖顺序排列。使用库辅助函数——`stage`、`say`/`step`、`open_url`、`ask`/`ask_secret`、`write_env`、`set_secret`/`set_var`、`pause`/`confirm`——并把 `TOTAL_STAGES` 设为你编写的 stage 数量。

守住模板设定的标准:在索要某个值之前先打开它的 URL,任何 secret 都使用 `ask_secret`,每个要持久化的值都 `write_env`,`set_secret` 只用于 CI 真正需要的值,任何不可逆动作之前都 `confirm`。每个 `stage` 都会清屏,只显示当前步骤——让一个 stage 只做一件聚焦的事,这样人类需要的内容不会滚出视野。不要碰标记之上的库部分。

### 4. 验证并交接

- `bash -n <script>`;如果可用,运行 `shellcheck`。
- `chmod +x <script>`。
- 不要自己端到端运行它——它会打开浏览器并阻塞等待人类输入。改为静态追踪:第 1 步的每个值都被捕获并落在第 1 步所说的地方,每个 `set_secret` 名称都精确匹配 CI 中的一个 `secrets.*` 引用。
- 告诉用户如何运行它。如果它是可重复的 setup 路径,提交它并从 README 链接,这样下一个人运行脚本而不是问 AI。

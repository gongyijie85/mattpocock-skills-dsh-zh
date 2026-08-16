---
name: improve-codebase-architecture
description: 扫描代码库寻找 deepening（加深）机会，将其呈现为可视化 HTML 报告，然后对你选中的那一项进行 grilling（拷问）式深入探讨。
disable-model-invocation: true
---

# 改进代码库架构

找出架构摩擦点，并提出 **deepening opportunities（加深机会）**——把浅层模块变成深层模块的 refactor。目标是可测试性与 AI 可导航性（AI-navigability）。

该命令以项目的领域模型为_依据_，并建立在一套共享的设计词汇之上：

- 调用 skill tool 的 "codebase-design" 获取架构词汇（**module**、**interface**、**depth**、**seam**、**adapter**、**leverage**、**locality**）及其原则（deletion test（删除测试）、"the interface is the test surface"（接口即测试表面）、"one adapter = hypothetical seam, two = real"（一个 adapter = 假想的 seam，两个 = 真实的））。每条建议中都精确使用这些术语——不要滑向 "component"、"service"、"API" 或 "boundary"。
- `CONTEXT.md` 中的领域语言为好的 seams 命名；`docs/adr/` 中的 ADRs 记录了该命令不应重新争论（re-litigate）的决策。

## 流程

### 1. 探索

**先界定范围再扫描——YAGNI。** 加深一个模块的价值在于让未来对它的修改更容易，因此要把额外权重放在代码库中最近有变动的部分。在动手看之前先决定*看哪里*：

- 如果用户指明了方向——某个模块、子系统或痛点——直接采纳，跳过下面的推断。
- 否则，往回翻阅一段较长的提交历史（`git log --oneline`），找出代码库的 hot spots（热点）——反复出现的文件和区域——让这些路径先吸引你的注意力。如果变更分散、没有明确热点，就扩大搜索范围。

先阅读项目的领域词汇表（`CONTEXT.md`）以及你要触及区域中的任何 ADRs。

然后派生一个 sub-agent 去遍历代码库。不要遵循僵化的启发式规则——有机地探索，并记录你在哪里感受到摩擦：

- 在哪里，理解一个概念需要在许多小模块之间来回跳转？
- 哪些模块是 **shallow（浅层）** 的——interface 几乎与实现一样复杂？
- 哪些地方仅仅为了可测试性就抽取了纯函数，而真正的 bug 却藏在调用方式里（没有 **locality（局部性）**）？
- 哪些紧耦合的模块在 seams 之间泄漏？
- 代码库的哪些部分未被测试，或难以通过它们当前的 interface 测试？

对你怀疑是 shallow 的任何东西应用 **deletion test（删除测试）**：删除它会集中复杂性，还是只是转移它？「会集中」正是你想要的信号。

### 2. 以 HTML 报告形式呈现候选

把自包含的 HTML 文件写入操作系统的临时目录，这样仓库里不会留下任何东西。从 `$TMPDIR` 解析临时目录，回退到 `/tmp`（Windows 上是 `%TEMP%`），写入 `<tmpdir>/architecture-review-<timestamp>.html`，这样每次运行都会得到新文件。为用户打开它——Linux 上用 `xdg-open <path>`，macOS 上用 `open <path>`，Windows 上用 `start <path>`——并告诉他们绝对路径。

报告用 **通过 CDN 引入的 Tailwind** 做布局与样式，并在图/流程/时序能可靠传达结构的地方用 **通过 CDN 引入的 Mermaid** 画图。把 Mermaid 与手工制作的 CSS/SVG 视觉元素混用——关系呈图状时（调用图、依赖、时序）用 Mermaid；想要更有编辑感的东西时（体量图、剖面图、折叠动画）用手工构建的 div/SVG。每个候选都配一个 **before/after（改造前/后）可视化**。要注重视觉化。

为每个候选渲染一张卡片，包含：

- **Files（涉及文件）** — 涉及哪些文件/模块
- **Problem（问题）** — 当前架构为何造成摩擦
- **Solution（方案）** — 用通俗语言描述会发生什么变化
- **Benefits（收益）** — 从 locality 与 leverage 的角度解释，以及测试将如何改善
- **Before / After 示意图** — 并排、手工绘制，展示 shallow 与加深的效果
- **Recommendation strength（推荐强度）** — `Strong`、`Worth exploring`、`Speculative` 之一，渲染为徽章

报告以 **Top recommendation（首要推荐）** 部分结尾：你会先处理哪个候选，为什么。

**领域用 `CONTEXT.md` 的词汇，架构用 `codebase-design` 的词汇。** 如果 `CONTEXT.md` 定义了 "Order"，就说 "the Order intake module"（Order 录入模块）——不要说 "the FooBarHandler"，也不要说 "the Order service"。

**ADR 冲突**：如果某个候选与现有 ADR 矛盾，只有当摩擦真实到值得重新审视该 ADR 时才把它提出来。在卡片中明确标注（例如一个警告 callout：_「contradicts ADR-0007 — but worth reopening because…」_）。不要列出 ADR 禁止的每一个理论上的 refactor。

完整的 HTML 脚手架、图表模式与样式指南参见 [HTML-REPORT.md](HTML-REPORT.md)。

先不要提出 interface。文件写好后，问用户：「这些里面你想探索哪一个？」

### 3. Grilling 循环

一旦用户选中某个候选，调用 skill tool 的 "grilling" 与他们一起走完 decision tree（决策树）——约束、依赖、加深后模块的形态、seam 背后是什么、哪些测试能存活。

随着决策逐渐成型，副作用会即时发生——调用 skill tool 的 "domain-modeling" 让领域模型随时保持最新：

- **要用 `CONTEXT.md` 中没有的概念命名加深后的模块？** 把该术语加入 `CONTEXT.md`。文件不存在就惰性创建。
- **对话中厘清了一个模糊术语？** 就地更新 `CONTEXT.md`。
- **用户以有分量的理由拒绝了候选？** 提议记录一个 ADR，措辞如：_「要不要我把这条记成 ADR，这样以后的架构审查就不会再推荐它了？」_ 只有当该理由确实是未来的探索者避免重复推荐所需时才提议——跳过一时性的理由（「现在不值得」）和不言自明的理由。
- **想为加深后的模块探索替代 interface？** 调用 skill tool 的 "codebase-design"，使用它的 design-it-twice（设计两遍）并行 sub-agent 模式。

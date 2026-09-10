---
name: to-tickets-zh
description: 把一个 plan、spec 或当前对话拆分为一组 tracer-bullet ticket,每个 ticket 声明其 blocking edges,并发布到已配置的 tracker——本地以文本记录 edges(每个 ticket 一个文件),真实 tracker 则使用原生 blocking 链接。
disable-model-invocation: true
---

# 生成 Tickets

把一个 plan、spec 或对话拆分为一组 **tickets(票证)**——tracer-bullet 垂直切片,每个 ticket 声明 **block(阻塞)** 它的那些 tickets。

issue tracker 和 triage 标签词汇表应当已经提供给你。如果没有,告诉用户运行 `setup-matt-pocock-skills`。

## 流程

### 1. 收集上下文

基于对话上下文中已有的内容展开工作。如果用户以参数传入一个引用(spec 路径、issue 编号或 URL),获取它并通读其完整正文和评论。

### 2. 探索代码库(可选)

如果还没有探索过代码库,请先探索以了解代码的当前状态。ticket 标题和描述应使用项目的领域词汇表词汇,并尊重你所触及区域的 ADR。

寻找预先重构(prefactor)的机会,让实现变得更简单。"先让改动变容易,再做出容易的改动。"

### 3. 起草垂直切片

把工作拆分为 **tracer bullet(曳光弹)** tickets。

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests) — vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

为每个 ticket 给出它的 **blocking edges(阻塞边)**——在它开始之前必须先完成的其他 tickets。没有阻塞者的 ticket 可以立即开始。

**Wide refactors(大范围重构)是垂直切片的例外。** **wide refactor** 是单一机械改动——重命名一列、更改共享符号的类型——其 **blast radius(爆炸半径)** 波及整个代码库,一次编辑会同时破坏成千上万个调用点,没有任何垂直切片能保持绿色。不要强行把它塞进 tracer bullet;按 **expand–contract(先扩张后收缩)** 的顺序编排。首先 expand(扩张):在旧形式旁边加入新形式,保证什么都不会破坏。然后按 blast radius 分批迁移调用点(按包、按目录),每批都是被 expand 阻塞的独立 ticket,由于旧形式仍然存在,CI 可以逐批保持绿色。最后 contract(收缩):一旦不再有调用者,就删除旧形式,该 ticket 被每一批迁移所阻塞。即使各批次单独无法保持绿色,也要保留这个顺序,但让它们共享一个集成分支,所有批次共同阻塞一个最终的 integrate-and-verify(集成并验证)ticket——绿色只在那个 ticket 上得到承诺。

### 4. 询问用户

把建议的拆分以编号列表呈现。对每个 ticket,展示:

- **Title(标题)**:简短描述性名称
- **Blocked by(被谁阻塞)**:必须先完成的其它 tickets(如果有)
- **What it delivers(交付什么)**:这个 ticket 使哪些端到端行为可用

询问用户:

- 粒度感觉合适吗?(太粗 / 太细)
- blocking edges 正确吗——每个 ticket 是否只依赖真正 gate 它的 tickets?
- 是否有 tickets 应该合并或进一步拆分?

反复迭代,直到用户批准该拆分。

### 5. 把 tickets 发布到已配置的 tracker

发布已批准的 tickets。**方式**取决于 `setup-matt-pocock-skills` 配置的 tracker——无论哪种方式,tickets 都是一样的,只有 blocking edges 的形态不同:

- **本地文件** → 在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 下为每个 ticket 写一个文件,从 `01` 开始按依赖顺序编号(blockers 在前)。每个文件的 "Blocked by" 列出它所依赖的编号/标题。使用下面的按 ticket 文件模板——每个文件一个 ticket,绝不合并成单个文件。
- **真实 issue tracker(GitHub、Linear、…)** → 按依赖顺序(blockers 在前)为每个 ticket 发布一个 issue,这样每个 ticket 的 blocking edges 可以引用真实标识符。平台若有原生的 blocking / sub-issue 关系就使用它;否则把每个 ticket 的 "Blocked by" 设为阻塞它的 issues。除非另有指示,应用 `ready-for-agent` triage 标签——这些 tickets 天生就是 agent 可认领的。

推进 **frontier(前沿)**:处理所有 blockers 都已完成、可被认领的 ticket。对纯线性链条而言就是从顶到底。

不要关闭或修改任何父 issue。

<local-ticket-template>

# <NN> — <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective — not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None — can start immediately".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

A reference to the parent issue on the tracker (if the source was an existing issue, otherwise omit this section).

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective — not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None — can start immediately".

</issue-template>

无论采用哪种形式,都要避免具体的文件路径或代码片段——它们很快就会过时。例外:如果 prototype 产出了比散文更能精确编码某个决策的片段(state machine、reducer、schema、类型形态),就把它内联进去,并简要注明它来自 prototype。裁剪到富含决策的部分——不是可运行的演示,只是重要的片段。

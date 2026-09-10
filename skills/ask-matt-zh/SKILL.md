---
name: ask-matt-zh
description: 询问哪个 skill 或 flow 适合当前情境。作为本仓库内所有 skill 的路由器。
disable-model-invocation: true
---

# Ask Matt

你不可能记住每一个 skill,所以问吧。

一个 **flow(流程)** 是贯穿各 skill 的一条路径。大多数路径沿着一条 **main flow(主流程)** 展开,并有两条 **on-ramp(入口)** 汇入其中。其他一切都是独立的,或者是运行在底层的一层 vocabulary(词汇)。

## 主流程:idea → ship

这是大多数工作走的路线。你有一个想法,希望把它构建出来。

1. **`grill-with-docs`** — 通过访谈打磨想法。当你在**工作目录中工作**时,从这里开始:它是有状态的,会把学到的东西保留在 `CONTEXT.md` 和 ADR 中。(没有工作目录?使用 `grill-me` — 见 Standalone。两者运行的是同一个 `grilling` 原语;`grill-with-docs` 是会留下书面记录的那个,因此只要有仓库可供留下记录,它就是两者中更好的选择。)
2. **分支 — 所有问题都能在对话中解决吗?** 如果某个问题需要一个可运行的答案(state、业务逻辑、你必须亲眼看到的 UI),就绕道经过一个 prototype,由 **`handoff`** 双向桥接(prototype 住在自己的目录里,这正是 `handoff` 的用途 — 见 Phase boundaries):
   - **`handoff`** 出去,然后针对那个文件开启一个新 session,
   - **`prototype`** 用一次性代码回答这个问题,
   - **`handoff`** 把你学到的东西带回来,并在原始的 idea 线程中引用它。
3. **分支 — 这是一个 multi-session(多会话)构建吗?**
   - **是** → **`to-spec`**(把线程变成 spec),然后 **`to-tickets`** 把它拆成 tracer-bullet tickets,每个 ticket 声明自己的 **blocking edges(阻塞边界)**。在本地 tracker 上,每个 ticket 是 `.scratch/<feature>/issues/` 下的一个文件,手工按 blockers-first(先处理阻塞项)推进;在真正的 tracker 上,这些边变成原生的 blocking links,因此任何 blockers 已完成的 ticket 都可以被领取 — 每个 ticket 启动一次 **`implement`**,并在每两个之间 **`/clear`** 上下文。每个 ticket 都是自包含的,所以最后一个 ticket 的上下文可以直接丢弃。
   - **否** → 就在当前 context window 里运行 **`implement`**。

   无论哪种方式,**`implement`** 都会在内部驱动 **`tdd`** 来构建每个 issue — 一次一个 red-green(红绿)切片 — 然后在提交之前,运行 **`code-review`**(对 diff 的双轴审查:Standards + Spec)收尾。当你只是想在没有完整 spec 的情况下以 test-first(测试先行)方式构建一个具体行为时,单独使用 **`tdd`**;每当你想针对某个固定点审查分支或 PR 时,单独使用 **`code-review`**。

### Context 卫生

把第 1–3 步保持在**一个不间断的 context window** 中 — 在 `to-tickets` 之前不要 compact 或 clear — 这样 grilling、spec 和 tickets 都建立在同一个思考之上。之后每个 `implement` 都从 ticket 出发、以全新状态开始。

这其中的限制是 **[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)**:模型仍能敏锐推理的窗口(在最先进的模型上约为 150k tokens)。如果 session 在 `to-tickets` 之前逼近这个窗口,不要在退化的状态下硬撑 — 在最近的 phase boundary 处 `/compact`,然后继续(见 Phase boundaries)。

## On-ramps(入口)

一种产生工作的起始情境,随后汇入主流程。

- **Bug 和请求堆积** → **`triage`**。它让 issues 经过 triage 角色流转,产出 agent-ready(agent 可直接处理)的 issues,之后由 **`implement`** 接手。

  Triage 只适用于**并非你创建**的 issues — bug 报告、新进来的 feature 请求、任何原始到达的内容。`to-tickets` 产出的 tickets 已经 agent-ready,所以**不要对它们做 triage**。

- **出了问题** → **`diagnosing-bugs`**。针对那些棘手的:一眼看不出的 bug、间歇性的 flake、在两个已知良好状态之间悄悄潜入的 regression。在拥有 **tight feedback loop(紧致的反馈回路)** — 一条已经能在*这个* bug 上变红的命令 — 之前,它拒绝进行理论化;然后带着 regression test 修复。当真正的发现是没有好的 seam 来锁定这个 bug 时,它的事后复盘会交接给 **`improve-codebase-architecture`**。

- **庞大而模糊的工作 — greenfield 项目或巨大的 feature 构建,大到一次 session 装不下** → **`wayfinder`**,这里认知负荷最高的 flow。当从这里到目的地的路还看不清时,它会在 issue tracker 上绘制一张由 **decision tickets(决策 ticket)** 组成的 **shared map(共享地图)**,并逐个解决它们 — 产出的是 **decisions(决策),不是 deliverables(交付物)** — 直到迷雾被推开、道路清晰。`grill-with-docs` 打磨的是你能在单次 session 中把握的想法,wayfinder 针对的是你把握不了的那个 — 它更慢、更密集,所以只在恰好这种情形下使用它,绝不要用于范围明确的功能。

  当地图清晰后,**它交接出去,而不是亲自构建**:在主流程的 **`to-spec`** 处汇入,`to-spec` 会把地图上相互关联的 decisions 折叠成可构建的计划,然后照常走 `to-tickets` 和 `implement`。把地图直接循环进 `implement` 会跳过这个折叠,把关联的细节丢掉 — 只有当工作量确实很小时才直接进入 `implement`。

## Codebase 健康

不是 feature 工作 — 是日常维护。

- **`improve-codebase-architecture`** — 只要有空闲时间就运行它,让 codebase 保持适合 agent 操作的状态。它会浮现 **deepening opportunities(加深机会)**;挑一个就会_产生一个想法_,你可以把它带进主流程的 `grill-with-docs`。它是发现候选者的勘察;**(下面的)** **`codebase-design`** 是你设计所选方案的工作台。

## 底层的 Vocabulary(词汇)

两个 model-invoked(模型可调用)的参考,运行在*其他 skill 之下* — 各自是其词汇的唯一事实来源。当问题出在**词语**而非流程上时,直接使用它们;或者让上面的 skill 把它们拉进来。

- **`domain-modeling`** — 打磨项目的 *domain* 语言:质疑模糊的术语、解决一词多义的问题(一个 "account" 承担三种职责)、把难以逆转的决策记录为 ADR。它是 `grill-with-docs` 所驱动的主动纪律,让 `CONTEXT.md` 保持为一份干净的 glossary。
- **`codebase-design`** — 用于设计模块*形态*的 deep-module(深模块)词汇(module、interface、depth、seam、adapter、leverage、locality):在干净的 seam 上,用一个小 interface 承载大量行为。`tdd` 和 `improve-codebase-architecture` 都使用这套语言。

## Phase boundaries(阶段边界)

**phase(阶段)** 是 session 内的一块工作 — grilling、implementation、QA 都是。在两个 phase 的 **boundary(边界)** 处你有五个选项,在它们之间做选择是整个地图中最模糊的决策:

- **Continue(继续)** — 原地不动。不花任何成本,也不丢失任何东西。
- **`/clear`** — 清空窗口,当这里的内容对下一步无关紧要时。
- **`handoff`** — 写一个可移植的 markdown 文件。用途很窄:只用于**新的 harness**、**新的目录**、**同事**,或**在 phase 中途**分出支线任务。它买来的是可移植性。
- **Subagent(子代理)** — 把一个范围紧凑的任务送到它自己的窗口,拿回一份报告。
- **`/compact`** — 压缩当前上下文,并用它开启一个新 session。这是**默认选项**,位于决策树的底部,而不是首选。

阅读 [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) 了解有序的决策树 — 五个问题、每个分支背后的推理,以及为什么 primary-source 成本让 **Continue** 成为第一个要排除的选项。要在**边界处**做决定;在 phase 中途,要么继续,要么把其余部分拆给 subagents。

## Standalone(独立技能)

完全脱离主流程。

- **`grill-me`** — 与 `grill-with-docs` 相同的 relentless interview(不留情面的访谈),但它是 **stateless(无状态)的**:不在本地保存任何东西,也不构建 `CONTEXT.md`。当你**不在工作目录中工作**时使用它 — 打磨一个计划、一个设计、一篇文章,任何没有 repo 支撑的东西。如果你在工作目录中,改用 `grill-with-docs`:它运行同样的访谈并留下书面记录,所以严格来说它更好。
- **`grilling`** — 访谈原语本身:rounds(轮次)、the frontier(前沿);事实是 agent 的工作,决策是你的。`grill-me` 和 `grill-with-docs` 是两个具名的入口,`triage`、`wayfinder` 和 `improve-codebase-architecture` 都在内部运行它。只有当你想要不带任何包装的访谈时,才直接使用它。
- **`resolving-merge-conflicts`** — 逐个 hunk 处理进行中的 merge 或 rebase 冲突,依据**意图**解决 — 追溯到每一侧的 primary source,而不是挑拣代码行 — 然后完成操作。它从不运行 `--abort`。独立于所有 flow 之外:当你已经身处冲突之中时使用它。
- **`prototype`** — 一个小型、一次性的程序,用来回答一个设计问题:这个 state model 感觉对吗,或者这个 UI 应该长什么样。Throwaway(一次性)是对代码编写方式的约束,而不是销毁它的承诺:答案会融入真正的代码,prototype 本身则作为 **primary source(主要来源)** 保存在 main 之外的 `prototype/<name>` 分支上,由 implementation issue 指向它。它是主流程第 2 步中的绕行,但任何时候只要一个设计问题难以在纸面上解决,就可以使用它。
- **`research`** — 把阅读类的跑腿工作委托给一个 **background agent(后台代理)**:它针对 **primary sources(主要来源)** 调查一个问题,然后在仓库里留下一份带引用的 Markdown 文件。它阅读的同时你可以继续工作。它产出的文件是要*带进*主流程 `grill-with-docs` 的东西 — research 喂养思考,而不是取代思考。
- **`to-questionnaire`** — 当阻挡你的东西不在你的头脑里、也不在 codebase 里,而是在**别人的头脑里**时,它会为对方写一份问卷来填写。它是 `grill-me` 的反向操作:不是就主题访谈你,而是就**发送**访谈你 — 问卷要发给谁、你需要收回什么 — 并让问题瞄准那个缺口。收回来的东西是 `grill-with-docs` 或 `to-spec` 的素材。
- **`wizard`** — 用于只有**人类**才能完成的步骤:配置基础设施、设置凭据或 CI secrets、点击浏览不熟悉的第三方 dashboard、运行一次性的 migration 或 cutover。它生成一个交互式 bash 脚本,打开每个 URL、捕获每个值,并写入 `.env` 和 GitHub secrets — 这样该流程就不再需要你每次重新向 agent 解释。它是 model-invoked 的,所以 agent 一遇到只有你能通过的墙就会使用它。如果 agent 自己能做,就应该自己做;这个 skill 用于人类真正在环(in the loop)的场景。
- **`wait-what`** — 针对一条没被听明白的消息的纠偏工具。在对话中途、任何其他 skill 内部使用它,agent 会用你缺失的上下文、以通俗的英文、使用 `CONTEXT.md` 的词汇重新表述它刚才说的话。它是在事后起作用的;`grill-with-docs` 才是前期的解药,因为尽早达成共识的共享语言正是阻止行话出现的根本。
- **`teach`** — 跨多个 session 学习一个概念,把当前目录作为有状态的工作区。
- **`writing-for-agents`** — 编写 agent 会消费的文档(skills、AGENTS.md、被指向的文档)的参考。

## 前置条件

**`setup-matt-pocock-skills`** — 在第一次运行 engineering flow 之前运行,以配置其他 skill 所依赖的 issue tracker、triage labels 和文档布局。自定义 issue tracker 同样可用。

---
name: code-review
description: 沿两个轴审查自某个固定点(fixed point,commit、分支、tag 或 merge-base)以来的变更 — Standards(代码是否符合本仓库文档化的 coding standards?)和 Spec(代码是否实现了原始 issue/spec 所要求的内容?)。两个审查在并行 sub-agents 中运行,并排报告结果。当用户想审查一个分支、一个 PR、进行中的变更,或说 "review since X" 时使用。
---

对 `HEAD` 与用户提供的固定点之间的 diff 进行双轴审查:

- **Standards(标准)** — 代码是否符合本仓库文档化的 coding standards?
- **Spec(规格)** — 代码是否忠实地实现了原始的 issue / spec?

两个轴都以**并行 sub-agents** 运行,这样它们不会污染彼此的上下文,然后本 skill 汇总它们的发现。

issue tracker 应该已经提供给你。如果缺少 `docs/agents/issue-tracker.md`,告诉用户运行 `setup-matt-pocock-skills`。

## 流程

### 1. 固定参照点

用户所说的就是固定点 — commit SHA、分支名、tag、`main`、`HEAD~5` 等。如果他们没有指定,就问他们要。

一次性确定 diff 命令:`git diff <fixed-point>...HEAD`(三个点,因此比较是针对 merge-base 进行的)。另外通过 `git log <fixed-point>..HEAD --oneline` 记下 commit 列表。

在继续之前,确认固定点可以解析(`git rev-parse <fixed-point>`)且 diff 非空。错误的 ref 或空的 diff 应该在这里就失败 — 而不是在两个并行的 sub-agents 内部。

### 2. 确定 spec 来源

按以下顺序寻找原始 spec:

1. commit message 中的 issue 引用(`#123`、`Closes #45`、GitLab `!67` 等) — 通过 `docs/agents/issue-tracker.md` 中的工作流获取。
2. 用户作为参数传入的路径。
3. `docs/`、`specs/` 或 `.scratch/` 下与分支名或 feature 匹配的 spec 文件。
4. 如果什么都没找到,问用户 spec 在哪里。如果他们说没有,**Spec** sub-agent 将跳过并报告 "no spec available"。

### 3. 确定 standards 来源

仓库中任何记录了代码应该如何编写的文件,例如 `CODING_STANDARDS.md` 或 `CONTRIBUTING.md`。

在仓库自身文档之上,Standards 轴始终携带下面的 **smell baseline(坏味道基线)** — 一组固定的 Fowler code smells(_Refactoring_ 第 3 章),即使仓库没有任何文档也适用。有两条规则约束它:

- **仓库优先(Repo overrides)。** 文档化的仓库标准永远胜出;当它认可基线会标记的东西时,抑制该 smell。
- **始终是判断问题。** 每个 smell 都是一个带标签的启发式("possible Feature Envy"),绝不是硬性违规 — 而且和这里的任何标准一样,跳过工具已经强制检查的内容。

每个 smell 都按 *它是什么* → *如何修复* 来阅读;把它与 diff 进行匹配:

- **Mysterious Name(神秘命名)** — 函数、变量或类型的名字无法揭示它的作用或内容。→ 重命名它;如果想不出诚实的名字,说明设计本身很模糊。
- **Duplicated Code(重复代码)** — 相同的逻辑形态出现在变更中的多个 hunk 或文件中。→ 提取共享形态,从两处调用它。
- **Feature Envy(依恋情结)** — 方法访问另一个对象的数据多于自己的数据。→ 把方法移到它羡慕的数据所在的类上。
- **Data Clumps(数据泥团)** — 同样的几个字段或参数总是结伴而行(一个等待诞生的类型)。→ 把它们打包成一个类型,传递那个类型。
- **Primitive Obsession(基本类型偏执)** — 用基本类型或字符串代替本应拥有自己类型的 domain 概念。→ 给这个概念一个自己的小类型。
- **Repeated Switches(重复的 switch)** — 对同一类型的相同 `switch`/`if` 级联在整个变更中反复出现。→ 用多态替换,或用两处共享的一张 map。
- **Shotgun Surgery(霰弹式修改)** — 一个逻辑变更迫使 diff 中许多文件发生零散的修改。→ 把一起变化的东西集中到一个 module 中。
- **Divergent Change(发散式变化)** — 一个文件或 module 因多个不相关的原因被修改。→ 拆分,让每个 module 只为一个原因变化。
- **Speculative Generality(臆测式泛化)** — 为 spec 并不需要的需求添加的抽象、参数或 hooks。→ 删除它;内联回来,直到真正的需求出现。
- **Message Chains(消息链)** — 长的 `a.b().c().d()` 导航,调用者本不应依赖它。→ 把遍历隐藏在第一个对象的一个方法后面。
- **Middle Man(中间人)** — 一个主要只是向下转发的类或函数。→ 砍掉它,直接调用真正的目标。
- **Refused Bequest(被拒的遗产)** — 一个忽略或重写大部分继承内容的子类或实现者。→ 放弃继承,改用组合。

### 4. 并行启动两个 sub-agents

**Standards sub-agent 提示词** — 包含:

- 完整的 diff 命令和 commit 列表。
- 第 3 步中找到的 standards-source 文件列表,**加上第 3 步的 smell baseline** 完整粘贴 — sub-agent 没有其他途径获取它。
- 任务简报:"报告 — 在相关处按文件/hunk — (a) diff 违反文档化标准的每一处:引用该标准(文件 + 规则);(b) 你发现的任何基线 smell:说出名字并引用该 hunk。区分硬性违规与判断问题 — 违反文档化标准可能是硬性的,但基线 smells 始终是判断问题,且文档化的仓库标准优先于基线。跳过工具已强制检查的内容。400 词以内。"

**Spec sub-agent 提示词** — 包含:

- diff 命令和 commit 列表。
- spec 的路径或获取到的内容。
- 任务简报:"报告:(a) spec 要求但缺失或不完整的需求;(b) diff 中未被要求的行为(scope creep);(c) 看起来已实现但实现方式有误的需求。每个发现都要引用 spec 原文。400 词以内。"

如果 spec 缺失,跳过 Spec sub-agent,并在最终报告中注明。

### 5. 汇总

在 `## Standards` 和 `## Spec` 两个标题下呈现这两份报告,逐字或轻度整理。**不要**合并或重新排序发现 — 两个轴是刻意分开的(见 _为什么是两个轴_)。

最后用一行总结:每个轴的发现总数,以及_每个轴内部_最严重的问题(如有)。不要在轴与轴之间挑一个胜者 — 那种重新排序正是分离要防止的。

## 为什么是两个轴

一个变更可能通过一个轴而败在另一个轴上:

- 遵循所有标准但实现了错误东西的代码 → **Standards 通过,Spec 失败。**
- 完全按 issue 要求实现但破坏了项目约定的代码 → **Spec 通过,Standards 失败。**

分开报告可以防止一个轴掩盖另一个轴。

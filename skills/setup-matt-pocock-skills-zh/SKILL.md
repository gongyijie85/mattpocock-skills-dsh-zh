---
name: setup-matt-pocock-skills-zh
description: 为工程类 skills 配置本仓库——设置它的 issue tracker、triage 标签词汇与领域文档布局。在首次使用其他工程类 skills 之前运行一次。
disable-model-invocation: true
---

# 配置 Matt Pocock 的 Skills

搭建工程类 skills 所依赖的每个仓库的配置：

- **Issue tracker（问题跟踪器）** — issues 存放的地方（默认 GitHub；本地 markdown 也开箱即支持）
- **Triage labels（分流标签）** — 用于五个标准 triage 角色的字符串
- **Domain docs（领域文档）** — `CONTEXT.md` 和 ADRs 存放的位置，以及阅读它们的消费规则

这是一个由 prompt 驱动的 skill，不是确定性的脚本。先探索，呈现你的发现，与用户确认，然后再写入。

## 流程

### 1. 探索

查看当前仓库，了解它的初始状态。读取已有的任何内容；不要臆测：

- `git remote -v` 和 `.git/config` — 这是 GitHub 仓库吗？是哪一个？
- 仓库根目录下的 `AGENTS.md` 和 `CLAUDE.md` — 两者存在吗？其中是否已有 `## Agent skills` 小节？
- 仓库根目录下的 `CONTEXT.md` 和 `CONTEXT-MAP.md`
- `docs/adr/` 以及任何 `src/*/docs/adr/` 目录
- `docs/agents/` — 这个 skill 之前的输出是否已经存在？
- `.scratch/` — 表示本地 markdown issue tracker 约定已在使用的迹象
- `triage` skill 是否已安装？（与当前 skill 并排的 `triage` skill 文件夹，或你的可用 skills 中的 `triage`。）这决定了 B 部分是否执行。
- Monorepo 信号 — `pnpm-workspace.yaml`、`package.json` 中的 `workspaces` 字段，或带有自己的 `src/` 的、内容充实的 `packages/*`。这些只出现在真正大型的多包仓库中；它们的缺失意味着 single-context（单上下文），而几乎每个仓库都是如此。

### 2. 呈现发现并询问

总结哪些已存在、哪些缺失。然后按顺序逐节进行——一节、一个答案，然后下一节。

每节都以推荐答案开头，让用户一句话就能接受。只有当选择确实产生分支时才给一行解释；当探索已经定案时跳过整节（未安装 `triage` 时跳过 B 部分，没有 monorepo 时跳过 C 部分）。

**A 部分 — Issue tracker。**

> 解释：本仓库的「issue tracker」就是 issues 存放的地方。`to-tickets`、`triage` 和 `to-spec` 等 skills 会读写它——它们需要知道是调用 `gh issue create`、在 `.scratch/` 下写 markdown 文件，还是遵循你描述的其他工作流。选择你实际用来跟踪本仓库工作的地方。

默认姿态：这些 skills 是为 GitHub 设计的。如果 `git remote` 指向 GitHub，就提议 GitHub。如果 `git remote` 指向 GitLab（`gitlab.com` 或自托管主机），就提议 GitLab。否则（或用户另有偏好时），提供：

- **GitHub** — issues 存放在仓库的 GitHub Issues 中（使用 `gh` CLI）
- **GitLab** — issues 存放在仓库的 GitLab Issues 中（使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI）
- **Local markdown** — issues 以文件形式存放在本仓库的 `.scratch/<feature>/` 下（适合个人项目或没有 remote 的仓库）
- **Other（其他）**（Jira、Linear 等）— 请用户用一段话描述工作流；skill 会把它记录为自由格式的散文

把选择记录到 `docs/agents/issue-tracker.md`。GitHub 和 GitLab 模板带有一个「PRs as a request surface（将 PR 作为请求入口）」标志，默认**关闭**——保持关闭，不要提起它；希望外部 PR 进入 triage 队列的用户之后可以在文件中自行打开该标志。

**B 部分 — Triage 标签词汇。** 如果 `triage` skill 未安装（探索阶段已得知），完全跳过本节——未安装的 skill 不需要标签。

如果已安装，只问一个问题：

> 你想保留默认的 triage 标签吗？（推荐：**是**）

默认值是五个标准角色，每个标签字符串与其名称相同：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。用户说**是**就原样写入。只有当用户说不——通常是因为他们的 tracker 已经在用其他名称（例如用 `bug:triage` 代替 `needs-triage`）——才收集覆盖项，让 `triage` 应用已有标签而不是创建重复项。

**C 部分 — Domain docs。** 默认为 **single-context（单上下文）**——仓库根目录下一个 `CONTEXT.md` + `docs/adr/`。这几乎适配每个仓库；无需询问直接写入。

只有当探索发现 monorepo 信号时，才提供 **multi-context（多上下文）**——根目录的 `CONTEXT-MAP.md` 指向各个上下文的 `CONTEXT.md` 文件。然后确认他们想要哪种布局。

### 3. 确认与编辑

向用户展示以下内容的草稿：

- 要添加到 `CLAUDE.md` / `AGENTS.md`（视正在编辑哪一个而定）中的 `## Agent skills` 块（选择规则见第 4 步）
- `docs/agents/issue-tracker.md`、`docs/agents/domain.md` 和 `docs/agents/triage-labels.md` 的内容（最后一个仅在安装了 `triage` 时）

写入前先让他们修改。

### 4. 写入

**选择要编辑的文件：**

- 如果 `CLAUDE.md` 存在，编辑它。
- 否则，如果 `AGENTS.md` 存在，编辑它。
- 如果两者都不存在，问用户要创建哪一个——不要替他们选择。

当 `CLAUDE.md` 已存在时绝不创建 `AGENTS.md`（反之亦然）——始终编辑已有的那一个。

如果所选文件中已有 `## Agent skills` 块，就地更新其内容，而不是追加一个重复块。不要覆盖用户对周围小节的编辑。

该块：

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout — "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

只有当 `triage` 已安装且 B 部分执行过时，才包含 `### Triage labels` 子块并写入 `docs/agents/triage-labels.md`。否则两者都省略。

然后以本 skill 文件夹中的种子模板为起点写入文档文件：

- [issue-tracker-github.md](./issue-tracker-github.md) — GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) — GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) — local-markdown issue tracker
- [triage-labels.md](./triage-labels.md) — 标签映射（仅在安装了 `triage` 时）
- [domain.md](./domain.md) — 领域文档消费规则 + 布局

对于「other（其他）」类 issue tracker，使用用户的描述从零编写 `docs/agents/issue-tracker.md`。

### 5. 完成

告诉用户设置已完成，以及哪些工程类 skills 现在会读取这些文件。提醒他们之后可以直接编辑 `docs/agents/*.md`——只有当他们想更换 issue tracker 或从头重来时才需要重新运行此 skill。

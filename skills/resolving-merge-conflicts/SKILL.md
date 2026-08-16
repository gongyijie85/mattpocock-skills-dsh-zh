---
name: resolving-merge-conflicts
description: "当你需要解决进行中的 git merge/rebase 冲突时使用。"
---

1. **查看 merge/rebase 的当前状态**。检查 git 历史与冲突文件。

2. **为每个冲突找到 primary sources（一手来源）**。深入理解每项变更为何产生、原始意图是什么。阅读 commit messages，查看 PRs，查看原始的 issues/tickets。

3. **解决每个 hunk（代码块）**。尽可能保留双方的意图。当意图互不兼容时，选择与 merge 的既定目标一致的那一个，并记下取舍。**不要**凭空发明新行为。始终去解决；绝不 `--abort`。

4. 找出项目的**自动化检查**并运行它们——通常是 typecheck，然后是 tests，最后是 format。修复 merge 破坏的任何东西。

5. **完成 merge/rebase。** 暂存所有内容并提交。如果正在 rebase，继续 rebase 流程，直到所有 commits 都完成 rebase。

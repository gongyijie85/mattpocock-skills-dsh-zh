---
name: to-spec-zh
description: 把当前对话转化为 spec 并发布到项目 issue tracker——不做访谈,只综合你们已经讨论过的内容。
disable-model-invocation: true
---

本技能基于当前对话上下文和对代码库的理解产出一份 spec。不要对用户做访谈——只综合你已经知道的内容。

issue tracker 和 triage 标签词汇表应当已经提供给你。如果没有,告诉用户运行 `setup-matt-pocock-skills`。

## 流程

1. 如果还没有探索过仓库,先探索它以了解代码库的当前状态。在整份 spec 中使用项目的领域词汇表词汇,并尊重你所触及区域的任何 ADR。

2. 勾画出你将在其上测试该功能的 seams(接缝)。已有 seams 应优先于新建 seams。尽可能使用最高的 seam。如果需要新的 seams,在你能达到的最高点提出它们。整个代码库中的 seams 越少越好——理想数量是一个。

与用户确认这些 seams 符合他们的预期。

3. 使用下面的模板编写 spec,然后发布到项目 issue tracker。应用 `ready-for-agent` triage 标签——无需额外 triage。

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>

---
name: handoff
description: 将当前对话压缩成一份 handoff（交接）文档，供另一个 agent 接手。
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

写一份 handoff 文档，总结当前对话，让一个全新的 agent 能够继续这项工作。保存到用户操作系统的临时目录——而不是当前工作区。

在文档中包含一个 "suggested skills" 小节，列出下一个 agent 应调用 skill tool 获取的 skills。

不要重复其他工件中已经记录的内容（specs、plans、ADRs、issues、commits、diffs）。改为通过路径或 URL 引用它们。

对任何敏感信息进行脱敏，例如 API keys、密码或可识别个人身份的信息。

如果用户传入了参数，请将其视为对下一个会话关注点的描述，并据此调整文档内容。

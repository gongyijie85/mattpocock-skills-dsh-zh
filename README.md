# mattpocock-skills-dsh-zh

[![npm version](https://img.shields.io/npm/v/mattpocock-skills-dsh-zh)](https://www.npmjs.com/package/mattpocock-skills-dsh-zh)
[![GitHub release](https://img.shields.io/github/v/release/gongyijie85/mattpocock-skills-dsh-zh)](https://github.com/gongyijie85/mattpocock-skills-dsh-zh/releases)
[![CI](https://github.com/gongyijie85/mattpocock-skills-dsh-zh/actions/workflows/ci.yml/badge.svg)](https://github.com/gongyijie85/mattpocock-skills-dsh-zh/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **English:** Matt Pocock's skills in Chinese for DeepSeek Harness — all 25
> promoted SKILL.md files translated to natural Chinese (technical leading
> words kept in English with first-mention glosses). Install:
> `dsh plugin --profile web add mattpocock-skills-dsh-zh`.

[mattpocock-skills-dsh](https://github.com/gongyijie85/mattpocock-skills-dsh) 的
**中文技能版**:Matt Pocock 完整发布技能集(25 个 SKILL.md)的正文全部译为中文,
适配 **DeepSeek Harness (DSH)** 的 Cordis 插件架构。

> 适合偏好中文提示词的国内用户;关键术语(design tree、frontier、seam、
> tracer-bullet、blocking edges 等)保留英文以保证模型表现,首次出现处附中文注释。
> 英文原版见 [mattpocock-skills-dsh](https://github.com/gongyijie85/mattpocock-skills-dsh);
> 两个包可共存(技能名一致,后装者按注册优先级覆盖,建议二选一)。

## 安装

```sh
dsh plugin --profile web add mattpocock-skills-dsh-zh
# 或 GitHub
dsh plugin --profile web add github:gongyijie85/mattpocock-skills-dsh-zh
```

装完重启 profile(`dsh web`),25 个技能即可用 `skill` 工具加载(`ask-matt`
是路由器入口)。

## 技能列表

与英文版一致(25 个 = 上游 promoted 集):productivity 7(grill-me、grilling、
handoff、teach、to-questionnaire、wait-what、writing-for-agents)+
engineering 18(ask-matt、code-review、codebase-design、diagnosing-bugs、
domain-modeling、grill-with-docs、implement、improve-codebase-architecture、
prototype、research、resolving-merge-conflicts、setup-matt-pocock-skills、
tdd、to-spec、to-tickets、triage、wayfinder、wizard)。

## 移植与翻译说明

- **同步状态**:与英文版同步更新——0.1.1 补译 grilling 轮次 HR 分隔模板与
  wait-what 的 `CONTEXT-MAP.md` 指引(to-tickets 的 wide-refactor 内容初版已含)。
- **正文全译**:25 个 SKILL.md 的正文翻译为自然中文;frontmatter 的 `name`
  保持原样,`description` 译为中文(便于中文触发)。
- **术语策略**:technical leading words 保留英文 + 首次中文注释,避免翻译
  损伤模型对概念的调用。
- **DSH 适配**:与英文版相同——`Skill tool` → `skill tool`;技能名斜杠前缀
  去除;`/clear`、`/compact` 保留。
- **辅助文件**:各技能引用的辅助文件(如 `SKILL-MECHANICS.md`)保持英文原版,
  文件名不变(由 `resourceBase` 解析),未纳入本次翻译范围。

## 工作原理 / 添加技能 / 许可证

同 [mattpocock-skills-dsh](https://github.com/gongyijie85/mattpocock-skills-dsh)
(host 层 `ctx.skills.registerProvider`,`lib/index.js` 零运行时依赖,原生解析
折叠 YAML frontmatter)。MIT;技能内容 © Matt Pocock,中文翻译与 DSH 移植
© mattpocock-skills-dsh-zh contributors。见 [LICENSE](LICENSE)。

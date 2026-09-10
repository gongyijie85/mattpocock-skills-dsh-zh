# Changelog

遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)；版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [0.1.5] - 2026-09-10

### Changed（破坏性：技能名变更）

- **25 个技能名统一加 `-zh` 后缀**（如 `grilling` → `grilling-zh`、`tdd` → `tdd-zh`、`writing-for-agents` → `writing-for-agents-zh`）。
  原因：英文版、中文版与用户级 `~/.agents/skills` 三者技能名完全相同且 rank 相同 → 同名时只有一方能进 catalog，实测**中文版净贡献为 0（中文描述从未进入 catalog）**。加后缀后不再同名，中文技能方可在 catalog 中被加载。
- 同步更新：25 个技能目录名、25 个 `SKILL.md` 的 frontmatter `name`、`dsh.plugin.json` 的 `contributes.skills`、`scripts/verify-provider.mjs` 期望名单、README 说明。
- **升级提示**：此前按旧技能名（无后缀）引用本包技能的用法需改用带 `-zh` 的新名。旧名在同环境下实际被英文版/用户级同名技能遮蔽，通常不存在有效引用。

### Notes

- 本次仅重命名与文档同步，技能正文内容未改动。

## [0.1.4] - 2026-09-10

### Changed

- 新增 `peerDependencies.@deepseek-ai/cordis "^4.0.1"`：显式声明宿主 cordis 契约。
- `dsh.compatibility.dshReleases` 由 17 键补至 20 键：新增 `0.1.5-alpha.2` / `0.1.5-rc.1` / `0.1.5-rc.2`（均 `compatible`），适配 0.1.5 线宿主；`engines.dsh` 维持 `>=0.1.0-rc.6`。
- README 的"支持的 DSH 版本"由 `>=0.1.0-rc.8` 更正为 `>=0.1.0-rc.6`（与 manifest 一致）。

### Notes

- 本文件自 0.1.4 起维护；0.1.0 – 0.1.3 的发布历史见 npm 版本页与 git tag。
- 本包为 [mattpocock-skills-dsh](https://www.npmjs.com/package/mattpocock-skills-dsh) 的中文版（技能正文中文化，技能集合与上游一致）。

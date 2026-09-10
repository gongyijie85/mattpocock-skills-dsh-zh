# Changelog

遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)；版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [0.1.4] - 2026-09-10

### Changed

- 新增 `peerDependencies.@deepseek-ai/cordis "^4.0.1"`：显式声明宿主 cordis 契约。
- `dsh.compatibility.dshReleases` 由 17 键补至 20 键：新增 `0.1.5-alpha.2` / `0.1.5-rc.1` / `0.1.5-rc.2`（均 `compatible`），适配 0.1.5 线宿主；`engines.dsh` 维持 `>=0.1.0-rc.6`。
- README 的"支持的 DSH 版本"由 `>=0.1.0-rc.8` 更正为 `>=0.1.0-rc.6`（与 manifest 一致）。

### Notes

- 本文件自 0.1.4 起维护；0.1.0 – 0.1.3 的发布历史见 npm 版本页与 git tag。
- 本包为 [mattpocock-skills-dsh](https://www.npmjs.com/package/mattpocock-skills-dsh) 的中文版（技能正文中文化，技能集合与上游一致）。

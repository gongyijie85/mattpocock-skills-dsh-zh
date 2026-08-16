---
name: wayfinder
description: 把一个巨大的工作块(超过单个 agent 会话所能承载)规划为 issue tracker 上的一张共享决策 ticket 地图,并逐个解决这些 tickets,直到通往目的地的路线清晰可见。
disable-model-invocation: true
---

一个模糊的想法来了——大到单个 agent 会话装不下,而且包裹在迷雾中:从这里通往 **destination(目的地)** 的路还看不见。Wayfinding(寻路)要做的正是找到这条路,而不是径直冲向目的地。本技能把这条路绘制成仓库 issue tracker 上的一张 **共享地图(shared map)**,然后逐一处理它的 **decision tickets(决策票证)**——这些 ticket 要解决的是决策,而不是待执行构建的切片——直到路线清晰。

destination 因每次 effort 而异,而命名它就是绘图的第一步——它塑造每一张 ticket。它可能是一份要交接并迭代的 spec、一个在规划开始前要锁定的决策,或一个原地进行的改动,比如数据结构迁移。这张地图与领域无关——工程工作、课程内容,任何符合这种形态的东西都行。

## 规划,而不是执行

Wayfinder 默认是 **规划(planning)**:每张 ticket 解决一个决策,当路线清晰时地图就完成了——在某人去执行之前,不再有任何待决策的事项。那种"干脆把活干了"的冲动,通常说明你已到达地图边缘、该交接了。一次 effort 可以在其 **Notes** 中覆盖这一默认——把执行带进地图本身——但除非如此,产出的是决策,而不是交付物。

## 用名称引用

每张地图和 ticket 都是一个 issue,因此都有一个 **名称(name)**——它的标题。在人类阅读的一切内容中——叙述、地图的 Decisions-so-far——都用那个名称引用它,绝不使用裸 id、编号或 slug。一墙的 `#42, #43, #44` 无法阅读;名称一眼可读。id 和 URL 不会消失——名称包裹着它的链接——但它们藏在名称_内部_,绝不替代名称。

## 地图

地图是本仓库 issue tracker 上的单个 issue,标签为 `wayfinder:map`——它是规范产物。它的 tickets 是地图的子 issues。

地图是一个 **index(索引)**,而不是仓库。它列出已做出的决策,并指向承载其细节的 tickets;一个决策恰好只存在于一个地方——它的 ticket——因此地图从不复述它,只摘录要点并加链接。

**地图、它的子 tickets、blocking 和 frontier 查询物理上存放在哪里,取决于 tracker。** issue tracker 应当已经提供给你。如果没有,告诉用户运行 `setup-matt-pocock-skills`。查阅 tracker 文档的 "Wayfinding operations" 一节,了解_本_仓库如何表达它们。如果没有提供 tracker,默认使用 local-markdown tracker。

### 地图正文

整张地图的低分辨率视图,每个会话加载一次。打开的 tickets **不会**列出——它们是打开的子 issues,通过查询发现。

```markdown
## Destination

<what reaching the end of this map looks like — the spec, decision, or change this effort is finding its way to. One or two lines; every session orients to it before choosing a ticket.>

## Notes

<domain; skills every session should consult; standing preferences for this effort>

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [<closed ticket title>](link) — <one-line gist of the answer>

## Not yet specified

<!-- see "Fog of war": in-scope fog you can't ticket yet; graduates as the frontier advances -->

## Out of scope

<!-- see "Out of scope": work ruled beyond the destination; closed, never graduates -->
```

### Tickets

每张 ticket 都是地图的一个 **子 issue(child issue)**;tracker 的 issue id 就是它的身份。它的正文就是问题,大小适合一个 100K token 的 agent 会话:

```markdown
## Question

<the decision or investigation this ticket resolves>
```

每张 ticket 携带一个 `wayfinder:<type>` 标签——`research`、`prototype`、`grilling`、`task` 之一(参见 [Ticket Types](#ticket-types))。

一个会话通过把 ticket 分配(assign)给驱动地图的 dev 来**认领(claim)**它,**先**于任何工作,这样并发会话就会跳过它。那个 assignee _就是_认领:一张打开且未分配的 ticket 就是未被认领的。

Blocking 使用 tracker 的**原生**依赖关系——这很关键,因为它在 tracker 自己的 UI 中以_可视化_方式渲染 frontier,人类不用打开地图就能看到哪些可认领。只有缺少原生 blocking 的 tracker 才退回到正文约定。当所有阻塞它的 tickets 都已关闭时,一张 ticket 就是 **unblocked(未阻塞)的**;**frontier(前沿)** 就是打开的、未阻塞的、未被认领的子 issues——已知世界的边缘。

答案不是正文的一部分——它在解决时被记录(参见 [Work through the map](#work-through-the-map))。解决 ticket 过程中产生的资产从 issue 链接,而不是粘贴进去。

## Ticket Types

每张 ticket 要么是 **HITL**——human in the loop(人在环路中),与一个能为自己发声的人类_共同_推进——要么是 **AFK**,由 agent 独自驱动。HITL ticket 只能通过那种实时交流来解决;agent 绝不代行人类那一侧(一个回答自己问题的 grilling agent 就破坏了这一点)。

- **Research(研究)**(AFK):阅读文档、第三方 API 或本地资源(如知识库),以浮出某个决策所等待的事实。由调用 skill tool 使用 "research" 的 subagent 解决。当需要当前工作目录之外的知识时使用。
- **Prototype(原型)**(HITL):通过制作一个廉价、粗糙、具体的工件来提升讨论的保真度——一个提纲、一个粗略想法、一个桩(stub),或 UI/逻辑代码,通过调用 skill tool 使用 "prototype"。把 prototype 作为资产链接。当关键问题是"它应该长什么样"或"它应该怎么表现"时使用。
- **Grilling(追问)**(HITL):对话。默认情况。总是调用 skill tool 两次,分别使用 "grilling" 和 "domain-modeling"。
- **Task(任务)**(HITL 或 AFK):必须在_决策_做出之前完成的体力活——没有要决策、原型化或研究的东西,但讨论被它阻塞直到完成。注册一个服务以便评判它的 API、开通访问权限、搬移数据以便看清它的形态。这是唯一一个_做_而不是_决定_的类型——它凭解除某个决策的阻塞而赢得位置,而不是凭交付目的地。agent 在自己能完成的地方独自驱动(AFK);否则它把一份精确的检查清单交给人类(HITL)。工作完成时解决;答案记录做了什么,以及后续 tickets 依赖的任何衍生事实(凭据位置、新 URL、行数)。

## 战争迷雾

地图是_有意_不完整的:不要绘制你还看不见的东西。在活跃 tickets 之外是 **战争迷雾(fog of war)**——你隐约知道会来、但还无法钉死的决策和调查的模糊视野,因为它们悬在仍然打开的问题上。解决一张 ticket 会清除它前方的迷雾,把现在可以具体化的东西毕业为新的 tickets——一次一个,直到通往目的地的路线清晰、不再有 tickets 剩下。

地图的 **Not yet specified(尚未明确)** 一节就是写下那个模糊视野的地方:被怀疑的问题、以后要重新审视的区域。它是_朝向_目的地的未发现前沿——这里的一切都在范围内,只是还不够清晰到可以开 ticket。按视野允许的松散或完整程度来写;它同时充当协作者阅读项目走向的路标。

**迷雾还是 ticket?** 判断标准是你现在能否精确陈述这个问题——_而不是_你现在能否回答它。

- **当问题已经清晰时就开 ticket**——即使它被阻塞、你还不能对它采取行动。
- **当你还不能把它表述得那么清晰时,写入 Not yet specified。** 不要把迷雾预先切成 ticket 大小的碎片:它比 ticket 更粗糙,一块迷雾可能毕业为几张 tickets,也可能一张都没有,取决于 frontier 何时到达它。

**Not yet specified** 排除已经决定的(Decisions so far)、已经是活跃 ticket 的,以及超出范围的(下一节)。

## 超出范围(Out of scope)

迷雾只朝_目的地_聚集。目的地固定了范围,因此超出它的工作就是 **out of scope(超出范围)**——它不是迷雾,也不属于 **Not yet specified**。它在地图上拥有自己的 **Out of scope** 一节:你有意识地排除在_本次_ effort 之外的工作。让它落在这里的是范围,而不是清晰度。

超出范围的工作永远不会毕业——frontier 在目的地停下——因此只有目的地被重画时它才会回来,而且是以一次全新的 effort 的形式,而不是恢复。

把某件事划为超出范围是一种划定范围的行为,不是路线上的一个步骤。当一张已经存在的 ticket 结果落在目的地之外时——绘图时误纳入范围,或由某次解决暴露出来——**关闭它**(关闭的 ticket 明确不在 frontier 上),并在 **Out of scope** 一节留下一行:要点加上为什么超出范围,链接那张关闭的 ticket。它不进入 **Decisions so far**,那一节记录的是实际走过的路线——范围边界不是路线上的一个步骤。

## 调用

两种模式。无论哪种,**每个会话绝不解决超过一张 ticket**——research tickets 除外。

### 绘制地图

用户带着一个模糊想法调用。

1. **命名目的地。** 调用 skill tool 两次,分别使用 "grilling" 和 "domain-modeling",钉死这张地图要找到的是什么——spec、决策或改动。目的地固定范围,所以先把它定下来。
2. **绘制前沿。** 再次 grill,这次**广度优先(breadth-first)**:在整个空间上扇出,而不是在任一线索上深挖,浮出打开的决策和现在就能迈出的第一步。**如果没有浮出迷雾**——通往目的地的路已经清晰,整个旅程小到一个会话就能装下——你不需要地图。停下来问用户希望如何进行。
3. **创建地图**(标签 `wayfinder:map`):Destination 和 Notes 填好,Decisions-so-far 为空,迷雾草草写入 **Not yet specified**。
4. **把现在能具体化的 tickets 创建为地图的子 issues**——然后在**第二遍**中接线 blocking edges(issues 需要有 id 之后才能互相引用)。接线把它们分为 frontier 和被阻塞的;一切你还不能具体化的都留在迷雾中——**Not yet specified** 一节。
5. **放出 research subagents。** 对刚创建的每张 `research` ticket,启动一个调用 skill tool 使用 "research" 的 subagent 并行解决它,在一次性 `research/<name>` 分支上捕获发现,并从 ticket 挂一个上下文指针。
6. 停止——绘图是一个会话的工作;它不手工解决任何东西。

### Work through the map

用户带着一张地图(URL 或编号)调用。ticket 是**可选的**——没有它,由你挑选下一个决策,而不是用户。

1. 加载**地图**——低分辨率视图,而不是每张 ticket 的正文。
2. 选择 ticket。如果用户点名了一张,就用它。否则按顺序取第一张 frontier ticket。**认领它**:在任何工作之前把它分配给自己。
3. 解决它——**按需 zoom(放大)**:按需获取任何相关或已关闭 ticket 的完整正文;为 `## Notes` 一节点名的技能调用 skill tool。拿不准时,调用 skill tool 两次,分别使用 "grilling" 和 "domain-modeling"。
4. 记录解决:把答案作为**解决评论(resolution comment)**发布,**关闭**该 issue,并向地图的 Decisions-so-far **追加一个上下文指针**。
5. 添加新浮出的 tickets(先创建后接线);把答案使其可具体化的迷雾毕业,并从 **Not yet specified** 清除每一块已毕业的迷雾,使它只作为新 ticket 存在。如果答案揭示某张 ticket——这张或另一张——落在目的地之外,**把它划为 out of scope**,而不是在路线上解决它。如果决策使地图其它部分失效,更新或删除那些 tickets。

用户可能并行处理未阻塞的 tickets,所以要预期其它会话正在并发编辑 tracker。

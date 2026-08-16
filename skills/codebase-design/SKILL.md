---
name: codebase-design
description: 设计 deep modules(深模块)的共享词汇。当用户想要设计或改进模块的 interface、寻找 deepening(加深)机会、决定 seam 放在哪里、让代码更可测试或更易被 AI 导航,或当其他 skill 需要 deep-module 词汇时使用。
---

# Codebase Design

设计 **deep modules(深模块)**:在干净的 seam 上,用一个小 interface 承载大量行为,并且可以通过这个 interface 进行测试。在任何设计或重构代码的地方,使用这套语言和这些原则。目标是让调用者获得 leverage(杠杆效应)、维护者获得 locality(局部性),所有人都获得可测试性。

## Glossary(词汇表)

精确使用这些术语 — 不要用 "component"、"service"、"API" 或 "boundary" 来替代。一致的语言正是全部意义所在。

**Module(模块)** — 任何拥有 interface 和 implementation 的东西。刻意与规模无关:一个函数、类、包,或跨层级的切片。_避免使用_:unit、component、service。

**Interface(接口)** — 调用者要正确使用模块必须知道的一切:类型签名,还包括不变量、顺序约束、错误模式、所需配置和性能特征。_避免使用_:API、signature(太窄 — 它们只指类型层面的表面)。

**Implementation(实现)** — 模块内部的东西,它的代码主体。与 **Adapter(适配器)** 不同:一个东西可以是小的 adapter 配大的 implementation(一个 Postgres repo),也可以是大的 adapter 配小的 implementation(一个内存中的 fake)。当讨论的主题是 seam 时用 "adapter";否则用 "implementation"。

**Depth(深度)** — interface 处的 leverage:调用者(或测试)每学习一单位 interface 所能驱动的行为量。当大量行为位于小 interface 之后时,模块是 **deep(深的)**;当 interface 几乎和 implementation 一样复杂时,它是 **shallow(浅的)**。

**Seam(接缝)** _(Michael Feathers)_ — 一个无需在该处编辑就能改变行为的地方;模块 interface 所在的*位置*。把 seam 放在哪里本身就是一个设计决策,与放在它后面的是什么不同。_避免使用_:boundary(与 DDD 的 bounded context 一词多义)。

**Adapter(适配器)** — 在 seam 处满足 interface 的具体东西。描述的是*角色*(它填补哪个槽位),而不是实质(里面是什么)。

**Leverage(杠杆效应)** — 调用者从 depth 中得到的东西:每学习一单位 interface 获得更多能力。一份 implementation 在 N 个调用点和 M 个测试中回报。

**Locality(局部性)** — 维护者从 depth 中得到的东西:变更、bug、知识和验证集中在一个地方,而不是分散在调用者之间。修复一次,处处修复。

## 深 vs 浅

**Deep module(深模块)** = 小 interface + 大量 implementation:

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
└─────────────────────┘
```

**Shallow module(浅模块)** = 大 interface + 少量 implementation(避免):

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

设计 interface 时,问自己:

- 我能减少方法的数量吗?
- 我能简化参数吗?
- 我能把更多复杂性藏到里面吗?

## 原则

- **Depth 是 interface 的属性,而不是 implementation 的属性。** 一个 deep module 内部可以由小的、可 mock 的、可替换的部件组成 — 它们只是不属于 interface。模块既可以有 **internal seams(内部接缝)**(implementation 私有,由其自身测试使用),也可以有位于 interface 处的 **external seam(外部接缝)**。
- **删除测试(Deletion test)。** 想象删除这个模块。如果复杂性随之消失,它只是一个 pass-through(传声筒)。如果复杂性在 N 个调用者那里重新出现,它就是在自食其力。
- **Interface 就是测试面。** 调用者和测试穿过同一个 seam。如果你想*越过* interface 测试,这个模块的形状很可能不对。
- **一个 adapter 意味着假想的 seam;两个 adapter 意味着真实的 seam。** 除非有东西真的跨 seam 变化,否则不要引入 seam。

## 为可测试性而设计

好的 interface 让测试变得自然:

1. **接收依赖,不要创建依赖。**

   ```typescript
   // Testable
   function processOrder(order, paymentGateway) {}

   // Hard to test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **返回结果,不要产生副作用。**

   ```typescript
   // Testable
   function calculateDiscount(cart): Discount {}

   // Hard to test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **小的表面积。** 方法越少 = 需要的测试越少。参数越少 = 测试搭建越简单。

## 关系

- 一个 **Module** 恰好有一个 **Interface**(它呈现给调用者和测试的表面)。
- **Depth** 是 **Module** 的属性,针对其 **Interface** 来衡量。
- **Seam** 是 **Module** 的 **Interface** 所在之处。
- **Adapter** 位于 **Seam** 处,满足 **Interface**。
- **Depth** 为调用者产生 **Leverage**,为维护者产生 **Locality**。

## 被否决的框架

- **把 Depth 定义为 implementation 行数与 interface 行数之比**(Ousterhout):这会奖励给 implementation 注水。我们改用 depth-as-leverage(深度即杠杆)。
- **把 "Interface" 理解为 TypeScript 的 `interface` 关键字或类的公共方法**:太窄 — 这里的 interface 包含调用者必须知道的每一个事实。
- **"Boundary"**:与 DDD 的 bounded context 一词多义。请说 **seam** 或 **interface**。

## 进一步深入

- **在已知依赖的情况下加深一个 cluster(集群)** — 见 [DEEPENING.md](DEEPENING.md):依赖类别、seam 纪律,以及 replace-don't-layer(替换而非分层)测试。
- **探索备选的 interface 设计** — 见 [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md):启动并行 sub-agents,以几种截然不同的方式设计 interface,然后在 depth、locality 和 seam 位置上进行对比。

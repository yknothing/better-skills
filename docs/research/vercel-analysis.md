# Vercel 流派深度分析

> 来源：vercel/vercel-plugin (GitHub)
> 代表技能：`nextjs`, `ai-sdk`, `react-best-practices`, `routing-middleware`

---

## 设计哲学

**核心理念**：技能即领域专家——每个技能覆盖一个技术领域（Next.js、AI SDK、React），通过验证规则自动检测代码中的反模式，并通过 `upgradeToSkill` 自动路由到修复方案。技能作为"知识插件"分发，由知识图谱关联。

## 关键创新

### 1. 验证规则 + 自动升级路由

Vercel 技能最独特的创新：`validate` 规则不仅检测反模式，还自动推荐调用哪个技能来修复。

```yaml
validate:
  - pattern: export.*getServerSideProps
    message: 'getServerSideProps is removed in App Router'
    severity: error
    upgradeToSkill: nextjs
    upgradeWhy: 'Guides migration from Pages Router getServerSideProps to App Router server components.'
```

这是一个从"发现问题"到"修复问题"的**闭环**：不是把问题丢给用户，而是给出具体的解决路径。

### 2. 多信号自动触发

技能的触发不依赖单一的 description 字段，而是通过多个信号：

```yaml
metadata:
  pathPatterns:           # 文件路径模式匹配
    - 'next.config.*'
    - 'app/**'
  bashPatterns:           # Shell 命令模式匹配
    - '\bnext\s+(dev|build|start|lint)\b'
    - '\bnpx\s+create-next-app\b'
  promptSignals:          # 对话内容信号匹配
    phrases:
      - "next.js"
      - "app router"
    allOf:                # 必须全部匹配
      - [middleware, next]
      - [layout, route]
    anyOf:                # 任一匹配
      - "pages router"
      - "use server"
    minScore: 6           # 最低分数阈值
```

这种多信号方法比单纯的 description 匹配更**鲁棒**——它可以在 agent 没有显式说"我需要 Next.js 帮助"时就检测到需求。

### 3. 知识图谱关联

Vercel 的技能不是孤立的——它们通过知识图谱关联：

- `nextjs` 技能引用 `routing-middleware` 进行代理迁移
- `ai-sdk` 技能链接到上游文档源
- 技能之间的 `upgradeToSkill` 形成交叉引用网络

这使得 Vercel 的插件更像是一个**互联的知识网络**，而非一个扁平的技能列表。

### 4. 上游文档同步

每个领域技能都有 `upstream/` 子目录，包含从官方文档同步的最新信息：

```
skills/nextjs/
├── SKILL.md              # 核心技能
└── upstream/
    └── SKILL.md          # 上游文档的最新信息
```

这解决了技能文档过时的问题——通过自动化同步保持技能与官方文档一致。

### 5. 反直觉设计决策

#### 验证规则的 skipIfFileContains

不是所有匹配都是问题。Vercel 的验证规则可以指定 `skipIfFileContains`：

```yaml
- pattern: (useState|useEffect)
  message: 'React hooks require "use client" directive'
  severity: warn
  skipIfFileContains: "^['\"]use client['\"]"
```

如果文件已经包含 `"use client"` 指令，则跳过警告。这避免了误报。

#### "recommended" 严重级别

不是只有 error/warn，还有 `recommended` 级别——表示"你应该考虑这样做，但不是阻塞性的"。

```yaml
- pattern: revalidateTag\(\s*['"][^'"]+['"]\s*\)
  message: 'Single-arg revalidateTag(tag) is deprecated in Next.js 16'
  severity: recommended
  upgradeToSkill: nextjs
```

### 6. 与 Anthropic/Cursor 的对比

| 维度 | Vercel | Anthropic | Cursor |
|------|--------|-----------|--------|
| 技能粒度 | 领域级——一个技能覆盖一个技术栈 | 流程级——一个技能覆盖一个工作流 | 原子级——一个操作 |
| 触发机制 | 多信号（路径+命令+对话） | description 匹配 | description 匹配 |
| 质量保证 | 验证规则 + upgradeToSkill | 反模式命名 + 门禁 | 硬规则 |
| 知识更新 | 上游文档同步 | 手动更新 | 手动更新 |
| 技能间关联 | 知识图谱 | 技能链（brainstorm→plan→work） | 调用关系 |
| 适用场景 | 技术栈/平台知识 | 通用工作流 | 具体操作 |

## 可复用技术

| 技术 | 描述 | 适用场景 |
|------|------|---------|
| 验证规则 + upgradeToSkill | 检测反模式并自动推荐修复路径 | 领域知识类技能 |
| 多信号触发 | 通过路径/命令/对话多个信号检测技能需求 | 需要精确触发的技能 |
| skipIfFileContains | 验证规则的精确例外控制 | 验证规则系统 |
| recommended 严重级别 | error/warn 之外的"建议"级别 | 渐进式代码改进 |
| 上游文档同步 | 从官方文档自动同步最新信息 | 依赖外部文档的技能 |
| 知识图谱关联 | 技能之间的结构化交叉引用 | 多技能生态系统 |

## 设计特征总结

| 维度 | 评价 |
|------|------|
| 技能粒度 | 领域级——一个技能覆盖一个技术栈 |
| 指令精确度 | 验证规则驱动 + 多信号触发 |
| 错误预防 | 验证规则 + skipIfFileContains 防止误报 |
| 上下文效率 | 紧凑——平均 100-200 行 |
| 平台依赖 | 依赖验证引擎和多信号触发系统 |
| 维护成本 | 中——需要维护验证规则和上游文档同步 |
| 适用场景 | 技术栈/平台知识，代码迁移和升级 |

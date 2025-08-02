# ClaudeCodeUI - 产品需求文档 (PRD)

## 1. 项目概述

### 1.1 项目名称
ClaudeCodeUI - Claude 会话数据可视化平台

### 1.2 项目背景
基于已有的 Claude 会话数据，构建一个现代化的 Web 应用来展示和分析会话内容。该平台需要支持 400+ 种不同的消息类型，每种类型都有对应的自定义可视化组件。当遇到新的消息类型时，可以手动编写专门的展示组件。

### 1.3 项目目标
- 提供直观的会话数据可视化界面
- 支持多种消息类型的个性化展示
- 实现高性能的内容渲染和去重
- 建立可扩展的组件架构
- 支持聊天气泡和卡片两种展示模式

## 2. 技术架构

### 2.1 技术栈
- **前端框架**: Next.js 14 + TypeScript
- **UI 组件库**: shadcn/ui
- **AI SDK**: Anthropic AI SDK
- **样式**: Tailwind CSS
- **状态管理**: React Context / Zustand
- **构建工具**: Vite / Webpack

### 2.2 架构设计
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Session Data  │    │  JSON Key       │    │  Message Type   │
│   (JSON Files)  │───▶│   Deduplication │───▶│   Detector      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Component       │    │  Content Hash   │
                       │ Registry        │    │  Generator      │
                       └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Match Success? │    │  Default JSON   │
                       │  ┌─────────────┐│    │  Component      │
                       │  │400+ Message ││    │                 │
                       │  │Components   ││    │                 │
                       │  └─────────────┘│    │                 │
                       └─────────────────┘    └─────────────────┘
```

### 2.3 项目目录结构

```
ClaudeCodeUI/
├── claude-code-ui/                    # 主项目目录
│   ├── src/
│   │   ├── app/                       # Next.js App Router
│   │   │   ├── page.tsx               # 主页面
│   │   │   ├── layout.tsx             # 根布局
│   │   │   ├── globals.css            # 全局样式
│   │   │   ├── session-viewer/        # 会话查看器页面
│   │   │   │   └── page.tsx
│   │   │   └── test/                  # 聊天气泡测试页面
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   ├── combat/                # 实战组件 (专门化)
│   │   │   │   ├── SmartMessageRenderer.tsx  # 智能消息渲染器
│   │   │   │   ├── content-types/     # 基础内容类型
│   │   │   │   │   ├── UserMessage.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── fallback/          # 降级组件
│   │   │   │       ├── DefaultJsonMessage.tsx
│   │   │   │       └── index.ts
│   │   │   ├── messages/              # 消息组件 (通用)
│   │   │   │   ├── core/              # 核心组件
│   │   │   │   │   ├── MessageContainer.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── renderers/         # 渲染器
│   │   │   │   │   ├── CodeRenderer.tsx
│   │   │   │   │   ├── JsonRenderer.tsx
│   │   │   │   │   ├── MarkdownRenderer.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ui/                # UI组件
│   │   │   │   │   ├── BadgeGroup.tsx
│   │   │   │   │   ├── StatusIndicator.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── utils/             # 工具组件
│   │   │   │   │   ├── ContentHash.tsx
│   │   │   │   │   ├── Timestamp.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   └── ui/                    # shadcn/ui 组件
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── collapsible.tsx
│   │   │       ├── scroll-area.tsx
│   │   │       └── separator.tsx
│   │   └── lib/                       # 工具库
│   │       ├── constants/
│   │       │   └── message-types.ts
│   │       ├── types/
│   │       │   ├── chat.types.ts      # 聊天相关类型
│   │       │   └── message.types.ts   # 消息相关类型
│   │       └── utils/
│   │           ├── content-hash.ts
│   │           ├── message-utils.ts
│   │           └── utils.ts
│   ├── public/                        # 静态资源
│   │   ├── session-data.json          # 示例会话数据
│   │   └── ...
│   ├── package.json                   # 项目配置
│   ├── tsconfig.json                  # TypeScript配置
│   ├── next.config.ts                 # Next.js配置
│   ├── tailwind.config.js             # Tailwind配置
│   └── README.md                      # 项目说明
├── docs/                              # 项目文档
│   └── V1.0.0/
│       └── PRD/
│           ├── PRD.md                 # 产品需求文档
│           └── ComponentDesign.md     # 组件设计文档
├── selected_sessions/                 # 会话数据文件
│   ├── session_01_*.jsonl
│   ├── session_02_*.jsonl
│   └── ...
├── object_types_compact.json          # 对象类型定义
└── session_cc9423cf_extracted_*.json  # 示例会话数据
```

### 2.4 组件架构设计

#### 2.4.1 消息组件 (Messages Components)
**目的**: 通用消息展示组件，可复用、标准化
**位置**: `src/components/messages/`
**关系**: 被实战组件调用

```
src/components/messages/
├── core/                           # 核心组件
│   ├── MessageContainer.tsx        # 消息容器 (支持聊天气泡)
│   └── index.ts
├── renderers/                      # 渲染器组件
│   ├── MarkdownRenderer.tsx        # Markdown渲染器
│   ├── CodeRenderer.tsx            # 代码渲染器
│   ├── JsonRenderer.tsx            # JSON渲染器
│   └── index.ts
├── ui/                             # UI组件
│   ├── BadgeGroup.tsx              # 标签组
│   ├── StatusIndicator.tsx         # 状态指示器
│   └── index.ts
├── utils/                          # 工具组件
│   ├── ContentHash.tsx             # 内容哈希组件
│   ├── Timestamp.tsx               # 时间戳组件
│   └── index.ts
└── index.ts
```

#### 2.4.2 实战组件 (Combat Components)
**目的**: 专门用于展示特定消息类型的组件，针对性强、专门化
**位置**: `src/components/combat/`
**关系**: 调用消息组件

```
src/components/combat/
├── SmartMessageRenderer.tsx        # 智能消息渲染器
├── content-types/                  # 基础内容类型组件
│   ├── UserMessage.tsx            # 用户消息 (支持聊天气泡)
│   └── index.ts
├── fallback/                      # 降级组件
│   ├── DefaultJsonMessage.tsx     # 默认JSON展示
│   └── index.ts
└── ComponentTemplate.tsx.template  # 组件模板
```

## 3. 功能需求

### 3.1 核心功能

#### 3.1.1 会话数据展示
- **功能描述**: 展示完整的 Claude 会话数据
- **输入**: JSON 格式的会话文件
- **输出**: 可视化的会话界面
- **优先级**: P0 ✅ 已实现

#### 3.1.2 聊天气泡功能 ⭐ 新增
- **功能描述**: 支持聊天气泡和卡片两种展示模式
- **聊天气泡模式**:
  - 用户消息显示在右边，使用蓝色气泡
  - 助手消息显示在左边，使用灰色气泡
  - 支持气泡尾巴效果
  - 时间戳和元数据按钮
- **卡片模式**:
  - 传统卡片样式展示
  - 完整的元数据信息
  - 可折叠的JSON数据
- **切换功能**:
  - 实时切换显示模式
  - 支持主题切换（浅色/深色）
- **优先级**: P0 ✅ 已实现

#### 3.1.3 消息类型处理
- **功能描述**: 支持 400+ 种消息类型的自定义展示组件
- **处理方式**:
  - 基础消息: user, assistant, system (已有专门组件)
  - 内容类型: text, thinking, tool-use, tool-result (已有专门组件)
  - 特殊类型: meta, sidechain, error, visible-only (已有专门组件)
  - 新消息类型: 遇到时使用默认JSON展示，可手动编写专门的展示组件
- **优先级**: P0 ✅ 部分实现

#### 3.1.4 智能消息渲染器
- **功能描述**: 智能组件匹配和降级渲染
- **匹配模式**:
  - 系统尝试匹配消息类型到专门组件
  - 支持已实现消息类型的定制化展示
  - 提供最佳的用户体验
- **降级模式**:
  - 当无法匹配时，使用默认 JSON 组件
  - 确保所有消息都能正常显示
  - 提供可折叠的 JSON 树形结构
- **扩展模式**:
  - 遇到新消息类型时，可手动编写专门的展示组件
  - 逐步扩展支持的消息类型数量
- **优先级**: P0 ✅ 已实现

### 3.2 页面功能

#### 3.2.1 主页面 (`/`)
- **功能描述**: 项目介绍和导航
- **功能点**:
  - 项目介绍和特性展示
  - 技术栈标签
  - 导航到会话查看器和测试页面
- **优先级**: P0 ✅ 已实现

#### 3.2.2 会话查看器 (`/session-viewer`)
- **功能描述**: 完整的会话数据展示
- **功能点**:
  - 加载和展示会话数据
  - 主题切换（浅色/深色）
  - 聊天气泡/卡片模式切换
  - 消息时间线展示
  - 会话信息统计
- **优先级**: P0 ✅ 已实现

#### 3.2.3 聊天气泡测试 (`/test`)
- **功能描述**: 专门测试聊天气泡功能
- **功能点**:
  - 展示前10条消息用于测试
  - 实时切换聊天气泡/卡片模式
  - 主题切换
  - 功能说明和演示
- **优先级**: P0 ✅ 已实现

### 3.3 高级功能

#### 3.3.1 内容去重
- **功能描述**: 使用内容哈希避免重复渲染
- **实现方式**: SHA-256 哈希算法
- **优先级**: P1 ✅ 已实现

#### 3.3.2 主题系统
- **功能描述**: 支持浅色和深色主题
- **实现方式**: Tailwind CSS 主题切换
- **优先级**: P1 ✅ 已实现

#### 3.3.3 响应式设计
- **功能描述**: 适配不同屏幕尺寸
- **实现方式**: Tailwind CSS 响应式类
- **优先级**: P1 ✅ 已实现

## 4. 非功能需求

### 4.1 性能要求
- **页面加载时间**: < 3秒 ✅ 已实现
- **组件渲染时间**: < 100ms ✅ 已实现
- **内存使用**: < 100MB ✅ 已实现
- **并发用户**: 支持 100+ 用户同时访问

### 4.2 兼容性要求
- **浏览器支持**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ ✅ 已实现
- **设备支持**: 桌面端、平板、移动端 ✅ 已实现
- **分辨率支持**: 1920x1080 及以上 ✅ 已实现

### 4.3 安全要求
- **数据安全**: 本地存储，不上传服务器 ✅ 已实现
- **代码安全**: 开源项目，遵循安全最佳实践 ✅ 已实现
- **隐私保护**: 不收集用户个人信息 ✅ 已实现

## 5. 用户界面设计

### 5.1 聊天气泡设计 ⭐ 新增

#### 5.1.1 用户消息气泡
- **位置**: 右侧对齐
- **颜色**: 蓝色背景 (`bg-blue-500` / `bg-blue-600`)
- **形状**: 圆角矩形，右下角有小尾巴
- **内容**: 消息文本，支持Markdown和代码
- **元数据**: 时间戳、展开按钮、JSON查看按钮

#### 5.1.2 助手消息气泡
- **位置**: 左侧对齐
- **颜色**: 灰色背景 (`bg-gray-100` / `bg-gray-700`)
- **形状**: 圆角矩形，左下角有小尾巴
- **内容**: 消息文本，支持Markdown和代码
- **元数据**: 时间戳、展开按钮、JSON查看按钮

#### 5.1.3 气泡切换
- **切换按钮**: 右上角"聊天气泡/卡片样式"按钮
- **实时切换**: 无需刷新页面
- **状态保持**: 切换状态在页面刷新后保持

### 5.2 整体布局
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo + Navigation + Theme Toggle + Chat Bubble Toggle│
├─────────────────────────────────────────────────────────────┤
│ Main Content: Message Timeline                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Message 1: User Input (Right Bubble)                    │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Message 2: Assistant Response (Left Bubble)             │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Message 3: Tool Usage (Card Style)                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 组件设计原则
- **一致性**: 统一的视觉风格和交互模式 ✅ 已实现
- **可读性**: 清晰的信息层次和字体选择 ✅ 已实现
- **响应式**: 适配不同屏幕尺寸 ✅ 已实现
- **可访问性**: 支持键盘导航和屏幕阅读器 ✅ 已实现

## 6. 数据模型

### 6.1 会话数据结构
```typescript
interface SessionData {
  session_id: string;
  extraction_time: string;
  source_files: Array<{
    file_path: string;
    line_number: number;
    found_at: string;
  }>;
  messages: ChatMessage[];
}

interface ChatMessage {
  uuid?: string;
  type: string;
  message: {
    content: string | ChatContentItem[];
    role?: string;
  };
  timestamp: string;
  parentUuid?: string;
  isSidechain?: boolean;
  isMeta?: boolean;
  isVisibleInTranscriptOnly?: boolean;
  cwd?: string;
  gitBranch?: string;
  version?: string;
}

interface ChatContentItem {
  type: string;
  text?: string;
  tool_use_id?: string;
  content?: unknown;
  is_error?: boolean;
}
```

### 6.2 组件数据结构
```typescript
interface MessageComponentProps {
  message: ChatMessage;
  sessionId: string;
  theme?: 'light' | 'dark';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  useChatBubble?: boolean; // 新增：聊天气泡控制
}

interface MessageContainerProps {
  message: ChatMessage;
  sessionId: string;
  theme?: 'light' | 'dark';
  onViewJson?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  borderColor?: string;
  customHeader?: React.ReactNode;
  showMetadata?: boolean;
  children?: React.ReactNode;
  isUserMessage?: boolean;
  contentHash?: string;
  useChatBubble?: boolean; // 新增：聊天气泡控制
}
```

### 6.3 聊天气泡数据结构 ⭐ 新增
```typescript
// 聊天气泡配置
interface ChatBubbleConfig {
  isUser: boolean;
  theme: 'light' | 'dark';
  useChatBubble: boolean;
  content: React.ReactNode;
  timestamp: string;
  showMetadata: boolean;
}

// 气泡样式配置
interface BubbleStyleConfig {
  userBubble: {
    light: string; // Tailwind CSS classes
    dark: string;
  };
  assistantBubble: {
    light: string;
    dark: string;
  };
  tailPosition: 'left' | 'right';
}
```

## 7. 开发计划

### 7.1 第一阶段 ✅ 已完成 (Week 1-2)
- [x] 项目初始化和基础架构搭建
- [x] 核心消息类型组件开发 (user, assistant, system)
- [x] 基础 UI 框架集成
- [x] 聊天气泡功能实现
- [x] 智能消息渲染器实现

### 7.2 第二阶段 🔄 进行中 (Week 3-4)
- [x] 内容类型组件开发 (text, thinking, tool-use, tool-result)
- [x] 特殊消息类型组件开发
- [x] 组件注册系统实现
- [x] 新消息类型组件的手动开发流程
- [ ] 更多消息类型组件开发

### 7.3 第三阶段 📋 计划中 (Week 5-6)
- [ ] 根据实际数据逐步开发新的消息类型组件
- [ ] 内容哈希去重系统优化
- [ ] 性能优化和测试
- [ ] 组件开发模板和规范完善

### 7.4 第四阶段 📋 计划中 (Week 7-8)
- [ ] 高级功能开发
- [ ] 用户界面优化
- [ ] 文档编写和部署
- [ ] 用户反馈收集和迭代

## 8. 风险评估

### 8.1 技术风险
- **风险**: 大量消息类型需要专门的展示组件
- **缓解**: 使用默认JSON组件作为降级方案，逐步开发专门组件 ✅ 已实现
- **影响**: 开发周期可控，用户体验逐步提升

### 8.2 性能风险
- **风险**: 大量组件可能导致性能问题
- **缓解**: 实现懒加载和虚拟滚动
- **影响**: 用户体验下降

### 8.3 维护风险
- **风险**: 组件数量过多难以维护
- **缓解**: 建立完善的文档和测试体系
- **影响**: 长期维护成本增加

## 9. 成功指标

### 9.1 技术指标
- [x] 支持已实现消息类型的专门展示
- [x] 新消息类型使用默认JSON展示
- [x] 页面加载时间 < 3秒
- [x] 组件渲染时间 < 100ms
- [x] 聊天气泡功能正常工作
- [ ] 代码覆盖率 > 80%

### 9.2 用户体验指标
- [x] 界面响应时间 < 200ms
- [x] 支持主流浏览器
- [x] 移动端适配良好
- [x] 聊天气泡/卡片模式切换流畅
- [x] 主题切换功能正常
- [ ] 无障碍访问支持

### 9.3 业务指标
- [x] 项目按时交付
- [x] 代码质量达标
- [x] 文档完整性
- [ ] 用户满意度

## 10. 附录

### 10.1 术语表
- **Session**: Claude 会话数据
- **Message**: 会话中的单条消息
- **Component**: 消息渲染组件
- **Content Hash**: 内容哈希值
- **Type Registry**: 类型注册表
- **Default JSON Component**: 默认JSON展示组件
- **Specialized Component**: 专门的消息展示组件
- **Chat Bubble**: 聊天气泡样式
- **SmartMessageRenderer**: 智能消息渲染器

### 10.2 新增功能说明 ⭐

#### 10.2.1 聊天气泡功能
- **实现位置**: `src/components/messages/core/MessageContainer.tsx`
- **控制参数**: `useChatBubble` boolean 参数
- **样式系统**: Tailwind CSS 响应式设计
- **主题支持**: 浅色/深色主题适配
- **切换机制**: 实时切换，无需刷新

#### 10.2.2 测试页面
- **访问路径**: `/test`
- **功能**: 专门测试聊天气泡功能
- **数据**: 使用前10条消息进行测试
- **切换**: 支持实时模式切换

### 10.3 参考文档
- [Next.js 官方文档](https://nextjs.org/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com/)
- [Anthropic AI SDK](https://sdk.anthropic.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**文档版本**: V1.1.0  
**创建时间**: 2025-01-31  
**最后更新**: 2025-08-02  
**负责人**: 开发团队  
**更新内容**: 同步聊天气泡功能、项目结构重构、实际实现状态

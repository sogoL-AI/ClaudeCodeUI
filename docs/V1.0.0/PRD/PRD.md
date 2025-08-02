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

### 2.3 组件目录结构设计

#### 2.3.1 公共组件 (Public Components)
**目的**: 为了以后实现具体会话调用的通用组件，可复用、标准化
**位置**: `src/components/public/`
**关系**: 被实战组件调用

```
src/components/public/
├── core/                           # 核心公共组件
│   ├── MessageContainer.tsx        # 消息容器 (基础包装)
│   ├── MessageHeader.tsx           # 消息头部 (时间、类型等)
│   ├── MessageFooter.tsx           # 消息底部 (元数据等)
│   └── index.ts
│
├── renderers/                      # 渲染器组件
│   ├── MarkdownRenderer.tsx        # Markdown渲染器
│   ├── CodeRenderer.tsx            # 代码渲染器
│   ├── JsonRenderer.tsx            # JSON渲染器
│   ├── ImageRenderer.tsx           # 图片渲染器
│   └── index.ts
│
├── ui/                             # UI组件
│   ├── BadgeGroup.tsx              # 标签组
│   ├── IconGroup.tsx               # 图标组
│   ├── StatusIndicator.tsx         # 状态指示器
│   ├── ProgressBar.tsx             # 进度条
│   └── index.ts
│
├── layouts/                        # 布局组件
│   ├── CardLayout.tsx              # 卡片布局
│   ├── ListLayout.tsx              # 列表布局
│   ├── GridLayout.tsx              # 网格布局
│   └── index.ts
│
└── utils/                          # 工具组件
    ├── ContentHash.tsx             # 内容哈希组件
    ├── Timestamp.tsx               # 时间戳组件
    ├── FilePath.tsx                # 文件路径组件
    └── index.ts
```

#### 2.3.2 实战组件 (Combat Components)
**目的**: 专门用于展示特定消息类型的组件，针对性强、专门化
**位置**: `src/components/combat/`
**关系**: 调用公共组件

```
src/components/combat/
├── content-types/                  # 基础内容类型组件
│   ├── UserMessage.tsx            # 用户消息
│   ├── AssistantMessage.tsx       # 助手消息
│   ├── SystemMessage.tsx          # 系统消息
│   └── index.ts
│
├── tools/                         # 工具相关组件 (100+ 组件)
│   ├── tool-use/                  # 工具调用
│   │   ├── TaskToolUse.tsx        # Task工具调用
│   │   ├── FileToolUse.tsx        # 文件工具调用
│   │   ├── WebToolUse.tsx         # 网页工具调用
│   │   └── index.ts
│   ├── tool-result/               # 工具结果
│   │   ├── TaskToolResult.tsx     # Task工具结果
│   │   ├── FileToolResult.tsx     # 文件工具结果
│   │   ├── WebToolResult.tsx      # 网页工具结果
│   │   └── index.ts
│   ├── tool-error/                # 工具错误
│   │   ├── TaskToolError.tsx      # Task工具错误
│   │   ├── FileToolError.tsx      # 文件工具错误
│   │   └── index.ts
│   └── index.ts
│
├── subagent/                      # 子代理相关组件 (50+ 组件)
│   ├── subagent-message/          # 子代理消息
│   │   ├── GeneralPurposeAgent.tsx # 通用代理
│   │   ├── CodeAgent.tsx          # 代码代理
│   │   ├── ResearchAgent.tsx      # 研究代理
│   │   └── index.ts
│   ├── subagent-result/           # 子代理结果
│   │   ├── GeneralPurposeResult.tsx
│   │   ├── CodeAgentResult.tsx
│   │   └── index.ts
│   └── index.ts
│
├── commands/                      # 命令相关组件 (30+ 组件)
│   ├── local-command/             # 本地命令
│   │   ├── FileCommand.tsx        # 文件操作命令
│   │   ├── GitCommand.tsx         # Git命令
│   │   ├── SystemCommand.tsx      # 系统命令
│   │   └── index.ts
│   ├── command-output/            # 命令输出
│   │   ├── StdoutMessage.tsx      # 标准输出
│   │   ├── StderrMessage.tsx      # 错误输出
│   │   └── index.ts
│   └── index.ts
│
├── files/                         # 文件相关组件 (40+ 组件)
│   ├── file-operations/           # 文件操作
│   │   ├── FileRead.tsx           # 文件读取
│   │   ├── FileWrite.tsx          # 文件写入
│   │   ├── FileDelete.tsx         # 文件删除
│   │   └── index.ts
│   ├── file-content/              # 文件内容
│   │   ├── CodeFile.tsx           # 代码文件
│   │   ├── TextFile.tsx           # 文本文件
│   │   ├── ImageFile.tsx          # 图片文件
│   │   └── index.ts
│   └── index.ts
│
├── agents/                        # 代理相关组件 (20+ 组件)
│   ├── agent-management/          # 代理管理
│   │   ├── AgentCreate.tsx        # 创建代理
│   │   ├── AgentList.tsx          # 代理列表
│   │   ├── AgentDelete.tsx        # 删除代理
│   │   └── index.ts
│   ├── agent-chat/                # 代理聊天
│   │   ├── CoolPersonaAgent.tsx   # 酷炫个性代理
│   │   ├── CharismaticAgent.tsx   # 魅力代理
│   │   └── index.ts
│   └── index.ts
│
├── thinking/                      # 思考相关组件 (10+ 组件)
│   ├── thinking-content/          # 思考内容
│   │   ├── UltraThink.tsx         # Ultra思考
│   │   ├── NormalThink.tsx        # 普通思考
│   │   └── index.ts
│   └── index.ts
│
├── meta/                          # 元数据组件 (20+ 组件)
│   ├── session-meta/              # 会话元数据
│   │   ├── SessionStart.tsx       # 会话开始
│   │   ├── SessionEnd.tsx         # 会话结束
│   │   ├── SessionHook.tsx        # 会话钩子
│   │   └── index.ts
│   ├── system-meta/               # 系统元数据
│   │   ├── SystemEvent.tsx        # 系统事件
│   │   ├── SystemNotification.tsx # 系统通知
│   │   └── index.ts
│   └── index.ts
│
├── specialized/                   # 特殊组件 (30+ 组件)
│   ├── sidechain/                 # 侧链消息
│   │   ├── SidechainUser.tsx      # 侧链用户
│   │   ├── SidechainAssistant.tsx # 侧链助手
│   │   └── index.ts
│   ├── error/                     # 错误消息
│   │   ├── ToolError.tsx          # 工具错误
│   │   ├── SystemError.tsx        # 系统错误
│   │   └── index.ts
│   └── index.ts
│
├── fallback/                      # 降级组件
│   ├── DefaultJsonMessage.tsx     # 默认JSON展示
│   ├── UnknownMessage.tsx         # 未知消息类型
│   └── index.ts
│
└── SmartMessageRenderer.tsx       # 智能消息渲染器
```

**处理流程：**
1. **Session Data** → 读取 JSON 会话数据
2. **JSON Key Deduplication** → 使用 uuid/key 进行去重
3. **Message Type Detector** → 根据消息结构识别类型
4. **Component Registry** → 尝试匹配对应组件
5. **Match Success?** → 判断是否匹配成功
   - **成功** → 使用专门的 400+ 消息组件
   - **失败** → 使用默认的 JSON 展示组件
6. **Content Hash Generator** → 生成内容哈希用于缓存
7. **Component Rendering** → 渲染选定的组件

## 3. 功能需求

### 3.1 核心功能

#### 3.1.1 会话数据展示
- **功能描述**: 展示完整的 Claude 会话数据
- **输入**: JSON 格式的会话文件
- **输出**: 可视化的会话界面
- **优先级**: P0

#### 3.1.2 消息类型处理
- **功能描述**: 支持 400+ 种消息类型的自定义展示组件
- **处理方式**:
  - 基础消息: user, assistant, system (已有专门组件)
  - 内容类型: text, thinking, tool-use, tool-result (已有专门组件)
  - 特殊类型: meta, sidechain, error, visible-only (已有专门组件)
  - 新消息类型: 遇到时使用默认JSON展示，可手动编写专门的展示组件
- **优先级**: P0

#### 3.1.3 组件化渲染
- **功能描述**: 支持两种渲染模式
- **模式一 - 匹配成功**:
  - 每种消息类型对应专门的组件
  - 已实现的定制化组件
  - 优化的用户体验
- **模式二 - 匹配失败**:
  - 使用默认的 JSON 展示组件
  - 直接展示原始 JSON 数据
  - 确保所有消息都能显示
- **组件特性**:
  - 独立文件结构
  - TypeScript 类型安全
  - 响应式设计
  - 可复用性
- **扩展方式**:
  - 遇到新消息类型时，可手动编写专门的展示组件
  - 逐步积累 400+ 种消息类型的专门组件
- **优先级**: P0

### 3.2 渲染模式

#### 3.2.1 双模式渲染系统
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
- **优先级**: P0

### 3.3 高级功能

#### 3.3.1 内容去重
- **功能描述**: 使用内容哈希避免重复渲染
- **实现方式**: SHA-256 哈希算法
- **优先级**: P1

#### 3.2.2 会话管理
- **功能描述**: 支持多个会话的切换和管理
- **功能点**:
  - 会话列表
  - 会话搜索
  - 会话标签
- **优先级**: P1

#### 3.2.3 数据导出
- **功能描述**: 支持会话数据的多种格式导出
- **支持格式**: JSON, CSV, PDF
- **优先级**: P2

## 4. 非功能需求

### 4.1 性能要求
- **页面加载时间**: < 3秒
- **组件渲染时间**: < 100ms
- **内存使用**: < 100MB
- **并发用户**: 支持 100+ 用户同时访问

### 4.2 兼容性要求
- **浏览器支持**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **设备支持**: 桌面端、平板、移动端
- **分辨率支持**: 1920x1080 及以上

### 4.3 安全要求
- **数据安全**: 本地存储，不上传服务器
- **代码安全**: 开源项目，遵循安全最佳实践
- **隐私保护**: 不收集用户个人信息

## 5. 用户界面设计

### 5.1 整体布局
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo + Navigation + Settings                        │
├─────────────────────────────────────────────────────────────┤
│ Sidebar: Session List + Search + Filters                   │
├─────────────────────────────────────────────────────────────┤
│ Main Content: Message Timeline                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Message 1: User Input                                    │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Message 2: Assistant Response                            │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Message 3: Tool Usage                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 组件设计原则
- **一致性**: 统一的视觉风格和交互模式
- **可读性**: 清晰的信息层次和字体选择
- **响应式**: 适配不同屏幕尺寸
- **可访问性**: 支持键盘导航和屏幕阅读器

## 6. 数据模型

### 6.1 会话数据结构
```typescript
interface Session {
  session_id: string;
  extraction_time: string;
  source_files: SourceFile[];
  messages: Message[];
}

interface Message {
  uuid: string;
  type: string;
  message: any;
  timestamp: string;
  parentUuid?: string;
  isSidechain?: boolean;
  userType?: string;
  // ... 其他字段
}
```

### 6.2 组件数据结构
```typescript
interface MessageComponent {
  type: string;
  component: React.ComponentType<MessageComponentProps>;
  priority: number;
  metadata: ComponentMetadata;
}

interface MessageComponentProps {
  message: Message;
  sessionId: string;
  contentHash: string;
}

// 默认 JSON 组件
interface DefaultJsonComponentProps {
  message: Message;
  sessionId: string;
  contentHash: string;
  isCollapsible?: boolean;
}

// 组件匹配结果
interface ComponentMatchResult {
  success: boolean;
  component?: React.ComponentType<MessageComponentProps>;
  fallbackComponent: React.ComponentType<DefaultJsonComponentProps>;
}
```

### 6.3 组件开发规范

#### 6.3.1 组件命名规范
- **文件命名**: `PascalCase.tsx` (如: `TaskToolUse.tsx`)
- **组件命名**: `PascalCase` (如: `TaskToolUse`)
- **目录命名**: `kebab-case` (如: `tool-use/`)

#### 6.3.2 组件目录分类
- **tools/**: 工具相关组件 (100+ 组件)
  - `tool-use/`: 工具调用组件
  - `tool-result/`: 工具结果组件
  - `tool-error/`: 工具错误组件
- **subagent/**: 子代理相关组件 (50+ 组件)
  - `subagent-message/`: 子代理消息组件
  - `subagent-result/`: 子代理结果组件
- **commands/**: 命令相关组件 (30+ 组件)
  - `local-command/`: 本地命令组件
  - `command-output/`: 命令输出组件
- **files/**: 文件相关组件 (40+ 组件)
  - `file-operations/`: 文件操作组件
  - `file-content/`: 文件内容组件
- **agents/**: 代理相关组件 (20+ 组件)
  - `agent-management/`: 代理管理组件
  - `agent-chat/`: 代理聊天组件
- **thinking/**: 思考相关组件 (10+ 组件)
  - `thinking-content/`: 思考内容组件
- **meta/**: 元数据组件 (20+ 组件)
  - `session-meta/`: 会话元数据组件
  - `system-meta/`: 系统元数据组件
- **specialized/**: 特殊组件 (30+ 组件)
  - `sidechain/`: 侧链消息组件
  - `error/`: 错误消息组件

#### 6.3.3 组件开发流程
1. **分析消息结构** → 确定消息类型和特征
2. **选择目录位置** → 根据消息类型选择对应目录
3. **创建组件文件** → 按照命名规范创建组件
4. **实现组件逻辑** → 编写专门的展示逻辑
5. **注册到渲染器** → 更新SmartMessageRenderer
6. **测试验证** → 确保组件正常工作

#### 6.3.4 组件模板结构
```typescript
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageContainer } from '../core/message-container/MessageContainer';
import { formatTimestamp, getRelativeTime } from '@/lib/utils/message-utils';
import { generateContentHash } from '@/lib/utils/content-hash';

interface ComponentNameProps {
  message: any;
  sessionId: string;
  theme?: 'light' | 'dark';
  onViewJson: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function ComponentName({ 
  message, 
  sessionId, 
  theme = 'light',
  onViewJson,
  isExpanded = false,
  onToggleExpand 
}: ComponentNameProps) {
  const contentHash = generateContentHash(message);
  
  return (
    <div className="w-full">
      <MessageContainer
        message={message}
        sessionId={sessionId}
        contentHash={contentHash}
        theme={theme}
        onViewJson={onViewJson}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
      
      <Card className="w-full mt-2 border-[color]-200 bg-[color]-50 dark:border-[color]-800 dark:bg-[color]-950/20">
        <CardHeader className="pb-3">
          {/* 组件特定的头部内容 */}
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* 组件特定的内容展示 */}
        </CardContent>
      </Card>
    </div>
  );
}
```

## 7. 开发计划

### 7.1 第一阶段 (Week 1-2)
- [ ] 项目初始化和基础架构搭建
- [ ] 核心消息类型组件开发 (user, assistant, system)
- [ ] 基础 UI 框架集成

### 7.2 第二阶段 (Week 3-4)
- [ ] 内容类型组件开发 (text, thinking, tool-use, tool-result)
- [ ] 特殊消息类型组件开发
- [ ] 组件注册系统实现
- [ ] 新消息类型组件的手动开发流程

### 7.3 第三阶段 (Week 5-6)
- [ ] 根据实际数据逐步开发新的消息类型组件
- [ ] 内容哈希去重系统
- [ ] 性能优化和测试
- [ ] 组件开发模板和规范

### 7.4 第四阶段 (Week 7-8)
- [ ] 高级功能开发
- [ ] 用户界面优化
- [ ] 文档编写和部署

## 8. 风险评估

### 8.1 技术风险
- **风险**: 大量消息类型需要专门的展示组件
- **缓解**: 使用默认JSON组件作为降级方案，逐步开发专门组件
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
- 支持已实现消息类型的专门展示
- 新消息类型使用默认JSON展示
- 页面加载时间 < 3秒
- 组件渲染时间 < 100ms
- 代码覆盖率 > 80%

### 9.2 用户体验指标
- 界面响应时间 < 200ms
- 支持主流浏览器
- 移动端适配良好
- 无障碍访问支持

### 9.3 业务指标
- 项目按时交付
- 代码质量达标
- 文档完整性
- 用户满意度

## 10. 附录

### 10.1 术语表
- **Session**: Claude 会话数据
- **Message**: 会话中的单条消息
- **Component**: 消息渲染组件
- **Content Hash**: 内容哈希值
- **Type Registry**: 类型注册表
- **Default JSON Component**: 默认JSON展示组件
- **Specialized Component**: 专门的消息展示组件

### 10.2 参考文档
- [Next.js 官方文档](https://nextjs.org/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com/)
- [Anthropic AI SDK](https://sdk.anthropic.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**文档版本**: V1.0.0  
**创建时间**: 2025-01-31  
**最后更新**: 2025-01-31  
**负责人**: 开发团队

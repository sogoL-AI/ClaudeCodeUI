# ClaudeCodeUI - 组件设计文档

## 1. 组件架构概述

### 1.1 技术栈
- **AI SDK**: Anthropic AI SDK
- **UI 框架**: shadcn/ui + Tailwind CSS
- **Markdown**: react-markdown + remark-gfm
- **图标**: Lucide React
- **主题**: next-themes

### 1.2 组件分类（基于414种类型分析）

```
components/
├── messages/
│   ├── core/                    # 核心消息类型 (占比最高)
│   │   ├── user-message/        # 用户消息 (16.30%)
│   │   ├── assistant-message/   # 助手消息 (12.36%)
│   │   ├── system-message/      # 系统消息
│   │   └── subagent-message/    # 子代理消息 (isSidechain: true)
│   ├── content-types/           # 内容类型组件
│   │   ├── text-content/        # 文本内容 (3.08%)
│   │   ├── thinking-content/    # 思考内容 (4.71%)
│   │   ├── tool-use/            # 工具调用 (1.43%)
│   │   ├── tool-result/         # 工具结果 (3.55%)
│   │   ├── error-content/       # 错误内容
│   │   └── summary-content/     # 摘要内容 (0.17%)
│   ├── tools/                   # 工具专用组件
│   │   ├── bash-tool/           # Bash 命令工具
│   │   ├── edit-tool/           # 文件编辑工具
│   │   ├── read-tool/           # 文件读取工具
│   │   ├── write-tool/          # 文件写入工具
│   │   ├── ls-tool/             # 目录列表工具
│   │   ├── todo-tool/           # Todo 管理工具
│   │   ├── playwright-tool/     # 浏览器自动化工具
│   │   └── task-tool/           # 任务执行工具
│   ├── specialized/             # 特殊类型
│   │   ├── meta-message/        # 元数据消息 (isMeta: true)
│   │   ├── command-message/     # 命令消息
│   │   ├── stdout-message/      # 标准输出
│   │   ├── visible-only/        # 仅可见消息
│   │   ├── patch-message/       # 代码补丁消息
│   │   └── diff-message/        # 差异对比消息
│   └── common/                  # 通用组件
│       ├── json-viewer/         # JSON 查看器
│       ├── markdown-renderer/   # Markdown 渲染器
│       ├── theme-toggle/        # 主题切换
│       ├── usage-display/       # 使用量显示
│       ├── timestamp-display/   # 时间戳显示
│       └── metadata-display/    # 元数据显示
```

## 2. 核心设计原则

### 2.1 基于414种类型的公共组件抽象

#### 2.1.1 高频结构组件（占比 > 1%）
```typescript
// 1. 基础任务组件 (16.30%)
interface TaskComponentProps {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

// 2. 使用量统计组件 (12.36%)
interface UsageComponentProps {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
  service_tier: string;
}

// 3. 思考内容组件 (4.71%)
interface ThinkingComponentProps {
  type: 'thinking';
  thinking: string;
  signature?: string;
}

// 4. 工具结果组件 (3.55%)
interface ToolResultComponentProps {
  tool_use_id: string;
  type: 'tool_result';
  content: string;
  is_error?: boolean;
}

// 5. 文本内容组件 (3.08%)
interface TextComponentProps {
  type: 'text';
  text: string;
}
```

#### 2.1.2 统一接口
```typescript
interface BaseMessageProps {
  message: Message;
  sessionId: string;
  contentHash: string;
  theme: 'light' | 'dark';
  onViewJson: () => void;
}

interface MessageComponentProps extends BaseMessageProps {
  // 组件特定属性
}
```

### 2.2 公共能力
- **JSON 查看**: 每个组件都有"查看 JSON"按钮
- **主题支持**: 支持亮色/暗色主题切换
- **响应式设计**: 适配不同屏幕尺寸
- **可访问性**: 支持键盘导航和屏幕阅读器

## 3. 核心消息组件设计

### 3.1 用户消息组件 (UserMessage)
```typescript
interface UserMessageProps extends BaseMessageProps {
  userType: 'external' | 'internal';
  isMeta?: boolean;
}
```

**设计特点:**
- **头像**: 用户头像，不同用户类型不同颜色
- **边框**: 左侧蓝色边框，表示用户输入
- **内容**: Markdown 渲染，支持代码高亮
- **元数据**: 显示时间戳和用户类型
- **样式**: 简洁现代，突出用户身份

### 3.2 助手消息组件 (AssistantMessage)
```typescript
interface AssistantMessageProps extends BaseMessageProps {
  model: string;
  role: 'assistant';
  content: ContentBlock[];
}
```

**设计特点:**
- **头像**: Claude 头像，品牌色彩
- **边框**: 右侧绿色边框，表示 AI 回复
- **内容**: 支持多种内容类型渲染
- **模型信息**: 显示使用的模型版本
- **样式**: 专业友好，突出 AI 身份

### 3.3 子代理消息组件 (SubagentMessage)
```typescript
interface SubagentMessageProps extends BaseMessageProps {
  isSidechain: true;
  subagentType: string;
  agentName?: string;
}
```

**设计特点:**
- **头像**: 子代理专用头像，不同代理不同图标
- **边框**: 紫色边框，区分主代理
- **标识**: 显示子代理类型和名称
- **样式**: 独特设计，突出子代理身份

## 4. 内容类型组件设计

### 4.1 文本内容组件 (TextContent)
```typescript
interface TextContentProps extends BaseMessageProps {
  text: string;
  isMarkdown: boolean;
}
```

**设计特点:**
- **Markdown 渲染**: 完整的 Markdown 支持
- **代码高亮**: 语法高亮和行号
- **链接处理**: 可点击链接和预览
- **表格支持**: 响应式表格设计
- **数学公式**: LaTeX 公式渲染

### 4.2 思考内容组件 (ThinkingContent)
```typescript
interface ThinkingContentProps extends BaseMessageProps {
  thinking: string;
  signature?: string;
  isVisible: boolean;
}
```

**设计特点:**
- **可折叠**: 默认折叠，点击展开
- **特殊样式**: 灰色背景，表示内部思考
- **图标**: 大脑图标，表示思考过程
- **签名**: 显示思考签名（可选）

### 4.3 工具调用组件 (ToolUse)
```typescript
interface ToolUseProps extends BaseMessageProps {
  toolId: string;
  toolName: string;
  input: any;
  icon?: string;
}
```

**设计特点:**
- **工具图标**: 每个工具专属图标
- **参数表单**: 结构化的参数展示
- **状态指示**: 调用中/成功/失败状态
- **可展开**: 详细参数可展开查看

### 4.4 工具专用组件设计

#### 4.4.1 Bash 工具组件
```typescript
interface BashToolProps extends BaseMessageProps {
  command: string;
  description: string;
  timeout?: number;
}
```

**设计特点:**
- **终端样式**: 模拟终端界面
- **命令高亮**: 语法高亮显示
- **执行状态**: 显示执行进度
- **超时设置**: 显示超时配置

#### 4.4.2 Edit 工具组件
```typescript
interface EditToolProps extends BaseMessageProps {
  file_path: string;
  old_string: string;
  new_string: string;
}
```

**设计特点:**
- **差异对比**: 并排显示修改前后
- **语法高亮**: 根据文件类型高亮
- **行号显示**: 显示修改的行号
- **可折叠**: 长文件可折叠显示

#### 4.4.3 Read 工具组件
```typescript
interface ReadToolProps extends BaseMessageProps {
  file_path: string;
  limit?: number;
  offset?: number;
}
```

**设计特点:**
- **文件预览**: 显示文件内容
- **分页支持**: 支持大文件分页
- **语法高亮**: 根据文件扩展名高亮
- **行号显示**: 显示行号信息

#### 4.4.4 Todo 工具组件
```typescript
interface TodoToolProps extends BaseMessageProps {
  todos: TodoItem[];
}

interface TodoItem {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}
```

**设计特点:**
- **任务列表**: 卡片式任务展示
- **状态切换**: 可视化状态变化
- **优先级标识**: 颜色编码优先级
- **进度显示**: 整体完成进度

#### 4.4.5 Playwright 工具组件
```typescript
interface PlaywrightToolProps extends BaseMessageProps {
  element: string;
  ref: string;
  action: 'click' | 'type' | 'navigate';
}
```

**设计特点:**
- **浏览器模拟**: 显示浏览器操作
- **元素高亮**: 高亮目标元素
- **操作记录**: 显示操作历史
- **截图预览**: 显示页面状态

### 4.4 工具结果组件 (ToolResult)
```typescript
interface ToolResultProps extends BaseMessageProps {
  toolUseId: string;
  content: any;
  isError: boolean;
  duration?: number;
}
```

**设计特点:**
- **结果展示**: 结构化的结果展示
- **错误处理**: 错误信息的友好展示
- **性能指标**: 显示执行时间
- **关联工具**: 链接到对应的工具调用

## 5. 特殊消息组件设计

### 5.1 元数据消息组件 (MetaMessage)
```typescript
interface MetaMessageProps extends BaseMessageProps {
  isMeta: true;
  metaType: string;
  content: any;
}
```

**设计特点:**
- **半透明背景**: 表示元数据性质
- **小字体**: 不占用主要视觉空间
- **可折叠**: 默认折叠状态
- **图标**: 信息图标

### 5.2 代码补丁组件 (PatchMessage)
```typescript
interface PatchMessageProps extends BaseMessageProps {
  structuredPatch: PatchHunk[];
  filePath: string;
  userModified: boolean;
}

interface PatchHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}
```

**设计特点:**
- **差异视图**: 并排显示修改前后
- **行号对齐**: 精确显示行号变化
- **语法高亮**: 根据文件类型高亮
- **折叠支持**: 支持大补丁折叠

### 5.3 系统消息组件 (SystemMessage)
```typescript
interface SystemMessageProps extends BaseMessageProps {
  content: string;
  level: 'info' | 'warning' | 'error' | 'success';
  toolUseID?: string;
}
```

**设计特点:**
- **级别标识**: 不同级别不同颜色
- **图标显示**: 对应级别的图标
- **时间戳**: 显示系统时间
- **可忽略**: 支持忽略系统消息

### 5.4 子代理消息组件 (SubagentMessage)
```typescript
interface SubagentMessageProps extends BaseMessageProps {
  isSidechain: true;
  subagentType: string;
  agentName?: string;
  content: any;
}
```

**设计特点:**
- **代理标识**: 显示子代理类型
- **独特样式**: 区别于主代理
- **代理头像**: 不同代理不同图标
- **层级显示**: 显示代理层级关系

### 5.2 命令消息组件 (CommandMessage)
```typescript
interface CommandMessageProps extends BaseMessageProps {
  commandName: string;
  commandArgs: string[];
  commandMessage: string;
}
```

**设计特点:**
- **命令高亮**: 命令名称特殊高亮
- **参数展示**: 结构化的参数列表
- **终端风格**: 模拟终端界面
- **可执行**: 显示执行状态

### 5.3 标准输出组件 (StdoutMessage)
```typescript
interface StdoutMessageProps extends BaseMessageProps {
  content: string;
  level: 'info' | 'warning' | 'error' | 'success';
}
```

**设计特点:**
- **终端样式**: 等宽字体，终端背景
- **颜色编码**: 不同级别不同颜色
- **可滚动**: 长输出可滚动查看
- **复制功能**: 一键复制输出内容

## 6. 通用组件设计

### 6.1 JSON 查看器组件 (JsonViewer)
```typescript
interface JsonViewerProps {
  data: any;
  title?: string;
  isCollapsible?: boolean;
  theme: 'light' | 'dark';
}
```

**设计特点:**
- **树形结构**: 可折叠的 JSON 树
- **语法高亮**: JSON 语法高亮
- **搜索功能**: 快速搜索 JSON 内容
- **复制功能**: 复制 JSON 或特定路径
- **主题适配**: 支持亮色/暗色主题

### 6.2 使用量显示组件 (UsageDisplay)
```typescript
interface UsageDisplayProps {
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
    service_tier: string;
  };
  theme: 'light' | 'dark';
}
```

**设计特点:**
- **进度条**: 可视化 token 使用量
- **缓存标识**: 区分缓存和实际使用
- **服务等级**: 显示服务等级信息
- **成本估算**: 显示预估成本

### 6.3 时间戳显示组件 (TimestampDisplay)
```typescript
interface TimestampDisplayProps {
  timestamp: string;
  format?: 'relative' | 'absolute' | 'both';
  theme: 'light' | 'dark';
}
```

**设计特点:**
- **相对时间**: "2分钟前"、"1小时前"
- **绝对时间**: 完整的时间戳
- **时区支持**: 支持多时区显示
- **可切换**: 支持格式切换

### 6.4 元数据显示组件 (MetadataDisplay)
```typescript
interface MetadataDisplayProps {
  metadata: {
    cwd?: string;
    gitBranch?: string;
    version?: string;
    userType?: string;
    isSidechain?: boolean;
    isMeta?: boolean;
  };
  theme: 'light' | 'dark';
}
```

**设计特点:**
- **环境信息**: 显示工作目录、分支
- **版本信息**: 显示版本号
- **用户类型**: 区分内部/外部用户
- **状态标识**: 显示特殊状态

### 6.2 Markdown 渲染器组件 (MarkdownRenderer)
```typescript
interface MarkdownRendererProps {
  content: string;
  theme: 'light' | 'dark';
  allowHtml?: boolean;
}
```

**设计特点:**
- **完整支持**: 所有 Markdown 语法
- **代码高亮**: 支持多种编程语言
- **表格样式**: 响应式表格设计
- **数学公式**: LaTeX 公式支持
- **自定义样式**: 主题化样式

## 7. 主题系统设计

### 7.1 颜色方案
```typescript
interface ThemeColors {
  // 用户消息
  userBorder: string;
  userBackground: string;
  userText: string;
  
  // 助手消息
  assistantBorder: string;
  assistantBackground: string;
  assistantText: string;
  
  // 子代理消息
  subagentBorder: string;
  subagentBackground: string;
  subagentText: string;
  
  // 工具相关
  toolBorder: string;
  toolBackground: string;
  toolIcon: string;
  
  // 通用
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
  background: string;
  foreground: string;
}
```

### 7.2 亮色主题
- **用户消息**: 蓝色边框，白色背景
- **助手消息**: 绿色边框，浅绿背景
- **子代理**: 紫色边框，浅紫背景
- **工具**: 橙色边框，浅橙背景

### 7.3 暗色主题
- **用户消息**: 深蓝边框，深灰背景
- **助手消息**: 深绿边框，深灰背景
- **子代理**: 深紫边框，深灰背景
- **工具**: 深橙边框，深灰背景

## 8. 工具图标系统

### 8.1 内置工具图标
```typescript
const ToolIcons = {
  'Task': 'TaskIcon',
  'File': 'FileIcon',
  'Search': 'SearchIcon',
  'Code': 'CodeIcon',
  'Terminal': 'TerminalIcon',
  'Database': 'DatabaseIcon',
  'API': 'ApiIcon',
  'Web': 'GlobeIcon',
  // ... 更多工具图标
};
```

### 8.2 自定义图标支持
- 支持 SVG 图标
- 支持 Lucide React 图标
- 支持自定义图标组件
- 图标主题适配

## 9. 响应式设计

### 9.1 断点设计
```css
/* 移动端 */
@media (max-width: 768px) {
  .message-container {
    padding: 0.5rem;
    margin: 0.25rem 0;
  }
}

/* 平板 */
@media (min-width: 769px) and (max-width: 1024px) {
  .message-container {
    padding: 0.75rem;
    margin: 0.5rem 0;
  }
}

/* 桌面端 */
@media (min-width: 1025px) {
  .message-container {
    padding: 1rem;
    margin: 0.75rem 0;
  }
}
```

### 9.2 布局适配
- **移动端**: 单列布局，紧凑设计
- **平板**: 双列布局，适中间距
- **桌面端**: 多列布局，宽松间距

## 10. 性能优化

### 10.1 组件懒加载
```typescript
const MessageComponent = React.lazy(() => 
  import(`./messages/${messageType}`)
);
```

### 10.2 虚拟滚动
- 长会话列表使用虚拟滚动
- 只渲染可见区域的消息
- 动态加载历史消息

### 10.3 缓存策略
- 组件渲染结果缓存
- JSON 解析结果缓存
- Markdown 渲染结果缓存

## 11. 可访问性设计

### 11.1 键盘导航
- Tab 键导航
- Enter 键激活
- Escape 键关闭
- 方向键导航

### 11.2 屏幕阅读器
- 语义化 HTML 结构
- ARIA 标签支持
- 焦点管理
- 状态通知

### 11.3 颜色对比度
- 符合 WCAG 2.1 AA 标准
- 最小对比度 4.5:1
- 支持高对比度模式

## 12. 开发规范

### 12.1 组件命名
- 使用 PascalCase
- 描述性名称
- 类型后缀

### 12.2 文件结构
```
component-name/
├── ComponentName.tsx      # 主组件
├── ComponentName.types.ts # 类型定义
├── ComponentName.test.tsx # 测试文件
├── ComponentName.stories.tsx # Storybook
└── index.ts              # 导出文件
```

### 12.3 代码规范
- TypeScript 严格模式
- ESLint + Prettier
- 组件文档化
- 单元测试覆盖

## 13. 基于414种类型的组件设计策略

### 13.1 核心组件抽象方案 (15-20个核心组件)

#### 🎯 核心统计
- **总消息类型**: 414种
- **主要分类**: 12个核心分类
- **建议组件数**: **15-20个核心组件**

#### 🏗️ 核心组件架构

##### 1. **消息核心组件** (MSG_CORE - 86.0%)
```typescript
// 基础消息容器
<MessageContainer>
  <MessageHeader />     // id, type, role, model
  <MessageContent />    // content数组
  <MessageFooter />     // stop_reason, stop_sequence
</MessageContainer>
```

##### 2. **文件操作组件** (FILE_OPS - 77.8%)
```typescript
// 文件操作相关
<FileOperations>
  <FileReader />        // Read工具
  <FileWriter />        // Write工具  
  <FileEditor />        // Edit, MultiEdit工具
  <FilePatcher />       // structuredPatch
</FileOperations>
```

##### 3. **工具使用组件** (TOOL_USAGE - 80.7%)
```typescript
// 工具调用系统
<ToolSystem>
  <ToolCall />          // tool_use基础
  <SystemTools />       // Bash, LS, Grep
  <WebTools />          // WebFetch, WebSearch
  <BrowserTools />      // Playwright
</ToolSystem>
```

##### 4. **使用统计组件** (USAGE_STATS - 57.2%)
```typescript
// 性能监控
<UsageStats>
  <TokenCounter />      // input/output tokens
  <CacheStats />        // cache相关统计
  <ServiceTier />       // service_tier显示
</UsageStats>
```

##### 5. **任务管理组件** (TASK_MGMT - 8.0%)
```typescript
// 任务系统
<TaskManagement>
  <TodoList />          // todos数组
  <TaskStatus />        // status, priority
  <TaskProgress />      // 进度跟踪
</TaskManagement>
```

##### 6. **会话管理组件** (SESSION_MGMT - 39.9%)
```typescript
// 会话控制
<SessionManagement>
  <SessionInfo />       // sessionId, uuid
  <SessionTimeline />   // timestamp, parentUuid
  <SessionControls />   // 会话操作
</SessionManagement>
```

##### 7. **环境信息组件** (ENV_INFO - 39.6%)
```typescript
// 环境状态
<EnvironmentInfo>
  <WorkingDirectory />  // cwd
  <GitInfo />          // gitBranch
  <VersionInfo />      // version
  <UserInfo />         // userType
</EnvironmentInfo>
```

##### 8. **思考过程组件** (THINKING - 15.9%)
```typescript
// AI思考过程
<ThinkingProcess>
  <ThinkingContent />   // thinking字段
  <ThinkingSignature /> // signature验证
  <ThinkingControls />  // 思考控制
</ThinkingProcess>
```

##### 9. **工具结果组件** (TOOL_RESULT - 9.9%)
```typescript
// 工具执行结果
<ToolResults>
  <ToolResult />        // tool_result
  <ErrorDisplay />      // is_error处理
  <ResultContent />     // 结果内容
</ToolResults>
```

##### 10. **系统命令组件** (SYSTEM_CMD - 13.8%)
```typescript
// 系统命令
<SystemCommands>
  <CommandInput />      // command
  <CommandDescription /> // description
  <CommandHistory />    // 命令历史
</SystemCommands>
```

##### 11. **子代理组件** (SUBAGENT - 5.2%)
```typescript
// 子代理系统
<SubagentSystem>
  <SubagentHeader />    // isSidechain标识
  <SubagentContent />   // 子代理内容
  <SubagentControls />  // 子代理控制
</SubagentSystem>
```

##### 12. **元数据组件** (METADATA - 12.1%)
```typescript
// 元数据管理
<MetadataSystem>
  <MetaInfo />          // isMeta标识
  <MetaContent />       // 元数据内容
  <MetaControls />      // 元数据控制
</MetadataSystem>
```

### 13.2 组件组合策略

#### 13.2.1 AI组件生成策略
```typescript
// AI组件生成接口
interface AIComponentGenerator {
  // 组件生成Prompt模板
  generateComponentPrompt(componentType: string, data: any): string;
  
  // 组件规范定义
  getComponentSpec(componentType: string): ComponentSpec;
  
  // 组件测试用例生成
  generateTestCases(componentType: string): TestCase[];
}

// 组件规范
interface ComponentSpec {
  name: string;
  description: string;
  props: PropDefinition[];
  requirements: string[];
  examples: Example[];
  theme: ThemeRequirements;
}
```

#### 13.2.2 组件生成优先级
```typescript
// 按使用频率的组件生成优先级
const ComponentGenerationPriority = {
  MSG_CORE: 1,      // 86.0% - 最高优先级
  TOOL_USAGE: 2,    // 80.7% - 工具调用
  FILE_OPS: 3,      // 77.8% - 文件操作
  USAGE_STATS: 4,   // 57.2% - 使用统计
  SESSION_MGMT: 5,  // 39.9% - 会话管理
  ENV_INFO: 6,      // 39.6% - 环境信息
  THINKING: 7,      // 15.9% - 思考过程
  SYSTEM_CMD: 8,    // 13.8% - 系统命令
  METADATA: 9,      // 12.1% - 元数据
  TOOL_RESULT: 10,  // 9.9% - 工具结果
  TASK_MGMT: 11,    // 8.0% - 任务管理
  SUBAGENT: 12,     // 5.2% - 子代理
};
```

#### 13.2.3 组件生成流程
```typescript
// AI组件生成流程
interface ComponentGenerationFlow {
  // 1. 分析消息结构
  analyzeMessageStructure(message: Message): MessageAnalysis;
  
  // 2. 确定组件类型
  determineComponentType(analysis: MessageAnalysis): string;
  
  // 3. 生成组件Prompt
  generatePrompt(componentType: string, message: Message): string;
  
  // 4. AI生成组件代码
  generateComponentCode(prompt: string): Promise<string>;
  
  // 5. 组件验证和测试
  validateComponent(componentCode: string): ValidationResult;
}
```

### 13.3 工具组件分类策略
根据工具使用频率，分为以下类别：

#### 高频工具 (>1%)
- **Bash**: 命令行工具
- **Edit**: 文件编辑
- **Read**: 文件读取
- **TodoWrite**: 任务管理

#### 中频工具 (0.1%-1%)
- **Write**: 文件写入
- **LS**: 目录列表
- **Task**: 任务执行

#### 低频工具 (<0.1%)
- **Playwright**: 浏览器自动化
- **Search**: 搜索功能
- **API**: API 调用

### 13.3 组件复用策略
通过以下方式最大化组件复用：

1. **基础组件**: 文本、时间戳、元数据
2. **组合组件**: 工具调用、消息容器
3. **特殊组件**: 补丁、差异、系统消息

### 13.4 性能优化策略
基于数据特征优化：

1. **懒加载**: 低频组件按需加载
2. **缓存**: 高频组件结果缓存
3. **虚拟化**: 长列表虚拟滚动
4. **预加载**: 预测性组件加载

### 13.5 补充建议

#### 13.5.1 组件实现优先级
```typescript
// 第一阶段：核心组件 (覆盖90%+场景)
const Phase1Components = [
  'MessageContainer',    // 消息容器
  'FileOperations',      // 文件操作
  'ToolSystem',          // 工具系统
  'UsageStats',          // 使用统计
];

// 第二阶段：辅助组件 (覆盖95%+场景)
const Phase2Components = [
  'SessionManagement',   // 会话管理
  'EnvironmentInfo',     // 环境信息
  'ThinkingProcess',     // 思考过程
  'ToolResults',         // 工具结果
];

// 第三阶段：特殊组件 (覆盖99%+场景)
const Phase3Components = [
  'SystemCommands',      // 系统命令
  'TaskManagement',      // 任务管理
  'SubagentSystem',      // 子代理
  'MetadataSystem',      // 元数据
];
```

#### 13.5.2 AI组件生成规范
```typescript
// AI组件生成Prompt模板
interface ComponentPromptTemplate {
  // 组件类型描述
  componentType: string;
  
  // 技术要求
  requirements: {
    framework: 'Next.js 14 + TypeScript';
    ui: 'shadcn/ui + Tailwind CSS';
    markdown: 'react-markdown + remark-gfm';
    icons: 'Lucide React';
    theme: 'next-themes';
  };
  
  // 组件规范
  spec: {
    props: PropDefinition[];
    features: string[];
    accessibility: string[];
    responsive: boolean;
    themeable: boolean;
  };
  
  // 示例数据
  examples: Example[];
  
  // 生成指令
  instructions: string[];
}

// 组件生成示例
const MessageContainerPrompt = {
  componentType: 'MessageContainer',
  requirements: {
    framework: 'Next.js 14 + TypeScript',
    ui: 'shadcn/ui + Tailwind CSS',
    markdown: 'react-markdown + remark-gfm',
    icons: 'Lucide React',
    theme: 'next-themes'
  },
  spec: {
    props: [
      { name: 'message', type: 'Message', required: true },
      { name: 'sessionId', type: 'string', required: true },
      { name: 'theme', type: "'light' | 'dark'", required: true },
      { name: 'onViewJson', type: '() => void', required: true }
    ],
    features: [
      '支持亮色/暗色主题切换',
      'JSON查看按钮',
      '响应式设计',
      '可访问性支持'
    ],
    accessibility: [
      '键盘导航支持',
      '屏幕阅读器兼容',
      'ARIA标签',
      '颜色对比度符合WCAG标准'
    ],
    responsive: true,
    themeable: true
  },
  examples: [
    {
      input: { /* 示例消息数据 */ },
      output: '/* 期望的组件渲染效果 */'
    }
  ],
  instructions: [
    '使用TypeScript严格模式',
    '遵循shadcn/ui设计规范',
    '支持主题切换',
    '包含JSON查看功能',
    '添加适当的错误处理'
  ]
};
```

#### 13.5.3 用户体验优化
```typescript
// 渐进式加载
interface ProgressiveLoading {
  // 1. 骨架屏
  renderSkeleton(): React.ReactNode;
  
  // 2. 基础内容
  renderBasic(): React.ReactNode;
  
  // 3. 完整内容
  renderFull(): React.ReactNode;
  
  // 4. 交互功能
  renderInteractive(): React.ReactNode;
}
```

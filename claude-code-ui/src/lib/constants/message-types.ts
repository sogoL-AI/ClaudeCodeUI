// 消息类型常量
export const MESSAGE_TYPES = {
  // 核心消息类型
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  
  // 内容类型
  TEXT: 'text',
  THINKING: 'thinking',
  TOOL_USE: 'tool_use',
  TOOL_RESULT: 'tool_result',
  
  // 特殊类型
  META: 'meta',
  SUBAGENT: 'subagent',
  COMMAND: 'command',
  STDOUT: 'stdout',
  VISIBLE_ONLY: 'visible-only',
} as const;

// 组件类型常量
export const COMPONENT_TYPES = {
  // 核心组件
  MESSAGE_CONTAINER: 'message-container',
  USER_MESSAGE: 'user-message',
  ASSISTANT_MESSAGE: 'assistant-message',
  SYSTEM_MESSAGE: 'system-message',
  SUBAGENT_MESSAGE: 'subagent-message',
  
  // 内容组件
  TEXT_CONTENT: 'text-content',
  THINKING_CONTENT: 'thinking-content',
  TOOL_USE: 'tool-use',
  TOOL_RESULT: 'tool-result',
  
  // 工具组件
  BASH_TOOL: 'bash-tool',
  EDIT_TOOL: 'edit-tool',
  READ_TOOL: 'read-tool',
  WRITE_TOOL: 'write-tool',
  LS_TOOL: 'ls-tool',
  TODO_TOOL: 'todo-tool',
  PLAYWRIGHT_TOOL: 'playwright-tool',
  TASK_TOOL: 'task-tool',
  
  // 特殊组件
  META_MESSAGE: 'meta-message',
  COMMAND_MESSAGE: 'command-message',
  STDOUT_MESSAGE: 'stdout-message',
  PATCH_MESSAGE: 'patch-message',
  DIFF_MESSAGE: 'diff-message',
  
  // 通用组件
  JSON_VIEWER: 'json-viewer',
  MARKDOWN_RENDERER: 'markdown-renderer',
  USAGE_DISPLAY: 'usage-display',
  TIMESTAMP_DISPLAY: 'timestamp-display',
  METADATA_DISPLAY: 'metadata-display',
} as const;

// 工具类型常量
export const TOOL_TYPES = {
  BASH: 'Bash',
  EDIT: 'Edit',
  READ: 'Read',
  WRITE: 'Write',
  LS: 'LS',
  TODO_WRITE: 'TodoWrite',
  PLAYWRIGHT: 'mcp__playwright__browser_click',
  TASK: 'Task',
  WEB_FETCH: 'WebFetch',
  WEB_SEARCH: 'WebSearch',
  GREP: 'Grep',
} as const;

// 主题常量
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// 任务状态常量
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

// 任务优先级常量
export const TASK_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// 系统级别常量
export const SYSTEM_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
} as const; 
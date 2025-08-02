// 基础消息类型定义
export interface Message {
  uuid: string;
  type: string;
  message: any;
  timestamp: string;
  parentUuid?: string;
  isSidechain?: boolean;
  userType?: string;
  cwd?: string;
  sessionId?: string;
  version?: string;
  gitBranch?: string;
  isMeta?: boolean;
  isVisibleInTranscriptOnly?: boolean;
  requestId?: string;
  toolUseResult?: any;
  toolUseID?: string;
  level?: string;
}

// 会话类型定义
export interface Session {
  session_id: string;
  extraction_time: string;
  source_files: SourceFile[];
  messages: Message[];
}

export interface SourceFile {
  file_path: string;
  line_number: number;
  found_at: string;
}

// 内容类型定义
export interface ContentBlock {
  type: string;
  text?: string;
  thinking?: string;
  signature?: string;
  tool_use_id?: string;
  content?: string;
  is_error?: boolean;
}

// 工具使用类型定义
export interface ToolUse {
  type: 'tool_use';
  id: string;
  name: string;
  input: any;
}

// 工具结果类型定义
export interface ToolResult {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

// 使用量统计类型定义
export interface Usage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
  service_tier: string;
}

// 任务类型定义
export interface Task {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

// 组件Props基础类型
export interface BaseMessageProps {
  message: Message;
  sessionId: string;
  contentHash: string;
  theme: 'light' | 'dark';
  onViewJson: () => void;
  borderColor?: string;
}

// 组件匹配结果类型
export interface ComponentMatchResult {
  success: boolean;
  component?: React.ComponentType<BaseMessageProps>;
  fallbackComponent: React.ComponentType<BaseMessageProps>;
} 
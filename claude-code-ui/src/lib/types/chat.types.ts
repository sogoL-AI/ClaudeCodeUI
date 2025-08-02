// 聊天消息类型定义
export interface ChatMessage {
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

// 聊天内容项类型
export interface ChatContentItem {
  type: string;
  text?: string;
  tool_use_id?: string;
  content?: any;
  is_error?: boolean;
}

// 会话数据类型
export interface SessionData {
  session_id: string;
  extraction_time: string;
  source_files: Array<{
    file_path: string;
    line_number: number;
    found_at: string;
  }>;
  messages: ChatMessage[];
}

// 消息组件Props类型
export interface MessageComponentProps {
  message: ChatMessage;
  sessionId: string;
  theme?: 'light' | 'dark';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  useChatBubble?: boolean;
}

// 消息容器Props类型
export interface MessageContainerProps {
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
  useChatBubble?: boolean;
} 
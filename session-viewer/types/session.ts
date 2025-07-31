export interface SessionData {
  session_id: string;
  extraction_time: string;
  source_files: Array<{
    file_path: string;
    line_number: number;
    found_at: string;
  }>;
  messages: SessionMessage[];
}

export interface SessionMessage {
  parentUuid: string | null;
  isSidechain: boolean;
  userType: string;
  cwd: string;
  sessionId: string;
  version: string;
  gitBranch: string;
  type: 'user' | 'assistant';
  message: {
    id?: string;
    type?: string;
    role: 'user' | 'assistant';
    model?: string;
    content: string | ContentPart[];
    stop_reason?: string | null;
    stop_sequence?: string | null;
    usage?: {
      input_tokens: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
      output_tokens: number;
      service_tier: string;
    };
  };
  requestId?: string;
  uuid: string;
  timestamp: string;
  isMeta?: boolean;
  isVisibleInTranscriptOnly?: boolean;
}

export interface ContentPart {
  type: 'text' | 'tool_use' | 'thinking' | 'step-start';
  text?: string;
  thinking?: string;
  signature?: string;
  id?: string;
  name?: string;
  input?: any;
}

export interface ParsedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  usage?: SessionMessage['message']['usage'];
  toolInvocations?: ToolInvocation[];
  thinking?: string;
  isSidechain?: boolean;
  parentId?: string;
}

export interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: 'call' | 'result';
  args?: any;
  result?: any;
}
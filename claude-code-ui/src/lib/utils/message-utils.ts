import { Message, ContentBlock } from '../types/message.types';
import { ChatMessage } from '../types/chat.types';

/**
 * 分析消息结构，确定组件类型
 * @param message 消息对象
 * @returns 组件类型
 */
export function analyzeMessageType(message: Message | ChatMessage): string {
  // 检查是否为子代理消息
  if (message.isSidechain) {
    return 'subagent-message';
  }

  // 检查是否为元数据消息
  if (message.isMeta) {
    return 'meta-message';
  }

  // 检查消息类型
  switch (message.type) {
    case 'user':
      return 'user-message';
    case 'assistant':
      return 'assistant-message';
    case 'system':
      return 'system-message';
    default:
      return 'unknown-message';
  }
}

/**
 * 分析内容类型
 * @param content 内容数组
 * @returns 内容类型数组
 */
export function analyzeContentTypes(content: ContentBlock[]): string[] {
  return content.map(block => {
    switch (block.type) {
      case 'text':
        return 'text-content';
      case 'thinking':
        return 'thinking-content';
      case 'tool_use':
        return 'tool-use';
      case 'tool_result':
        return 'tool-result';
      default:
        return 'unknown-content';
    }
  });
}

/**
 * 检查消息是否包含工具调用
 * @param message 消息对象
 * @returns 是否包含工具调用
 */
export function hasToolUse(message: Message): boolean {
  if (!message.message?.content) return false;
  
  return message.message.content.some((block: ContentBlock) => 
    block.type === 'tool_use'
  );
}

/**
 * 检查消息是否包含工具结果
 * @param message 消息对象
 * @returns 是否包含工具结果
 */
export function hasToolResult(message: Message): boolean {
  if (!message.message?.content) return false;
  
  return message.message.content.some((block: ContentBlock) => 
    block.type === 'tool_result'
  );
}

/**
 * 获取消息的文本内容
 * @param message 消息对象
 * @returns 文本内容
 */
export function getTextContent(message: Message): string {
  if (!message.message?.content) return '';
  
  const textBlocks = message.message.content.filter((block: ContentBlock) => 
    block.type === 'text'
  );
  
  return textBlocks.map((block: ContentBlock) => block.text).join('\n');
}

/**
 * 获取消息的思考内容
 * @param message 消息对象
 * @returns 思考内容
 */
export function getThinkingContent(message: Message): string {
  if (!message.message?.content) return '';
  
  const thinkingBlocks = message.message.content.filter((block: ContentBlock) => 
    block.type === 'thinking'
  );
  
  return thinkingBlocks.map((block: ContentBlock) => block.thinking).join('\n');
}

/**
 * 格式化时间戳
 * @param timestamp 时间戳
 * @returns 格式化的时间
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * 获取相对时间
 * @param timestamp 时间戳
 * @returns 相对时间字符串
 */
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '刚刚';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}分钟前`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}小时前`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}天前`;
  }
} 
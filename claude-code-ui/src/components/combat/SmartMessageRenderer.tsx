'use client';

import React from 'react';
import { UserMessage } from './content-types';
import { DefaultJsonMessage } from './fallback';
import { ChatMessage, MessageComponentProps, ChatContentItem } from '@/lib/types/chat.types';

// 消息组件注册表接口
interface MessageComponent {
  type: string;
  component: React.ComponentType<MessageComponentProps>;
  priority: number;
  matchCondition: (message: ChatMessage) => boolean;
  description: string;
}

// SmartMessageRenderer Props
type SmartMessageRendererProps = MessageComponentProps;

// 组件匹配结果
interface ComponentMatchResult {
  success: boolean;
  component: React.ComponentType<MessageComponentProps>;
  matchedType: string;
  priority: number;
}

// 消息类型分析器
class MessageTypeAnalyzer {
  static analyzeMessage(message: ChatMessage): {
    baseType: string;
    subType: string;
    flags: string[];
    content: string | ChatContentItem[];
  } {
    const baseType = message.type || 'unknown';
    const content = message.message?.content;
    const flags: string[] = [];
    
    // 特殊标记
    if (message.isMeta) flags.push('meta');
    if (message.isSidechain) flags.push('sidechain');
    if (message.isVisibleInTranscriptOnly) flags.push('transcript-only');
    
    // 内容分析
    let subType = 'default';
    
    if (Array.isArray(content)) {
      const hasThinking = content.some((item: ChatContentItem) => item.type === 'thinking');
      const hasToolUse = content.some((item: ChatContentItem) => item.type === 'tool_use');
      const hasToolResult = content.some((item: ChatContentItem) => item.type === 'tool_result');
      const hasText = content.some((item: ChatContentItem) => item.type === 'text');
      
      if (hasThinking) flags.push('thinking');
      if (hasToolUse) flags.push('tool-use');
      if (hasToolResult) flags.push('tool-result');
      if (hasText) flags.push('text');
      
      if (hasToolUse && hasThinking) subType = 'assistant-with-thinking-and-tools';
      else if (hasToolUse) subType = 'assistant-with-tools';
      else if (hasThinking) subType = 'assistant-with-thinking';
      else if (hasToolResult) subType = 'user-tool-result';
    } else if (typeof content === 'string') {
      const hasCommandContent = content.includes('<command-name>') || 
                              content.includes('<local-command-stdout>') ||
                              content.includes('<local-command-stderr>');
      if (hasCommandContent) {
        flags.push('command');
        subType = 'command-output';
      }
    }
    
    return { baseType, subType, flags, content };
  }
}

// 组件注册表管理器
class ComponentRegistry {
  private static components: MessageComponent[] = [
    // 基础消息类型组件
    {
      type: 'user-message',
      component: UserMessage,
      priority: 100,
      matchCondition: (message: ChatMessage) => {
        const analysis = MessageTypeAnalyzer.analyzeMessage(message);
        return analysis.baseType === 'user';
      },
      description: '用户消息组件'
    },
    
    // TODO: 添加更多组件
    // {
    //   type: 'assistant-message',
    //   component: AssistantMessage,
    //   priority: 100,
    //   matchCondition: (message: any) => {
    //     const analysis = MessageTypeAnalyzer.analyzeMessage(message);
    //     return analysis.baseType === 'assistant';
    //   },
    //   description: '助手消息组件'
    // },
    
    // {
    //   type: 'system-message',
    //   component: SystemMessage,
    //   priority: 100,
    //   matchCondition: (message: any) => {
    //     const analysis = MessageTypeAnalyzer.analyzeMessage(message);
    //     return analysis.baseType === 'system';
    //   },
    //   description: '系统消息组件'
    // },
    
    // 工具相关组件示例
    // {
    //   type: 'tool-use-message',
    //   component: ToolUseMessage,
    //   priority: 200,
    //   matchCondition: (message: any) => {
    //     const analysis = MessageTypeAnalyzer.analyzeMessage(message);
    //     return analysis.flags.includes('tool-use') && analysis.baseType === 'assistant';
    //   },
    //   description: '工具调用消息组件'
    // },
    
    // {
    //   type: 'tool-result-message',
    //   component: ToolResultMessage,
    //   priority: 200,
    //   matchCondition: (message: any) => {
    //     const analysis = MessageTypeAnalyzer.analyzeMessage(message);
    //     return analysis.flags.includes('tool-result') && analysis.baseType === 'user';
    //   },
    //   description: '工具结果消息组件'
    // },
    
    // 命令相关组件示例
    // {
    //   type: 'command-output-message',
    //   component: CommandOutputMessage,
    //   priority: 150,
    //   matchCondition: (message: any) => {
    //     const analysis = MessageTypeAnalyzer.analyzeMessage(message);
    //     return analysis.flags.includes('command');
    //   },
    //   description: '命令输出消息组件'
    // },
    
    // 思考相关组件示例
    // {
    //   type: 'thinking-message',
    //   component: ThinkingMessage,
    //   priority: 180,
    //   matchCondition: (message: any) => {
    //     const analysis = MessageTypeAnalyzer.analyzeMessage(message);
    //     return analysis.flags.includes('thinking');
    //   },
    //   description: '思考内容消息组件'
    // },
    
    // 子代理相关组件示例
    // {
    //   type: 'sidechain-message',
    //   component: SidechainMessage,
    //   priority: 120,
    //   matchCondition: (message: any) => {
    //     const analysis = MessageTypeAnalyzer.analyzeMessage(message);
    //     return analysis.flags.includes('sidechain');
    //   },
    //   description: '子代理消息组件'
    // },
    
    // 元数据组件示例
    // {
    //   type: 'meta-message',
    //   component: MetaMessage,
    //   priority: 110,
    //   matchCondition: (message: any) => {
    //     const analysis = MessageTypeAnalyzer.analyzeMessage(message);
    //     return analysis.flags.includes('meta');
    //   },
    //   description: '元数据消息组件'
    // },
  ];

  // 注册新组件
  static registerComponent(component: MessageComponent): void {
    this.components.push(component);
    // 按优先级排序，优先级高的在前
    this.components.sort((a, b) => b.priority - a.priority);
  }

  // 查找匹配的组件
  static findMatchingComponent(message: ChatMessage): ComponentMatchResult {
    for (const comp of this.components) {
      try {
        if (comp.matchCondition(message)) {
          return {
            success: true,
            component: comp.component,
            matchedType: comp.type,
            priority: comp.priority
          };
        }
      } catch (error) {
        console.warn(`组件匹配错误 [${comp.type}]:`, error);
      }
    }
    
    // 如果没有匹配的组件，返回默认JSON组件
    return {
      success: false,
      component: DefaultJsonMessage,
      matchedType: 'default-json',
      priority: 0
    };
  }

  // 获取所有注册的组件信息
  static getRegisteredComponents(): MessageComponent[] {
    return [...this.components];
  }

  // 获取组件统计信息
  static getStats(): {
    totalComponents: number;
    componentsByType: Record<string, number>;
  } {
    const stats = {
      totalComponents: this.components.length,
      componentsByType: {} as Record<string, number>
    };

    this.components.forEach(comp => {
      const category = comp.type.split('-')[0];
      stats.componentsByType[category] = (stats.componentsByType[category] || 0) + 1;
    });

    return stats;
  }
}

// 主要的智能消息渲染器
export function SmartMessageRenderer({
  message,
  sessionId,
  theme = 'light',
  isExpanded = false,
  onToggleExpand,
  useChatBubble = false
}: SmartMessageRendererProps) {
  
  // 分析消息
  const messageAnalysis = MessageTypeAnalyzer.analyzeMessage(message);
  
  // 查找匹配的组件
  const matchResult = ComponentRegistry.findMatchingComponent(message);
  
  // 获取要渲染的组件
  const ComponentToRender = matchResult.component;
  
  // 在开发模式下添加调试信息
  if (process.env.NODE_ENV === 'development') {
    console.debug('SmartMessageRenderer Debug:', {
      messageId: message.uuid,
      messageType: message.type,
      analysis: messageAnalysis,
      matchResult: {
        success: matchResult.success,
        matchedType: matchResult.matchedType,
        priority: matchResult.priority
      }
    });
  }
  
  return (
    <div className="smart-message-wrapper" data-message-type={matchResult.matchedType}>
      <ComponentToRender
        message={message}
        sessionId={sessionId}
        theme={theme}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        useChatBubble={useChatBubble}
      />
    </div>
  );
}

// 导出工具类供外部使用
export { ComponentRegistry, MessageTypeAnalyzer };
export type { MessageComponent, MessageComponentProps, ComponentMatchResult }; 
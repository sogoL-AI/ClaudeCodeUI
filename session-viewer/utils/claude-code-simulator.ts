import { ParsedMessage, ToolInvocation } from '@/types/session';

interface SimulatedResponse {
  content: string;
  thinking?: string;
  toolInvocations?: ToolInvocation[];
  usage?: {
    input_tokens: number;
    output_tokens: number;
    service_tier: string;
  };
  subagentResponse?: {
    content: string;
  };
}

// 模拟的工具响应数据
const toolResponses = {
  fileSearch: {
    toolName: 'fileSearch',
    args: { pattern: '*.tsx', directory: 'components' },
    result: {
      files: [
        'components/message-component.tsx',
        'components/session-viewer.tsx',
        'components/interactive-chat-interface.tsx'
      ],
      totalFound: 3
    }
  },
  codeAnalysis: {
    toolName: 'codeAnalysis',
    args: { file: 'components/interactive-chat-interface.tsx' },
    result: {
      complexity: 'medium',
      linesOfCode: 245,
      suggestions: [
        'Consider extracting message handling logic into a custom hook',
        'Add error boundaries for better error handling'
      ]
    }
  },
  Task: {
    toolName: 'Task',
    args: {
      description: 'Code review and optimization',
      prompt: 'Review the interactive chat interface code and provide optimization suggestions',
      subagent_type: 'general-purpose'
    },
    result: 'Task completed successfully. Generated comprehensive code review with 5 optimization suggestions.'
  }
};

// 模拟的思考过程
const thinkingProcesses = [
  "用户询问关于代码优化的问题。我需要分析现有代码结构，识别潜在的改进点，并提供具体的建议。让我先检查代码质量指标。",
  "这是一个关于React组件的问题。我应该关注性能优化、代码可读性和最佳实践。让我分析组件结构和state管理模式。",
  "用户想要了解项目架构。我需要分析文件结构、依赖关系和模块化程度，然后提供改进建议。",
  "这个问题涉及UI/UX改进。我需要考虑用户体验、可访问性和响应式设计原则。",
];

// 模拟的响应内容
const responseTemplates = {
  codeReview: [
    "我已经分析了你的代码，发现了几个可以优化的地方：\n\n1. **性能优化**：建议使用 `useMemo` 和 `useCallback` 来优化重渲染\n2. **代码结构**：可以将复杂的组件拆分为更小的子组件\n3. **类型安全**：添加更严格的TypeScript类型定义\n\n具体的改进建议我会通过工具调用来详细分析。",
    "让我帮你优化这段代码。首先，我会分析当前的代码结构和潜在问题：\n\n**发现的问题：**\n- 组件过于复杂，承担了太多责任\n- 状态管理可以进一步优化\n- 缺少错误处理机制\n\n**建议的改进：**\n- 使用自定义Hook抽取逻辑\n- 添加错误边界\n- 实现更好的加载状态管理",
  ],
  general: [
    "很好的问题！让我来帮你分析一下。根据你的需求，我建议采用以下方案：",
    "我理解你的想法。基于我的分析，这里有几个关键点需要考虑：",
    "这是一个很有意思的挑战。让我通过工具来深入分析一下：",
    "好的，我来帮你解决这个问题。首先让我了解一下当前的情况：",
  ],
  explanation: [
    "让我详细解释一下这个概念：\n\n这涉及到几个重要的技术点，我会逐一为你说明。",
    "这是一个很好的问题！让我从技术原理开始解释：",
    "我来帮你理解这个概念。简单来说：",
  ]
};

const subagentResponses = [
  "Hey! 我是专门的代码分析子代理。我已经完成了对你项目的深度分析，发现了一些很有意思的模式和改进机会。\n\n从架构角度来看，你的组件设计很不错，但还有提升空间。特别是在性能优化和用户体验方面，我有一些具体的建议想和你分享。",
  "你好！作为UI/UX专家子代理，我注意到你的界面设计有很多亮点。流式输出的实现特别棒，给用户很好的实时反馈感。\n\n不过我也发现了几个可以进一步优化的地方，比如响应式设计的某些细节，还有交互动画的流畅性。",
  "Hi there! 我是性能优化专家。刚才分析了你的代码，整体结构很清晰，TypeScript使用也很规范。\n\n在性能方面，我发现了一些可以优化的点，特别是在大量消息渲染时的虚拟化处理，以及状态更新的批处理优化。"
];

export async function simulateClaudeCodeResponse(
  userMessage: string, 
  conversationHistory: ParsedMessage[]
): Promise<SimulatedResponse> {
  // 根据用户输入确定响应类型
  const messageType = categorizeMessage(userMessage);
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  let response: SimulatedResponse = {
    content: generateResponseContent(messageType, userMessage),
    thinking: thinkingProcesses[Math.floor(Math.random() * thinkingProcesses.length)],
    usage: {
      input_tokens: Math.floor(Math.random() * 100) + 50,
      output_tokens: Math.floor(Math.random() * 300) + 100,
      service_tier: 'standard'
    }
  };

  // 根据消息类型决定是否需要工具调用
  if (shouldUseTool(userMessage)) {
    const toolName = selectTool(userMessage);
    response.toolInvocations = [{
      toolCallId: `tool-${Date.now()}`,
      toolName: toolName,
      state: 'call' as const,
      args: toolResponses[toolName as keyof typeof toolResponses]?.args,
      result: toolResponses[toolName as keyof typeof toolResponses]?.result
    }];
  }

  // 某些情况下添加子代理响应
  if (shouldUseSubagent(userMessage)) {
    response.subagentResponse = {
      content: subagentResponses[Math.floor(Math.random() * subagentResponses.length)]
    };
  }

  return response;
}

function categorizeMessage(message: string): 'codeReview' | 'general' | 'explanation' {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('代码') || lowerMessage.includes('优化') || lowerMessage.includes('review')) {
    return 'codeReview';
  }
  
  if (lowerMessage.includes('解释') || lowerMessage.includes('什么是') || lowerMessage.includes('如何')) {
    return 'explanation';
  }
  
  return 'general';
}

function generateResponseContent(type: string, userMessage: string): string {
  const templates = responseTemplates[type as keyof typeof responseTemplates] || responseTemplates.general;
  const baseResponse = templates[Math.floor(Math.random() * templates.length)];
  
  // 根据用户消息定制响应
  if (userMessage.includes('流式输出')) {
    return baseResponse + "\n\n关于流式输出，这是一个很棒的功能。它让用户能够实时看到AI的思考过程，大大提升了用户体验。在技术实现上，我们使用了React的状态管理和异步处理来模拟真实的打字效果。";
  }
  
  if (userMessage.includes('组件')) {
    return baseResponse + "\n\n我注意到你提到了组件。在React开发中，组件的设计模式非常重要。我建议采用组合优于继承的原则，同时确保每个组件都有明确的职责边界。";
  }
  
  return baseResponse + "\n\n我会继续帮你分析和改进项目的各个方面。有什么具体的问题或者想要深入讨论的地方吗？";
}

function shouldUseTool(message: string): boolean {
  const toolTriggers = ['搜索', '分析', '检查', '优化', '查找', 'search', 'analyze', 'find'];
  return toolTriggers.some(trigger => message.toLowerCase().includes(trigger));
}

function selectTool(message: string): string {
  if (message.includes('文件') || message.includes('搜索') || message.includes('search')) {
    return 'fileSearch';
  }
  if (message.includes('分析') || message.includes('代码') || message.includes('analyze')) {
    return 'codeAnalysis';
  }
  return 'Task';
}

function shouldUseSubagent(message: string): boolean {
  const subagentTriggers = ['专家', '深入', '详细', '专门', '复杂'];
  return subagentTriggers.some(trigger => message.includes(trigger)) || Math.random() < 0.3;
}
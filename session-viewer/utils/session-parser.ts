import { SessionMessage, ParsedMessage, ContentPart, ToolInvocation } from '@/types/session';

export function parseSessionMessages(messages: SessionMessage[]): ParsedMessage[] {
  return messages
    .filter(msg => !msg.isMeta && msg.message && msg.message.role) // Filter out meta messages and messages without proper structure
    .map(msg => {
      const parsedMessage: ParsedMessage = {
        id: msg.uuid,
        role: msg.message.role,
        content: extractTextContent(msg.message.content),
        timestamp: msg.timestamp,
        model: msg.message.model,
        usage: msg.message.usage,
        isSidechain: msg.isSidechain,
        parentId: msg.parentUuid || undefined,
      };

      // Extract thinking content
      const thinking = extractThinkingContent(msg.message.content);
      if (thinking) {
        parsedMessage.thinking = thinking;
      }

      // Extract tool invocations
      const toolInvocations = extractToolInvocations(msg.message.content);
      if (toolInvocations.length > 0) {
        parsedMessage.toolInvocations = toolInvocations;
      }

      return parsedMessage;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function extractTextContent(content: string | ContentPart[]): string {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .filter(part => part.type === 'text')
      .map(part => part.text || '')
      .join('\n\n')
      .trim();
  }

  return '';
}

function extractThinkingContent(content: string | ContentPart[]): string | undefined {
  if (typeof content === 'string') {
    return undefined;
  }

  if (Array.isArray(content)) {
    const thinkingParts = content.filter(part => part.type === 'thinking');
    if (thinkingParts.length > 0) {
      return thinkingParts
        .map(part => part.thinking || '')
        .join('\n\n')
        .trim();
    }
  }

  return undefined;
}

function extractToolInvocations(content: string | ContentPart[]): ToolInvocation[] {
  if (typeof content === 'string') {
    return [];
  }

  if (Array.isArray(content)) {
    return content
      .filter(part => part.type === 'tool_use')
      .map(part => ({
        toolCallId: part.id || '',
        toolName: part.name || '',
        state: 'call' as const,
        args: part.input,
      }));
  }

  return [];
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

export function groupMessagesByConversation(messages: ParsedMessage[]): {
  main: ParsedMessage[];
  sidechain: ParsedMessage[];
} {
  return {
    main: messages.filter(msg => !msg.isSidechain),
    sidechain: messages.filter(msg => msg.isSidechain),
  };
}
'use client';

import { useState, useRef, useEffect } from 'react';
import { SessionData, ParsedMessage } from '@/types/session';
import { StreamingMessage } from './streaming-message';
import { MessageInput } from './message-input';
import { SmartSidebar } from './smart-sidebar';
import { parseSessionMessages } from '@/utils/session-parser';
import { simulateClaudeCodeResponse } from '@/utils/claude-code-simulator';
import { Sparkles, Code, Settings } from 'lucide-react';

interface InteractiveChatInterfaceProps {
  sessionData: SessionData;
}

export function InteractiveChatInterface({ sessionData }: InteractiveChatInterfaceProps) {
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<ParsedMessage | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'replay' | 'interactive'>('replay');

  useEffect(() => {
    // 统一时间排序所有消息（包括主对话和子代理）
    const parsedMessages = parseSessionMessages(sessionData.messages);
    const sortedMessages = parsedMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    setMessages(sortedMessages);
  }, [sessionData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: ParsedMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isSidechain: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 模拟Claude Code响应
      const response = await simulateClaudeCodeResponse(content, messages);
      
      // 流式输出效果
      setStreamingMessage({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        model: 'claude-sonnet-4-20250514',
        toolInvocations: response.toolInvocations,
        thinking: response.thinking,
        isSidechain: false,
        usage: response.usage
      });

      // 模拟流式输出
      let currentContent = '';
      const words = response.content.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? ' ' : '') + words[i];
        
        setStreamingMessage(prev => prev ? {
          ...prev,
          content: currentContent
        } : null);
        
        // 随机延迟模拟真实打字效果
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 30));
      }

      // 完成流式输出
      const finalMessage: ParsedMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        model: 'claude-sonnet-4-20250514',
        toolInvocations: response.toolInvocations,
        thinking: response.thinking,
        isSidechain: false,
        usage: response.usage
      };

      setMessages(prev => [...prev, finalMessage]);
      setStreamingMessage(null);

      // 如果有子代理响应，也添加进来
      if (response.subagentResponse) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const subagentMessage: ParsedMessage = {
          id: `subagent-${Date.now()}`,
          role: 'assistant',
          content: response.subagentResponse.content,
          timestamp: new Date().toISOString(),
          model: 'claude-sonnet-4-20250514',
          isSidechain: true
        };

        setMessages(prev => [...prev, subagentMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplayMode = () => {
    setMode('replay');
    // 重新加载原始会话数据
    const parsedMessages = parseSessionMessages(sessionData.messages);
    const sortedMessages = parsedMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    setMessages(sortedMessages);
  };

  const handleInteractiveMode = () => {
    setMode('interactive');
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* 主聊天区域 */}
      <div className={`flex flex-col transition-all duration-300 ${showSidebar ? 'flex-1' : 'w-full'}`}>
        {/* 头部 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Claude Code</h1>
                  <p className="text-sm text-gray-500">Interactive AI Assistant</p>
                </div>
              </div>
              
              {/* 模式切换 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={handleReplayMode}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    mode === 'replay' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📺 Replay
                </button>
                <button
                  onClick={handleInteractiveMode}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    mode === 'interactive' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  💬 Interactive
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Connected
              </div>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {messages.length === 0 && mode === 'interactive' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Code!</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start a conversation with Claude Code. Ask questions, request code reviews, or get help with your project.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <StreamingMessage 
              key={message.id} 
              message={message}
              isStreaming={false}
            />
          ))}

          {streamingMessage && (
            <StreamingMessage 
              message={streamingMessage}
              isStreaming={true}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        {mode === 'interactive' && (
          <div className="border-t border-gray-200 p-6">
            <MessageInput
              value={input}
              onChange={setInput}
              onSend={handleSendMessage}
              isLoading={isLoading}
              placeholder="Ask Claude Code anything..."
            />
          </div>
        )}
      </div>

      {/* 智能侧边栏 */}
      {showSidebar && (
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          <SmartSidebar 
            sessionData={sessionData}
            currentMessages={messages}
            mode={mode}
          />
        </div>
      )}
    </div>
  );
}
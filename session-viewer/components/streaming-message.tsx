'use client';

import { ParsedMessage } from '@/types/session';
import { User, Bot, Wrench, Brain, ChevronDown, ChevronRight, Clock, Cpu, Zap } from 'lucide-react';
import { useState } from 'react';

interface StreamingMessageProps {
  message: ParsedMessage;
  isStreaming?: boolean;
}

export function StreamingMessage({ message, isStreaming = false }: StreamingMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUser = message.role === 'user';
  const hasDetails = message.usage || message.thinking || (message.toolInvocations && message.toolInvocations.length > 0);

  return (
    <div className={`flex gap-4 ${message.isSidechain ? 'ml-8 bg-green-50/50 rounded-lg p-4' : ''}`}>
      {/* 头像 */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
          : message.isSidechain
          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
          : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
      }`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0">
        {/* 消息头部 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">
              {isUser ? 'You' : (message.isSidechain ? 'Subagent' : 'Claude Code')}
            </span>
            {message.model && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {message.model}
              </span>
            )}
            {isStreaming && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span>thinking...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {new Date(message.timestamp).toLocaleString()}
          </div>
        </div>

        {/* 消息内容 */}
        <div className="prose prose-sm max-w-none mb-4">
          <div className={`text-gray-800 leading-relaxed whitespace-pre-wrap ${isStreaming ? 'typing-cursor' : ''}`}>
            {message.content}
            {isStreaming && <span className="animate-pulse">|</span>}
          </div>
        </div>

        {/* 工具调用 */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="space-y-3 mb-4">
            {message.toolInvocations.map((tool, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-orange-900">{tool.toolName}</div>
                    <div className="text-sm text-orange-700">
                      {tool.state === 'call' ? 'Executing...' : 'Completed'}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tool.state === 'call' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {tool.state}
                  </div>
                </div>
                
                {tool.args && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-orange-700 mb-2">Arguments:</div>
                    <div className="bg-orange-100 rounded-lg p-3 text-sm">
                      <pre className="whitespace-pre-wrap text-orange-900 overflow-x-auto">
                        {JSON.stringify(tool.args, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                {tool.result && (
                  <div>
                    <div className="text-xs font-medium text-orange-700 mb-2">Result:</div>
                    <div className="bg-orange-100 rounded-lg p-3 text-sm">
                      <div className="text-orange-900">
                        {typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result, null, 2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 可展开的详细信息 */}
        {hasDetails && (
          <div className="mt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-50 rounded-lg"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <Zap className="w-4 h-4" />
              Details & Analytics
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-4 pl-6 border-l-2 border-gray-100">
                {/* 思考过程 */}
                {message.thinking && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">Reasoning Process</span>
                    </div>
                    <div className="text-sm text-purple-800 whitespace-pre-wrap leading-relaxed">
                      {message.thinking}
                    </div>
                  </div>
                )}

                {/* 使用统计 */}
                {message.usage && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">Usage Statistics</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {message.usage.input_tokens.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Input Tokens</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {message.usage.output_tokens.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Output Tokens</div>
                      </div>
                      {message.usage.cache_creation_input_tokens && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {message.usage.cache_creation_input_tokens.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Cache Created</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-700 capitalize">
                          {message.usage.service_tier}
                        </div>
                        <div className="text-xs text-gray-500">Service Tier</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
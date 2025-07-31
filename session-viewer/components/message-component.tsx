'use client';

import { ParsedMessage } from '@/types/session';
import { User, Bot, Wrench, Brain, ChevronDown, ChevronRight, Clock, Cpu } from 'lucide-react';

interface MessageComponentProps {
  message: ParsedMessage;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isSidechain?: boolean;
}

export function MessageComponent({ 
  message, 
  isExpanded, 
  onToggleExpand, 
  isSidechain = false 
}: MessageComponentProps) {
  const isUser = message.role === 'user';
  const hasDetails = message.usage || message.thinking || (message.toolInvocations && message.toolInvocations.length > 0);

  return (
    <div className={`p-6 ${isSidechain ? 'bg-green-50/50' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-100 text-blue-600' 
            : isSidechain
            ? 'bg-green-100 text-green-600'
            : 'bg-purple-100 text-purple-600'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {isUser ? 'User' : (isSidechain ? 'Subagent' : 'Claude')}
              </span>
              {message.model && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {message.model}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {message.content}
            </div>
          </div>

          {/* Tool Invocations */}
          {message.toolInvocations && message.toolInvocations.length > 0 && (
            <div className="mt-4 space-y-2">
              {message.toolInvocations.map((tool, index) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-900">{tool.toolName}</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      {tool.state}
                    </span>
                  </div>
                  {tool.args && (
                    <div className="mb-2">
                      <div className="text-xs text-orange-700 mb-1">Arguments:</div>
                      <pre className="text-xs bg-orange-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(tool.args, null, 2)}
                      </pre>
                    </div>
                  )}
                  {tool.result && (
                    <div>
                      <div className="text-xs text-orange-700 mb-1">Result:</div>
                      <pre className="text-xs bg-orange-100 p-2 rounded overflow-x-auto">
                        {typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Expandable Details */}
          {hasDetails && (
            <div className="mt-4">
              <button
                onClick={onToggleExpand}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                Details
              </button>

              {isExpanded && (
                <div className="mt-3 space-y-3">
                  {/* Thinking */}
                  {message.thinking && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-purple-900">Thinking</span>
                      </div>
                      <div className="text-sm text-purple-800 whitespace-pre-wrap">
                        {message.thinking}
                      </div>
                    </div>
                  )}

                  {/* Usage Stats */}
                  {message.usage && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Usage Statistics</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <div className="text-gray-500">Input Tokens</div>
                          <div className="font-medium">{message.usage.input_tokens.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Output Tokens</div>
                          <div className="font-medium">{message.usage.output_tokens.toLocaleString()}</div>
                        </div>
                        {message.usage.cache_creation_input_tokens && (
                          <div>
                            <div className="text-gray-500">Cache Created</div>
                            <div className="font-medium">{message.usage.cache_creation_input_tokens.toLocaleString()}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-gray-500">Service Tier</div>
                          <div className="font-medium capitalize">{message.usage.service_tier}</div>
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
    </div>
  );
}
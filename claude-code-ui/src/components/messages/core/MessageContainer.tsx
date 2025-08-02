'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Code, User, Bot, Settings, Sidebar } from 'lucide-react';
import { analyzeMessageType, formatTimestamp, getRelativeTime } from '@/lib/utils/message-utils';
import { generateContentHash } from '@/lib/utils/content-hash';
import { MESSAGE_TYPES, THEMES } from '@/lib/constants/message-types';
import { MessageContainerProps } from '@/lib/types/chat.types';

export function MessageContainer({ 
  message, 
  sessionId, 
  theme, 
  onViewJson,
  isExpanded = false,
  onToggleExpand,
  borderColor,
  customHeader,
  showMetadata = true,
  children,
  isUserMessage,
  contentHash,
  useChatBubble = false // 新增参数
}: MessageContainerProps) {
  // 使用传入的contentHash，如果没有则生成
  const finalContentHash = contentHash || generateContentHash(message);
  const messageType = analyzeMessageType(message);
  const timestamp = formatTimestamp(message.timestamp);
  const relativeTime = getRelativeTime(message.timestamp);
  const isUser = message.type === MESSAGE_TYPES.USER || isUserMessage;

  // 获取消息图标
  const getMessageIcon = () => {
    switch (message.type) {
      case MESSAGE_TYPES.USER:
        return <User className="h-4 w-4" />;
      case MESSAGE_TYPES.ASSISTANT:
        return <Bot className="h-4 w-4" />;
      case MESSAGE_TYPES.SYSTEM:
        return <Settings className="h-4 w-4" />;
      default:
        return <Sidebar className="h-4 w-4" />;
    }
  };

  // 获取消息类型标签
  const getMessageTypeLabel = () => {
    switch (messageType) {
      case 'user-message':
        return '用户消息';
      case 'assistant-message':
        return '助手回复';
      case 'system-message':
        return '系统消息';
      case 'subagent-message':
        return '子代理';
      case 'meta-message':
        return '元数据';
      default:
        return '未知类型';
    }
  };

  // 获取消息类型颜色
  const getMessageTypeColor = () => {
    switch (messageType) {
      case 'user-message':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'assistant-message':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'system-message':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'subagent-message':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'meta-message':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // 聊天气泡样式
  if (useChatBubble && isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] space-y-2">
          {/* 用户消息气泡 */}
          <div className={`
            relative px-4 py-3 rounded-2xl rounded-br-md
            ${theme === THEMES.DARK 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-500 text-white'
            }
            shadow-sm
          `}>
            {/* 气泡尾巴 */}
            <div className={`
              absolute bottom-0 right-0 w-4 h-4
              ${theme === THEMES.DARK ? 'bg-blue-600' : 'bg-blue-500'}
              transform translate-x-1 translate-y-1 rotate-45
            `} />
            
            {/* 消息内容 */}
            <div className="relative z-10">
              {children || (
                <div className="text-sm">
                  {typeof message.message?.content === 'string' 
                    ? message.message.content 
                    : JSON.stringify(message.message?.content)
                  }
                </div>
              )}
            </div>
          </div>

          {/* 时间戳 */}
          <div className="flex justify-end">
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
              {relativeTime}
            </div>
          </div>

          {/* 元数据按钮 */}
          {(onViewJson || onToggleExpand) && (
            <div className="flex justify-end gap-2">
              {onToggleExpand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              )}
              {onViewJson && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewJson}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  <Code className="h-3 w-3 mr-1" />
                  JSON
                </Button>
              )}
            </div>
          )}

          {/* 展开的元数据 */}
          {showMetadata && (
            <Collapsible open={isExpanded}>
              <CollapsibleContent>
                <div className="mt-2">
                  <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-3">
                      <ScrollArea className="max-h-48">
                        <div className="space-y-3">
                          {/* 消息内容 */}
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded border overflow-x-auto">
                              <code>{JSON.stringify(message, null, 2)}</code>
                            </pre>
                          </div>

                          {/* 元数据信息 */}
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="text-gray-600 dark:text-gray-400">
                              <div>会话ID: {sessionId}</div>
                              <div>内容哈希: {finalContentHash.slice(0, 16)}...</div>
                              {message.cwd && <div>工作目录: {message.cwd}</div>}
                              {message.gitBranch && <div>Git分支: {message.gitBranch}</div>}
                              {message.version && <div>版本: {message.version}</div>}
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    );
  }

  // 助手消息气泡样式
  if (useChatBubble && !isUser) {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[80%] space-y-2">
          {/* 助手消息气泡 */}
          <div className={`
            relative px-4 py-3 rounded-2xl rounded-bl-md
            ${theme === THEMES.DARK 
              ? 'bg-gray-700 text-gray-100' 
              : 'bg-gray-100 text-gray-900'
            }
            shadow-sm
          `}>
            {/* 气泡尾巴 */}
            <div className={`
              absolute bottom-0 left-0 w-4 h-4
              ${theme === THEMES.DARK ? 'bg-gray-700' : 'bg-gray-100'}
              transform -translate-x-1 translate-y-1 rotate-45
            `} />
            
            {/* 消息内容 */}
            <div className="relative z-10">
              {children || (
                <div className="text-sm">
                  {typeof message.message?.content === 'string' 
                    ? message.message.content 
                    : JSON.stringify(message.message?.content)
                  }
                </div>
              )}
            </div>
          </div>

          {/* 时间戳 */}
          <div className="flex justify-start">
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
              {relativeTime}
            </div>
          </div>

          {/* 元数据按钮 */}
          {(onViewJson || onToggleExpand) && (
            <div className="flex justify-start gap-2">
              {onToggleExpand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              )}
              {onViewJson && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewJson}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  <Code className="h-3 w-3 mr-1" />
                  JSON
                </Button>
              )}
            </div>
          )}

          {/* 展开的元数据 */}
          {showMetadata && (
            <Collapsible open={isExpanded}>
              <CollapsibleContent>
                <div className="mt-2">
                  <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-3">
                      <ScrollArea className="max-h-48">
                        <div className="space-y-3">
                          {/* 消息内容 */}
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded border overflow-x-auto">
                              <code>{JSON.stringify(message, null, 2)}</code>
                            </pre>
                          </div>

                          {/* 元数据信息 */}
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="text-gray-600 dark:text-gray-400">
                              <div>会话ID: {sessionId}</div>
                              <div>内容哈希: {finalContentHash.slice(0, 16)}...</div>
                              {message.cwd && <div>工作目录: {message.cwd}</div>}
                              {message.gitBranch && <div>Git分支: {message.gitBranch}</div>}
                              {message.version && <div>版本: {message.version}</div>}
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    );
  }

  // 原有的卡片样式（非聊天气泡模式）
  return (
    <Card 
      className={`w-full mb-4 transition-all duration-200 ${
        theme === THEMES.DARK 
          ? 'bg-gray-900 border-gray-700 text-gray-100' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}
      borderColor={borderColor}
    >
      {customHeader || (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                theme === THEMES.DARK ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                {getMessageIcon()}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <Badge className={getMessageTypeColor()}>
                    {getMessageTypeLabel()}
                  </Badge>
                  {message.isSidechain && (
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      子代理
                    </Badge>
                  )}
                  {message.isMeta && (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      元数据
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span title={timestamp}>{relativeTime}</span>
                  {message.uuid && (
                    <span className="ml-2 text-xs">ID: {message.uuid.slice(0, 8)}...</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {onToggleExpand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                  className="h-8 w-8 p-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {onViewJson && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewJson}
                  className="h-8 px-2"
                >
                  <Code className="h-4 w-4 mr-1" />
                  JSON
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      {children && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}

      {showMetadata && (
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <Separator className="mb-4" />
            <CardContent className="pt-0">
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {/* 消息内容 */}
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code>{JSON.stringify(message, null, 2)}</code>
                    </pre>
                  </div>

                  {/* 元数据信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">基本信息</h4>
                      <div className="space-y-1 text-gray-600 dark:text-gray-400">
                        <div>会话ID: {sessionId}</div>
                        <div>内容哈希: {finalContentHash.slice(0, 16)}...</div>
                        {message.cwd && <div>工作目录: {message.cwd}</div>}
                        {message.gitBranch && <div>Git分支: {message.gitBranch}</div>}
                        {message.version && <div>版本: {message.version}</div>}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">时间信息</h4>
                      <div className="space-y-1 text-gray-600 dark:text-gray-400">
                        <div>绝对时间: {timestamp}</div>
                        <div>相对时间: {relativeTime}</div>
                        {message.parentUuid && (
                          <div>父消息: {message.parentUuid.slice(0, 8)}...</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
} 
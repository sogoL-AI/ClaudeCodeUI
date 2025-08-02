'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { User, Terminal, Wrench, GitBranch, ChevronDown, ChevronRight, Code } from 'lucide-react';
import { MessageContainer } from '../../messages/core';
import { BadgeGroup, StatusIndicator, ContentHash, Timestamp } from '../../messages';
import { CodeRenderer, JsonRenderer } from '../../messages/renderers';
import { ChatMessage, MessageComponentProps } from '@/lib/types/chat.types';

type UserMessageProps = MessageComponentProps;

export function UserMessage({ 
  message, 
  sessionId, 
  theme = 'light',
  isExpanded = false,
  onToggleExpand,
  useChatBubble = false
}: UserMessageProps) {
  const [isJsonExpanded, setIsJsonExpanded] = useState(false);
  
  const isMeta = message.isMeta;
  const isSidechain = message.isSidechain;
  const content = message.message?.content;
  
  // 检查内容类型
  const hasToolResult = Array.isArray(content) && content.some((item) => item.type === 'tool_result');
  const contentString = typeof content === 'string' ? content : '';
  const hasCommandContent = contentString.includes('<command-name>') || contentString.includes('<local-command-stdout>');
  
  // 生成内容哈希
  const generateContentHash = (message: ChatMessage): string => {
    const jsonString = JSON.stringify(message, null, 0);
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  const contentHash = generateContentHash(message);

  // 准备标签数据
  const badges = [];
  if (isMeta) {
    badges.push({ label: 'Meta', color: 'orange' });
  }
  if (isSidechain) {
    badges.push({ label: 'Sidechain', color: 'purple' });
  }
  if (hasToolResult) {
    badges.push({ label: '工具结果', color: 'yellow' });
  }
  if (hasCommandContent) {
    badges.push({ label: '命令消息', color: 'green' });
  }

  // 获取消息图标
  const getMessageIcon = () => {
    if (hasCommandContent) return <Terminal className="h-4 w-4" />;
    if (hasToolResult) return <Wrench className="h-4 w-4" />;
    if (isSidechain) return <GitBranch className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getMessageLabel = () => {
    if (hasCommandContent) return '命令消息';
    if (hasToolResult) return '工具结果';
    if (isSidechain) return 'Sidechain消息';
    return '用户消息';
  };

  // 获取边框颜色 (十六进制)
  const getBorderColor = () => {
    if (hasCommandContent) return '#10b981'; // emerald-500 (命令消息)
    if (hasToolResult) return '#f59e0b'; // amber-500 (工具结果)
    if (isSidechain) return '#8b5cf6'; // violet-500 (Sidechain)
    if (isMeta) return '#f97316'; // orange-500 (Meta)
    return '#3b82f6'; // blue-500 (普通用户消息)
  };

  // 条件判断调试
  // 简单用户消息 - 使用聊天气泡
  if (!hasToolResult && !hasCommandContent && !isMeta && !isSidechain) {
    return (
      <MessageContainer
        message={message}
        sessionId={sessionId}
        contentHash={contentHash}
        theme={theme}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        isUserMessage={true}
        borderColor={getBorderColor()}
        onViewJson={() => {}}
        useChatBubble={useChatBubble}
      >
        <div className="text-sm">
          {typeof content === 'string' ? content : JSON.stringify(content)}
        </div>
      </MessageContainer>
    );
  }

  // 复杂用户消息 - 使用卡片样式
  return (
    <MessageContainer
      message={message}
      sessionId={sessionId}
      contentHash={contentHash}
      theme={theme}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      showMetadata={false}
      borderColor={getBorderColor()}
      onViewJson={() => {}}
      customHeader={
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {getMessageIcon()}
            <span className="font-medium text-blue-900 dark:text-blue-100">
              {getMessageLabel()}
            </span>
            <BadgeGroup badges={badges} />
          </div>
          <div className="flex items-center gap-2">
            <Timestamp timestamp={message.timestamp} format="both" variant="inline" />
            <ContentHash content={message} variant="badge" showCopyButton />
          </div>
        </div>
      }
    >
      <div className="space-y-4 p-4">
        {/* 工具结果内容 */}
        {hasToolResult && (
          <div className="space-y-3">
            <StatusIndicator status="completed" label="工具执行结果" variant="card" />
            {Array.isArray(content) && content.map((item, index: number) => {
              if (item.type === 'tool_result') {
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Tool ID: {item.tool_use_id}
                      </Badge>
                      {item.is_error && (
                        <StatusIndicator status="error" />
                      )}
                    </div>
                    <JsonRenderer 
                      data={item.content} 
                      theme={theme}
                      isCollapsible
                      title="工具结果内容"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* 命令内容 */}
        {hasCommandContent && (
          <div className="space-y-3">
            <StatusIndicator status="processing" label="命令执行" variant="card" />
            <CodeRenderer 
              code={contentString}
              language="bash"
              theme={theme}
              fileName="command-output"
            />
          </div>
        )}

        {/* 普通文本内容 */}
        {!hasToolResult && !hasCommandContent && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
            {typeof content === 'string' ? (
              <CodeRenderer 
                code={content}
                language="text"
                theme={theme}
                showLanguage={false}
                showCopyButton={false}
              />
            ) : (
              <JsonRenderer 
                data={content} 
                theme={theme}
                isCollapsible
                defaultExpanded={false}
              />
            )}
          </div>
        )}

        {/* 额外元数据 */}
        {(message.cwd || message.gitBranch || message.version) && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h5 className="font-medium mb-2 text-sm">环境信息</h5>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              {message.cwd && (
                <div><span className="font-medium">工作目录:</span> {message.cwd}</div>
              )}
              {message.gitBranch && (
                <div><span className="font-medium">Git分支:</span> {message.gitBranch}</div>
              )}
              {message.version && (
                <div><span className="font-medium">版本:</span> {message.version}</div>
              )}
            </div>
          </div>
        )}

        {/* 集成JSON展示 */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <Collapsible open={isJsonExpanded} onOpenChange={setIsJsonExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span>查看完整JSON数据</span>
                </div>
                {isJsonExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="max-h-80 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <JsonRenderer 
                  data={message} 
                  theme={theme}
                  isCollapsible={false}
                  showCopyButton={true}
                  maxHeight="max-h-80"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </MessageContainer>
  );
} 
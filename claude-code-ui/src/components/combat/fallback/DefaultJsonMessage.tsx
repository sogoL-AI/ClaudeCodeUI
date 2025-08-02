'use client';

import React, { useState } from 'react';
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertCircle, ChevronDown, ChevronRight, Code } from 'lucide-react';
import { MessageContainer } from '../../messages/core';
import { BadgeGroup, ContentHash, Timestamp } from '../../messages';
import { JsonRenderer } from '../../messages/renderers';
import { ChatMessage, MessageComponentProps } from '@/lib/types/chat.types';

type DefaultJsonMessageProps = MessageComponentProps;

export function DefaultJsonMessage({ 
  message, 
  sessionId, 
  theme = 'light',
  isExpanded = false,
  onToggleExpand,
  useChatBubble = false
}: DefaultJsonMessageProps) {
  const [isJsonExpanded, setIsJsonExpanded] = useState(false);
  
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
  
  // 分析消息类型
  const messageType = message.type || 'unknown';
  const hasSpecialFlags = message.isMeta || message.isSidechain || message.isVisibleInTranscriptOnly;
  
  // 获取消息类型标签
  const getMessageTypeLabel = () => {
    switch (messageType) {
      case 'user':
        return '用户消息';
      case 'assistant':
        return '助手消息';
      case 'system':
        return '系统消息';
      default:
        return '未知类型';
    }
  };

  // 获取消息类型颜色
  const getMessageTypeColor = () => {
    switch (messageType) {
      case 'user':
        return 'blue';
      case 'assistant':
        return 'green';
      case 'system':
        return 'gray';
      default:
        return 'red';
    }
  };

  // 获取边框颜色 (十六进制)
  const getBorderColor = () => {
    switch (messageType) {
      case 'user':
        return '#3b82f6'; // blue-500
      case 'assistant':
        return '#10b981'; // emerald-500
      case 'system':
        return '#6b7280'; // gray-500
      default:
        return '#ef4444'; // red-500
    }
  };

  // 准备标签数据
  const badges = [
    { label: getMessageTypeLabel(), color: getMessageTypeColor() }
  ];
  
  if (hasSpecialFlags) {
    if (message.isMeta) badges.push({ label: 'Meta', color: 'orange' });
    if (message.isSidechain) badges.push({ label: 'Sidechain', color: 'purple' });
    if (message.isVisibleInTranscriptOnly) badges.push({ label: '仅转录可见', color: 'yellow' });
  }

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
      useChatBubble={useChatBubble}
      isUserMessage={messageType === 'user'}
      customHeader={
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-900 dark:text-red-100">
                默认JSON展示
              </span>
              <BadgeGroup badges={badges} />
            </div>
            <div className="flex items-center gap-2">
              <Timestamp timestamp={message.timestamp} format="both" variant="inline" />
              <ContentHash content={message} variant="badge" showCopyButton />
            </div>
          </div>
        </CardHeader>
      }
    >
      <div className="w-full">
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
    </MessageContainer>
  );
} 
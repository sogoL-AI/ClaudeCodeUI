'use client';

import React, { useState, useEffect } from 'react';
import { SmartMessageRenderer } from '@/components/combat/SmartMessageRenderer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Clock, Database } from 'lucide-react';
import { SessionData } from '@/lib/types/chat.types';

export default function SessionViewerPage() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [useChatBubble, setUseChatBubble] = useState<boolean>(true);

  // 加载session数据
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/session-data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSessionData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load session data:', err);
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, []);

  // 格式化时间
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">加载Session数据中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-800">
              <FileText className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">加载失败</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>没有找到Session数据</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Session 查看器
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              查看和分析 Claude 会话数据
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              size="sm"
            >
              浅色主题
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              size="sm"
            >
              深色主题
            </Button>
            <Button
              variant={useChatBubble ? 'default' : 'outline'}
              onClick={() => setUseChatBubble(!useChatBubble)}
              size="sm"
            >
              {useChatBubble ? '聊天气泡' : '卡片样式'}
            </Button>
          </div>
        </div>

        {/* Session信息卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Session 信息</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Session ID: {sessionData.session_id}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">提取时间</div>
                  <div className="text-xs text-gray-600">
                    {formatDate(sessionData.extraction_time)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">消息数量</div>
                  <div className="text-xs text-gray-600">
                    {sessionData.messages.length} 条消息
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">源文件</div>
                  <div className="text-xs text-gray-600">
                    {sessionData.source_files.length} 个文件
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 消息列表 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-800">
              消息时间线
            </Badge>
            <span className="text-sm text-gray-600">
              共 {sessionData.messages.length} 条消息
            </span>
          </div>
          
          {sessionData.messages.map((message, index) => (
            <div key={message.uuid || index} className="relative">
              {/* 消息序号 */}
              <div className="absolute -left-8 top-4 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {index + 1}
              </div>
              
              {/* 智能消息渲染器 */}
              <SmartMessageRenderer
                message={message}
                sessionId={sessionData.session_id}
                theme={theme}
                useChatBubble={useChatBubble}
              />
            </div>
          ))}
        </div>

        {/* 底部统计 */}
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                已处理 {sessionData.messages.length} 条消息
              </span>
              <span>
                Session ID: {sessionData.session_id}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
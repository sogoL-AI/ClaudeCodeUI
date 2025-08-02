'use client';

import React, { useState, useEffect } from 'react';
import { SmartMessageRenderer } from '@/components/combat/SmartMessageRenderer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Code } from 'lucide-react';
import { SessionData } from '@/lib/types/chat.types';

export default function TestPage() {
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

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-lg">加载Session数据中...</span>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-800">
              <MessageSquare className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">加载失败</h3>
                <p className="text-sm">{error || '没有找到Session数据'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 只显示前10条消息用于测试
  const testMessages = sessionData.messages.slice(0, 10);

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              聊天气泡测试
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              测试用户消息的聊天气泡展示效果
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

        {/* 测试信息 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              <h2 className="text-lg font-semibold">测试信息</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium">当前模式</div>
                <div className="text-gray-600">
                  {useChatBubble ? '聊天气泡模式' : '卡片样式模式'}
                </div>
              </div>
              <div>
                <div className="font-medium">主题</div>
                <div className="text-gray-600">
                  {theme === 'light' ? '浅色主题' : '深色主题'}
                </div>
              </div>
              <div>
                <div className="font-medium">测试消息数</div>
                <div className="text-gray-600">
                  {testMessages.length} 条消息
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 消息列表 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-medium">消息展示</span>
          </div>
          
          {testMessages.map((message, index) => (
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

        {/* 说明 */}
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>聊天气泡模式：</strong>用户消息显示在右边，使用蓝色气泡样式</p>
              <p><strong>卡片样式模式：</strong>所有消息使用统一的卡片样式展示</p>
              <p><strong>切换说明：</strong>点击右上角的&ldquo;聊天气泡/卡片样式&rdquo;按钮可以切换展示模式</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
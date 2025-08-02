'use client';

import React from 'react';

export interface MarkdownRendererProps {
  content: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export function MarkdownRenderer({ 
  content, 
  theme = 'light',
  className = ''
}: MarkdownRendererProps) {
  
  // 简单的Markdown解析 - 这里可以替换为更强大的库如react-markdown
  const parseMarkdown = (text: string) => {
    return text
      // 代码块
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-2 overflow-x-auto"><code>$1</code></pre>')
      // 行内代码
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // 标题
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // 列表
      .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      // 换行
      .replace(/\n/g, '<br />');
  };

  const parsedContent = parseMarkdown(content);

  return (
    <div 
      className={`prose prose-sm max-w-none ${
        theme === 'dark' ? 'prose-invert' : ''
      } ${className}`}
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  );
} 
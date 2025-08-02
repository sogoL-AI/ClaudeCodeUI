'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

export interface TimestampProps {
  timestamp: string;
  format?: 'relative' | 'absolute' | 'both';
  showIcon?: boolean;
  variant?: 'badge' | 'inline' | 'full';
  locale?: string;
  className?: string;
}

export function Timestamp({ 
  timestamp, 
  format = 'relative',
  showIcon = true,
  variant = 'inline',
  locale = 'zh-CN',
  className = ''
}: TimestampProps) {
  
  const formatAbsoluteTime = (timestamp: string, locale: string) => {
    try {
      return new Date(timestamp).toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      const now = new Date();
      const messageTime = new Date(timestamp);
      const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);
      
      if (diffInSeconds < 60) return '刚刚';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`;
      return `${Math.floor(diffInSeconds / 31536000)}年前`;
    } catch {
      return '未知时间';
    }
  };

  const absoluteTime = formatAbsoluteTime(timestamp, locale);
  const relativeTime = formatRelativeTime(timestamp);

  const getDisplayText = () => {
    if (format === 'absolute') return absoluteTime;
    if (format === 'relative') return relativeTime;
    if (format === 'both') return `${relativeTime} (${absoluteTime})`;
    return relativeTime;
  };

  const renderContent = () => (
    <>
      {showIcon && (
        <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
      )}
      <span className="text-sm">
        {getDisplayText()}
      </span>
    </>
  );

  if (variant === 'badge') {
    return (
      <Badge variant="secondary" className={className}>
        <div className="flex items-center space-x-1">
          {renderContent()}
        </div>
      </Badge>
    );
  }

  if (variant === 'inline') {
    return (
      <div 
        className={`flex items-center space-x-1 text-gray-600 dark:text-gray-400 ${className}`}
        title={format !== 'absolute' ? absoluteTime : undefined}
      >
        {renderContent()}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`space-y-1 p-2 bg-gray-50 dark:bg-gray-800 rounded ${className}`}>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium">时间信息</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div>相对时间: {relativeTime}</div>
          <div>绝对时间: {absoluteTime}</div>
        </div>
      </div>
    );
  }

  return null;
} 
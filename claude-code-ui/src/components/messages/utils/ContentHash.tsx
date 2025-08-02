'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Hash } from 'lucide-react';

export interface ContentHashProps {
  content: any;
  algorithm?: 'sha256' | 'md5' | 'simple';
  displayLength?: number;
  showCopyButton?: boolean;
  showIcon?: boolean;
  variant?: 'badge' | 'inline' | 'full';
  className?: string;
}

export function ContentHash({ 
  content, 
  algorithm = 'simple',
  displayLength = 8,
  showCopyButton = false,
  showIcon = true,
  variant = 'badge',
  className = ''
}: ContentHashProps) {
  const [isCopied, setIsCopied] = useState(false);

  // 生成内容哈希
  const generateHash = (data: any, algo: string): string => {
    const jsonString = JSON.stringify(data, null, 0);
    
    if (algo === 'simple') {
      // 简单哈希算法
      let hash = 0;
      for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
      }
      return Math.abs(hash).toString(16).padStart(8, '0');
    }
    
    // 对于更复杂的哈希，可以集成crypto库
    // 这里暂时使用简单哈希
    return generateHash(data, 'simple');
  };

  const fullHash = generateHash(content, algorithm);
  const displayHash = fullHash.slice(0, displayLength);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullHash);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  const renderContent = () => (
    <>
      {showIcon && <Hash className="h-3 w-3" />}
      <span className="font-mono text-xs">
        {variant === 'full' ? fullHash : displayHash}
        {variant !== 'full' && '...'}
      </span>
      {showCopyButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-4 w-4 p-0 ml-1"
        >
          {isCopied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      )}
    </>
  );

  if (variant === 'badge') {
    return (
      <Badge variant="secondary" className={`${className}`}>
        <div className="flex items-center space-x-1">
          {renderContent()}
        </div>
      </Badge>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-1 text-gray-600 dark:text-gray-400 ${className}`}>
        {renderContent()}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded ${className}`}>
        {renderContent()}
      </div>
    );
  }

  return null;
} 
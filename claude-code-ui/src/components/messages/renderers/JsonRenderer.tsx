'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

export interface JsonRendererProps {
  data: unknown;
  theme?: 'light' | 'dark';
  maxHeight?: string;
  showCopyButton?: boolean;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  title?: string;
}

export function JsonRenderer({ 
  data, 
  theme = 'light',
  maxHeight = 'max-h-96',
  showCopyButton = true,
  isCollapsible = false,
  defaultExpanded = true,
  title = 'JSON 数据'
}: JsonRendererProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatJsonWithSyntaxHighlight = (jsonStr: string) => {
    // 简单的语法高亮
    return jsonStr
      .replace(/(".*?")(:\s*)/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>$2')
      .replace(/(:\s*)(".*?")/g, '$1<span class="text-green-600 dark:text-green-400">$2</span>')
      .replace(/(:\s*)(true|false|null)/g, '$1<span class="text-purple-600 dark:text-purple-400">$2</span>')
      .replace(/(:\s*)(\d+)/g, '$1<span class="text-orange-600 dark:text-orange-400">$2</span>');
  };

  const content = (
    <div className="relative">
      {showCopyButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
      
      <ScrollArea className={maxHeight}>
        <pre 
          className={`text-sm p-4 rounded-lg overflow-x-auto ${
            theme === 'dark' 
              ? 'bg-gray-800 text-gray-100' 
              : 'bg-gray-50 text-gray-900'
          }`}
        >
          <code 
            dangerouslySetInnerHTML={{ 
              __html: formatJsonWithSyntaxHighlight(jsonString) 
            }}
          />
        </pre>
      </ScrollArea>
    </div>
  );

  if (isCollapsible) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto font-normal">
              <div className="flex items-center space-x-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{title}</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            {content}
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return content;
} 
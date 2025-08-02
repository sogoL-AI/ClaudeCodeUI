'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';

export interface CodeRendererProps {
  code: string;
  language?: string;
  theme?: 'light' | 'dark';
  maxHeight?: string;
  showCopyButton?: boolean;
  showLanguage?: boolean;
  fileName?: string;
}

export function CodeRenderer({ 
  code, 
  language = 'text',
  theme = 'light',
  maxHeight = 'max-h-96',
  showCopyButton = true,
  showLanguage = true,
  fileName
}: CodeRendererProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 简单的语法高亮 - 可以替换为更强大的库如prism.js或highlight.js
  const applySyntaxHighlight = (code: string, lang: string) => {
    if (lang === 'javascript' || lang === 'typescript' || lang === 'jsx' || lang === 'tsx') {
      return code
        .replace(/(const|let|var|function|class|interface|type|export|import|return|if|else|for|while|do|switch|case|default|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|static|abstract|async|await)/g, 
          '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>')
        .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="text-green-600 dark:text-green-400">$1</span>')
        .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="text-gray-500 dark:text-gray-400 italic">$1</span>')
        .replace(/(\d+)/g, '<span class="text-orange-600 dark:text-orange-400">$1</span>');
    }
    
    if (lang === 'python') {
      return code
        .replace(/(def|class|import|from|return|if|elif|else|for|while|try|except|finally|with|as|lambda|global|nonlocal|pass|break|continue|yield|raise|assert|del|in|is|not|and|or)/g, 
          '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>')
        .replace(/('.*?'|".*?"|'''[\s\S]*?'''|"""[\s\S]*?""")/g, '<span class="text-green-600 dark:text-green-400">$1</span>')
        .replace(/(#.*$)/gm, '<span class="text-gray-500 dark:text-gray-400 italic">$1</span>')
        .replace(/(\d+)/g, '<span class="text-orange-600 dark:text-orange-400">$1</span>');
    }

    return code;
  };

  const highlightedCode = applySyntaxHighlight(code, language);

  return (
    <div className="relative">
      {/* 头部信息 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {fileName && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {fileName}
            </span>
          )}
          {showLanguage && language && (
            <Badge variant="secondary" className="text-xs">
              {language}
            </Badge>
          )}
        </div>
        
        {showCopyButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* 代码内容 */}
      <ScrollArea className={maxHeight}>
        <pre 
          className={`text-sm p-4 rounded-lg overflow-x-auto font-mono ${
            theme === 'dark' 
              ? 'bg-gray-900 text-gray-100 border border-gray-700' 
              : 'bg-gray-50 text-gray-900 border border-gray-200'
          }`}
        >
          <code 
            dangerouslySetInnerHTML={{ 
              __html: highlightedCode 
            }}
          />
        </pre>
      </ScrollArea>
    </div>
  );
} 
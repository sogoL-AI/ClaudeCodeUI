'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Mic, Image, Code, Zap, Command } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  value, 
  onChange, 
  onSend, 
  isLoading, 
  placeholder = "Type your message..." 
}: MessageInputProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickSuggestions = [
    { icon: '🔍', text: 'Search through my codebase', category: 'analysis' },
    { icon: '🐛', text: 'Help me debug this error', category: 'debug' },
    { icon: '⚡', text: 'Optimize this code', category: 'improvement' },
    { icon: '📚', text: 'Explain this concept', category: 'learning' },
    { icon: '🚀', text: 'Deploy this project', category: 'deployment' },
    { icon: '🧪', text: 'Write tests for this function', category: 'testing' }
  ];

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    if (e.key === '/' && value === '') {
      setShowSuggestions(true);
    }
  };

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value);
      setAttachments([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  // 自动调整文本框高度
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="relative">
      {/* 快速建议 */}
      {showSuggestions && (
        <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mb-2 max-h-60 overflow-y-auto z-10">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Command className="w-4 h-4" />
              Quick Commands
            </div>
          </div>
          <div className="p-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
              >
                <span className="text-lg">{suggestion.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {suggestion.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 附件预览 */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              <Paperclip className="w-3 h-3" />
              <span className="truncate max-w-20">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="hover:text-blue-900 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <div className="flex">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                adjustTextareaHeight();
                if (e.target.value === '' && showSuggestions) {
                  setShowSuggestions(false);
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(false)}
              placeholder={placeholder}
              className="w-full px-4 py-3 pr-12 resize-none border-0 focus:outline-none focus:ring-0 rounded-xl text-gray-900 placeholder-gray-500"
              rows={1}
              style={{ minHeight: '48px' }}
              disabled={isLoading}
            />
            
            {/* 快捷操作提示 */}
            {value === '' && !showSuggestions && (
              <div className="absolute right-4 top-3 text-xs text-gray-400">
                Type <kbd className="px-1 py-0.5 bg-gray-100 rounded">/ </kbd> for commands
              </div>
            )}
          </div>
        </div>

        {/* 底部工具栏 */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {/* 文件上传 */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.md,.json,.js,.ts,.tsx,.jsx,.py"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Attach files"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* 更多工具 */}
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Add image"
            >
              <Image className="w-4 h-4" />
            </button>
            
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Code snippet"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* 字符计数 */}
            <div className="text-xs text-gray-400">
              {value.length}/2000
            </div>

            {/* 发送按钮 */}
            <button
              onClick={handleSend}
              disabled={!value.trim() || isLoading}
              className={`p-2 rounded-lg transition-all ${
                value.trim() && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Send message (Enter)"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Enter</kbd> to send</span>
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded">Shift + Enter</kbd> for new line</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>AI-powered responses</span>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { SessionData, ParsedMessage } from '@/types/session';
import { 
  BarChart3, 
  FileText, 
  Search, 
  Download, 
  Share2, 
  Sparkles,
  Clock,
  Code,
  Brain,
  Zap,
  TrendingUp
} from 'lucide-react';

interface SmartSidebarProps {
  sessionData: SessionData;
  currentMessages: ParsedMessage[];
  mode: 'replay' | 'interactive';
}

export function SmartSidebar({ currentMessages }: SmartSidebarProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'search' | 'insights' | 'export'>('analytics');

  const stats = {
    totalMessages: currentMessages.length,
    userMessages: currentMessages.filter(m => m.role === 'user').length,
    assistantMessages: currentMessages.filter(m => m.role === 'assistant' && !m.isSidechain).length,
    subagentMessages: currentMessages.filter(m => m.isSidechain).length,
    toolCalls: currentMessages.reduce((acc, m) => acc + (m.toolInvocations?.length || 0), 0),
    totalTokens: currentMessages.reduce((acc, m) => acc + (m.usage?.input_tokens || 0) + (m.usage?.output_tokens || 0), 0)
  };

  const tabs = [
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'insights', icon: Brain, label: 'Insights' },
    { id: 'export', icon: Download, label: 'Export' }
  ] as const;

  return (
    <div className="h-full flex flex-col">
      {/* 标签页导航 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* 会话概览 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Session Overview
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalMessages}</div>
                  <div className="text-xs text-blue-600">Total Messages</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.toolCalls}</div>
                  <div className="text-xs text-green-600">Tool Calls</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.subagentMessages}</div>
                  <div className="text-xs text-purple-600">Subagent</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(stats.totalTokens / 1000)}K
                  </div>
                  <div className="text-xs text-orange-600">Tokens</div>
                </div>
              </div>

              {/* 消息类型分布 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Message Distribution</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">User Messages</span>
                    </div>
                    <span className="text-sm font-medium">{stats.userMessages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Claude Responses</span>
                    </div>
                    <span className="text-sm font-medium">{stats.assistantMessages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Subagent</span>
                    </div>
                    <span className="text-sm font-medium">{stats.subagentMessages}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 活动时间线 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Activity Timeline
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {currentMessages.slice(-5).map((message) => (
                  <div key={message.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      message.role === 'user' ? 'bg-blue-500' : 
                      message.isSidechain ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-gray-700 truncate">
                      {message.content.slice(0, 30)}...
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Smart Search</h3>
            </div>

            {/* 搜索框 */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages, code, or concepts..."
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>

            {/* 快速过滤器 */}
            <div className="flex flex-wrap gap-2">
              {['All', 'User', 'Claude', 'Subagent', 'Tools', 'Errors'].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* 智能建议 */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Suggested Searches</h4>
              <div className="space-y-2">
                {[
                  '🔍 Tool usage patterns',
                  '💭 Thinking processes',
                  '⚠️ Error messages',
                  '📊 Token usage spikes'
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            </div>

            {/* 智能摘要 */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h4 className="font-medium text-purple-900">Session Summary</h4>
              </div>
              <p className="text-sm text-purple-800">
                This session shows an exploration of Claude Code&apos;s subagent capabilities, 
                with multiple tool invocations and interactive demonstrations.
              </p>
            </div>

            {/* 趋势分析 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Patterns</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Most used tool</span>
                  <span className="font-medium">Task</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Average response time</span>
                  <span className="font-medium">2.3s</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Primary language</span>
                  <span className="font-medium">Chinese</span>
                </div>
              </div>
            </div>

            {/* 建议 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-600" />
                <h4 className="font-medium text-green-900">Recommendations</h4>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Try using more specific prompts for better results</li>
                <li>• Consider breaking complex tasks into smaller steps</li>
                <li>• Explore more tool combinations for efficiency</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Export & Share</h3>
            </div>

            {/* 导出选项 */}
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Export as Markdown</div>
                  <div className="text-sm text-gray-500">Full conversation with formatting</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <Code className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Export Code Snippets</div>
                  <div className="text-sm text-gray-500">Extract all code examples</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Analytics Report</div>
                  <div className="text-sm text-gray-500">Detailed usage statistics</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <Share2 className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900">Share Link</div>
                  <div className="text-sm text-gray-500">Generate shareable URL</div>
                </div>
              </button>
            </div>

            {/* 自定义导出 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Custom Export</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" defaultChecked />
                  <span className="text-sm text-gray-600">Include timestamps</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" defaultChecked />
                  <span className="text-sm text-gray-600">Include thinking processes</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" />
                  <span className="text-sm text-gray-600">Include usage statistics</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" />
                  <span className="text-sm text-gray-600">Include subagent conversations</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
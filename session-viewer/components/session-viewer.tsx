'use client';

import { useState } from 'react';
import { SessionData } from '@/types/session';
import { MessageComponent } from './message-component';
import { parseSessionMessages } from '@/utils/session-parser';
import { Filter, User, Bot } from 'lucide-react';

interface SessionViewerProps {
  sessionData: SessionData;
}

export function SessionViewer({ sessionData }: SessionViewerProps) {
  const [showSidechain, setShowSidechain] = useState(true);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const parsedMessages = parseSessionMessages(sessionData.messages);
  const mainMessages = parsedMessages.filter(msg => !msg.isSidechain);
  const sidechainMessages = parsedMessages.filter(msg => msg.isSidechain);

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Filters */}
      <div className="mb-6 flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <Filter className="w-5 h-5 text-gray-500" />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showSidechain}
            onChange={(e) => setShowSidechain(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium">Show subagent conversations</span>
        </label>
      </div>

      {/* Main Conversation */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="bg-blue-50 px-6 py-3 border-b">
            <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Main Conversation ({mainMessages.length} messages)
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {mainMessages.map((message) => (
              <div key={message.id} className="relative">
                <MessageComponent 
                  message={message} 
                  isExpanded={expandedMessages.has(message.id)}
                  onToggleExpand={() => toggleMessageExpansion(message.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sidechain Conversations */}
        {showSidechain && sidechainMessages.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-green-50 px-6 py-3 border-b">
              <h2 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Subagent Conversations ({sidechainMessages.length} messages)
              </h2>
              <p className="text-sm text-green-700 mt-1">
                These are conversations between the main assistant and specialized subagents
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {sidechainMessages.map((message) => (
                <div key={message.id} className="relative">
                  <MessageComponent 
                    message={message} 
                    isExpanded={expandedMessages.has(message.id)}
                    onToggleExpand={() => toggleMessageExpansion(message.id)}
                    isSidechain={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
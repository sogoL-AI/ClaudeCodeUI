'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface BadgeItem {
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  color?: string;
  className?: string;
}

export interface BadgeGroupProps {
  badges: BadgeItem[];
  theme?: 'light' | 'dark';
  spacing?: 'sm' | 'md' | 'lg';
  wrap?: boolean;
  className?: string;
}

export function BadgeGroup({ 
  badges, 
  theme = 'light',
  spacing = 'md',
  wrap = true,
  className = ''
}: BadgeGroupProps) {
  
  const spacingClasses = {
    sm: 'space-x-1',
    md: 'space-x-2',
    lg: 'space-x-3'
  };

  const getColorClasses = (color?: string) => {
    if (!color) return '';
    
    // 预定义的颜色主题
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    };

    return colorMap[color] || '';
  };

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex ${wrap ? 'flex-wrap' : ''} ${spacingClasses[spacing]} ${className}`}>
      {badges.map((badge, index) => (
        <Badge
          key={index}
          variant={badge.variant || 'default'}
          className={`
            ${getColorClasses(badge.color)}
            ${badge.className || ''}
          `}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  );
} 
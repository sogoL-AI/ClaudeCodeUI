'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Loader2, 
  Info,
  Zap,
  AlertTriangle
} from 'lucide-react';

export type StatusType = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'pending' 
  | 'loading' 
  | 'processing'
  | 'completed';

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'inline' | 'card';
  theme?: 'light' | 'dark';
  className?: string;
}

export function StatusIndicator({ 
  status, 
  label,
  showIcon = true,
  showLabel = true,
  size = 'md',
  variant = 'badge',
  theme = 'light',
  className = ''
}: StatusIndicatorProps) {
  
  // 获取状态配置
  const getStatusConfig = (status: StatusType) => {
    const configs = {
      success: {
        icon: CheckCircle,
        label: label || '成功',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        borderColor: 'border-green-200 dark:border-green-800',
        animate: false
      },
      error: {
        icon: XCircle,
        label: label || '错误',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        borderColor: 'border-red-200 dark:border-red-800',
        animate: false
      },
      warning: {
        icon: AlertTriangle,
        label: label || '警告',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        animate: false
      },
      info: {
        icon: Info,
        label: label || '信息',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        borderColor: 'border-blue-200 dark:border-blue-800',
        animate: false
      },
      pending: {
        icon: Clock,
        label: label || '待处理',
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        borderColor: 'border-gray-200 dark:border-gray-800',
        animate: false
      },
      loading: {
        icon: Loader2,
        label: label || '加载中',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        borderColor: 'border-blue-200 dark:border-blue-800',
        animate: true
      },
      processing: {
        icon: Zap,
        label: label || '处理中',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        borderColor: 'border-purple-200 dark:border-purple-800',
        animate: false
      },
      completed: {
        icon: CheckCircle,
        label: label || '已完成',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        borderColor: 'border-green-200 dark:border-green-800',
        animate: false
      }
    };

    return configs[status];
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  // 图标尺寸
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  // 渲染内容
  const renderContent = () => (
    <>
      {showIcon && (
        <Icon 
          className={`${iconSizes[size]} ${config.color} ${
            config.animate ? 'animate-spin' : ''
          }`} 
        />
      )}
      {showLabel && config.label && (
        <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
          {config.label}
        </span>
      )}
    </>
  );

  // 根据变体渲染不同样式
  if (variant === 'badge') {
    return (
      <Badge className={`${config.bgColor} ${className}`}>
        <div className="flex items-center space-x-1">
          {renderContent()}
        </div>
      </Badge>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {renderContent()}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`
        flex items-center space-x-2 p-2 rounded-lg border 
        ${config.bgColor} ${config.borderColor} ${className}
      `}>
        {renderContent()}
      </div>
    );
  }

  return null;
} 
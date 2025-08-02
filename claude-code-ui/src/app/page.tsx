import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Code, Database, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ClaudeCodeUI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Claude 会话数据可视化平台
          </p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Next.js 14
            </Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              TypeScript
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              shadcn/ui
            </Badge>
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              Tailwind CSS
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <CardTitle>消息展示</CardTitle>
              </div>
              <CardDescription>
                支持 414+ 种消息类型的可视化展示
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                基于真实数据分析，提供智能的消息类型识别和组件渲染
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-green-600" />
                <CardTitle>组件系统</CardTitle>
              </div>
              <CardDescription>
                15-20 个核心组件覆盖 99%+ 场景
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                模块化组件设计，支持主题切换和响应式布局
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-6 w-6 text-purple-600" />
                <CardTitle>数据管理</CardTitle>
              </div>
              <CardDescription>
                智能去重和缓存优化
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                基于内容哈希的去重机制，提升性能和用户体验
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-orange-600" />
                <CardTitle>性能优化</CardTitle>
              </div>
              <CardDescription>
                懒加载和虚拟滚动
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                针对大量消息的渲染优化，确保流畅的用户体验
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
                <CardTitle>工具集成</CardTitle>
              </div>
              <CardDescription>
                支持多种工具调用展示
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bash、Edit、Read、Todo等工具的专用组件
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-teal-600" />
                <CardTitle>AI 生成</CardTitle>
              </div>
              <CardDescription>
                基于 Prompt 的组件生成
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                使用 AI 根据消息结构自动生成对应组件
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              开始使用
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              查看示例会话或上传你的会话数据
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg">
              <Link href="/session-viewer">
                查看会话
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/test">
                聊天气泡测试
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              上传数据
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

# AI SDK 文档自动化爬取工具

这个项目用于自动化爬取 [AI SDK](https://ai-sdk.dev/) 官方文档的 Markdown 内容。

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装 Python 依赖
pip install -r requirements.txt

# 安装 Playwright 浏览器
playwright install chromium
```

### 2. 运行爬取

```bash
# 显示当前进度
python main.py --progress

# 爬取所有页面（跳过已爬取的页面）
python main.py

# 爬取所有页面（不跳过已爬取的页面）
python main.py --no-resume

# 爬取单个页面
python main.py --page introduction

# 使用无头模式（不显示浏览器）
python main.py --headless

# 查看帮助
python main.py --help
```

### 3. 测试功能

```bash
# 运行测试套件
python tests/test_scraper.py

# 运行单页面演示
python tests/demo_single_page.py
```

## 📁 项目结构

```
AI-SDK-DOCS/
├── ORIGINAL_PROMPT.md                 # 原始需求文档
├── ai-sdk-docs-scraping-status.json  # 爬取状态跟踪文件
├── main.py                            # 新的主入口脚本
├── requirements.txt                   # Python依赖
├── README.md                          # 说明文档
├── src/                               # 源代码包
│   ├── __init__.py
│   ├── scraper/                       # 爬取器模块
│   │   ├── __init__.py
│   │   ├── ai_sdk_scraper.py          # 核心爬取器类
│   │   └── config.py                  # 配置管理
│   └── utils/                         # 工具函数
│       ├── __init__.py
│       ├── file_utils.py              # 文件操作工具
│       └── logger.py                  # 日志工具
├── tests/                             # 测试和演示脚本
│   ├── __init__.py
│   ├── test_scraper.py                # 测试脚本
│   └── demo_single_page.py            # 单页面演示脚本
├── docs/                              # 爬取的文档存储目录
│   ├── root/                          # 根级别页面
│   ├── foundations/                   # 基础概念
│   ├── getting-started/               # 入门指南
│   ├── ai-sdk-core/                   # AI SDK Core 文档
│   ├── ai-sdk-ui/                     # AI SDK UI 文档
│   ├── ai-sdk-rsc/                    # AI SDK RSC 文档
│   ├── advanced/                      # 高级主题
│   ├── reference/                     # API 参考
│   ├── migration-guides/              # 迁移指南
│   └── troubleshooting/               # 故障排除
└── 旧版脚本/                          # 保留的旧版脚本（可选）
    ├── scrape_ai_sdk_docs.py          # 旧版主要爬取脚本
    ├── test_scraper.py                # 旧版测试脚本
    └── demo_single_page.py            # 旧版演示脚本
```

## ✨ 功能特性

- ✅ **模块化设计**: 采用包结构，代码组织清晰
- ✅ **完整页面发现**: 自动展开侧边栏获取所有107个文档页面
- ✅ **状态跟踪**: JSON文件记录每个页面的爬取状态
- ✅ **目录组织**: 按文档类别自动组织文件结构
- ✅ **Markdown获取**: 使用页面的"Copy markdown"按钮获取官方格式化内容
- ✅ **进度保存**: 定期保存进度，可中断后继续
- ✅ **错误处理**: 完善的错误处理和重试机制
- ✅ **日志记录**: 详细的日志记录和调试信息
- ✅ **配置管理**: 灵活的配置选项
- ✅ **命令行接口**: 丰富的命令行选项

## 🔧 配置选项

主要配置在 `src/scraper/config.py` 中：

```python
# 基础配置
BASE_URL = "https://ai-sdk.dev"
HEADLESS = True  # 是否使用无头浏览器
DELAY_BETWEEN_REQUESTS = 2  # 请求间隔秒数
MAX_RETRIES = 3  # 最大重试次数

# 超时配置
BROWSER_TIMEOUT = 30000  # 浏览器超时时间
PAGE_LOAD_TIMEOUT = 30000  # 页面加载超时时间
```

## 📊 使用示例

### 查看当前进度

```bash
$ python main.py --progress
================================
AI SDK 文档爬取进度
================================
总页面数: 99
已爬取: 20
剩余: 79
进度: 20.2%
最后更新: 2025-07-31T21:09:09.880837Z
================================
```

### 爬取特定页面

```python
from src.scraper import AISDKDocsScraper, ScraperConfig

# 创建配置
config = ScraperConfig()
config.HEADLESS = False  # 显示浏览器

# 创建爬取器
scraper = AISDKDocsScraper(config)

# 爬取单个页面
success = scraper.scrape_single_page('introduction')
```

## 🧪 测试

运行完整测试套件：

```bash
python tests/test_scraper.py
```

测试包括：
- 依赖项检查
- 配置类测试  
- 状态文件测试
- 目录结构测试
- 爬取器初始化测试

## 🛠️ 技术实现

### 爬取方式
- 使用 Playwright 自动化浏览器
- 模拟用户点击"Copy markdown"按钮
- 从剪贴板获取内容（确保获取官方格式化的 Markdown）

### 目录映射
- `root`: 根级别页面（introduction, ai-sdk-5-beta）
- `foundations`: 基础概念相关页面
- `getting-started`: 入门指南
- `ai-sdk-core`: AI SDK Core 相关文档
- `ai-sdk-ui`: AI SDK UI 相关文档
- `ai-sdk-rsc`: AI SDK RSC 相关文档
- `advanced`: 高级主题
- `reference`: API 参考文档
- `migration-guides`: 版本迁移指南
- `troubleshooting`: 故障排除指南

### 文件命名
文件名基于 URL 路径生成，例如:
- `/docs/foundations/overview` → `foundations_overview.md`
- `/docs/ai-sdk-core/generating-text` → `ai-sdk-core_generating-text.md`

## ⚠️ 注意事项

1. **网络连接**: 确保网络连接稳定
2. **浏览器权限**: 脚本需要剪贴板读取权限
3. **爬取礼仪**: 脚本在请求间有2秒延迟，请勿频繁运行
4. **内容更新**: AI SDK 文档可能会更新，建议定期重新爬取

## 🐛 错误处理

- 页面加载超时: 30秒超时，失败后重试
- 按钮未找到: 记录错误并继续下一个页面  
- 剪贴板为空: 重试机制或跳过
- 网络错误: 自动重试机制

## 📋 状态文件格式

`ai-sdk-docs-scraping-status.json` 包含:

```json
{
  "baseUrl": "https://ai-sdk.dev",
  "totalPages": 99,
  "scrapedPages": 20,
  "lastUpdated": "2025-07-31T21:09:09.880837Z",
  "pages": {
    "introduction": {
      "url": "/docs/introduction",
      "title": "AI SDK by Vercel",
      "category": "root",
      "scraped": true,
      "filePath": "docs/root/introduction.md",
      "lastScraped": "2025-07-31T20:35:00.821836Z"
    }
    // ... 更多页面
  }
}
```

## 🤝 贡献

如果发现问题或有改进建议，请提交 Issue 或 Pull Request。

## 📝 许可证

本项目仅用于学习和研究目的，请遵守 AI SDK 官方网站的使用条款。

## 📚 原始需求

查看 [ORIGINAL_PROMPT.md](ORIGINAL_PROMPT.md) 了解项目的原始需求和实现目标。
#!/usr/bin/env python3

"""
爬取器测试脚本

使用新的包结构测试爬取器功能。
"""

import sys
import json
from pathlib import Path

# 添加src目录到Python路径
project_root = Path(__file__).parent.parent
src_path = project_root / 'src'
sys.path.insert(0, str(src_path))

from src.scraper import AISDKDocsScraper, ScraperConfig
from src.utils import setup_logging, get_logger, count_files_in_directory


def test_config():
    """测试配置类"""
    print("🧪 测试配置类...")
    
    config = ScraperConfig()
    
    print(f"  ✅ 基础URL: {config.BASE_URL}")
    print(f"  ✅ 状态文件: {config.STATUS_FILE}")
    print(f"  ✅ 文档目录: {config.DOCS_DIR}")
    print(f"  ✅ 类别目录数量: {len(config.CATEGORY_DIRS)}")
    
    # 测试路径生成
    test_path = config.get_output_path('foundations', 'test.md')
    print(f"  ✅ 路径生成测试: {test_path}")
    
    return True


def test_status_file():
    """测试状态文件"""
    print("\n🧪 测试状态文件...")
    
    config = ScraperConfig()
    
    if not config.STATUS_FILE.exists():
        print("  ❌ 状态文件不存在!")
        return False
    
    try:
        with open(config.STATUS_FILE, 'r', encoding='utf-8') as f:
            status_data = json.load(f)
        
        print(f"  ✅ 状态文件加载成功")
        print(f"  📊 总页面数: {status_data.get('totalPages', 0)}")
        print(f"  📊 已爬取页面数: {status_data.get('scrapedPages', 0)}")
        print(f"  📊 最后更新: {status_data.get('lastUpdated', 'Unknown')}")
        
        # 检查几个示例页面
        pages = status_data.get('pages', {})
        sample_pages = ['introduction', 'foundations', 'ai-sdk-core']
        
        for page_key in sample_pages:
            if page_key in pages:
                page = pages[page_key]
                status = "✅" if page.get('scraped', False) else "⏳"
                print(f"  {status} {page_key}: {page.get('title', 'Unknown')} ({page.get('url', 'Unknown')})")
            else:
                print(f"  ❓ {page_key}: 未找到")
        
        return True
        
    except Exception as e:
        print(f"  ❌ 状态文件加载失败: {e}")
        return False


def test_directory_structure():
    """测试目录结构"""
    print("\n🧪 测试目录结构...")
    
    config = ScraperConfig()
    
    if not config.DOCS_DIR.exists():
        print(f"  ❌ 文档目录不存在: {config.DOCS_DIR}")
        return False
    
    print(f"  ✅ 文档目录存在: {config.DOCS_DIR}")
    
    for category, dir_name in config.CATEGORY_DIRS.items():
        category_dir = config.DOCS_DIR / dir_name
        if category_dir.exists():
            file_count = count_files_in_directory(category_dir, "*.md")
            print(f"  ✅ {category}: {file_count} 个.md文件")
        else:
            print(f"  ❌ {category}: 目录不存在")
    
    return True


def test_scraper_init():
    """测试爬取器初始化"""
    print("\n🧪 测试爬取器初始化...")
    
    try:
        scraper = AISDKDocsScraper()
        
        print(f"  ✅ 爬取器创建成功")
        
        # 测试进度信息
        progress = scraper.get_progress_info()
        print(f"  📊 总页面: {progress['total_pages']}")
        print(f"  📊 已爬取: {progress['scraped_pages']}")
        print(f"  📊 进度: {progress['progress_percentage']:.1f}%")
        
        return True
        
    except Exception as e:
        print(f"  ❌ 爬取器初始化失败: {e}")
        return False


def test_dependencies():
    """测试依赖项"""
    print("\n🧪 测试依赖项...")
    
    try:
        from playwright.sync_api import sync_playwright
        print("  ✅ Playwright 已安装")
    except ImportError:
        print("  ❌ Playwright 未安装")
        print("     请运行: pip install playwright")
        print("     然后运行: playwright install chromium")
        return False
    
    # 测试其他导入
    try:
        import json, time, re
        from datetime import datetime
        print("  ✅ 标准库模块正常")
    except ImportError as e:
        print(f"  ❌ 标准库导入失败: {e}")
        return False
    
    return True


def main():
    """主测试函数"""
    print("🧪 AI SDK 爬取器测试套件")
    print("=" * 50)
    
    # 设置日志
    setup_logging(level='INFO')
    
    tests = [
        ("依赖项检查", test_dependencies),
        ("配置类测试", test_config),
        ("状态文件测试", test_status_file),
        ("目录结构测试", test_directory_structure),
        ("爬取器初始化测试", test_scraper_init),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            if test_func():
                print(f"✅ {test_name} 通过")
                passed += 1
            else:
                print(f"❌ {test_name} 失败")
        except Exception as e:
            print(f"❌ {test_name} 出错: {e}")
    
    print(f"\n{'='*50}")
    print(f"测试结果: {passed}/{total} 通过")
    
    if passed == total:
        print("🎉 所有测试通过!")
        return True
    else:
        print("⚠️  部分测试失败，请检查配置")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
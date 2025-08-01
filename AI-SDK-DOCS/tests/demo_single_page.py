#!/usr/bin/env python3

"""
单页面演示脚本

使用新的包结构演示单页面爬取功能。
"""

import sys
from pathlib import Path

# 添加src目录到Python路径
project_root = Path(__file__).parent.parent
src_path = project_root / 'src'
sys.path.insert(0, str(src_path))

from src.scraper import AISDKDocsScraper, ScraperConfig
from src.utils import setup_logging, get_logger


def demo_single_page_scraping():
    """演示单页面爬取"""
    
    print("🚀 AI SDK 单页面爬取演示")
    print("=" * 50)
    
    # 设置日志
    setup_logging(level='INFO')
    logger = get_logger(__name__)
    
    try:
        # 创建配置（显示浏览器窗口以便观察）
        config = ScraperConfig()
        config.HEADLESS = False  # 显示浏览器
        
        # 创建爬取器
        logger.info("创建爬取器...")
        scraper = AISDKDocsScraper(config)
        
        # 显示当前进度
        progress = scraper.get_progress_info()
        logger.info(f"当前进度: {progress['scraped_pages']}/{progress['total_pages']} ({progress['progress_percentage']:.1f}%)")
        
        # 选择要演示的页面
        demo_pages = ['introduction', 'foundations', 'ai-sdk-core']
        
        for page_key in demo_pages:
            if page_key in scraper.status_data['pages']:
                page_data = scraper.status_data['pages'][page_key]
                
                logger.info(f"\n📍 演示页面: {page_data['title']}")
                logger.info(f"🔗 URL: {config.BASE_URL}{page_data['url']}")
                
                if page_data['scraped']:
                    logger.info("✅ 该页面已经爬取过，跳过演示")
                    continue
                
                # 询问用户是否要爬取这个页面
                user_input = input(f"是否要爬取页面 '{page_data['title']}'? (y/n): ").lower().strip()
                
                if user_input == 'y':
                    logger.info("开始爬取...")
                    success = scraper.scrape_single_page(page_key)
                    
                    if success:
                        logger.info("🎉 爬取成功!")
                        
                        # 显示保存的文件信息
                        if page_data.get('filePath'):
                            file_path = project_root / page_data['filePath']
                            if file_path.exists():
                                file_size = file_path.stat().st_size
                                logger.info(f"📁 文件路径: {file_path}")
                                logger.info(f"📏 文件大小: {file_size} 字节")
                                
                                # 显示文件内容预览
                                with open(file_path, 'r', encoding='utf-8') as f:
                                    content = f.read()
                                    preview = content[:300] + "..." if len(content) > 300 else content
                                    logger.info(f"📄 内容预览:\n{preview}")
                    else:
                        logger.error("❌ 爬取失败")
                
                else:
                    logger.info("跳过此页面")
                
                # 询问是否继续
                if input("\n继续演示下一个页面? (y/n): ").lower().strip() != 'y':
                    break
            else:
                logger.warning(f"页面 '{page_key}' 不存在于状态文件中")
        
        # 显示最终进度
        final_progress = scraper.get_progress_info()
        logger.info(f"\n最终进度: {final_progress['scraped_pages']}/{final_progress['total_pages']} ({final_progress['progress_percentage']:.1f}%)")
        
    except KeyboardInterrupt:
        logger.info("用户中断了演示")
    except Exception as e:
        logger.error(f"演示过程中发生错误: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n🏁 演示完成!")


def list_available_pages():
    """列出可用页面"""
    print("\n📋 可用页面列表:")
    print("-" * 50)
    
    try:
        scraper = AISDKDocsScraper()
        
        for category in ['root', 'foundations', 'getting-started', 'ai-sdk-core', 'ai-sdk-ui']:
            print(f"\n📂 {category.upper()}:")
            
            category_pages = [
                (key, data) for key, data in scraper.status_data['pages'].items() 
                if data.get('category') == category
            ]
            
            for page_key, page_data in category_pages[:5]:  # 只显示前5个
                status = "✅" if page_data.get('scraped') else "⏳"
                print(f"  {status} {page_key}: {page_data.get('title', 'Unknown')}")
            
            if len(category_pages) > 5:
                print(f"  ... 还有 {len(category_pages) - 5} 个页面")
    
    except Exception as e:
        print(f"无法加载页面列表: {e}")


def main():
    """主函数"""
    print("选择演示模式:")
    print("1. 交互式单页面爬取演示")
    print("2. 列出所有可用页面")
    print("3. 退出")
    
    while True:
        choice = input("\n请选择 (1-3): ").strip()
        
        if choice == '1':
            demo_single_page_scraping()
            break
        elif choice == '2':
            list_available_pages()
            break
        elif choice == '3':
            print("再见!")
            break
        else:
            print("无效选择，请选择 1-3")


if __name__ == "__main__":
    main()
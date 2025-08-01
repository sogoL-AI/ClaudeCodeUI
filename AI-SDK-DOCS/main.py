#!/usr/bin/env python3

"""
AI SDK 文档爬取工具 - 主入口脚本

使用重构后的包结构运行文档爬取任务。
"""

import sys
import argparse
from pathlib import Path

# 添加src目录到Python路径
src_path = Path(__file__).parent / 'src'
sys.path.insert(0, str(src_path))

from src.scraper import AISDKDocsScraper, ScraperConfig
from src.utils import setup_logging, get_logger


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='AI SDK 文档爬取工具')
    parser.add_argument('--page', type=str, help='爬取单个页面（通过页面键）')
    parser.add_argument('--headless', action='store_true', help='使用无头浏览器模式')
    parser.add_argument('--no-resume', action='store_true', help='不跳过已爬取的页面')
    parser.add_argument('--config', type=str, help='配置文件路径（可选）')
    parser.add_argument('--log-level', type=str, default='INFO', 
                       choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
                       help='日志级别')
    parser.add_argument('--log-file', type=str, help='日志文件路径（可选）')
    parser.add_argument('--progress', action='store_true', help='显示当前进度')
    
    args = parser.parse_args()
    
    # 设置日志
    setup_logging(
        level=getattr(sys.modules['logging'], args.log_level),
        log_file=args.log_file
    )
    
    logger = get_logger(__name__)
    
    try:
        # 创建配置
        config = ScraperConfig()
        if args.headless:
            config.HEADLESS = True
        
        # 创建爬取器
        scraper = AISDKDocsScraper(config)
        
        if args.progress:
            # 显示进度信息
            progress = scraper.get_progress_info()
            logger.info("=" * 50)
            logger.info("AI SDK 文档爬取进度")
            logger.info("=" * 50)
            logger.info(f"总页面数: {progress['total_pages']}")
            logger.info(f"已爬取: {progress['scraped_pages']}")
            logger.info(f"剩余: {progress['remaining_pages']}")
            logger.info(f"进度: {progress['progress_percentage']:.1f}%")
            logger.info(f"最后更新: {progress['last_updated']}")
            logger.info("=" * 50)
            return
        
        if args.page:
            # 爬取单个页面
            logger.info(f"开始爬取单个页面: {args.page}")
            success = scraper.scrape_single_page(args.page)
            if success:
                logger.info("单页面爬取成功!")
            else:
                logger.error("单页面爬取失败!")
                sys.exit(1)
        else:
            # 爬取所有页面
            logger.info("开始爬取所有页面...")
            resume = not args.no_resume
            scraper.scrape_all_pages(resume=resume)
            logger.info("爬取任务完成!")
    
    except KeyboardInterrupt:
        logger.info("用户中断了爬取过程")
        sys.exit(0)
    except Exception as e:
        logger.error(f"爬取过程中发生错误: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
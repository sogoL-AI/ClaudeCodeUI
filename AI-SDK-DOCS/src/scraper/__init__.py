"""
AI SDK 文档爬取器模块

提供核心的文档爬取功能。
"""

from .ai_sdk_scraper import AISDKDocsScraper
from .config import ScraperConfig

__all__ = ['AISDKDocsScraper', 'ScraperConfig']
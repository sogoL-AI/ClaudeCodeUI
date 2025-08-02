import crypto from 'crypto';

/**
 * 生成内容哈希值，用于去重和缓存
 * @param content 要哈希的内容
 * @returns SHA-256哈希值
 */
export function generateContentHash(content: any): string {
  const contentString = typeof content === 'string' 
    ? content 
    : JSON.stringify(content);
  
  return crypto
    .createHash('sha256')
    .update(contentString)
    .digest('hex');
}

/**
 * 生成消息的唯一标识
 * @param message 消息对象
 * @returns 唯一标识
 */
export function generateMessageId(message: any): string {
  const key = message.uuid || message.id || message.timestamp;
  return generateContentHash(key);
}

/**
 * 检查两个内容是否相同
 * @param content1 内容1
 * @param content2 内容2
 * @returns 是否相同
 */
export function isContentEqual(content1: any, content2: any): boolean {
  const hash1 = generateContentHash(content1);
  const hash2 = generateContentHash(content2);
  return hash1 === hash2;
} 
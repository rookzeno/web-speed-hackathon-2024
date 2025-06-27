import { createMiddleware } from 'hono/factory';

export const cacheControlMiddleware = createMiddleware(async (c, next) => {
  await next();
  
  const url = new URL(c.req.url);
  
  // 画像、フォント、Service Workerは長期間キャッシュ
  if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/assets/') || url.pathname.endsWith('.global.js')) {
    c.res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return;
  }
  
  // リリース情報APIは短期間キャッシュ（変更頻度が低いため）
  if (url.pathname.startsWith('/api/v1/releases/')) {
    c.res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    return;
  }
  
  // その他は従来通り
  c.res.headers.append('Cache-Control', 'private');
  c.res.headers.append('Cache-Control', 'no-store');
});

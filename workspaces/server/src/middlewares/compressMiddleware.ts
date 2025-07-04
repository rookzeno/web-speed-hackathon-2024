import { encoding } from '@hapi/accept';
import { ZstdInit } from '@oneidentity/zstd-js/asm/index.cjs.js';
import { createMiddleware } from 'hono/factory';

const zstdInit = ZstdInit();

export const compressMiddleware = createMiddleware(async (c, next) => {
  await next();
  const { ZstdStream } = await zstdInit;

  const accept = encoding(c.req.header('Accept-Encoding'), ['zstd']);

  switch (accept) {
    case 'zstd': {
      const transform = new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          controller.enqueue(ZstdStream.compress(chunk, 6, false)); // 圧縮レベルを下げて速度向上
        },
      });

      c.res = new Response(c.res.body?.pipeThrough(transform), c.res);

      c.res.headers.delete('Content-Length');
      c.res.headers.append('Cache-Control', 'no-transform');
      c.res.headers.set('Content-Encoding', 'zstd');
      break;
    }
    default: {
      c.res.headers.append('Cache-Control', 'no-transform');
      break;
    }
  }
});

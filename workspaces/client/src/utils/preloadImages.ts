import path from 'path-browserify';

async function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function preloadImages() {
  if (process.env['PATH_LIST'] == null) {
    return;
  }

  const imagePathList: string[] = process.env['PATH_LIST'].split(',').filter((imagePath) => {
    const extension = path.parse(imagePath).ext.toLowerCase();
    return ['.bmp', '.jpg', '.jpeg', '.gif', '.png', '.webp', '.avif'].includes(extension);
  });

  // 最初の10個の画像のみプリロード（重要度が高いもの）
  const priorityImages = imagePathList.slice(0, 10);
  
  // AVIFサポートを確認
  const supportsAVIF = await checkAVIFSupport();
  const supportsWebP = await checkWebPSupport();

  const prefetch = Promise.all(
    priorityImages.map((imagePath) => {
      return new Promise((resolve) => {
        const link = document.createElement('link');
        
        // 最適化されたフォーマットのURLを生成
        let optimizedPath = imagePath;
        if (supportsAVIF) {
          optimizedPath += '?format=avif';
        } else if (supportsWebP) {
          optimizedPath += '?format=webp';
        }

        Object.assign(link, {
          as: 'image',
          crossOrigin: 'anonymous',
          fetchPriority: 'high',
          href: optimizedPath,
          onerror: resolve,
          onload: resolve,
          rel: 'preload',
        });
        document.head.appendChild(link);
      });
    }),
  );

  await Promise.race([prefetch, wait(3000)]);
}

async function checkAVIFSupport(): Promise<boolean> {
  try {
    return 'createImageBitmap' in window && 
           await createImageBitmap(new Blob()).then(() => true, () => false);
  } catch {
    return false;
  }
}

async function checkWebPSupport(): Promise<boolean> {
  try {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  } catch {
    return false;
  }
}

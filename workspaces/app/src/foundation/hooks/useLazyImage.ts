import { useAsync } from 'react-use';

import { getImageUrl } from '../../lib/image/getImageUrl';

import { useLazyLoad } from './useLazyLoad';

export const useLazyImage = ({ height, imageId, width }: { height: number; imageId: string; width: number }) => {
  const [ref, isIntersecting] = useLazyLoad<HTMLDivElement>();

  const { value } = useAsync(async () => {
    if (!isIntersecting) return null;

    const dpr = window.devicePixelRatio;

    const img = new Image();
    img.src = getImageUrl({
      format: 'jpg',
      height: height * dpr,
      imageId,
      width: width * dpr,
    });

    await img.decode();

    const canvas = document.createElement('canvas');
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d')!;

    // Draw image to canvas as object-fit: cover
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const targetAspect = width / height;

    if (imgAspect > targetAspect) {
      const srcW = img.naturalHeight * targetAspect;
      const srcH = img.naturalHeight;
      const srcX = (img.naturalWidth - srcW) / 2;
      const srcY = 0;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, width * dpr, height * dpr);
    } else {
      const srcW = img.naturalWidth;
      const srcH = img.naturalWidth / targetAspect;
      const srcX = 0;
      const srcY = (img.naturalHeight - srcH) / 2;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, width * dpr, height * dpr);
    }

    return canvas.toDataURL('image/png');
  }, [height, imageId, width, isIntersecting]);

  return { imageSrc: value, ref };
};

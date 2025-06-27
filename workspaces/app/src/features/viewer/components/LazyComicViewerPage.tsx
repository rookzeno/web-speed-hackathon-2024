import { useRef } from 'react';
import { useAsync } from 'react-use';
import styled from 'styled-components';

import { decrypt } from '@wsh-2024/image-encrypt/src/decrypt';

import { useLazyLoad } from '../../../foundation/hooks/useLazyLoad';
import { getImageUrl } from '../../../lib/image/getImageUrl';

const _Canvas = styled.canvas`
  height: 100%;
  width: auto;
  flex-grow: 0;
  flex-shrink: 0;
`;

const _Placeholder = styled.div`
  height: 100%;
  width: auto;
  flex-grow: 0;
  flex-shrink: 0;
  background-color: #1a1a1a;
`;

type Props = {
  pageImageId: string;
};

export const LazyComicViewerPage = ({ pageImageId }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerRef, isIntersecting] = useLazyLoad<HTMLDivElement>({
    rootMargin: '200px', // 200px前から読み込み開始
    threshold: 0,
  });

  useAsync(async () => {
    if (!isIntersecting) return;

    const image = new Image();
    image.src = getImageUrl({
      format: 'jxl',
      imageId: pageImageId,
    });
    await image.decode();

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d')!;

    decrypt({
      exportCanvasContext: ctx,
      sourceImage: image,
      sourceImageInfo: {
        height: image.naturalHeight,
        width: image.naturalWidth,
      },
    });

    canvas.setAttribute('role', 'img');
  }, [pageImageId, isIntersecting]);

  if (!isIntersecting) {
    return <_Placeholder ref={containerRef} />;
  }

  return <_Canvas ref={canvasRef} />;
};

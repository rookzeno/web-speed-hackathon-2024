import type * as CSS from 'csstype';
import { useState } from 'react';
import styled from 'styled-components';

import { addUnitIfNeeded } from '../../lib/css/addUnitIfNeeded';
import { useLazyLoad } from '../hooks/useLazyLoad';

const StyledImage = styled.img<{
  $height: number | string;
  $objectFit: string;
  $width: number | string;
}>`
  object-fit: ${({ $objectFit }) => $objectFit};
  width: ${({ $width }) => addUnitIfNeeded($width)};
  height: ${({ $height }) => addUnitIfNeeded($height)};
  display: block;
`;

const Placeholder = styled.div<{
  $height: number | string;
  $width: number | string;
}>`
  width: ${({ $width }) => addUnitIfNeeded($width)};
  height: ${({ $height }) => addUnitIfNeeded($height)};
  background-color: #f0f0f0;
  display: block;
`;

type Props = {
  height: number | string;
  objectFit: CSS.Property.ObjectFit;
  width: number | string;
} & Omit<JSX.IntrinsicElements['img'], 'loading'>;

export const LazyImage: React.FC<Props> = ({ height, objectFit, src, width, ...rest }) => {
  const [ref, isIntersecting] = useLazyLoad<HTMLDivElement>();
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isIntersecting) {
    return <Placeholder ref={ref} $height={height} $width={width} />;
  }

  return (
    <StyledImage
      {...rest}
      $height={height}
      $objectFit={objectFit}
      $width={width}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      src={src}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    />
  );
};

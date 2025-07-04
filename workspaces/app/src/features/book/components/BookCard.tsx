import { Suspense } from 'react';
import { styled } from 'styled-components';

import type { GetReleaseResponse } from '@wsh-2024/schema/src/api/releases/GetReleaseResponse';

import { Flex } from '../../../foundation/components/Flex';
import { Image } from '../../../foundation/components/Image';
import { Link } from '../../../foundation/components/Link';
import { Text } from '../../../foundation/components/Text';
import { useLazyImage } from '../../../foundation/hooks/useLazyImage';
import { Color, Radius, Space, Typography } from '../../../foundation/styles/variables';

const _Wrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: ${Radius.SMALL};
  background-color: ${Color.MONO_A};
  max-width: 192px;
  border: 1px solid ${Color.MONO_30};
`;

const _ImgWrapper = styled.div`
  > img {
    border-radius: ${Radius.SMALL} ${Radius.SMALL} 0 0;
  }
`;

const _AvatarWrapper = styled.div`
  width: 32px;
  height: 32px;
  > img {
    border-radius: 50%;
  }
`;

const _PlaceholderImg = styled.div<{ $height: number; $width: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  background-color: ${Color.MONO_30};
  border-radius: ${Radius.SMALL} ${Radius.SMALL} 0 0;
`;

const _PlaceholderAvatar = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background-color: ${Color.MONO_30};
  border-radius: 50%;
`;

type Props = {
  book: GetReleaseResponse['books'][number];
};

const BookCard: React.FC<Props> = ({ book }) => {
  const { imageSrc: imageUrl, ref: imgRef } = useLazyImage({ height: 128, imageId: book.image.id, width: 192 });
  const { imageSrc: authorImageUrl, ref: avatarRef } = useLazyImage({
    height: 32,
    imageId: book.author.image.id,
    width: 32,
  });

  return (
    <_Wrapper href={`/books/${book.id}`}>
      {imageUrl != null ? (
        <_ImgWrapper>
          <Image alt={book.image.alt} height={128} objectFit="cover" src={imageUrl} width={192} />
        </_ImgWrapper>
      ) : (
        <_PlaceholderImg ref={imgRef} $height={128} $width={192} />
      )}

      <Flex align="stretch" direction="column" flexGrow={1} gap={Space * 1} justify="space-between" p={Space * 2}>
        <Text color={Color.MONO_100} typography={Typography.NORMAL14} weight="bold">
          {book.name}
        </Text>

        <Flex align="center" gap={Space * 1} justify="flex-end">
          {authorImageUrl != null ? (
            <_AvatarWrapper>
              <Image alt={book.author.name} height={32} objectFit="cover" src={authorImageUrl} width={32} />
            </_AvatarWrapper>
          ) : (
            <_PlaceholderAvatar ref={avatarRef} $size={32} />
          )}
          <Text color={Color.MONO_100} typography={Typography.NORMAL12}>
            {book.author.name}
          </Text>
        </Flex>
      </Flex>
    </_Wrapper>
  );
};

const BookCardWithSuspense: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={null}>
      <BookCard {...props} />
    </Suspense>
  );
};

export { BookCardWithSuspense as BookCard };

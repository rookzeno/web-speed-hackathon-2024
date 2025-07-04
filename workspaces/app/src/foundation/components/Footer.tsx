import { useSetAtom } from 'jotai';
import React, { useId } from 'react';
import styled from 'styled-components';

import { DialogContentAtom } from '../atoms/DialogContentAtom';
import { useTextContent } from '../hooks/useTextContent';
import { Color, Space, Typography } from '../styles/variables';

import { Box } from './Box';
import { Button } from './Button';
import { Flex } from './Flex';
import { Spacer } from './Spacer';
import { Text } from './Text';

const _Button = styled(Button)`
  color: ${Color.MONO_A};
`;

const _Content = styled.section`
  white-space: pre-line;
`;

export const Footer: React.FC = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const termDialogA11yId = useId();
  const contactDialogA11yId = useId();
  const questionDialogA11yId = useId();
  const companyDialogA11yId = useId();
  const overviewDialogA11yId = useId();

  const updateDialogContent = useSetAtom(DialogContentAtom);
  const { fetchTextContent } = useTextContent();

  const handleRequestToTermDialogOpen = async () => {
    try {
      const content = await fetchTextContent('term');
      updateDialogContent(
        <_Content aria-labelledby={termDialogA11yId} role="dialog">
          <Text as="h2" color={Color.MONO_100} id={termDialogA11yId} typography={Typography.NORMAL16}>
            利用規約
          </Text>
          <Spacer height={Space * 1} />
          <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL12}>
            {content}
          </Text>
        </_Content>,
      );
    } catch (error) {
      console.error('Failed to load terms content:', error);
    }
  };

  const handleRequestToContactDialogOpen = async () => {
    try {
      const content = await fetchTextContent('contact');
      updateDialogContent(
        <_Content aria-labelledby={contactDialogA11yId} role="dialog">
          <Text as="h2" color={Color.MONO_100} id={contactDialogA11yId} typography={Typography.NORMAL16}>
            お問い合わせ
          </Text>
          <Spacer height={Space * 1} />
          <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL12}>
            {content}
          </Text>
        </_Content>,
      );
    } catch (error) {
      console.error('Failed to load contact content:', error);
    }
  };

  const handleRequestToQuestionDialogOpen = async () => {
    try {
      const content = await fetchTextContent('question');
      updateDialogContent(
        <_Content aria-labelledby={questionDialogA11yId} role="dialog">
          <Text as="h2" color={Color.MONO_100} id={questionDialogA11yId} typography={Typography.NORMAL16}>
            Q&A
          </Text>
          <Spacer height={Space * 1} />
          <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL12}>
            {content}
          </Text>
        </_Content>,
      );
    } catch (error) {
      console.error('Failed to load question content:', error);
    }
  };

  const handleRequestToCompanyDialogOpen = async () => {
    try {
      const content = await fetchTextContent('company');
      updateDialogContent(
        <_Content aria-labelledby={companyDialogA11yId} role="dialog">
          <Text as="h2" color={Color.MONO_100} id={companyDialogA11yId} typography={Typography.NORMAL16}>
            運営会社
          </Text>
          <Spacer height={Space * 1} />
          <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL12}>
            {content}
          </Text>
        </_Content>,
      );
    } catch (error) {
      console.error('Failed to load company content:', error);
    }
  };

  const handleRequestToOverviewDialogOpen = async () => {
    try {
      const content = await fetchTextContent('overview');
      updateDialogContent(
        <_Content aria-labelledby={overviewDialogA11yId} role="dialog">
          <Text as="h2" color={Color.MONO_100} id={overviewDialogA11yId} typography={Typography.NORMAL16}>
            Cyber TOONとは
          </Text>
          <Spacer height={Space * 1} />
          <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL12}>
            {content}
          </Text>
        </_Content>,
      );
    } catch (error) {
      console.error('Failed to load overview content:', error);
    }
  };

  return (
    <Box as="footer" backgroundColor={Color.Background} p={Space * 1}>
      <Flex align="flex-start" direction="column" gap={Space * 1} justify="flex-start">
        <img alt="Cyber TOON" src="/assets/cyber-toon.svg" />
        <Flex align="start" direction="row" gap={Space * 1.5} justify="center">
          <_Button disabled={!isClient} onClick={handleRequestToTermDialogOpen}>
            利用規約
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToContactDialogOpen}>
            お問い合わせ
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToQuestionDialogOpen}>
            Q&A
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToCompanyDialogOpen}>
            運営会社
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToOverviewDialogOpen}>
            Cyber TOONとは
          </_Button>
        </Flex>
      </Flex>
    </Box>
  );
};

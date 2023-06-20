'use client';

import { getUsdValue } from '@/common/utils';
import { Button, Tooltip } from '@/ui/components';
import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { FC, useCallback, useMemo, useState } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { useStxPriceForTx } from './useStxPriceForTx';

const initialTooltipContent = 'Displaying current value; Click to show value on day of txn';

const tooltipContent = ['Current value', 'Estimated value on day of txn'];

interface StxPriceButtonProps {
  tx: Transaction | MempoolTransaction;
  value: number;
}

export const StxPriceButton: FC<StxPriceButtonProps> = ({ tx, value }) => {
  const { historicalStxPrice, currentStxPrice } = useStxPriceForTx(tx);
  const [tooltipContentIndex, setTooltipContentIndex] = useState(0);
  const [initialRender, setInitialRender] = useState(true);
  const toggleStxPrice = useCallback(() => {
    if (initialRender) setInitialRender(false);
    historicalStxPrice && setTooltipContentIndex((tooltipContentIndex + 1) % tooltipContent.length);
  }, [initialRender, tooltipContentIndex, historicalStxPrice]);
  const showCurrentPriceForCompletedTransactions = tooltipContentIndex !== 1;
  const currentPriceFormatted = useMemo(
    () => getUsdValue(value, currentStxPrice, true),
    [currentStxPrice, value]
  );
  const historicalPriceFormatted = useMemo(
    () => getUsdValue(value, historicalStxPrice, true),
    [historicalStxPrice, value]
  );
  const { colorMode } = useColorMode();
  return (
    <Tooltip label={initialRender ? initialTooltipContent : tooltipContent[tooltipContentIndex]}>
      <Button
        size={'xs'}
        bg={colorMode === 'light' ? '#e9e8ff' : 'bg4.dark'}
        color={'textBody'}
        _hover={{
          bg: colorMode === 'light' ? '#d9d7ff' : 'bg4.dark',
        }}
        ml={'5px'}
        onClick={toggleStxPrice}
        fontSize={'12px !important'}
        _focus={{ outline: 0 }}
        flexShrink={0}
        suppressHydrationWarning={true}
      >
        {showCurrentPriceForCompletedTransactions
          ? currentPriceFormatted
          : historicalPriceFormatted}
      </Button>
    </Tooltip>
  );
};

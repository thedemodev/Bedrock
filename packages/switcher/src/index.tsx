import React from 'react';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';
import { mergeBreakpoints } from '@bedrock-layout/spacing-constants';
import Stack, { StackProps } from '@bedrock-layout/stack';
import Split, { SplitProps } from '@bedrock-layout/split';
import useForwardedRef from '@bedrock-layout/use-forwarded-ref';
import useContainerQuery from '@bedrock-layout/use-container-query';
import { forwardRefWithAs } from '@bedrock-layout/type-utils';

export interface SplitSwitcherProps extends StackProps, SplitProps {
  switchAt?: number;
  children?: React.ReactNode;
}

const safeTheme = { breakPoints: {} };

export const SplitSwitcher = forwardRefWithAs<SplitSwitcherProps, 'div'>(
  ({ fraction, switchAt, as, ...props }, ref) => {
    const safeRef = useForwardedRef(ref);
    const { breakPoints = {} } = React.useContext(ThemeContext) || safeTheme;
    const widthToSwitchAt =
      switchAt && switchAt > -1
        ? switchAt
        : mergeBreakpoints(breakPoints).smallOnly;

    const shouldSwitch = useContainerQuery(safeRef.current, widthToSwitchAt);

    return shouldSwitch ? (
      <Stack as={as} ref={safeRef} {...props} />
    ) : (
      <Split as={as} ref={safeRef} fraction={fraction} {...props} />
    );
  }
);

SplitSwitcher.displayName = 'SplitSwitcher';

SplitSwitcher.propTypes = { ...Split.propTypes, switchAt: PropTypes.number };

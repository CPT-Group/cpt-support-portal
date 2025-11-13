'use client';

import { Tooltip, TooltipProps } from 'primereact/tooltip';

export interface CPTTooltipProps extends TooltipProps {}

export const CPTTooltip = (props: CPTTooltipProps) => {
  return <Tooltip {...props} />;
};


'use client';

import { ProgressBar, ProgressBarProps } from 'primereact/progressbar';

export interface CPTProgressBarProps extends ProgressBarProps {}

export const CPTProgressBar = (props: CPTProgressBarProps) => {
  return <ProgressBar {...props} />;
};


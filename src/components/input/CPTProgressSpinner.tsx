'use client';

import { ProgressSpinner, ProgressSpinnerProps } from 'primereact/progressspinner';

export interface CPTProgressSpinnerProps extends ProgressSpinnerProps {}

export const CPTProgressSpinner = (props: CPTProgressSpinnerProps) => {
  return <ProgressSpinner {...props} />;
};


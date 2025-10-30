'use client';

import { Button, ButtonProps } from 'primereact/button';

export interface CPTButtonProps extends ButtonProps {}

export const CPTButton = (props: CPTButtonProps) => {
  return <Button {...props} />;
};


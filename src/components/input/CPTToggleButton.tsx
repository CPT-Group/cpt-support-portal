'use client';

import { ToggleButton, ToggleButtonProps } from 'primereact/togglebutton';

export interface CPTToggleButtonProps extends ToggleButtonProps {}

export const CPTToggleButton = (props: CPTToggleButtonProps) => {
  return <ToggleButton {...props} />;
};


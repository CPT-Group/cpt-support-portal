'use client';

import { RadioButton, RadioButtonProps } from 'primereact/radiobutton';

export interface CPTRadioButtonProps extends RadioButtonProps {}

export const CPTRadioButton = (props: CPTRadioButtonProps) => {
  return <RadioButton {...props} />;
};


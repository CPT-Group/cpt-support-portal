'use client';

import { InputText, InputTextProps } from 'primereact/inputtext';

export interface CPTInputTextProps extends InputTextProps {}

export const CPTInputText = (props: CPTInputTextProps) => {
  return <InputText {...props} />;
};


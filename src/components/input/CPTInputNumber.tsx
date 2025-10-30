'use client';

import { InputNumber, InputNumberProps } from 'primereact/inputnumber';

export interface CPTInputNumberProps extends InputNumberProps {}

export const CPTInputNumber = (props: CPTInputNumberProps) => {
  return <InputNumber {...props} />;
};


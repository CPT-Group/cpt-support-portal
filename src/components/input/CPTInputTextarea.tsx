'use client';

import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';

export interface CPTInputTextareaProps extends InputTextareaProps {}

export const CPTInputTextarea = (props: CPTInputTextareaProps) => {
  return <InputTextarea {...props} />;
};


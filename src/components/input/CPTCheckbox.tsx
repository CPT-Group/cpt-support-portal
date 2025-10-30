'use client';

import { Checkbox, CheckboxProps } from 'primereact/checkbox';

export interface CPTCheckboxProps extends CheckboxProps {}

export const CPTCheckbox = (props: CPTCheckboxProps) => {
  return <Checkbox {...props} />;
};


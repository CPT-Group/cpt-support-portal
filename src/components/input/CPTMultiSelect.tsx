'use client';

import { MultiSelect, MultiSelectProps } from 'primereact/multiselect';

export interface CPTMultiSelectProps extends MultiSelectProps {}

export const CPTMultiSelect = (props: CPTMultiSelectProps) => {
  return <MultiSelect {...props} />;
};


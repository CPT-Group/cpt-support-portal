'use client';

import { Dropdown, DropdownProps } from 'primereact/dropdown';

export interface CPTDropdownProps extends DropdownProps {}

export const CPTDropdown = (props: CPTDropdownProps) => {
  return <Dropdown {...props} />;
};


'use client';

import { Tag, TagProps } from 'primereact/tag';

export interface CPTTagProps extends TagProps {}

export const CPTTag = (props: CPTTagProps) => {
  return <Tag {...props} />;
};


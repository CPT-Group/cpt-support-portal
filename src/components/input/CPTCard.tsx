'use client';

import { Card, CardProps } from 'primereact/card';

export interface CPTCardProps extends CardProps {}

export const CPTCard = (props: CPTCardProps) => {
  return <Card {...props} />;
};

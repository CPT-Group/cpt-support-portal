'use client';

import { Dialog, DialogProps } from 'primereact/dialog';

export interface CPTDialogProps extends DialogProps {}

export const CPTDialog = (props: CPTDialogProps) => {
  return <Dialog {...props} />;
};


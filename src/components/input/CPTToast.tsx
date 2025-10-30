'use client';

import { Toast, ToastProps } from 'primereact/toast';
import { forwardRef } from 'react';

export interface CPTToastProps extends ToastProps {}

export const CPTToast = forwardRef<Toast, CPTToastProps>(
  (props: CPTToastProps, ref) => {
    return <Toast {...props} ref={ref} />;
  }
);

CPTToast.displayName = 'CPTToast';


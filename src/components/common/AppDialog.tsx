'use client';

import { Dialog } from 'primereact/dialog';
import type { DialogProps } from 'primereact/dialog';

/**
 * Single reusable dialog shell. Content and behavior come from props/children;
 * use this instead of defining many dialog components. Update header/children
 * per screen as needed.
 */
export interface AppDialogProps
  extends Pick<DialogProps, 'visible' | 'onHide' | 'modal' | 'dismissableMask'> {
  header: string;
  children: React.ReactNode;
  /** Optional overrides; defaults provide consistent width/breakpoints. */
  style?: React.CSSProperties;
  breakpoints?: DialogProps['breakpoints'];
}

const DEFAULT_STYLE: React.CSSProperties = { width: '50vw' };
const DEFAULT_BREAKPOINTS = { '960px': '75vw', '640px': '90vw' };

export function AppDialog({
  header,
  visible,
  onHide,
  children,
  style,
  breakpoints,
  modal = true,
  dismissableMask = true,
}: AppDialogProps) {
  return (
    <Dialog
      header={header}
      visible={visible}
      onHide={onHide}
      style={style ?? DEFAULT_STYLE}
      breakpoints={breakpoints ?? DEFAULT_BREAKPOINTS}
      modal={modal}
      dismissableMask={dismissableMask}
    >
      {children}
    </Dialog>
  );
}

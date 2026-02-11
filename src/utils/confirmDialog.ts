import { confirmDialog as primeConfirmDialog } from 'primereact/confirmdialog';
import type { ConfirmDialogProps } from 'primereact/confirmdialog';

/**
 * Data-driven confirm dialog options. Update props here to change content;
 * one pattern, no redefining dialogs per screen.
 */
export interface ConfirmDialogOptions {
  message: string;
  header: string;
  icon?: string;
  accept: () => void;
  reject?: () => void;
}

/**
 * Shows a confirm dialog with the given options. Use this + config objects
 * so all confirm content is data-driven and easy to update.
 */
export function showConfirmDialog(options: ConfirmDialogOptions): void {
  const props: ConfirmDialogProps = {
    message: options.message,
    header: options.header,
    icon: options.icon,
    accept: options.accept,
    reject: options.reject,
  };
  primeConfirmDialog(props);
}

const CPT_CORPORATE_URL = 'https://cptgroup.com';

/** Config for "Navigate to CPT Corporate" confirm. Single source of truth. */
const CPT_CORPORATE_CONFIRM: ConfirmDialogOptions = {
  message: 'Would you like to leave CPT Support and navigate to CPT Corporate?',
  header: 'Navigate to CPT Corporate',
  icon: 'pi pi-external-link',
  accept: () => {
    window.location.href = CPT_CORPORATE_URL;
  },
};

/** Shows the CPT Corporate navigation confirm dialog. */
export function showCptCorporateConfirm(): void {
  showConfirmDialog(CPT_CORPORATE_CONFIRM);
}

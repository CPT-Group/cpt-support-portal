'use client';

import { ProgressSpinner } from 'primereact/progressspinner';

/**
 * Shown during route transitions (e.g. navigating to FAQ or support-request).
 * Uses theme variables so all themes have good contrast.
 */
export default function Loading() {
  return (
    <div
      className="global-loading-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--maskbg)',
        color: 'var(--text-color)',
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-column align-items-center gap-3">
        <ProgressSpinner
          style={{ width: '3rem', height: '3rem' }}
          strokeWidth="4"
        />
        <span className="font-medium">Loading...</span>
      </div>
    </div>
  );
}

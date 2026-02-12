'use client';

import Link from 'next/link';
import { memo } from 'react';

export const Footer = memo(() => {
  return (
    <footer className="w-full py-3 mt-auto" style={{ borderTop: '1px solid var(--surface-border)' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 1rem', width: '100%' }}>
        <div className="flex justify-content-center align-items-center gap-3 flex-wrap">
          <Link 
            href="/terms" 
            className="text-sm text-color-secondary"
            style={{ textDecoration: 'none' }}
          >
            Terms of Use
          </Link>
          <span className="text-sm text-color-secondary">|</span>
          <Link 
            href="/privacy" 
            className="text-sm text-color-secondary"
            style={{ textDecoration: 'none' }}
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';


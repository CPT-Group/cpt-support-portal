'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface HeaderLogoProps {
  width?: number;
  height?: number;
  maxHeight?: string;
  priority?: boolean;
}

export const HeaderLogo = memo(({ 
  width = 140, 
  height = 50, 
  maxHeight = '50px',
  priority = true 
}: HeaderLogoProps) => {
  return (
    <Link href="/" aria-label="Go to Home" style={{ display: 'flex', alignItems: 'center' }}>
      <Image
        src="/cpt-logo.webp"
        alt="CPT Group Logo"
        width={width}
        height={height}
        priority={priority}
        style={{
          height: 'auto',
          width: 'auto',
          maxHeight,
        }}
      />
    </Link>
  );
});

HeaderLogo.displayName = 'HeaderLogo';


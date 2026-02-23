'use client';

import { useEffect } from 'react';
import { useLoadingOverlay } from '@/providers/LoadingOverlayProvider';

/**
 * Next.js route loading fallback. Triggers the global loading overlay (portaled above header)
 * so it shows during route transitions. Renders nothing; the overlay is rendered by LoadingOverlayProvider.
 */
export default function Loading() {
  const { showLoading, hideLoading } = useLoadingOverlay();

  useEffect(() => {
    showLoading('Loading, please wait...');
    return () => hideLoading();
  }, [showLoading, hideLoading]);

  return null;
}

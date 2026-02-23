'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { ProgressSpinner } from 'primereact/progressspinner';

const DEFAULT_MESSAGE = 'Loading, please wait...';

interface LoadingOverlayState {
  visible: boolean;
  message: string;
}

interface LoadingOverlayContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  loadingState: LoadingOverlayState;
}

const LoadingOverlayContext = createContext<LoadingOverlayContextType | undefined>(undefined);

export function useLoadingOverlay(): LoadingOverlayContextType {
  const context = useContext(LoadingOverlayContext);
  if (!context) {
    throw new Error('useLoadingOverlay must be used within LoadingOverlayProvider');
  }
  return context;
}

interface OverlayContentProps {
  message: string;
}

function OverlayContent({ message }: OverlayContentProps) {
  return (
    <div
      className="app-loading-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-column align-items-center gap-3">
        <ProgressSpinner
          style={{ width: '3rem', height: '3rem' }}
          strokeWidth="4"
        />
        <span className="font-bold text-lg">{message}</span>
      </div>
    </div>
  );
}

interface LoadingOverlayProviderProps {
  children: ReactNode;
}

/** Set to true to force overlay always on (for testing); nothing will turn it off. Set back to false when done. */
const OVERLAY_ALWAYS_VISIBLE = false;

export function LoadingOverlayProvider({ children }: LoadingOverlayProviderProps) {
  const [loadingState, setLoadingState] = useState<LoadingOverlayState>({
    visible: OVERLAY_ALWAYS_VISIBLE,
    message: DEFAULT_MESSAGE,
  });

  const showLoading = useCallback((message?: string) => {
    setLoadingState({ visible: true, message: message ?? DEFAULT_MESSAGE });
  }, []);

  const hideLoading = useCallback(() => {
    if (OVERLAY_ALWAYS_VISIBLE) return;
    setLoadingState((prev) => ({ ...prev, visible: false }));
  }, []);

  const value = useMemo(
    () => ({ showLoading, hideLoading, loadingState }),
    [showLoading, hideLoading, loadingState]
  );

  // Only portal after client mount so server and initial client render match (avoids hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Portal to body so overlay is above everything. Theme vars apply via html[data-theme] (overlay is under html).
  const canPortal =
    mounted &&
    typeof document !== 'undefined' &&
    typeof document.body !== 'undefined' &&
    loadingState.visible;
  const portal = canPortal
    ? createPortal(<OverlayContent message={loadingState.message} />, document.body)
    : null;

  return (
    <LoadingOverlayContext.Provider value={value}>
      {children}
      {portal}
    </LoadingOverlayContext.Provider>
  );
}

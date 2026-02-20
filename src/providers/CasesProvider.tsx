'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from 'react';
import type { CaseOption } from '@/types/supportRequest';

interface CasesContextType {
  cases: CaseOption[];
  loading: boolean;
  error: string | null;
  /** Call when user reaches the case list step; fetches and caches if not yet loaded. */
  loadOnce: () => void;
  refetch: () => void;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export function useCases(): CasesContextType {
  const context = useContext(CasesContext);
  if (!context) {
    throw new Error('useCases must be used within CasesProvider');
  }
  return context;
}

interface CasesProviderProps {
  children: ReactNode;
}

export function CasesProvider({ children }: CasesProviderProps) {
  const [cases, setCases] = useState<CaseOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedOnceRef = useRef(false);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sf/projects');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.message as string) || `Failed to load cases (${res.status})`);
        setCases([]);
        return;
      }
      setCases(data.cases ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load cases');
      setCases([]);
    } finally {
      setLoading(false);
      // Mark as attempted so loadOnce() does not retry on every re-render (stops infinite loop on 500)
      loadedOnceRef.current = true;
    }
  }, []);

  const loadOnce = useCallback(() => {
    if (loadedOnceRef.current || loading) return;
    fetchCases();
  }, [loading, fetchCases]);

  const refetch = useCallback(() => {
    loadedOnceRef.current = false;
    fetchCases();
  }, [fetchCases]);

  const value = useMemo(
    () => ({ cases, loading, error, loadOnce, refetch }),
    [cases, loading, error, loadOnce, refetch]
  );

  return (
    <CasesContext.Provider value={value}>
      {children}
    </CasesContext.Provider>
  );
}

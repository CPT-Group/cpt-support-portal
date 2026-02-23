'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { DynamicFormData } from '@/types/supportRequest';
import type { CaseOption } from '@/types/supportRequest';
import { getSupportRequestQueryString } from '@/utils/urlParams';

/**
 * Syncs the support-request page URL with form state only when the step changes
 * (Next/Previous), not on every formData change. Prevents flicker and full-page
 * reload on each keystroke while keeping the URL shareable at step boundaries.
 */
export function useSyncSupportRequestUrl(
  formData: DynamicFormData,
  activeStep: 0 | 1 | 2,
  cases: CaseOption[]
): void {
  const router = useRouter();
  const formDataRef = useRef(formData);
  const casesRef = useRef(cases);

  formDataRef.current = formData;
  casesRef.current = cases;

  useEffect(() => {
    const query = getSupportRequestQueryString(formDataRef.current, {
      step: activeStep,
      caseList: casesRef.current,
    });
    const newUrl = query ? `/support-request?${query}` : '/support-request';
    router.replace(newUrl, { scroll: false });
  }, [activeStep, router]);
}

'use client';

import { useMemo } from 'react';
import { CPTCard, CPTDropdown, CPTMessage } from '@cpt-group/cpt-prime-react';
import { CASE_LIST } from '@/constants';
import type { CaseOption } from '@/types';

interface StepCaseSelectionProps {
  selectedCaseId: string | null;
  error?: string;
  onCaseChange: (caseOption: CaseOption | null) => void;
  title?: string;
  description?: string;
}

export const StepCaseSelection = ({
  selectedCaseId,
  error,
  onCaseChange,
  title,
  description,
}: StepCaseSelectionProps) => {
  const selectedCase = useMemo(
    () => CASE_LIST.find((option) => option.id === selectedCaseId),
    [selectedCaseId]
  );

  return (
    <CPTCard className="mt-4">
      <div className="flex flex-column gap-3">
        <div>
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {description && (
            <p className="text-color-secondary mb-3 line-height-3">{description}</p>
          )}
        </div>
        {/* <label htmlFor="case-select" className="font-semibold">
          Select a case for support <span className="text-red-500">*</span>
        </label> */}
        <CPTDropdown
          id="case-select"
          value={selectedCase}
          onChange={(e) => onCaseChange(e.value)}
          options={CASE_LIST}
          optionLabel="name"
          placeholder="Select a case"
          className="w-full"
          filter
          scrollHeight="35vh"
          panelClassName="p-dropdown-panel"
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'case-select-error' : undefined}
        />
        {error && (
          <CPTMessage
            id="case-select-error"
            severity="error"
            text={error}
            className="w-full"
          />
        )}
      </div>
    </CPTCard>
  );
};


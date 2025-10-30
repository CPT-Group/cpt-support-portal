'use client';

import { CPTCard, CPTDropdown, CPTMessage } from '@/components/input';
import { CASE_LIST } from '@/constants';
import type { CaseOption } from '@/types';

interface StepCaseSelectionProps {
  selectedCaseId: string | null;
  error?: string;
  onCaseChange: (caseOption: CaseOption | null) => void;
}

export const StepCaseSelection = ({
  selectedCaseId,
  error,
  onCaseChange,
}: StepCaseSelectionProps) => {
  const selectedCase = CASE_LIST.find((option) => option.id === selectedCaseId);

  return (
    <CPTCard className="mt-4">
      <div className="flex flex-column gap-3">
        <label htmlFor="case-select" className="font-semibold">
          What case are you having issues with?
        </label>
        <CPTDropdown
          id="case-select"
          value={selectedCase}
          onChange={(e) => onCaseChange(e.value)}
          options={CASE_LIST}
          optionLabel="name"
          placeholder="Select a case"
          className="w-full"
          filter
          scrollHeight="400px"
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


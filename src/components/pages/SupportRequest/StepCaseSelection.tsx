'use client';

import { useMemo } from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
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
    <Card className="mt-2">
<div className="flex flex-column gap-1">
          <div>
            {title && <h3 className="text-2xl font-bold mb-0 mt-0">{title}</h3>}
            {description && (
              <p className="text-color-secondary mb-1 mt-0 line-height-3">{description}</p>
            )}
        </div>
        {/* <label htmlFor="case-select" className="font-semibold">
          Select a case for support <span className="text-red-500">*</span>
        </label> */}
        <Dropdown
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
          <Message
            id="case-select-error"
            severity="error"
            text={error}
            className="w-full"
          />
        )}
      </div>
    </Card>
  );
};


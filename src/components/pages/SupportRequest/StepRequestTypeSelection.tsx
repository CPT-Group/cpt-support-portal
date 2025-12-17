'use client';

import { CPTCard, CPTListbox, CPTMessage } from '@cpt-group/cpt-prime-react';
import { REQUEST_TYPES } from '@/constants/requestTypes';
import type { ListBoxChangeEvent } from 'primereact/listbox';
import type { RequestTypeConfig } from '@/types/formConfig';

interface StepRequestTypeSelectionProps {
  selectedRequestTypes: string[];
  error?: string;
  onRequestTypesChange: (selectedIds: string[]) => void;
  title?: string;
  description?: string;
}

export const StepRequestTypeSelection = ({
  selectedRequestTypes,
  error,
  onRequestTypesChange,
  title = 'Support Request Selection',
  description,
}: StepRequestTypeSelectionProps) => {
  const handleRequestTypeChange = (e: ListBoxChangeEvent) => {
    if (!e.value) {
      onRequestTypesChange([]);
      return;
    }
    
    const selectedIds = Array.isArray(e.value)
      ? e.value.map((rt: RequestTypeConfig) => rt.id)
      : [];
    onRequestTypesChange(selectedIds);
  };

  const selectedRequestTypeObjects = REQUEST_TYPES.filter((rt) =>
    selectedRequestTypes.includes(rt.id)
  );

  const selectedLabels = selectedRequestTypes
    .map((id) => REQUEST_TYPES.find((rt) => rt.id === id)?.label)
    .filter(Boolean);

  return (
    <>
      <CPTCard className="mt-4">
        <div className="flex flex-column gap-3">
          <div>
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {description && (
              <p className="text-color-secondary mb-3 line-height-3">{description}</p>
            )}
            {selectedLabels.length > 0 && (
              <p className="text-sm text-color-secondary mb-3">
                <strong>Selected:</strong> {selectedLabels.join(', ')}
              </p>
            )}
          </div>
          <label htmlFor="request-type-select" className="font-semibold">
            Select Request Types <span className="text-red-500">*</span>
          </label>
          <CPTListbox
            id="request-type-select"
            value={selectedRequestTypeObjects}
            onChange={handleRequestTypeChange}
            options={REQUEST_TYPES}
            optionLabel="label"
            multiple
            className="w-full"
            filter
            filterPlaceholder="Search request types..."
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'request-type-error' : undefined}
          />
          {error && (
            <CPTMessage
              id="request-type-error"
              severity="error"
              text={error}
              className="w-full"
            />
          )}
        </div>
      </CPTCard>
    </>
  );
};


'use client';

import { Card } from 'primereact/card';
import { ListBox } from 'primereact/listbox';
import { Message } from 'primereact/message';
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
      <Card className="mt-2">
<div className="flex flex-column gap-1">
            <div>
            <h3 className="text-2xl font-bold mb-0 mt-0">{title}</h3>
            {description && (
              <p className="text-color-secondary mb-1 mt-0 line-height-3">{description}</p>
            )}
            {selectedLabels.length > 0 && (
              <p className="text-sm text-color-secondary mb-1 mt-0">
                <strong>Selected:</strong> {selectedLabels.join(', ')}
              </p>
            )}
          </div>
          <label htmlFor="request-type-select" className="font-semibold mt-1 mb-0">
            Select Request Types <span className="text-red-500">*</span>
          </label>
          <ListBox
            id="request-type-select"
            value={selectedRequestTypeObjects}
            onChange={handleRequestTypeChange}
            options={REQUEST_TYPES}
            optionLabel="label"
            multiple
            className="w-full"
            filter
            filterPlaceholder="Search request types..."
            listStyle={{ maxHeight: '30vh', overflowY: 'auto' }}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'request-type-error' : undefined}
          />
          {error && (
            <Message
              id="request-type-error"
              severity="error"
              text={error}
              className="w-full"
            />
          )}
        </div>
      </Card>
    </>
  );
};


'use client';

import { useState } from 'react';
import { CPTCard, CPTListbox, CPTMessage, CPTDialog, CPTButton } from '@cpt-group/cpt-prime-react';
import { REQUEST_TYPES } from '@/constants/requestTypes';
import { FAQ_DATA } from '@/constants/faqData';
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
  const [faqDialogVisible, setFaqDialogVisible] = useState(false);
  const [selectedFaqItem, setSelectedFaqItem] = useState<{ question: string; answer: string } | null>(null);

  const handleRequestTypeChange = (e: ListBoxChangeEvent) => {
    if (!e.value) {
      onRequestTypesChange([]);
      return;
    }
    
    const selectedIds = Array.isArray(e.value)
      ? e.value.map((rt: RequestTypeConfig) => rt.id)
      : [];
    onRequestTypesChange(selectedIds);

    // Check if any newly selected request type has an FAQ reference
    const newlySelected = selectedIds.filter((id) => !selectedRequestTypes.includes(id));
    if (newlySelected.length > 0) {
      const requestTypeWithFaq = REQUEST_TYPES.find(
        (rt) => newlySelected.includes(rt.id) && rt.faqReference
      );

      if (requestTypeWithFaq?.faqReference) {
        // Find FAQ item by reference (simplified - in real implementation, match by FAQ ID or text)
        const faqItem = FAQ_DATA.find((faq) =>
          faq.question.toLowerCase().includes(requestTypeWithFaq.faqReference?.toLowerCase() || '')
        );

        if (faqItem) {
          setSelectedFaqItem({ question: faqItem.question, answer: faqItem.answer });
          setFaqDialogVisible(true);
        }
      }
    }
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
          <p className="text-sm text-color-secondary mt-2">
            You can select multiple request types. Required fields will be consolidated automatically.
          </p>
        </div>
      </CPTCard>

      <CPTDialog
        header="Did you know?"
        visible={faqDialogVisible}
        onHide={() => setFaqDialogVisible(false)}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '640px': '90vw' }}
      >
        {selectedFaqItem && (
          <div className="flex flex-column gap-3">
            <div>
              <h3 className="mt-0 mb-2">{selectedFaqItem.question}</h3>
              <p className="m-0 line-height-3">{selectedFaqItem.answer}</p>
            </div>
            <div className="flex justify-content-end gap-2 mt-3">
              <CPTButton
                label="Read More"
                icon="pi pi-external-link"
                iconPos="right"
                onClick={() => {
                  setFaqDialogVisible(false);
                  window.location.href = '/faq';
                }}
                className="p-button-outlined"
              />
              <CPTButton
                label="Close"
                onClick={() => setFaqDialogVisible(false)}
                className="p-button-secondary"
              />
            </div>
          </div>
        )}
      </CPTDialog>
    </>
  );
};


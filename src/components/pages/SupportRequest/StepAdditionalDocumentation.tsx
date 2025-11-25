'use client';

import { CPTCard, CPTInputTextarea } from '@cpt-group/cpt-prime-react';
import { SupportFileUpload } from '@/components/common/SupportFileUpload';
import type { DynamicFormData } from '@/types/supportRequest';

interface StepAdditionalDocumentationProps {
  formData: DynamicFormData;
  onDescriptionChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
}

export const StepAdditionalDocumentation = ({
  formData,
  onDescriptionChange,
  onFilesChange,
}: StepAdditionalDocumentationProps) => {
  const description = typeof formData.additionalDescription === 'string' 
    ? formData.additionalDescription 
    : '';
  const files = Array.isArray(formData.additionalFiles) && formData.additionalFiles[0] instanceof File
    ? (formData.additionalFiles as File[])
    : [];

  return (
    <CPTCard className="mt-4">
      <div className="flex flex-column gap-4">
        <div>
          <h3 className="mt-0 mb-3">Additional Documentation (Optional)</h3>
          <p className="text-color-secondary mb-4">
            If you have any additional context, notes, or supporting documents that might help us process your request, please add them here.
          </p>
        </div>

        <div className="flex flex-column gap-3">
          <div>
            <label htmlFor="additional-description" className="font-semibold block mb-2">
              Description
            </label>
            <CPTInputTextarea
              id="additional-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={6}
              placeholder="Enter any additional information or context..."
              className="w-full"
            />
          </div>

          <div>
            <SupportFileUpload
              files={files}
              onFilesChange={onFilesChange}
              label="Documents"
              maxFileSize={5000000} // 5MB
              accept="*/*"
              multiple
              emptyMessage="Drag and drop files here to upload, or click to browse."
            />
          </div>
        </div>
      </div>
    </CPTCard>
  );
};


'use client';

import { CPTCard, CPTInputTextarea, CPTFileUpload, CPTMessage } from '@/components/input';

interface StepDescriptionUploadProps {
  description: string;
  files: File[];
  error?: string;
  onDescriptionChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
}

export const StepDescriptionUpload = ({
  description,
  files,
  error,
  onDescriptionChange,
  onFilesChange,
}: StepDescriptionUploadProps) => {
  return (
    <CPTCard className="mt-4">
      <div className="flex flex-column gap-3">
        <div>
          <label htmlFor="description" className="font-semibold block mb-2">
            Description
          </label>
          <CPTInputTextarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={6}
            className={`w-full ${error ? 'p-invalid' : ''}`}
          />
          {error && <CPTMessage severity="error" text={error} className="mt-2" />}
        </div>
        <div>
          <label className="font-semibold block mb-2">
            Supporting Images or Screenshots (Optional)
          </label>
          <CPTFileUpload
            mode="basic"
            name="screenshots[]"
            accept="image/*"
            maxFileSize={5000000}
            chooseLabel="Choose Files"
            className="w-full"
            onSelect={(e) => {
              if (e.files) {
                const selectedFiles = Array.isArray(e.files)
                  ? e.files.map((f) => f as File)
                  : Array.from(e.files as FileList);
                onFilesChange([...files, ...selectedFiles]);
              }
            }}
            auto
          />
        </div>
      </div>
    </CPTCard>
  );
};


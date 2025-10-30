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
  const handleFileSelect = (event: { files: File[] | FileList | null }) => {
    if (event.files) {
      const fileArray = Array.isArray(event.files)
        ? event.files
        : Array.from(event.files);
      const validFiles = fileArray.filter((file): file is File => file instanceof File);
      const uniqueFiles = validFiles.filter(
        (newFile) =>
          !files.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size &&
              existingFile.type === newFile.type
          )
      );
      if (uniqueFiles.length > 0) {
        onFilesChange([...files, ...uniqueFiles]);
      }
    }
  };

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
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'description-error' : undefined}
          />
          {error && (
            <CPTMessage
              id="description-error"
              severity="error"
              text={error}
              className="mt-2"
            />
          )}
        </div>
        <div>
          <label htmlFor="file-upload" className="font-semibold block mb-2">
            Supporting Images or Screenshots (Optional)
          </label>
          <CPTFileUpload
            id="file-upload"
            mode="basic"
            name="screenshots[]"
            accept="image/*"
            maxFileSize={5000000}
            chooseLabel="Choose Files"
            className="w-full"
            onSelect={handleFileSelect}
            auto
          />
        </div>
      </div>
    </CPTCard>
  );
};


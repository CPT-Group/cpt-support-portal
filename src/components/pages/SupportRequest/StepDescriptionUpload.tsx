'use client';

import { useRef, useState, useEffect } from 'react';
import {
  CPTCard,
  CPTInputTextarea,
  CPTFileUpload,
  CPTMessage,
  CPTButton,
  CPTProgressBar,
  CPTTag,
  CPTTooltip,
} from '@/components/input';
import type {
  FileUpload as FileUploadType,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  ItemTemplateOptions,
} from 'primereact/fileupload';

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
  const fileUploadRef = useRef<FileUploadType>(null);
  const [totalSize, setTotalSize] = useState(0);
  const maxFileSize = 5000000; // 5MB

  // Initialize totalSize from existing files
  useEffect(() => {
    const currentTotal = files.reduce((sum, file) => sum + (file.size || 0), 0);
    setTotalSize(currentTotal);
  }, [files]);

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = totalSize;
    const selectedFiles: File[] = Array.isArray(e.files)
      ? e.files
      : Array.from(e.files).filter((f): f is File => f instanceof File);

    for (let i = 0; i < selectedFiles.length; i++) {
      _totalSize += selectedFiles[i].size || 0;
    }

    setTotalSize(_totalSize);

    // Add files to state, avoiding duplicates
    const uniqueFiles = selectedFiles.filter(
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
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    setTotalSize(totalSize - file.size);
    const updatedFiles = files.filter(
      (f) => !(f.name === file.name && f.size === file.size && f.type === file.type)
    );
    onFilesChange(updatedFiles);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
    onFilesChange([]);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = (totalSize / maxFileSize) * 100;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : '0 B';

    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / {fileUploadRef.current?.formatSize(maxFileSize) || '5 MB'}</span>
          <CPTProgressBar
            value={value}
            showValue={false}
            style={{ width: '10rem', height: '12px' }}
          />
        </div>
      </div>
    );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File & { objectURL?: string };
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '40%' }}>
          {file.objectURL && (
            <img
              alt={file.name}
              role="presentation"
              src={file.objectURL}
              width={100}
              className="border-round"
            />
          )}
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date(file.lastModified).toLocaleDateString()}</small>
          </span>
        </div>
        <CPTTag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <CPTButton
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: '5em',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-b)',
            color: 'var(--surface-d)',
          }}
        />
        <span
          style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };
  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
  };
  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
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
          <CPTTooltip target=".custom-choose-btn" content="Choose" position="bottom" />
          <CPTTooltip target=".custom-upload-btn" content="Upload" position="bottom" />
          <CPTTooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
          <CPTFileUpload
            ref={fileUploadRef}
            id="file-upload"
            name="screenshots[]"
            url="/api/upload"
            multiple
            accept="image/*"
            maxFileSize={maxFileSize}
            onSelect={onTemplateSelect}
            onError={onTemplateClear}
            onClear={onTemplateClear}
            headerTemplate={headerTemplate}
            itemTemplate={itemTemplate}
            emptyTemplate={emptyTemplate}
            chooseOptions={chooseOptions}
            uploadOptions={uploadOptions}
            cancelOptions={cancelOptions}
            customUpload
            uploadHandler={() => {
              // Custom upload handler - files are already added via onSelect
              // This is called when the upload button is clicked
              // In a real implementation, this would upload to a server
              // For now, we just acknowledge the upload
            }}
            className="w-full"
          />
        </div>
      </div>
    </CPTCard>
  );
};


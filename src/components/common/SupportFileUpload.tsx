'use client';

import { useState, useEffect, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import type {
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  FileUploadUploadEvent,
  ItemTemplateOptions,
} from 'primereact/fileupload';

export interface SupportFileUploadProps {
  /** Current array of files */
  files: File[];
  /** Callback when files change */
  onFilesChange: (files: File[]) => void;
  /** Maximum file size in bytes (default: 1MB) */
  maxFileSize?: number;
  /** Accepted file types (default: all files) */
  accept?: string;
  /** Label for the file upload (default: "Documents") */
  label?: string;
  /** Whether multiple files are allowed (default: true) */
  multiple?: boolean;
  /** Custom empty template message */
  emptyMessage?: string;
  /** ID for the file upload component */
  id?: string;
}

export const SupportFileUpload = ({
  files,
  onFilesChange,
  maxFileSize = 1000000, // 1MB default
  accept,
  label = 'Documents',
  multiple = true,
  emptyMessage = 'Drag and Drop Files Here',
  id = 'support-file-upload',
}: SupportFileUploadProps) => {
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);

  // Helper function to format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

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
            existingFile.type === existingFile.type
        )
    );

    if (uniqueFiles.length > 0) {
      onFilesChange([...files, ...uniqueFiles]);
    }
  };

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    // Files are already added via onSelect
    // This handler is for when upload button is clicked
    // In a real implementation, this would upload to a server
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
    const { className, chooseButton, cancelButton } = options;
    const value = (totalSize / maxFileSize) * 100;
    const formatedValue = formatSize(totalSize);
    const maxFormatted = formatSize(maxFileSize);

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
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>
            {formatedValue} / {maxFormatted}
          </span>
          <ProgressBar
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
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
        <Button
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
          {emptyMessage}
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };
  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
  };

  return (
    <div>
      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
      <FileUpload
        ref={fileUploadRef}
        id={id}
        name="support-files[]"
        url="/api/upload"
        multiple={multiple}
        accept={accept}
        maxFileSize={maxFileSize}
        onUpload={onTemplateUpload}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        cancelOptions={cancelOptions}
        customUpload
        auto
        uploadHandler={() => {
          // Auto-upload: files are automatically added via onSelect
          // No upload button needed - files are added immediately when selected
        }}
        className="w-full"
      />
    </div>
  );
};


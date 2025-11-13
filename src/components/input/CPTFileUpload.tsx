'use client';

import { FileUpload, FileUploadProps } from 'primereact/fileupload';
import { forwardRef } from 'react';

export interface CPTFileUploadProps extends FileUploadProps {}

export const CPTFileUpload = forwardRef<FileUpload, CPTFileUploadProps>(
  (props: CPTFileUploadProps, ref) => {
    return <FileUpload {...props} ref={ref} />;
  }
);

CPTFileUpload.displayName = 'CPTFileUpload';


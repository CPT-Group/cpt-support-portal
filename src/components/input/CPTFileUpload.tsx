'use client';

import { FileUpload, FileUploadProps } from 'primereact/fileupload';

export interface CPTFileUploadProps extends FileUploadProps {}

export const CPTFileUpload = (props: CPTFileUploadProps) => {
  return <FileUpload {...props} />;
};


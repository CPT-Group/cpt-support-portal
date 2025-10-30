'use client';

import { Message, MessageProps } from 'primereact/message';

export interface CPTMessageProps extends MessageProps {}

export const CPTMessage = (props: CPTMessageProps) => {
  return <Message {...props} />;
};


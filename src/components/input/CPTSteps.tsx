'use client';

import { Steps, StepsProps } from 'primereact/steps';

export interface CPTStepsProps extends StepsProps {}

export const CPTSteps = (props: CPTStepsProps) => {
  return <Steps {...props} />;
};


'use client';

import { CPTCard, CPTInputText, CPTMessage } from '@/components/input';

interface StepPersonalInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  onFieldBlur?: (field: string) => void;
}

export const StepPersonalInfo = ({
  firstName,
  lastName,
  email,
  errors,
  onFieldChange,
  onFieldBlur,
}: StepPersonalInfoProps) => {
  return (
    <CPTCard className="mt-4">
      <div className="flex flex-column gap-3">
        <div className="grid">
          <div className="col-12 md:col-6">
            <label htmlFor="firstName" className="font-semibold block mb-2">
              First Name
            </label>
            <CPTInputText
              id="firstName"
              value={firstName}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              onBlur={() => onFieldBlur?.('firstName')}
              className={`w-full ${errors.firstName ? 'p-invalid' : ''}`}
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            />
            {errors.firstName && (
              <CPTMessage
                id="firstName-error"
                severity="error"
                text={errors.firstName}
                className="mt-2"
              />
            )}
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="lastName" className="font-semibold block mb-2">
              Last Name
            </label>
            <CPTInputText
              id="lastName"
              value={lastName}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              onBlur={() => onFieldBlur?.('lastName')}
              className={`w-full ${errors.lastName ? 'p-invalid' : ''}`}
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName && (
              <CPTMessage
                id="lastName-error"
                severity="error"
                text={errors.lastName}
                className="mt-2"
              />
            )}
          </div>
        </div>
        <div className="grid">
          <div className="col-12">
            <label htmlFor="email" className="font-semibold block mb-2">
              Email
            </label>
            <CPTInputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              onBlur={() => onFieldBlur?.('email')}
              className={`w-full ${errors.email ? 'p-invalid' : ''}`}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <CPTMessage
                id="email-error"
                severity="error"
                text={errors.email}
                className="mt-2"
              />
            )}
          </div>
        </div>
      </div>
    </CPTCard>
  );
};


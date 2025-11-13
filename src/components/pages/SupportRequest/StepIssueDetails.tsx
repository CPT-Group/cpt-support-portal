'use client';

import {
  CPTCard,
  CPTMultiSelect,
  CPTDropdown,
  CPTCalendar,
  CPTMessage,
} from '@/components/input';
import { ISSUE_TYPE_OPTIONS, CONFIRMATION_EMAIL_OPTIONS } from '@/constants';
import type { IssueTypeOption, ConfirmationEmailOption } from '@/types';

interface StepIssueDetailsProps {
  issueTypes: string[];
  confirmationEmail: string | null;
  approximateTime: Date | null;
  errors: Record<string, string>;
  onIssueTypesChange: (selectedIds: string[]) => void;
  onConfirmationEmailChange: (option: ConfirmationEmailOption | null) => void;
  onApproximateTimeChange: (date: Date | null) => void;
}

export const StepIssueDetails = ({
  issueTypes,
  confirmationEmail,
  approximateTime,
  errors,
  onIssueTypesChange,
  onConfirmationEmailChange,
  onApproximateTimeChange,
}: StepIssueDetailsProps) => {
  const selectedIssueTypes = ISSUE_TYPE_OPTIONS.filter((option) =>
    issueTypes.includes(option.id)
  );

  return (
    <CPTCard className="mt-4">
      <div className="flex flex-column gap-3">
        <div>
          <label htmlFor="issue-types" className="font-semibold block mb-2">
            Issue Type
          </label>
          <CPTMultiSelect
            id="issue-types"
            value={selectedIssueTypes}
            onChange={(e) =>
              onIssueTypesChange((e.value as IssueTypeOption[]).map((opt) => opt.id))
            }
            options={ISSUE_TYPE_OPTIONS}
            optionLabel="label"
            placeholder="Select issue types"
            className={`w-full ${errors.issueTypes ? 'p-invalid' : ''}`}
            display="chip"
            aria-required="true"
            aria-invalid={!!errors.issueTypes}
            aria-describedby={errors.issueTypes ? 'issue-types-error' : undefined}
          />
          {errors.issueTypes && (
            <CPTMessage
              id="issue-types-error"
              severity="error"
              text={errors.issueTypes}
              className="mt-2"
            />
          )}
        </div>
        <div>
          <label htmlFor="confirmation-email" className="font-semibold block mb-2">
            Did you receive a confirmation email?
          </label>
          <CPTDropdown
            id="confirmation-email"
            value={confirmationEmail}
            onChange={(e) => {
              const selectedValue = e.value as string | null;
              const selectedOption = selectedValue
                ? CONFIRMATION_EMAIL_OPTIONS.find((opt) => opt.value === selectedValue) || null
                : null;
              onConfirmationEmailChange(selectedOption);
            }}
            options={CONFIRMATION_EMAIL_OPTIONS}
            optionLabel="label"
            optionValue="value"
            placeholder="Select an option"
            className={`w-full ${errors.confirmationEmail ? 'p-invalid' : ''}`}
            aria-required="true"
            aria-invalid={!!errors.confirmationEmail}
            aria-describedby={errors.confirmationEmail ? 'confirmation-email-error' : undefined}
          />
          {errors.confirmationEmail && (
            <CPTMessage
              id="confirmation-email-error"
              severity="error"
              text={errors.confirmationEmail}
              className="mt-2"
            />
          )}
        </div>
        <div>
          <label htmlFor="approximate-time" className="font-semibold block mb-2">
            Approximate time of issue (Optional)
          </label>
          <CPTCalendar
            id="approximate-time"
            value={approximateTime}
            onChange={(e) => onApproximateTimeChange(e.value as Date | null)}
            showTime
            hourFormat="12"
            className="w-full"
          />
        </div>
      </div>
    </CPTCard>
  );
};


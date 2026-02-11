'use client';

import { useMemo } from 'react';
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { Message } from 'primereact/message';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import type { FieldConfig } from '@/types/formConfig';
import type { DynamicFormData, CaseOption } from '@/types/supportRequest';
import { SupportRequestField } from './SupportRequestField';
import { organizeFieldsBySection } from '@/utils/fieldConsolidation';

interface StepRequestDataProps {
  formData: DynamicFormData;
  requiredFields: FieldConfig[];
  optionalFields: FieldConfig[];
  errors: Record<string, string>;
  onFieldChange: (fieldId: string, value: string | File[]) => void;
  onFieldBlur?: (fieldId: string, value: string) => void;
  title?: string;
  description?: string;
  selectedCase?: CaseOption | null;
}

export const StepRequestData = ({
  formData,
  requiredFields,
  optionalFields,
  errors,
  onFieldChange,
  onFieldBlur,
  title,
  description,
}: StepRequestDataProps) => {
  const requiredFieldsBySection = useMemo(
    () => organizeFieldsBySection(requiredFields),
    [requiredFields]
  );

  const optionalFieldsBySection = useMemo(
    () => organizeFieldsBySection(optionalFields),
    [optionalFields]
  );

  return (
    <Card className="mt-4" style={{ height: 'auto', overflow: 'visible' }}>
      <div className="flex flex-column gap-4" style={{ height: 'auto', overflow: 'visible' }}>
        {(title || description) && (
          <div className="mb-3">
            {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
            {description && (
              <p className="text-color-secondary line-height-3">{description}</p>
            )}
          </div>
        )}

        {requiredFieldsBySection.map((section, sectionIndex) => {
          if (section.fields.length === 0) return null;
          return (
            <div key={section.section}>
              {sectionIndex > 0 && <Divider />}
              <Fieldset legend={section.label}>
                <div className="flex flex-column gap-3">
                  {section.fields.map((field) => (
                    <SupportRequestField
                      key={field.id}
                      fieldConfig={field}
                      formData={formData}
                      errors={errors}
                      onFieldChange={onFieldChange}
                      onFieldBlur={onFieldBlur}
                      requiredFields={requiredFields}
                      optionalFields={optionalFields}
                    />
                  ))}
                </div>
              </Fieldset>
            </div>
          );
        })}

        {optionalFieldsBySection.length > 0 && (
          <>
            {requiredFieldsBySection.length > 0 && <Divider />}
            <Panel
              header="Additional Information"
              toggleable
              collapsed
              style={{ overflow: 'visible' }}
            >
              <div className="flex flex-column gap-3 pt-3" style={{ overflow: 'visible' }}>
                {optionalFieldsBySection.map((section) => (
                  <div key={section.section} className="flex flex-column gap-3">
                    {section.fields.map((field) => (
                      <SupportRequestField
                        key={field.id}
                        fieldConfig={field}
                        formData={formData}
                        errors={errors}
                        onFieldChange={onFieldChange}
                        onFieldBlur={onFieldBlur}
                        requiredFields={requiredFields}
                        optionalFields={optionalFields}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </Panel>
          </>
        )}

        {errors._general && (
          <Message severity="error" text={errors._general} className="mt-2" />
        )}
      </div>
    </Card>
  );
};

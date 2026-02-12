import type { DynamicFormData } from '@/types/supportRequest';

/**
 * Parses URL search parameters and converts them to partial form data.
 * Handles special cases like combining fname/lname into name.
 */
export function parseURLParams(searchParams: URLSearchParams): Partial<DynamicFormData> {
  const formData: Partial<DynamicFormData> = {};

  // Handle case ID
  const caseParam = searchParams.get('case');
  if (caseParam) {
    formData.caseId = caseParam;
  }

  // Handle firstName and lastName separately
  const fname = searchParams.get('fname') || searchParams.get('firstName');
  const lname = searchParams.get('lname') || searchParams.get('lastName');
  if (fname) {
    formData.firstName = fname;
  }
  if (lname) {
    formData.lastName = lname;
  }

  // Handle legacy name param (split into firstName and lastName)
  const nameParam = searchParams.get('name');
  if (nameParam && !fname && !lname) {
    const nameParts = nameParam.trim().split(/\s+/);
    if (nameParts.length >= 1) {
      formData.firstName = nameParts[0];
    }
    if (nameParts.length >= 2) {
      formData.lastName = nameParts.slice(1).join(' ');
    }
  }

  // Handle email
  const email = searchParams.get('email');
  if (email) {
    formData.email = email;
  }

  // Handle phone
  const phone = searchParams.get('phone');
  if (phone) {
    formData.phone = phone;
  }

  // Handle CPT ID
  const cptId = searchParams.get('cptid') || searchParams.get('cptId');
  if (cptId) {
    formData.cptId = cptId;
  }

  // Handle address field (mailingAddress consolidated to address)
  const address = searchParams.get('address') || searchParams.get('mailingaddress') || searchParams.get('mailingAddress');
  if (address) {
    formData.address = address;
  }

  // Handle request types (comma-separated IDs)
  const requestTypes = searchParams.get('requestTypes') || searchParams.get('types');
  if (requestTypes) {
    formData.requestTypes = requestTypes.split(',').map((id) => id.trim()).filter(Boolean);
  }

  // Remove undefined values
  const keysToRemove: (keyof DynamicFormData)[] = [];
  (Object.keys(formData) as Array<keyof DynamicFormData>).forEach((key) => {
    if (formData[key] === undefined) {
      keysToRemove.push(key);
    }
  });
  keysToRemove.forEach((key) => {
    delete formData[key];
  });

  return formData;
}

/**
 * Builds URL search parameters from form data.
 * Useful for sharing or bookmarking form state.
 */
export function buildURLParams(formData: Partial<DynamicFormData>): URLSearchParams {
  const params = new URLSearchParams();

  if (formData.caseId) {
    params.set('case', formData.caseId);
  }

  if (formData.firstName && typeof formData.firstName === 'string') {
    params.set('firstName', formData.firstName);
  }
  if (formData.lastName && typeof formData.lastName === 'string') {
    params.set('lastName', formData.lastName);
  }
  
  // Legacy support: also set fname/lname for backward compatibility
  if (formData.firstName && typeof formData.firstName === 'string') {
    params.set('fname', formData.firstName);
  }
  if (formData.lastName && typeof formData.lastName === 'string') {
    params.set('lname', formData.lastName);
  }

  if (formData.email && typeof formData.email === 'string') {
    params.set('email', formData.email);
  }

  if (formData.phone && typeof formData.phone === 'string') {
    params.set('phone', formData.phone);
  }

  if (formData.cptId && typeof formData.cptId === 'string') {
    params.set('cptid', formData.cptId);
  }

  if (formData.address && typeof formData.address === 'string') {
    params.set('address', formData.address);
  }

  if (formData.requestTypes && formData.requestTypes.length > 0) {
    params.set('requestTypes', formData.requestTypes.join(','));
  }

  return params;
}

/**
 * Gets a shareable URL with form data as query parameters.
 */
export function getShareableURL(
  basePath: string,
  formData: Partial<DynamicFormData>
): string {
  const params = buildURLParams(formData);
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}


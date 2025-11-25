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

  // Handle name (combine fname and lname if both present)
  const fname = searchParams.get('fname');
  const lname = searchParams.get('lname');
  if (fname || lname) {
    formData.name = [fname, lname].filter(Boolean).join(' ').trim() || undefined;
  }

  // Handle direct name param (takes precedence over fname/lname)
  const nameParam = searchParams.get('name');
  if (nameParam) {
    formData.name = nameParam;
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

  // Handle address fields
  const address = searchParams.get('address');
  if (address) {
    formData.address = address;
  }

  const mailingAddress = searchParams.get('mailingaddress') || searchParams.get('mailingAddress');
  if (mailingAddress) {
    formData.mailingAddress = mailingAddress;
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

  if (formData.name && typeof formData.name === 'string') {
    // Try to split name into first/last if it contains a space
    const nameParts = formData.name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      params.set('fname', nameParts[0]);
      params.set('lname', nameParts.slice(1).join(' '));
    } else {
      params.set('name', formData.name);
    }
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

  if (formData.mailingAddress && typeof formData.mailingAddress === 'string') {
    params.set('mailingaddress', formData.mailingAddress);
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


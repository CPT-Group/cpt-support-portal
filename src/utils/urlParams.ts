import type { DynamicFormData } from '@/types/supportRequest';
import { CASE_LIST } from '@/constants/CASELIST';
import { REQUEST_TYPES } from '@/constants/requestTypes';

/** Known URL param keys for form fields (allows only these; ignores unknown params) */
const KNOWN_FORM_KEYS = new Set<string>([
  'caseId', 'requestTypes',
  'firstName', 'lastName', 'email', 'phone', 'cptId', 'address',
  'previousAddress', 'newAddress', 'previousName', 'newName',
  'ssnTaxId', 'beneficiaryName', 'beneficiaryAddress', 'beneficiaryEmail',
  'additionalDescription',
]);

export interface URLParamsValidationResult {
  valid: boolean;
  errors: string[];
  formData: Partial<DynamicFormData>;
}

/**
 * Resolves caseName (decoded) to a case id from CASE_LIST (match by name or label, case-insensitive).
 */
function resolveCaseNameToId(caseName: string): string | null {
  const normalized = caseName.trim().toLowerCase();
  if (!normalized) return null;
  const found = CASE_LIST.find(
    (c) =>
      c.name.trim().toLowerCase() === normalized ||
      c.label.trim().toLowerCase() === normalized
  );
  return found?.id ?? null;
}

/**
 * Resolves a request-type value (ID or label) to the canonical ID from REQUEST_TYPES.
 * Accepts e.g. "3" or "Request Notice Packet" (case-insensitive).
 */
function resolveRequestTypeToId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const byId = REQUEST_TYPES.find((rt) => rt.id === trimmed);
  if (byId) return byId.id;
  const normalized = trimmed.toLowerCase();
  const byLabel = REQUEST_TYPES.find(
    (rt) => rt.label.trim().toLowerCase() === normalized
  );
  return byLabel?.id ?? null;
}

/**
 * Parses URL search parameters and converts them to partial form data.
 * Supports requestType (single or comma-separated), caseName (resolved to caseId), and all form fields.
 * Only includes keys that are known (form fields or caseId/requestTypes); ignores unknown params.
 */
export function parseURLParams(searchParams: URLSearchParams): Partial<DynamicFormData> {
  const formData: Partial<DynamicFormData> = {};

  // --- Request type(s): requestType (single or list) or requestTypes or types. Accept IDs or labels. ---
  const requestTypeParam =
    searchParams.get('requestType') ??
    searchParams.get('requestTypes') ??
    searchParams.get('types');
  if (requestTypeParam) {
    const rawValues = requestTypeParam
      .split(',')
      .map((v) => decodeURIComponent(v).trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    const ids = rawValues
      .map((v) => resolveRequestTypeToId(v))
      .filter((id): id is string => id != null);
    if (ids.length > 0) formData.requestTypes = ids;
  }

  // --- Case: case (id), caseName (resolved to id) ---
  const caseParam = searchParams.get('case') || searchParams.get('caseId');
  const caseNameParam = searchParams.get('caseName');
  if (caseParam) {
    formData.caseId = caseParam.trim();
  } else if (caseNameParam) {
    const decoded = decodeURIComponent(caseNameParam);
    const resolvedId = resolveCaseNameToId(decoded);
    if (resolvedId) formData.caseId = resolvedId;
  }

  // --- Identity / form fields (only known keys) ---
  const fname = searchParams.get('fname') || searchParams.get('firstName');
  const lname = searchParams.get('lname') || searchParams.get('lastName');
  if (fname) formData.firstName = fname;
  if (lname) formData.lastName = lname;

  const nameParam = searchParams.get('name');
  if (nameParam && !fname && !lname) {
    const nameParts = nameParam.trim().split(/\s+/);
    if (nameParts.length >= 1) formData.firstName = nameParts[0];
    if (nameParts.length >= 2) formData.lastName = nameParts.slice(1).join(' ');
  }

  const email = searchParams.get('email');
  if (email) formData.email = email;

  const phone = searchParams.get('phone');
  if (phone) formData.phone = phone;

  const cptId = searchParams.get('cptid') || searchParams.get('cptId');
  if (cptId) formData.cptId = cptId;

  const address =
    searchParams.get('address') ||
    searchParams.get('mailingaddress') ||
    searchParams.get('mailingAddress');
  if (address) formData.address = address;

  const previousAddress = searchParams.get('previousAddress') || searchParams.get('previousaddress');
  if (previousAddress) formData.previousAddress = previousAddress;
  const newAddress = searchParams.get('newAddress') || searchParams.get('newaddress');
  if (newAddress) formData.newAddress = newAddress;
  const previousName = searchParams.get('previousName') || searchParams.get('previousname');
  if (previousName) formData.previousName = previousName;
  const newName = searchParams.get('newName') || searchParams.get('newname');
  if (newName) formData.newName = newName;
  const ssnTaxId = searchParams.get('ssnTaxId') || searchParams.get('ssntaxid');
  if (ssnTaxId) formData.ssnTaxId = ssnTaxId;
  const beneficiaryName =
    searchParams.get('beneficiaryName') || searchParams.get('beneficiaryname');
  if (beneficiaryName) formData.beneficiaryName = beneficiaryName;
  const beneficiaryAddress =
    searchParams.get('beneficiaryAddress') || searchParams.get('beneficiaryaddress');
  if (beneficiaryAddress) formData.beneficiaryAddress = beneficiaryAddress;
  const beneficiaryEmail =
    searchParams.get('beneficiaryEmail') || searchParams.get('beneficiaryemail');
  if (beneficiaryEmail) formData.beneficiaryEmail = beneficiaryEmail;
  const additionalDescription =
    searchParams.get('additionalDescription') || searchParams.get('additionaldescription');
  if (additionalDescription) formData.additionalDescription = additionalDescription;

  // Strip unknown keys (only keep known form keys + caseId/requestTypes)
  Object.keys(formData).forEach((key) => {
    if (key !== 'caseId' && key !== 'requestTypes' && !KNOWN_FORM_KEYS.has(key)) {
      delete formData[key as keyof DynamicFormData];
    }
  });
  return formData;
}

/**
 * Validates parsed URL form data: request type IDs must exist, caseId must be a valid case (if set).
 * Optional raw searchParams: if provided and caseName was present but did not resolve, adds an error.
 */
export function validateURLParams(
  formData: Partial<DynamicFormData>,
  searchParams?: URLSearchParams
): URLParamsValidationResult {
  const errors: string[] = [];
  const validRequestTypeIds = new Set(REQUEST_TYPES.map((rt) => rt.id));
  const validCaseIds = new Set(CASE_LIST.map((c) => c.id));

  if (formData.requestTypes && formData.requestTypes.length > 0) {
    const invalid = formData.requestTypes.filter((id) => !validRequestTypeIds.has(id));
    if (invalid.length > 0) {
      errors.push(
        `Invalid request type(s) in URL: ${invalid.join(', ')}. Please remove or correct the requestType parameter.`
      );
    }
  }

  if (formData.caseId != null && formData.caseId !== '') {
    if (!validCaseIds.has(formData.caseId)) {
      errors.push(
        'The case specified in the URL (case or caseName) was not found. Please check the URL or select a case on the form.'
      );
    }
  }

  if (searchParams?.has('caseName')) {
    const caseNameParam = searchParams.get('caseName');
    const decoded = caseNameParam ? decodeURIComponent(caseNameParam).trim() : '';
    if (decoded) {
      const resolvedId = resolveCaseNameToId(decoded);
      if (!resolvedId || !validCaseIds.has(resolvedId)) {
        errors.push(
          `The case name "${decoded}" in the URL was not found. Please check the caseName parameter or select a case on the form.`
        );
      }
    }
  }

  const valid = errors.length === 0;
  return { valid, errors, formData };
}

/**
 * Parse and validate URL params in one call. Use this on the support-request page.
 */
export function parseAndValidateURLParams(
  searchParams: URLSearchParams
): URLParamsValidationResult {
  const formData = parseURLParams(searchParams);
  return validateURLParams(formData, searchParams);
}

/** Step index: 0 = request type, 1 = case, 2 = request data. Used to only put relevant params in the URL. */
export type SupportRequestStep = 0 | 1 | 2;

/**
 * Builds URL search parameters from form data.
 * When step is provided, only includes params for that step and earlier (so going back removes later params).
 * Step 0: requestType only. Step 1: + case/caseName. Step 2 or undefined: + all form fields.
 */
export function buildURLParams(
  formData: Partial<DynamicFormData>,
  options?: { useCaseName?: boolean; step?: SupportRequestStep }
): URLSearchParams {
  const params = new URLSearchParams();
  const useCaseName = options?.useCaseName ?? true;
  const step = options?.step;

  if (formData.requestTypes && formData.requestTypes.length > 0) {
    const labels = formData.requestTypes
      .map((id) => REQUEST_TYPES.find((rt) => rt.id === id)?.label)
      .filter(Boolean) as string[];
    if (labels.length > 0) {
      params.set('requestType', labels.join(','));
    }
  }

  if (step === undefined || step >= 1) {
    if (formData.caseId) {
      params.set('case', formData.caseId);
      if (useCaseName) {
        const caseOption = CASE_LIST.find((c) => c.id === formData.caseId);
        if (caseOption) params.set('caseName', caseOption.name);
      }
    }
  }

  if (step === undefined || step >= 2) {
    if (formData.firstName && typeof formData.firstName === 'string') {
      params.set('firstName', formData.firstName);
      params.set('fname', formData.firstName);
    }
    if (formData.lastName && typeof formData.lastName === 'string') {
      params.set('lastName', formData.lastName);
      params.set('lname', formData.lastName);
    }
    if (formData.email && typeof formData.email === 'string') params.set('email', formData.email);
    if (formData.phone && typeof formData.phone === 'string') params.set('phone', formData.phone);
    if (formData.cptId && typeof formData.cptId === 'string') params.set('cptId', formData.cptId);
    if (formData.address && typeof formData.address === 'string')
      params.set('address', formData.address);
    if (formData.previousAddress && typeof formData.previousAddress === 'string')
      params.set('previousAddress', formData.previousAddress);
    if (formData.newAddress && typeof formData.newAddress === 'string')
      params.set('newAddress', formData.newAddress);
    if (formData.previousName && typeof formData.previousName === 'string')
      params.set('previousName', formData.previousName);
    if (formData.newName && typeof formData.newName === 'string')
      params.set('newName', formData.newName);
    if (formData.ssnTaxId && typeof formData.ssnTaxId === 'string')
      params.set('ssnTaxId', formData.ssnTaxId);
    if (formData.beneficiaryName && typeof formData.beneficiaryName === 'string')
      params.set('beneficiaryName', formData.beneficiaryName);
    if (formData.beneficiaryAddress && typeof formData.beneficiaryAddress === 'string')
      params.set('beneficiaryAddress', formData.beneficiaryAddress);
    if (formData.beneficiaryEmail && typeof formData.beneficiaryEmail === 'string')
      params.set('beneficiaryEmail', formData.beneficiaryEmail);
    if (formData.additionalDescription && typeof formData.additionalDescription === 'string')
      params.set('additionalDescription', formData.additionalDescription);
  }

  return params;
}

/**
 * Builds the support-request query string with human-readable request type labels
 * and literal commas (no %2C). When step is set, only includes params for that step (e.g. step 0 = no case/caseName).
 */
export function getSupportRequestQueryString(
  formData: Partial<DynamicFormData>,
  options?: { useCaseName?: boolean; step?: SupportRequestStep }
): string {
  const params = buildURLParams(formData, options);
  const parts: string[] = [];
  params.forEach((value, key) => {
    if (key === 'requestType') {
      const encodedLabels = value
        .split(',')
        .map((l) => encodeURIComponent(l.trim()))
        .join(',');
      parts.push(`requestType=${encodedLabels}`);
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });
  return parts.join('&');
}

/**
 * Gets a shareable URL with form data as query parameters.
 */
export function getShareableURL(
  basePath: string,
  formData: Partial<DynamicFormData>
): string {
  const queryString = getSupportRequestQueryString(formData);
  return queryString ? `${basePath}?${queryString}` : basePath;
}


export type State = {
  id: number;
  abbreviation: string;
  name: string;
};

export const STATES: State[] = [
  { id: 1, abbreviation: 'AL', name: 'Alabama' },
  { id: 2, abbreviation: 'AK', name: 'Alaska' },
  { id: 3, abbreviation: 'AZ', name: 'Arizona' },
  { id: 4, abbreviation: 'AR', name: 'Arkansas' },
  { id: 5, abbreviation: 'CA', name: 'California' },
  { id: 6, abbreviation: 'CO', name: 'Colorado' },
  { id: 7, abbreviation: 'CT', name: 'Connecticut' },
  { id: 8, abbreviation: 'DE', name: 'Delaware' },
  { id: 9, abbreviation: 'FL', name: 'Florida' },
  { id: 10, abbreviation: 'GA', name: 'Georgia' },
  { id: 11, abbreviation: 'HI', name: 'Hawaii' },
  { id: 12, abbreviation: 'ID', name: 'Idaho' },
  { id: 13, abbreviation: 'IL', name: 'Illinois' },
  { id: 14, abbreviation: 'IN', name: 'Indiana' },
  { id: 15, abbreviation: 'IA', name: 'Iowa' },
  { id: 16, abbreviation: 'KS', name: 'Kansas' },
  { id: 17, abbreviation: 'KY', name: 'Kentucky' },
  { id: 18, abbreviation: 'LA', name: 'Louisiana' },
  { id: 19, abbreviation: 'ME', name: 'Maine' },
  { id: 20, abbreviation: 'MD', name: 'Maryland' },
  { id: 21, abbreviation: 'MA', name: 'Massachusetts' },
  { id: 22, abbreviation: 'MI', name: 'Michigan' },
  { id: 23, abbreviation: 'MN', name: 'Minnesota' },
  { id: 24, abbreviation: 'MS', name: 'Mississippi' },
  { id: 25, abbreviation: 'MO', name: 'Missouri' },
  { id: 26, abbreviation: 'MT', name: 'Montana' },
  { id: 27, abbreviation: 'NE', name: 'Nebraska' },
  { id: 28, abbreviation: 'NV', name: 'Nevada' },
  { id: 29, abbreviation: 'NH', name: 'New Hampshire' },
  { id: 30, abbreviation: 'NJ', name: 'New Jersey' },
  { id: 31, abbreviation: 'NM', name: 'New Mexico' },
  { id: 32, abbreviation: 'NY', name: 'New York' },
  { id: 33, abbreviation: 'NC', name: 'North Carolina' },
  { id: 34, abbreviation: 'ND', name: 'North Dakota' },
  { id: 35, abbreviation: 'OH', name: 'Ohio' },
  { id: 36, abbreviation: 'OK', name: 'Oklahoma' },
  { id: 37, abbreviation: 'OR', name: 'Oregon' },
  { id: 38, abbreviation: 'PA', name: 'Pennsylvania' },
  { id: 39, abbreviation: 'RI', name: 'Rhode Island' },
  { id: 40, abbreviation: 'SC', name: 'South Carolina' },
  { id: 41, abbreviation: 'SD', name: 'South Dakota' },
  { id: 42, abbreviation: 'TN', name: 'Tennessee' },
  { id: 43, abbreviation: 'TX', name: 'Texas' },
  { id: 44, abbreviation: 'UT', name: 'Utah' },
  { id: 45, abbreviation: 'VT', name: 'Vermont' },
  { id: 46, abbreviation: 'VA', name: 'Virginia' },
  { id: 47, abbreviation: 'WA', name: 'Washington' },
  { id: 48, abbreviation: 'WV', name: 'West Virginia' },
  { id: 49, abbreviation: 'WI', name: 'Wisconsin' },
  { id: 50, abbreviation: 'WY', name: 'Wyoming' },
];

// Helper function to get state by abbreviation
export function getStateByAbbreviation(abbreviation: string): State | undefined {
  return STATES.find((state) => state.abbreviation.toUpperCase() === abbreviation.toUpperCase());
}

// Helper function to get state by ID
export function getStateById(id: number): State | undefined {
  return STATES.find((state) => state.id === id);
}

// Helper function to get state by name
export function getStateByName(name: string): State | undefined {
  return STATES.find((state) => state.name.toLowerCase() === name.toLowerCase());
}


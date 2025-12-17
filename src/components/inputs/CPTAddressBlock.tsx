'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CPTInputText, CPTInputMask, CPTDropdown, CPTAutoComplete } from '@cpt-group/cpt-prime-react';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import axios from 'axios';
import { STATES, getStateByAbbreviation } from '@/constants/STATES';
import type { State } from '@/constants/STATES';
import type { AutoCompleteCompleteEvent } from 'primereact/autocomplete';

export interface AddressData {
  street: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
}

export interface CPTAddressBlockProps {
  /** Current address value (full address string) */
  value?: string;
  /** Callback when address changes */
  onChange: (address: string) => void;
  /** Callback when field loses focus */
  onBlur?: () => void;
  /** Label for the address field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Field ID for accessibility */
  id?: string;
  /** Help text to display below the field */
  helpText?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
}

interface GeoapifySuggestion {
  formatted: string;
  address_line1: string;
  address_line2?: string;
  city?: string;
  state?: string;
  state_code?: string;
  postcode?: string;
  country?: string;
  housenumber?: string;
  street?: string;
}

export const CPTAddressBlock = ({
  value = '',
  onChange,
  onBlur,
  label = 'Address',
  required = false,
  placeholder = 'Start typing your address...',
  error,
  id = 'address-block',
  helpText,
  disabled = false,
}: CPTAddressBlockProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoapifySuggestion[]>([]);
  const [street, setStreet] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [zip, setZip] = useState('');
  const initializedRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  
  // Development warning if API key is missing
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !apiKey) {
      console.warn(
        'Geoapify API key is missing. Address autocomplete will not work. ' +
        'Please set NEXT_PUBLIC_GEOAPIFY_API_KEY in .env.local'
      );
    }
  }, [apiKey]);
  
  // Cache for API responses - stores query -> suggestions mapping
  const cacheRef = useRef<Map<string, { suggestions: GeoapifySuggestion[]; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

  // Parse existing value into structured address if it exists (only once on mount)
  useEffect(() => {
    // Only parse once on initial mount if we have a value
    if (!initializedRef.current && value) {
      initializedRef.current = true;
      // Simple parsing - just split by comma
      // Format: "Street, AddressLine2, City, State, ZIP" or "Street, City, State, ZIP"
      const parts = value.split(',').map(p => p.trim()).filter(Boolean);
      let partIndex = 0;
      
      // Street address (first part)
      if (parts.length > partIndex) {
        setStreet(parts[partIndex] || '');
        partIndex++;
      }
      
      // Address Line 2 (optional, if present)
      // We'll try to detect if next part is city or address line 2
      // For now, we'll assume if there are 5+ parts, second is address line 2
      if (parts.length >= 5 && partIndex < parts.length) {
        setAddressLine2(parts[partIndex] || '');
        partIndex++;
      }
      
      // City
      if (parts.length > partIndex) {
        setCity(parts[partIndex] || '');
        partIndex++;
      }
      
      // State
      if (parts.length > partIndex) {
        const stateValue = parts[partIndex] || '';
        const matchedState = getStateByAbbreviation(stateValue) || 
          STATES.find(s => s.name.toLowerCase() === stateValue.toLowerCase());
        setSelectedState(matchedState || null);
        partIndex++;
      }
      
      // ZIP
      if (parts.length > partIndex) {
        setZip(parts[partIndex] || '');
      }
    }
  }, [value]);

  // Check cache for existing results
  const getCachedResults = useCallback((query: string): GeoapifySuggestion[] | null => {
    const normalizedQuery = query.toLowerCase().trim();
    const now = Date.now();
    
    // Check exact match first
    const exactMatch = cacheRef.current.get(normalizedQuery);
    if (exactMatch && (now - exactMatch.timestamp) < CACHE_DURATION) {
      return exactMatch.suggestions;
    }
    
    // Check if query is a substring of any cached query (e.g., "Irvine" cached, user types "Irvin")
    // Find the longest cached query that starts with the current query
    let bestMatch: { query: string; suggestions: GeoapifySuggestion[] } | null = null;
    let bestMatchLength = 0;
    
    for (const [cachedQuery, cachedData] of cacheRef.current.entries()) {
      // Check if cache is still valid
      if ((now - cachedData.timestamp) >= CACHE_DURATION) {
        continue;
      }
      
      // Check if cached query starts with current query (user is typing forward)
      if (cachedQuery.startsWith(normalizedQuery) && cachedQuery.length > bestMatchLength) {
        bestMatch = { query: cachedQuery, suggestions: cachedData.suggestions };
        bestMatchLength = cachedQuery.length;
      }
      // Check if current query starts with cached query (user deleted characters)
      else if (normalizedQuery.startsWith(cachedQuery) && cachedQuery.length > bestMatchLength) {
        // Filter cached results to match current query
        const filtered = cachedData.suggestions.filter((suggestion) => {
          const formatted = (suggestion.formatted || '').toLowerCase();
          return formatted.includes(normalizedQuery);
        });
        if (filtered.length > 0) {
          bestMatch = { query: cachedQuery, suggestions: filtered };
          bestMatchLength = cachedQuery.length;
        }
      }
    }
    
    return bestMatch?.suggestions || null;
  }, []);

  // Clean up expired cache entries
  const cleanupCache = useCallback(() => {
    const now = Date.now();
    for (const [query, data] of cacheRef.current.entries()) {
      if ((now - data.timestamp) >= CACHE_DURATION) {
        cacheRef.current.delete(query);
      }
    }
  }, []);

  // Debounced search function with caching
  const searchAddresses = useCallback(
    async (query: string) => {
      if (!query || query.length < 4 || !apiKey) {
        setSuggestions([]);
        return;
      }

      const normalizedQuery = query.toLowerCase().trim();
      
      // Clean up expired cache entries periodically
      if (cacheRef.current.size > 50) {
        cleanupCache();
      }

      // Check cache first
      const cachedResults = getCachedResults(normalizedQuery);
      if (cachedResults && cachedResults.length > 0) {
        setSuggestions(cachedResults);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete`,
          {
            params: {
              text: query,
              apiKey: apiKey,
              limit: 5,
              format: 'json',
            },
          }
        );

        if (response.data && response.data.results && Array.isArray(response.data.results)) {
          const results = response.data.results;
          setSuggestions(results);
          
          // Debug logging in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Geoapify API Results:', results);
          }
          
          // Cache the results
          cacheRef.current.set(normalizedQuery, {
            suggestions: results,
            timestamp: Date.now(),
          });
        } else {
          setSuggestions([]);
          // Cache empty results too (to avoid repeated API calls for invalid queries)
          cacheRef.current.set(normalizedQuery, {
            suggestions: [],
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Geoapify API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          });
        } else {
          console.error('Error fetching address suggestions:', error);
        }
        setSuggestions([]);
      }
    },
    [apiKey, getCachedResults, cleanupCache]
  );

  // Handle autocomplete search
  const handleSearch = (e: AutoCompleteCompleteEvent) => {
    const query = e.query;
    setSearchQuery(query);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce API calls
    debounceTimerRef.current = setTimeout(() => {
      searchAddresses(query);
    }, 300);
  };

  // Handle address selection from autocomplete
  const handleAddressSelect = (selected: GeoapifySuggestion) => {
    // Extract street address (address_line1 contains street + house number)
    const streetValue = selected.address_line1 || selected.street || '';
    
    // Address line 2 should be empty from API - it's for apartment/suite which user enters manually
    // The API's address_line2 contains formatted city/state/zip which we don't want here
    const addressLine2Value = '';
    
    // Extract city - use the city field directly, not from address_line2
    const cityValue = selected.city || '';
    
    // Extract ZIP code
    const zipValue = selected.postcode || '';
    
    // Extract and match state - prioritize state_code (abbreviation) for matching
    const stateCode = selected.state_code || '';
    const stateName = selected.state || '';
    
    // Try to match by abbreviation first (most reliable)
    let matchedState: State | null = null;
    if (stateCode) {
      matchedState = getStateByAbbreviation(stateCode) || null;
      if (process.env.NODE_ENV === 'development') {
        console.log('State matching:', { stateCode, matchedState: matchedState?.name || 'not found' });
      }
    }
    
    // Fallback to matching by full state name if abbreviation didn't work
    if (!matchedState && stateName) {
      matchedState = STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase()) || null;
      if (process.env.NODE_ENV === 'development') {
        console.log('State matching by name:', { stateName, matchedState: matchedState?.name || 'not found' });
      }
    }
    
    // Debug log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Address selection:', {
        street: streetValue,
        city: cityValue,
        stateCode,
        stateName,
        matchedState: matchedState?.name || 'null',
        zip: zipValue,
      });
    }
    
    // Update all manual fields with selected address data
    setStreet(streetValue);
    setAddressLine2(addressLine2Value);
    setCity(cityValue);
    setSelectedState(matchedState);
    setZip(zipValue);
    
    // Set search query to formatted address
    setSearchQuery(selected.formatted || streetValue);
    setSuggestions([]);
    
    // Generate full address string
    const stateAbbr = matchedState ? matchedState.abbreviation : '';
    const parts = [streetValue, addressLine2Value, cityValue, stateAbbr, zipValue].filter(Boolean);
    const fullAddress = parts.join(', ');
    
    // Update parent with full formatted address
    onChange(fullAddress);
  };

  // Update full address when manual fields change - use a ref to prevent infinite loops
  const lastAddressRef = useRef<string>('');
  const onChangeRef = useRef(onChange);
  
  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  
  useEffect(() => {
    const stateValue = selectedState ? selectedState.abbreviation : '';
    const parts = [
      street,
      addressLine2,
      city,
      stateValue,
      zip
    ].filter(Boolean);
    const fullAddress = parts.join(', ');
    // Only call onChange if address actually changed to prevent loops
    if (fullAddress !== lastAddressRef.current) {
      lastAddressRef.current = fullAddress;
      onChangeRef.current(fullAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [street, addressLine2, city, selectedState, zip]); // Removed onChange from deps

  return (
    <div className="flex flex-column gap-3">
      <label htmlFor={id} className="font-semibold">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {/* Autocomplete input */}
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-map-marker"></i>
        </span>
        <CPTAutoComplete
          id={id}
          value={searchQuery}
          suggestions={suggestions}
          completeMethod={handleSearch}
          field="formatted"
          itemTemplate={(suggestion: GeoapifySuggestion) => (
            <div className="flex flex-column">
              <div className="font-semibold">{suggestion.formatted}</div>
              {suggestion.address_line2 && (
                <small className="text-color-secondary">
                  {suggestion.address_line2}
                </small>
              )}
            </div>
          )}
          onChange={(e) => {
            setSearchQuery(e.value);
            if (!e.value) {
              setSuggestions([]);
            }
          }}
          onSelect={(e) => {
            const selected = e.value as GeoapifySuggestion;
            handleAddressSelect(selected);
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full ${error ? 'p-invalid' : ''}`}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          dropdown
          forceSelection={false}
        />
      </div>

      {/* Manual entry using Inplace */}
      <Inplace closable>
        <InplaceDisplay>
          Enter address manually
        </InplaceDisplay>
        <InplaceContent>
          <div className="flex flex-column gap-3 pt-3">
            {/* Street Address */}
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-home"></i>
              </span>
              <CPTInputText
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                onBlur={onBlur}
                placeholder="Street Address"
                className="w-full"
                disabled={disabled}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
              />
            </div>

            {/* Address Line 2 (Apartment, suite, etc.) */}
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-building"></i>
              </span>
              <CPTInputText
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                onBlur={onBlur}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full"
                disabled={disabled}
              />
            </div>

            {/* City - Full width on all screens */}
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-building"></i>
              </span>
              <CPTInputText
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={onBlur}
                placeholder="City"
                className="w-full"
                disabled={disabled}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
              />
            </div>

            {/* State and ZIP Code - Side by side on tablet and larger */}
            <div className="flex flex-column md:flex-row gap-2">
              {/* State */}
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-map"></i>
                </span>
                <CPTDropdown
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.value)}
                  options={STATES}
                  optionLabel="name"
                  placeholder="Select State"
                  className="w-full"
                  disabled={disabled}
                  filter
                  filterPlaceholder="Search states..."
                  onBlur={onBlur}
                  aria-required={required}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${id}-error` : undefined}
                />
              </div>

              {/* ZIP Code */}
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-inbox"></i>
                </span>
                <CPTInputMask
                  value={zip}
                  onChange={(e) => setZip(e.value || '')}
                  onBlur={onBlur}
                  mask="99999"
                  placeholder="12345"
                  className="w-full"
                  disabled={disabled}
                  aria-required={required}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${id}-error` : undefined}
                />
              </div>
            </div>
          </div>
        </InplaceContent>
      </Inplace>

      {helpText && <small className="text-color-secondary">{helpText}</small>}
      {error && (
        <div id={`${id}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

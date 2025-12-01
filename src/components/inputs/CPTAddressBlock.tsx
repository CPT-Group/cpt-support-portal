'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CPTInputText, CPTAutoComplete, CPTInputMask } from '@cpt-group/cpt-prime-react';
import axios from 'axios';
import type { AutoCompleteCompleteEvent } from 'primereact/autocomplete';

export interface AddressData {
  street: string;
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
  properties: {
    formatted: string;
    address_line1: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
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
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  
  // Cache for API responses - stores query -> suggestions mapping
  const cacheRef = useRef<Map<string, { suggestions: GeoapifySuggestion[]; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

  // Parse existing value into structured address if it exists
  useEffect(() => {
    if (value && !selectedAddress && !manualMode) {
      // Try to parse existing value - if it looks structured, parse it
      // Otherwise, use it as the search query
      setSearchQuery(value);
    }
  }, [value, selectedAddress, manualMode]);

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
          const formatted = (suggestion.properties.formatted || '').toLowerCase();
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
            },
          }
        );

        if (response.data && response.data.features) {
          const features = response.data.features;
          setSuggestions(features);
          
          // Cache the results
          cacheRef.current.set(normalizedQuery, {
            suggestions: features,
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
    const props = selected.properties;
    const addressData: AddressData = {
      street: props.address_line1 || '',
      city: props.city || '',
      state: props.state || '',
      zip: props.postcode || '',
      fullAddress: props.formatted || props.address_line1 || '',
    };

    setSelectedAddress(addressData);
    setStreet(addressData.street);
    setCity(addressData.city);
    setState(addressData.state);
    setZip(addressData.zip);
    setSearchQuery(props.formatted || props.address_line1 || '');
    setSuggestions([]);
    setManualMode(false);

    // Update parent with full formatted address
    onChange(addressData.fullAddress);
  };

  // Handle manual address entry
  const handleManualEntry = () => {
    setManualMode(true);
    setSearchQuery('');
    setSuggestions([]);
  };

  // Update full address when manual fields change
  useEffect(() => {
    if (manualMode && (street || city || state || zip)) {
      const parts = [street, city, state, zip].filter(Boolean);
      const fullAddress = parts.join(', ');
      if (fullAddress) {
        onChange(fullAddress);
      }
    }
  }, [street, city, state, zip, manualMode, onChange]);

  // Format suggestions for autocomplete
  const formatSuggestions = (suggestion: GeoapifySuggestion) => {
    return suggestion.properties.formatted || suggestion.properties.address_line1 || '';
  };

  return (
    <div className="flex flex-column gap-3">
      <label htmlFor={id} className="font-semibold">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {!manualMode ? (
        <>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-map-marker"></i>
            </span>
            <CPTAutoComplete
              id={id}
              value={searchQuery}
              suggestions={suggestions}
              completeMethod={handleSearch}
              itemTemplate={(suggestion: GeoapifySuggestion) => (
                <div className="flex flex-column">
                  <div className="font-semibold">{suggestion.properties.formatted}</div>
                  {suggestion.properties.address_line2 && (
                    <small className="text-color-secondary">
                      {suggestion.properties.address_line2}
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
              onSelect={(e) => handleAddressSelect(e.value as GeoapifySuggestion)}
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
          <button
            type="button"
            onClick={handleManualEntry}
            className="p-button p-button-text p-button-sm text-left"
            style={{ padding: '0.25rem 0', fontSize: '0.875rem' }}
          >
            <i className="pi pi-pencil mr-2"></i>
            Enter address manually
          </button>
        </>
      ) : (
        <div className="flex flex-column gap-3">
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
            />
          </div>

          <div className="flex gap-2">
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
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-map"></i>
              </span>
              <CPTInputText
                value={state}
                onChange={(e) => setState(e.target.value)}
                onBlur={onBlur}
                placeholder="State"
                className="w-full"
                disabled={disabled}
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-inbox"></i>
              </span>
              <CPTInputMask
                value={zip}
                onChange={(e) => setZip(e.value || '')}
                onBlur={onBlur}
                mask="99999? -9999"
                placeholder="12345 or 12345-6789"
                className="w-full"
                disabled={disabled}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setManualMode(false);
              setSearchQuery('');
            }}
            className="p-button p-button-text p-button-sm text-left"
            style={{ padding: '0.25rem 0', fontSize: '0.875rem' }}
          >
            <i className="pi pi-search mr-2"></i>
            Use address autocomplete instead
          </button>
        </div>
      )}

      {helpText && <small className="text-color-secondary">{helpText}</small>}
      {error && (
        <div id={`${id}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
};


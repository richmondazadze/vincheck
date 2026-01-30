/**
 * CarAPI.dev Client
 * Server-side API client for fetching vehicle data
 * Based on documentation: https://docs.carapi.dev/
 */

import { config } from '@/lib/config';
import { decodeVinNhtsa, decodeVinsBatchNhtsa } from './nhtsa';
import type { VinSpecifications, VinDecodeResponse } from './types';

// Get API key from environment
const API_KEY = process.env.CAR_API || '';

// Base URL for CarAPI.dev
const BASE_URL = 'https://api.carapi.dev/v1';

// Mock data for static generation (when API is unavailable)
const mockYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

// Simple in-memory cache for server-side requests
const cache = new Map<string, { data: unknown; expiry: number }>();

function getCacheKey(endpoint: string, params?: Record<string, string | number | undefined>): string {
  const paramsString = params ? JSON.stringify(params) : '';
  return `${endpoint}:${paramsString}`;
}

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data as T;
  }
  if (cached) {
    cache.delete(key);
  }
  return null;
}

function setCache<T>(key: string, data: T, ttlSeconds: number): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Build API URL with token parameter
 * According to docs: https://api.carapi.dev/v1/vin-decode/{vin}?token=YOUR_API_KEY
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
  // Construct the base URL with endpoint
  let url = `${BASE_URL}${endpoint}`;
  
  // Add query parameters
  const queryParams = new URLSearchParams();
  
  // Add API token first
  if (API_KEY) {
    queryParams.set('token', API_KEY);
  }
  
  // Add additional params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.set(key, String(value));
      }
    });
  }
  
  // Append query string if there are parameters
  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
}

async function fetchWithTimeout(
  url: string,
  timeout = config.api.carApi.timeout
): Promise<Response | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[CarAPI] Fetch error:', error);
    return null;
  }
}

async function fetchWithRetry<T>(
  url: string,
  retries = config.api.carApi.retries,
  silent404 = false
): Promise<T | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(url);
      
      if (!response) {
        if (!silent404) {
          console.error('[CarAPI] No response received');
        }
        return null;
      }
      
      if (!response.ok) {
        // Handle 404 errors silently for optional endpoints (valuation, photos, stolen check)
        if (response.status === 404 && silent404) {
          return null;
        }
        
        // Handle rate limiting
        if (response.status === 429) {
          const errorData = await response.json().catch(() => ({}));
          console.warn('[CarAPI] API quota exceeded:', errorData);
          return null;
        }
        
        // Handle 404 for required endpoints (VIN decode)
        if (response.status === 404) {
          const errorText = await response.text().catch(() => 'Not found');
          console.warn(`[CarAPI] Resource not found (404):`, errorText);
          return null;
        }
        
        // Handle other errors
        const errorText = await response.text().catch(() => 'Unknown error');
        if (!silent404) {
          console.error(`[CarAPI] HTTP error ${response.status}:`, errorText);
        }
        return null;
      }
      
      const data = await response.json() as T;
      return data;
    } catch (error) {
      if (!silent404) {
        console.error(`[CarAPI] Attempt ${i + 1} failed:`, error);
      }
      // Wait before retrying (exponential backoff)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  return null;
}

// ============================================
// API Types based on documentation
// ============================================
// Note: VinSpecifications and VinDecodeResponse are imported from ./types
// Additional CarAPI-specific response types are defined below

export interface StolenCheckResponse {
  vin: string;
  stolen: boolean;
  countries: {
    sk: boolean;
    cz: boolean;
    si: boolean;
    hu: boolean;
    ro: boolean;
  };
}

export interface VehicleValuationResponse {
  originalPrice: number;
  currency: string;
  priceEstimation: Array<{
    year: number;
    price: number;
  }>;
}

export interface VehiclePhotosResponse {
  vin: string;
  photos: Array<{
    url: string;
    type: string;
    angle: string;
  }>;
}

export interface PlateToVinResponse {
  plateNumber: string;
  country: string;
  vin: string | null;
}

// ============================================
// API Client Functions
// ============================================

/**
 * Decode VIN using CarAPI.dev (internal function)
 * Endpoint: GET /vin-decode/{vin}
 * Credits: 1 per request
 * 
 * Example: https://api.carapi.dev/v1/vin-decode/1HGBH41JXMN109186?token=YOUR_API_KEY
 */
async function decodeVinCarApi(vin: string): Promise<VinDecodeResponse | null> {
  const normalizedVin = vin.toUpperCase().trim();
  const cacheKey = getCacheKey('carapi-vin-decode', { vin: normalizedVin });
  const cached = getCached<VinDecodeResponse>(cacheKey);
  if (cached) return cached;
  
  const url = buildUrl(`/vin-decode/${normalizedVin}`);
  
  const data = await fetchWithRetry<VinDecodeResponse>(url, config.api.carApi.retries, false);
  
  if (!data) {
    return null;
  }
  
  setCache(cacheKey, data, config.cache.vin);
  return data;
}

/**
 * Unified VIN Decoder - Uses NHTSA first (free), falls back to CarAPI
 * This hybrid approach reduces costs while maintaining reliability
 * 
 * Strategy:
 * 1. Try NHTSA API first (free, reliable for US vehicles)
 * 2. Fall back to CarAPI if NHTSA fails or returns incomplete data
 * 3. Merge results intelligently (prefer NHTSA for basic specs, CarAPI for missing fields)
 * 
 * @param vin - 17-character VIN
 * @returns VinDecodeResponse with specifications from best available source
 */
export async function decodeVin(vin: string): Promise<VinDecodeResponse | null> {
  const normalizedVin = vin.toUpperCase().trim();
  
  // Check unified cache first
  const unifiedCacheKey = getCacheKey('unified-vin-decode', { vin: normalizedVin });
  const cached = getCached<VinDecodeResponse>(unifiedCacheKey);
  if (cached) return cached;
  
  // Try NHTSA first (free, no authentication)
  let nhtsaSpecs = await decodeVinNhtsa(normalizedVin);
  
  // Try CarAPI as fallback or enhancement
  let carApiData: VinDecodeResponse | null = null;
  
  // If NHTSA failed or returned minimal data, try CarAPI
  if (!nhtsaSpecs || !nhtsaSpecs.make || !nhtsaSpecs.model) {
    carApiData = await decodeVinCarApi(normalizedVin);
  }
  
  // Merge results intelligently
  let finalSpecs: VinSpecifications | undefined;
  let features: string[] | undefined;
  let plateNumber: { country?: string; plateNumber?: string } | null | undefined;
  
  if (nhtsaSpecs && carApiData?.specifications) {
    // Merge: prefer NHTSA for basic specs, CarAPI for missing/enhanced fields
    finalSpecs = {
      ...nhtsaSpecs, // Start with NHTSA (official, comprehensive)
      ...carApiData.specifications, // Overlay CarAPI for any missing or enhanced fields
      // Prefer NHTSA for core fields if both exist
      make: nhtsaSpecs.make || carApiData.specifications.make,
      model: nhtsaSpecs.model || carApiData.specifications.model,
      year: nhtsaSpecs.year || carApiData.specifications.year,
      manufacturer: nhtsaSpecs.manufacturer || carApiData.specifications.manufacturer,
    };
    features = carApiData.features;
    plateNumber = carApiData.plateNumber;
  } else if (nhtsaSpecs) {
    // Use NHTSA only
    finalSpecs = nhtsaSpecs;
  } else if (carApiData?.specifications) {
    // Use CarAPI only (fallback)
    finalSpecs = carApiData.specifications;
    features = carApiData.features;
    plateNumber = carApiData.plateNumber;
  } else {
    // Both failed
    return null;
  }
  
  const result: VinDecodeResponse = {
    vin: normalizedVin,
    specifications: finalSpecs,
    features,
    plateNumber,
  };
  
  // Cache the unified result
  setCache(unifiedCacheKey, result, config.cache.vin);
  return result;
}

/**
 * Stolen Vehicle Check - Verify if vehicle is reported stolen
 * Endpoint: GET /stolen-check/{vin}
 * Credits: 2 per request
 * 
 * Example: https://api.carapi.dev/v1/stolen-check/1HGBH41JXMN109186?token=YOUR_API_KEY
 */
export async function checkStolen(vin: string): Promise<StolenCheckResponse | null> {
  const normalizedVin = vin.toUpperCase().trim();
  const cacheKey = getCacheKey('stolen-check', { vin: normalizedVin });
  const cached = getCached<StolenCheckResponse>(cacheKey);
  if (cached) return cached;
  
  const url = buildUrl(`/stolen-check/${normalizedVin}`);
  const data = await fetchWithRetry<StolenCheckResponse>(url, config.api.carApi.retries, true); // Silent 404
  
  if (!data) {
    return null;
  }
  
  setCache(cacheKey, data, config.cache.vin);
  return data;
}

/**
 * Vehicle Valuation - Get price estimations
 * Endpoint: GET /vehicle-valuation/{vin}
 * Credits: 1 per request
 * 
 * Example: https://api.carapi.dev/v1/vehicle-valuation/1HGBH41JXMN109186?token=YOUR_API_KEY
 */
export async function getVehicleValuation(vin: string): Promise<VehicleValuationResponse | null> {
  const normalizedVin = vin.toUpperCase().trim();
  const cacheKey = getCacheKey('vehicle-valuation', { vin: normalizedVin });
  const cached = getCached<VehicleValuationResponse>(cacheKey);
  if (cached) return cached;
  
  const url = buildUrl(`/vehicle-valuation/${normalizedVin}`);
  const data = await fetchWithRetry<VehicleValuationResponse>(url, config.api.carApi.retries, true); // Silent 404
  
  if (!data) {
    return null;
  }
  
  setCache(cacheKey, data, config.cache.vehicle);
  return data;
}

/**
 * Vehicle Photos - Get vehicle images
 * Endpoint: GET /photos/{vin}
 * Credits: 1 per request
 * 
 * Example: https://api.carapi.dev/v1/photos/1HGBH41JXMN109186?token=YOUR_API_KEY
 */
export async function getVehiclePhotos(vin: string): Promise<VehiclePhotosResponse | null> {
  const normalizedVin = vin.toUpperCase().trim();
  const cacheKey = getCacheKey('photos', { vin: normalizedVin });
  const cached = getCached<VehiclePhotosResponse>(cacheKey);
  if (cached) return cached;
  
  const url = buildUrl(`/photos/${normalizedVin}`);
  const data = await fetchWithRetry<VehiclePhotosResponse>(url, config.api.carApi.retries, true); // Silent 404
  
  if (!data) {
    return null;
  }
  
  setCache(cacheKey, data, config.cache.vehicle);
  return data;
}

/**
 * Plate to VIN - Convert license plate to VIN
 * Endpoint: GET /plate-to-vin/{plateNumber}
 * Credits: 1 per request
 * Supported countries: PL, NO, SK, SE, CZ
 * 
 * Example: https://api.carapi.dev/v1/plate-to-vin/ABC123?country=SK&token=YOUR_API_KEY
 */
export async function plateToVin(plateNumber: string, country: string): Promise<PlateToVinResponse | null> {
  const cacheKey = getCacheKey('plate-to-vin', { plateNumber, country });
  const cached = getCached<PlateToVinResponse>(cacheKey);
  if (cached) return cached;
  
  const url = buildUrl(`/plate-to-vin/${encodeURIComponent(plateNumber)}`, { country });
  const data = await fetchWithRetry<PlateToVinResponse>(url);
  
  if (!data) {
    return null;
  }
  
  setCache(cacheKey, data, config.cache.vin);
  return data;
}

// ============================================
// Legacy/Compatibility Functions
// ============================================

// These return mock data since the new API doesn't have these endpoints
export async function getYears(): Promise<number[]> {
  return mockYears;
}

export async function getMakes(_year?: number): Promise<Array<{ id: number; name: string }>> {
  // Return common makes
  return [
    { id: 1, name: 'Toyota' },
    { id: 2, name: 'Honda' },
    { id: 3, name: 'Ford' },
    { id: 4, name: 'Chevrolet' },
    { id: 5, name: 'BMW' },
    { id: 6, name: 'Mercedes-Benz' },
    { id: 7, name: 'Audi' },
    { id: 8, name: 'Volkswagen' },
    { id: 9, name: 'Hyundai' },
    { id: 10, name: 'Kia' },
    { id: 11, name: 'Nissan' },
    { id: 12, name: 'Lexus' },
    { id: 13, name: 'Tesla' },
    { id: 14, name: 'Subaru' },
    { id: 15, name: 'Mazda' },
  ];
}

export async function getModels(_year?: number, _makeId?: number): Promise<Array<{ id: number; name: string }>> {
  // Return common models
  return [
    { id: 1, name: 'Camry' },
    { id: 2, name: 'Corolla' },
    { id: 3, name: 'Civic' },
    { id: 4, name: 'Accord' },
    { id: 5, name: 'F-150' },
    { id: 6, name: 'Mustang' },
    { id: 7, name: 'Silverado' },
    { id: 8, name: '3 Series' },
    { id: 9, name: 'C-Class' },
    { id: 10, name: 'A4' },
    { id: 11, name: 'Golf' },
    { id: 12, name: 'Elantra' },
    { id: 13, name: 'Sorento' },
    { id: 14, name: 'Altima' },
    { id: 15, name: 'RX' },
  ];
}

export async function searchVehicles(_params: {
  year?: number;
  make?: string;
  model?: string;
  page?: number;
  perPage?: number;
}): Promise<{ vehicles: Array<{ id: number; vin: string; make?: string; model?: string; year?: number }>; total: number }> {
  // Return empty since this endpoint doesn't exist in the new API
  return { vehicles: [], total: 0 };
}

export async function getVehicle(_trimId: number): Promise<null> {
  // This endpoint doesn't exist in the new API
  return null;
}

/**
 * Decode multiple VINs in batch (uses NHTSA API - free, up to 50 VINs)
 * 
 * @param vins - Array of VINs (max 50)
 * @returns Array of VinDecodeResponse
 */
export async function decodeVinsBatch(vins: string[]): Promise<VinDecodeResponse[]> {
  if (vins.length === 0) return [];
  if (vins.length > 50) {
    console.warn('[VIN Decoder] Batch limit is 50 VINs, truncating to first 50');
    vins = vins.slice(0, 50);
  }
  
  const normalizedVins = vins.map(v => v.toUpperCase().trim());
  
  // Use NHTSA batch endpoint (free, supports up to 50 VINs)
  const batchResults = await decodeVinsBatchNhtsa(normalizedVins);
  
  // Convert to VinDecodeResponse format
  return batchResults.map(result => ({
    vin: result.vin,
    specifications: result.specifications || undefined,
    features: undefined,
    plateNumber: null,
  }));
}

// Export cache utilities for testing/debugging
export const cacheUtils = {
  clear: () => cache.clear(),
  size: () => cache.size,
};

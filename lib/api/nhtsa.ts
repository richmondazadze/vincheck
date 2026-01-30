/**
 * NHTSA VPIC API Client
 * Free, public API for VIN decoding provided by U.S. National Highway Traffic Safety Administration
 * Documentation: https://vpic.nhtsa.dot.gov/api/
 */

import { config } from '@/lib/config';
import type { VinSpecifications } from './types';

// Base URL for NHTSA VPIC API
const BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

// Simple in-memory cache for server-side requests
const cache = new Map<string, { data: unknown; expiry: number }>();

function getCacheKey(endpoint: string, params?: Record<string, string | number | undefined>): string {
  const paramsString = params ? JSON.stringify(params) : '';
  return `nhtsa:${endpoint}:${paramsString}`;
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
 * Build NHTSA API URL
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
  let url = `${BASE_URL}${endpoint}`;
  
  const queryParams = new URLSearchParams();
  queryParams.set('format', 'json'); // Always use JSON format
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.set(key, String(value));
      }
    });
  }
  
  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
}

async function fetchWithTimeout(
  url: string,
  timeout = config.api.nhtsa.timeout
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
    return null;
  }
}

async function fetchWithRetry<T>(
  url: string,
  retries = config.api.nhtsa.retries,
  silent404 = false
): Promise<T | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(url);
      
      if (!response) {
        return null;
      }
      
      if (!response.ok) {
        if (response.status === 404 && silent404) {
          return null;
        }
        
        if (response.status === 404) {
          return null;
        }
        
        const errorText = await response.text().catch(() => 'Unknown error');
        if (!silent404 && i === retries - 1) {
          console.warn(`[NHTSA] HTTP error ${response.status}:`, errorText);
        }
        return null;
      }
      
      const data = await response.json() as T;
      return data;
    } catch (error) {
      if (i === retries - 1 && !silent404) {
        console.warn(`[NHTSA] Attempt ${i + 1} failed:`, error);
      }
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  return null;
}

// ============================================
// NHTSA Response Types
// ============================================

export interface NhtsaResponse<T> {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: T[];
}

export interface NhtsaVinResult {
  [key: string]: string | null | undefined;
  // Common fields (will be dynamically accessed)
  Make?: string | null;
  Model?: string | null;
  ModelYear?: string | null;
  VIN?: string;
  EngineDisplacement?: string | null;
  EngineCylinders?: string | null;
  FuelTypePrimary?: string | null;
  TransmissionStyle?: string | null;
  DriveType?: string | null;
  BodyClass?: string | null;
  Doors?: string | null;
  ManufacturerName?: string | null;
  PlantCity?: string | null;
  PlantCountry?: string | null;
  PlantState?: string | null;
  VehicleType?: string | null;
  Series?: string | null;
  Trim?: string | null;
  // And 100+ more fields...
}

// ============================================
// Response Mapper
// ============================================

/**
 * Map NHTSA flat response to VinSpecifications
 * NHTSA returns key-value pairs, we need to map them to our structure
 */
export function mapNhtsaToVinSpecifications(result: NhtsaVinResult): VinSpecifications {
  const specs: VinSpecifications = {};
  
  // Basic vehicle info
  if (result.Make) specs.make = result.Make;
  if (result.Model) specs.model = result.Model;
  if (result.ModelYear) {
    const year = parseInt(result.ModelYear, 10);
    if (!isNaN(year)) specs.year = year;
  }
  if (result.Trim) specs.trim = result.Trim;
  if (result.Series) specs.series = result.Series;
  
  // Engine specifications
  if (result.EngineDisplacement) {
    specs.displacement = result.EngineDisplacement;
  }
  if (result.EngineCylinders) {
    const cylinders = parseInt(result.EngineCylinders, 10);
    if (!isNaN(cylinders)) specs.cylinders = cylinders;
  }
  if (result.FuelTypePrimary) {
    specs.fuelType = result.FuelTypePrimary;
    specs.fuel = result.FuelTypePrimary;
  }
  if (result.TransmissionStyle) specs.transmission = result.TransmissionStyle;
  if (result.DriveType) specs.drivetrain = result.DriveType;
  
  // Body and dimensions
  if (result.BodyClass) {
    specs.bodyType = result.BodyClass;
    specs.bodyClass = result.BodyClass;
  }
  if (result.Doors) {
    const doors = parseInt(result.Doors, 10);
    if (!isNaN(doors)) specs.doors = doors;
  }
  
  // Manufacturing info
  if (result.ManufacturerName) specs.manufacturer = result.ManufacturerName;
  if (result.PlantCity) specs.plantCity = result.PlantCity;
  if (result.PlantCountry) specs.plantCountry = result.PlantCountry;
  if (result.PlantState) specs.plantState = result.PlantState;
  if (result.VehicleType) specs.vehicleType = result.VehicleType;
  
  // Additional mappings for common fields
  if (result['Engine Model']) specs.engineType = result['Engine Model'];
  if (result['Engine Configuration']) {
    if (!specs.engineType) specs.engineType = result['Engine Configuration'];
  }
  
  // Engine power (if available)
  if (result['Engine Brake (hp)']) {
    const hp = parseInt(result['Engine Brake (hp)'], 10);
    if (!isNaN(hp)) specs.horsepower = hp;
  }
  if (result['Engine Brake (hp) From']) {
    const hp = parseInt(result['Engine Brake (hp) From'], 10);
    if (!isNaN(hp) && !specs.horsepower) specs.horsepower = hp;
  }
  
  // Safety features (NHTSA has extensive safety data)
  if (result['ABS']) specs.abs = result['ABS'];
  if (result['Electronic Stability Control (ESC)']) specs.esc = result['Electronic Stability Control (ESC)'];
  if (result['Traction Control']) specs.tractionControl = result['Traction Control'];
  if (result['Tire Pressure Monitoring System (TPMS)']) specs.tpms = result['Tire Pressure Monitoring System (TPMS)'];
  if (result['Backup Camera']) specs.backupCamera = result['Backup Camera'];
  if (result['Daytime Running Light (DRL)']) specs.daytimeRunningLights = result['Daytime Running Light (DRL)'];
  
  // Airbag locations
  if (result['Front Air Bag Locations']) specs.frontAirBagLocations = result['Front Air Bag Locations'];
  if (result['Side Air Bag Locations']) specs.sideAirBagLocations = result['Side Air Bag Locations'];
  if (result['Curtain Air Bag Locations']) specs.curtainAirBagLocations = result['Curtain Air Bag Locations'];
  if (result['Knee Air Bag Locations']) specs.kneeAirBagLocations = result['Knee Air Bag Locations'];
  
  // Dimensions (if available)
  if (result['Wheel Base (inches)']) {
    const wheelbase = result['Wheel Base (inches)'];
    specs.wheelbase = wheelbase.includes('"') ? wheelbase : `${wheelbase}"`;
  }
  if (result['Gross Vehicle Weight Rating From']) specs.grossWeight = result['Gross Vehicle Weight Rating From'];
  if (result['Curb Weight (lbs)']) {
    const weight = result['Curb Weight (lbs)'];
    specs.curbWeight = weight.includes('lbs') ? weight : `${weight} lbs`;
  }
  
  // Additional useful fields
  if (result['GVWR']) specs.grossWeight = result['GVWR'];
  if (result['Destination Market']) specs.destinationMarket = result['Destination Market'];
  
  // Vehicle description
  if (result['Vehicle Descriptor']) specs.description = result['Vehicle Descriptor'];
  
  // Additional dimensions
  if (result['Length (inches)']) {
    const length = result['Length (inches)'];
    specs.length = length.includes('"') ? length : `${length}"`;
  }
  if (result['Width (inches)']) {
    const width = result['Width (inches)'];
    specs.width = width.includes('"') ? width : `${width}"`;
  }
  if (result['Height (inches)']) {
    const height = result['Height (inches)'];
    specs.height = height.includes('"') ? height : `${height}"`;
  }
  
  return specs;
}

// ============================================
// API Client Functions
// ============================================

/**
 * Decode VIN using NHTSA API
 * Endpoint: GET /vehicles/DecodeVinValues/{vin}?format=json
 * 
 * @param vin - 17-character VIN
 * @returns Mapped VinSpecifications or null
 */
export async function decodeVinNhtsa(vin: string): Promise<VinSpecifications | null> {
  const normalizedVin = vin.toUpperCase().trim();
  const cacheKey = getCacheKey('DecodeVinValues', { vin: normalizedVin });
  const cached = getCached<VinSpecifications>(cacheKey);
  if (cached) return cached;
  
  const url = buildUrl(`/vehicles/DecodeVinValues/${normalizedVin}`);
  
  const response = await fetchWithRetry<NhtsaResponse<NhtsaVinResult>>(url, config.api.nhtsa.retries, true);
  
  if (!response || !response.Results || response.Results.length === 0) {
    return null;
  }
  
  const result = response.Results[0];
  if (!result || result.ErrorCode) {
    return null;
  }
  
  const specs = mapNhtsaToVinSpecifications(result);
  
  setCache(cacheKey, specs, config.cache.nhtsa);
  return specs;
}

/**
 * Decode multiple VINs in batch (up to 50)
 * Endpoint: GET /vehicles/DecodeVINValuesBatch/?data={vins}&format=json
 * 
 * @param vins - Array of VINs (max 50)
 * @returns Array of mapped VinSpecifications
 */
export async function decodeVinsBatchNhtsa(vins: string[]): Promise<Array<{ vin: string; specifications: VinSpecifications | null }>> {
  if (vins.length === 0) return [];
  if (vins.length > 50) {
    console.warn('[NHTSA] Batch limit is 50 VINs, truncating to first 50');
    vins = vins.slice(0, 50);
  }
  
  const normalizedVins = vins.map(v => v.toUpperCase().trim());
  const cacheKey = getCacheKey('DecodeVINValuesBatch', { vins: normalizedVins.join(',') });
  const cached = getCached<Array<{ vin: string; specifications: VinSpecifications | null }>>(cacheKey);
  if (cached) return cached;
  
  // NHTSA batch format: comma-separated VINs
  const dataParam = normalizedVins.join(',');
  const url = buildUrl('/vehicles/DecodeVINValuesBatch/', { data: dataParam });
  
  const response = await fetchWithRetry<NhtsaResponse<NhtsaVinResult>>(url, config.api.nhtsa.retries, true);
  
  if (!response || !response.Results) {
    return normalizedVins.map(vin => ({ vin, specifications: null }));
  }
  
  // Map results back to VINs
  const results: Array<{ vin: string; specifications: VinSpecifications | null }> = [];
  
  for (const vin of normalizedVins) {
    const result = response.Results.find(r => r.VIN === vin);
    if (result && !result.ErrorCode) {
      results.push({
        vin,
        specifications: mapNhtsaToVinSpecifications(result),
      });
    } else {
      results.push({ vin, specifications: null });
    }
  }
  
  setCache(cacheKey, results, config.cache.nhtsa);
  return results;
}

// Export cache utilities for testing/debugging
export const nhtsaCacheUtils = {
  clear: () => cache.clear(),
  size: () => cache.size,
};

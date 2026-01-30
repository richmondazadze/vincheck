/**
 * Formatting Utilities
 */

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format engine displacement (convert to liters with 1 decimal)
 */
export function formatDisplacement(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  // Value is typically in liters, format to 1 decimal place
  return `${value.toFixed(1)}L`;
}

/**
 * Format horsepower
 */
export function formatHorsepower(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  return `${formatNumber(value)} hp`;
}

/**
 * Format torque
 */
export function formatTorque(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  return `${formatNumber(value)} lb-ft`;
}

/**
 * Format MPG
 */
export function formatMpg(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  return `${value} MPG`;
}

/**
 * Format dimensions (add inches suffix)
 */
export function formatInches(value: string | null | undefined): string {
  if (!value || value === 'null' || value === 'undefined') return 'N/A';
  
  // If value already has units, return as-is
  if (value.includes('"') || value.includes('in') || value.includes('ft')) {
    return value;
  }
  
  return `${value}"`;
}

/**
 * Format weight (add lbs suffix)
 */
export function formatWeight(value: string | null | undefined): string {
  if (!value || value === 'null' || value === 'undefined') return 'N/A';
  
  // If value already has units, return as-is
  if (value.includes('lb') || value.includes('kg')) {
    return value;
  }
  
  return `${value} lbs`;
}

/**
 * Format capacity (add cu ft suffix)
 */
export function formatCapacity(value: string | null | undefined): string {
  if (!value || value === 'null' || value === 'undefined') return 'N/A';
  
  // If value already has units, return as-is
  if (value.includes('cu') || value.includes('gal') || value.includes('L')) {
    return value;
  }
  
  return `${value} cu ft`;
}

/**
 * Format VIN (uppercase, remove invalid characters)
 */
export function formatVin(vin: string): string {
  return vin
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, '') // Remove I, O, Q and non-alphanumeric
    .slice(0, 17);
}

/**
 * Validate VIN format
 */
export function isValidVin(vin: string): boolean {
  if (!vin || vin.length !== 17) return false;
  
  // VIN should only contain alphanumeric characters (excluding I, O, Q)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin.toUpperCase());
}

/**
 * Format vehicle title
 */
export function formatVehicleTitle(
  year?: number | null,
  make?: string | null,
  model?: string | null,
  trim?: string | null
): string {
  const parts = [year, make, model, trim].filter(Boolean);
  return parts.join(' ') || 'Unknown Vehicle';
}

/**
 * Format vehicle name from API response
 */
export function formatVehicleName(vehicle: {
  year?: number;
  make_model?: { make?: { name?: string }; name?: string } | null;
  name?: string;
}): string {
  const year = vehicle.year;
  const make = vehicle.make_model?.make?.name;
  const model = vehicle.make_model?.name;
  const trim = vehicle.name;
  
  return formatVehicleTitle(year, make, model, trim);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Convert string to slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Format percentage
 */
export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined) return 'N/A';
  
  return `${value.toFixed(decimals)}%`;
}

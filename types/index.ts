/**
 * Global TypeScript Types for Vehicle Database
 */

// ============================================
// CarAPI.dev Response Types
// ============================================

export interface Make {
  id: number;
  name: string;
}

export interface Model {
  id: number;
  name: string;
  make_id: number;
}

export interface Trim {
  id: number;
  name: string;
  description?: string;
  msrp?: number;
  invoice?: number;
  created?: string;
  modified?: string;
  make_model?: Model;
  year?: number;
}

export interface Engine {
  id?: number;
  engine_type?: string;
  fuel_type?: string;
  cylinders?: number;
  displacement?: number;
  horsepower?: number;
  torque?: number;
  valve_timing?: string;
  cam_type?: string;
  drive_type?: string;
  transmission?: string;
}

export interface Mileage {
  id?: number;
  fuel_tank_capacity?: string;
  combined_mpg?: number;
  epa_city_mpg?: number;
  epa_highway_mpg?: number;
  range_city?: string;
  range_highway?: string;
  battery_capacity_electric?: string;
  epa_kwh_100_mi_electric?: string;
  epa_time_to_charge_hr_240v_electric?: string;
}

export interface Body {
  id?: number;
  type?: string;
  doors?: number;
  length?: string;
  width?: string;
  height?: string;
  wheel_base?: string;
  front_track?: string;
  rear_track?: string;
  ground_clearance?: string;
  cargo_capacity?: string;
  max_cargo_capacity?: string;
  curb_weight?: string;
  gross_weight?: string;
  max_payload?: string;
  max_towing_capacity?: string;
  epa_interior_volume?: string;
  passenger_volume?: string;
}

export interface InteriorColor {
  id: number;
  name: string;
}

export interface ExteriorColor {
  id: number;
  name: string;
}

export interface Vehicle {
  id: number;
  name: string;
  description?: string;
  msrp?: number;
  invoice?: number;
  created?: string;
  modified?: string;
  make_model?: Model;
  year?: number;
  engine?: Engine;
  mileage?: Mileage;
  body?: Body;
  interior_colors?: InteriorColor[];
  exterior_colors?: ExteriorColor[];
}

export interface VinDecodeResponse {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  vehicle?: Vehicle;
}

export interface BodyType {
  id: number;
  name: string;
}

export interface FuelType {
  id: number;
  name: string;
}

// ============================================
// Application Types
// ============================================

export interface VehicleFilter {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
}

export interface VehicleSearchParams {
  year?: string;
  make?: string;
  model?: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  page?: string;
}

export interface ComparisonVehicle {
  id: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  vehicle?: Vehicle;
}

// ============================================
// SEO Types
// ============================================

export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
}

export interface JsonLdData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ============================================
// Component Prop Types
// ============================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

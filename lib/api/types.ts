/**
 * CarAPI.dev Type Definitions
 * Based on CarAPI.dev API documentation: https://docs.carapi.dev/
 */

// ============================================
// VIN Decode Response Types
// ============================================

export interface VinDecodeResponse {
  vin: string;
  specifications?: VinSpecifications;
  features?: string[];
  plateNumber?: PlateNumberInfo | null;
}

export interface VinSpecifications {
  make?: string;
  model?: string;
  fuel?: string;
  transmission?: string;
  enginePower?: string;
  registrationDate?: string;
  year?: number;
  bodyType?: string;
  doors?: number;
  engineType?: string;
  displacement?: string;
  cylinders?: number;
  horsepower?: number;
  torque?: number;
  drivetrain?: string;
  fuelType?: string;
  fuelTankCapacity?: string;
  combinedMpg?: number;
  cityMpg?: number;
  highwayMpg?: number;
  length?: string;
  width?: string;
  height?: string;
  wheelbase?: string;
  curbWeight?: string;
  grossWeight?: string;
  towingCapacity?: string;
  payloadCapacity?: string;
  msrp?: number;
  invoice?: number;
  trim?: string;
  description?: string;
  manufacturer?: string;
  plantCity?: string;
  plantCountry?: string;
  plantState?: string;
  vehicleType?: string;
  bodyClass?: string;
  series?: string;
  destinationMarket?: string;
  frontAirBagLocations?: string;
  sideAirBagLocations?: string;
  curtainAirBagLocations?: string;
  kneeAirBagLocations?: string;
  abs?: string;
  esc?: string;
  tractionControl?: string;
  tpms?: string;
  backupCamera?: string;
  daytimeRunningLights?: string;
}

export interface PlateNumberInfo {
  country?: string;
  plateNumber?: string;
}

// ============================================
// Stolen Check Response Types
// ============================================

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
  details?: StolenVehicleDetails;
}

export interface StolenVehicleDetails {
  reportDate?: string;
  reportingCountry?: string;
  policeDepartment?: string;
  caseNumber?: string;
}

// ============================================
// Vehicle Valuation Response Types
// ============================================

export interface VehicleValuationResponse {
  originalPrice: number;
  currency: string;
  priceEstimation: PriceEstimationYear[];
  depreciationRate?: number;
  marketValue?: {
    low: number;
    average: number;
    high: number;
  };
}

export interface PriceEstimationYear {
  year: number;
  price: number;
  mileage?: number;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
}

// ============================================
// Vehicle Photos Response Types
// ============================================

export interface VehiclePhotosResponse {
  vin: string;
  photos: string[]; // Array of image URLs according to API docs
}

// Legacy type for backwards compatibility (if API returns structured data)
export interface VehiclePhoto {
  url: string;
  type?: 'exterior' | 'interior' | 'engine' | 'detail';
  angle?: string;
  resolution?: string;
  size?: {
    width: number;
    height: number;
  };
}

// ============================================
// Plate to VIN Response Types
// ============================================

export interface PlateToVinResponse {
  plateNumber: string;
  country: string;
  vin: string | null;
  vehicleInfo?: {
    make?: string;
    model?: string;
    year?: number;
  };
}

// ============================================
// Legacy Types (for compatibility with existing components)
// ============================================

export interface CarApiMake {
  id: number;
  name: string;
}

export interface CarApiModel {
  id: number;
  name: string;
  make_id: number;
}

export interface CarApiTrim {
  id: number;
  name: string;
  description: string | null;
  msrp: number | null;
  invoice: number | null;
  created: string;
  modified: string;
  make_model_id: number;
  year: number;
  make_model?: CarApiModel & { make: CarApiMake };
}

export interface CarApiEngine {
  id: number;
  engine_type: string | null;
  fuel_type: string | null;
  cylinders: number | null;
  displacement: number | null;
  horsepower: number | null;
  torque: number | null;
  valve_timing: string | null;
  cam_type: string | null;
  drive_type: string | null;
  transmission: string | null;
}

export interface CarApiMileage {
  id: number;
  fuel_tank_capacity: string | null;
  combined_mpg: number | null;
  epa_city_mpg: number | null;
  epa_highway_mpg: number | null;
  range_city: string | null;
  range_highway: string | null;
  battery_capacity_electric: string | null;
  epa_kwh_100_mi_electric: string | null;
  epa_time_to_charge_hr_240v_electric: string | null;
}

export interface CarApiBody {
  id: number;
  type: string | null;
  doors: number | null;
  length: string | null;
  width: string | null;
  height: string | null;
  wheel_base: string | null;
  front_track: string | null;
  rear_track: string | null;
  ground_clearance: string | null;
  cargo_capacity: string | null;
  max_cargo_capacity: string | null;
  curb_weight: string | null;
  gross_weight: string | null;
  max_payload: string | null;
  max_towing_capacity: string | null;
  epa_interior_volume: string | null;
  passenger_volume: string | null;
}

export interface CarApiInteriorColor {
  id: number;
  name: string;
}

export interface CarApiExteriorColor {
  id: number;
  name: string;
}

export interface CarApiVehicle {
  id: number;
  name: string;
  description: string | null;
  msrp: number | null;
  invoice: number | null;
  created: string;
  modified: string;
  year: number;
  make_model_id: number;
  make_model?: CarApiModel & { make: CarApiMake };
  engine?: CarApiEngine;
  mileage?: CarApiMileage;
  body?: CarApiBody;
  interior_colors?: CarApiInteriorColor[];
  exterior_colors?: CarApiExteriorColor[];
}

export interface CarApiVinDecode {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  manufacturer?: string;
  plantCity?: string;
  plantCountry?: string;
  plantState?: string;
  vehicleType?: string;
  bodyClass?: string;
  series?: string;
  destinationMarket?: string;
  engine?: {
    type?: string;
    displacement?: string;
    cylinders?: number;
    horsepower?: number;
    torque?: number;
    fuelType?: string;
  };
  transmission?: string;
  drivetrain?: string;
  fuelEconomy?: {
    combined?: number;
    city?: number;
    highway?: number;
  };
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    wheelbase?: string;
    curbWeight?: string;
  };
  safety?: {
    abs?: string;
    esc?: string;
    tractionControl?: string;
    tpms?: string;
    backupCamera?: string;
    daytimeRunningLights?: string;
    frontAirBagLocations?: string;
    sideAirBagLocations?: string;
    curtainAirBagLocations?: string;
    kneeAirBagLocations?: string;
  };
  msrp?: number;
  invoice?: number;
  bodyType?: string;
  doors?: number;
}

export interface CarApiVinSpecs {
  manufacturer_name?: string;
  plant_city?: string;
  plant_country?: string;
  plant_state?: string;
  vehicle_type?: string;
  body_class?: string;
  series?: string;
  destination_market?: string;
  front_air_bag_locations?: string;
  side_air_bag_locations?: string;
  curtain_air_bag_locations?: string;
  knee_air_bag_locations?: string;
  anti_lock_braking_system_abs?: string;
  electronic_stability_control_esc?: string;
  traction_control?: string;
  tire_pressure_monitoring_system_tpms_type?: string;
  backup_camera?: string;
  daytime_running_light_drl?: string;
}

export interface CarApiBodyType {
  id: number;
  name: string;
}

export interface CarApiFuelType {
  id: number;
  name: string;
}

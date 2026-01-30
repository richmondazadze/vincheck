/**
 * Application Constants
 */

// Vehicle specification categories for display
export interface SpecItem {
  key: string;
  label: string;
  format?: string;
}

export interface SpecCategory {
  title: string;
  specs: SpecItem[];
}

export const SPEC_CATEGORIES: Record<string, SpecCategory> = {
  overview: {
    title: 'Overview',
    specs: [
      { key: 'body.type', label: 'Body Type' },
      { key: 'body.doors', label: 'Doors' },
      { key: 'year', label: 'Year' },
      { key: 'make_model.make.name', label: 'Make' },
      { key: 'make_model.name', label: 'Model' },
      { key: 'name', label: 'Trim' },
    ],
  },
  engine: {
    title: 'Engine & Performance',
    specs: [
      { key: 'engine.engine_type', label: 'Engine Type' },
      { key: 'engine.displacement', label: 'Displacement', format: 'displacement' },
      { key: 'engine.horsepower', label: 'Horsepower', format: 'horsepower' },
      { key: 'engine.torque', label: 'Torque', format: 'torque' },
      { key: 'engine.cylinders', label: 'Cylinders' },
      { key: 'engine.fuel_type', label: 'Fuel Type' },
      { key: 'engine.cam_type', label: 'Cam Type' },
      { key: 'engine.valve_timing', label: 'Valve Timing' },
    ],
  },
  dimensions: {
    title: 'Dimensions',
    specs: [
      { key: 'body.length', label: 'Length', format: 'inches' },
      { key: 'body.width', label: 'Width', format: 'inches' },
      { key: 'body.height', label: 'Height', format: 'inches' },
      { key: 'body.wheel_base', label: 'Wheelbase', format: 'inches' },
      { key: 'body.front_track', label: 'Front Track', format: 'inches' },
      { key: 'body.rear_track', label: 'Rear Track', format: 'inches' },
      { key: 'body.ground_clearance', label: 'Ground Clearance', format: 'inches' },
      { key: 'body.curb_weight', label: 'Curb Weight', format: 'weight' },
      { key: 'body.gross_weight', label: 'Gross Weight', format: 'weight' },
      { key: 'body.cargo_capacity', label: 'Cargo Capacity', format: 'capacity' },
      { key: 'body.max_cargo_capacity', label: 'Max Cargo Capacity', format: 'capacity' },
      { key: 'body.passenger_volume', label: 'Passenger Volume', format: 'capacity' },
    ],
  },
  fuel: {
    title: 'Fuel Economy',
    specs: [
      { key: 'mileage.epa_city_mpg', label: 'City MPG', format: 'mpg' },
      { key: 'mileage.epa_highway_mpg', label: 'Highway MPG', format: 'mpg' },
      { key: 'mileage.combined_mpg', label: 'Combined MPG', format: 'mpg' },
      { key: 'mileage.fuel_tank_capacity', label: 'Fuel Tank Capacity' },
      { key: 'mileage.range_city', label: 'Range (City)' },
      { key: 'mileage.range_highway', label: 'Range (Highway)' },
    ],
  },
  drivetrain: {
    title: 'Drivetrain',
    specs: [
      { key: 'engine.drive_type', label: 'Drive Type' },
      { key: 'engine.transmission', label: 'Transmission' },
      { key: 'body.max_towing_capacity', label: 'Max Towing Capacity', format: 'weight' },
      { key: 'body.max_payload', label: 'Max Payload', format: 'weight' },
    ],
  },
  pricing: {
    title: 'Pricing',
    specs: [
      { key: 'msrp', label: 'MSRP', format: 'currency' },
      { key: 'invoice', label: 'Invoice', format: 'currency' },
    ],
  },
};

// Navigation links
export const NAV_LINKS = [
  { href: '/vin', label: 'VIN Decoder' },
  { href: '/vin/batch', label: 'Batch Decoder' },
  { href: '/vin/guide', label: 'VIN Guide' },
  { href: '/cars', label: 'Browse' },
  { href: '/about', label: 'About' },
] as const;

// Popular vehicle searches (for homepage SEO)
export const POPULAR_SEARCHES = [
  { year: 2024, make: 'Toyota', model: 'Camry' },
  { year: 2024, make: 'Ford', model: 'F-150' },
  { year: 2024, make: 'Honda', model: 'Civic' },
  { year: 2024, make: 'Tesla', model: 'Model 3' },
  { year: 2023, make: 'Chevrolet', model: 'Silverado' },
  { year: 2023, make: 'BMW', model: '3 Series' },
  { year: 2023, make: 'Mercedes-Benz', model: 'C-Class' },
  { year: 2024, make: 'Lexus', model: 'RX' },
] as const;

// API endpoints documentation (for about page)
export const API_ENDPOINTS = [
  {
    name: 'Years',
    endpoint: '/years',
    description: 'Get all available model years',
  },
  {
    name: 'Makes',
    endpoint: '/makes?year={year}',
    description: 'Get vehicle makes for a specific year',
  },
  {
    name: 'Models',
    endpoint: '/models?year={year}&make_id={make_id}',
    description: 'Get models for a specific year and make',
  },
  {
    name: 'Trims',
    endpoint: '/trims?year={year}&model_id={model_id}',
    description: 'Get trim levels for a specific year and model',
  },
  {
    name: 'Vehicle Details',
    endpoint: '/trims/{trim_id}',
    description: 'Get detailed specifications for a specific trim',
  },
  {
    name: 'VIN Decode',
    endpoint: '/vin/{vin}',
    description: 'Decode a Vehicle Identification Number',
  },
  {
    name: 'Body Types',
    endpoint: '/body-types',
    description: 'Get all available body types',
  },
  {
    name: 'Fuel Types',
    endpoint: '/fuel-types',
    description: 'Get all available fuel types',
  },
] as const;

// Data points available (for about page)
export const DATA_POINTS = [
  'Year, Make, Model, Trim',
  'Engine specifications (type, displacement, cylinders)',
  'Performance metrics (horsepower, torque)',
  'Fuel economy (city/highway/combined MPG)',
  'Dimensions (length, width, height, wheelbase)',
  'Weight (curb weight, gross weight)',
  'Capacity (cargo, passenger volume)',
  'Drivetrain (FWD, RWD, AWD, 4WD)',
  'Transmission type',
  'MSRP and invoice pricing',
  'Available interior and exterior colors',
  'Towing and payload capacity',
] as const;

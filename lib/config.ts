/**
 * Application Configuration
 */

export const config = {
  // Site metadata
  site: {
    name: 'Vehicle Database',
    description: 'Free vehicle specifications database. Search by year, make, model, or VIN. No login required.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vehicledatabase.com',
    locale: 'en_US',
  },
  
  // API Configuration
  api: {
    carApi: {
      baseUrl: 'https://carapi.dev/api',
      timeout: 10000, // 10 seconds
      retries: 3,
    },
    nhtsa: {
      baseUrl: 'https://vpic.nhtsa.dot.gov/api',
      timeout: 10000, // 10 seconds
      retries: 2,
    },
  },
  
  // Cache durations (in seconds)
  cache: {
    years: 7 * 24 * 60 * 60, // 7 days
    makes: 24 * 60 * 60, // 1 day
    models: 24 * 60 * 60, // 1 day
    trims: 24 * 60 * 60, // 1 day
    vehicle: 7 * 24 * 60 * 60, // 7 days
    vin: 30 * 24 * 60 * 60, // 30 days (NHTSA data is official, cache longer)
    nhtsa: 60 * 24 * 60 * 60, // 60 days (NHTSA data changes infrequently)
    bodyTypes: 7 * 24 * 60 * 60, // 7 days
    fuelTypes: 7 * 24 * 60 * 60, // 7 days
  },
  
  // ISR revalidation periods (in seconds)
  revalidate: {
    vehicleDetail: 24 * 60 * 60, // 24 hours
    browsePage: 12 * 60 * 60, // 12 hours
    popular: 60 * 60, // 1 hour
  },
  
  // Pagination
  pagination: {
    defaultPerPage: 25,
    maxPerPage: 100,
  },
  
  // Comparison
  comparison: {
    maxVehicles: 3,
  },
} as const;

export default config;

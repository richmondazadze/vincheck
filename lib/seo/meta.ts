/**
 * Meta Tag Generators
 * SEO metadata utilities
 */

import { config } from '@/lib/config';
import type { MetaTags } from '@/types';

/**
 * Generate meta tags for the homepage
 */
export function getHomepageMeta(): MetaTags {
  return {
    title: `${config.site.name} | Free VIN Decoder & Car Specs`,
    description: config.site.description,
    canonical: config.site.url,
    ogTitle: `${config.site.name} | Free Vehicle Specifications`,
    ogDescription: config.site.description,
    ogType: 'website',
  };
}

/**
 * Generate meta tags for browse pages
 */
export function getBrowseMeta(params: {
  year?: number;
  make?: string;
  model?: string;
}): MetaTags {
  const { year, make, model } = params;
  
  if (year && make && model) {
    return {
      title: `${year} ${make} ${model} Specs, Dimensions, MPG | ${config.site.name}`,
      description: `Complete specifications for the ${year} ${make} ${model}. View engine specs, dimensions, fuel economy, MSRP, trim levels, and more.`,
      canonical: `${config.site.url}/cars/${year}/${make.toLowerCase()}/${model.toLowerCase()}`,
      ogTitle: `${year} ${make} ${model} Specifications`,
      ogDescription: `Detailed specs for the ${year} ${make} ${model}. Engine, dimensions, fuel economy, and pricing information.`,
      ogType: 'website',
    };
  }
  
  if (year && make) {
    return {
      title: `${year} ${make} Models & Specs | ${config.site.name}`,
      description: `Browse all ${year} ${make} models. View specifications, compare trims, and find detailed vehicle information.`,
      canonical: `${config.site.url}/cars/${year}/${make.toLowerCase()}`,
      ogTitle: `${year} ${make} Vehicle Lineup`,
      ogDescription: `Explore ${year} ${make} models with full specifications and pricing.`,
      ogType: 'website',
    };
  }
  
  if (year) {
    return {
      title: `${year} Vehicles | Browse by Year | ${config.site.name}`,
      description: `Browse all ${year} vehicles by make and model. Compare specifications, prices, and features.`,
      canonical: `${config.site.url}/cars/${year}`,
      ogTitle: `${year} Vehicle Database`,
      ogDescription: `Complete database of ${year} vehicles with specifications and pricing.`,
      ogType: 'website',
    };
  }
  
  return {
    title: `Browse Vehicles by Year, Make, Model | ${config.site.name}`,
    description: 'Search and filter vehicles by year, make, model, body type, and fuel type. Free access to comprehensive vehicle specifications.',
    canonical: `${config.site.url}/cars`,
    ogTitle: 'Browse Vehicle Database',
    ogDescription: 'Filter and search vehicles by year, make, model, and specifications.',
    ogType: 'website',
  };
}

/**
 * Generate meta tags for vehicle detail pages
 */
export function getVehicleDetailMeta(vehicle: {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  engine?: { horsepower?: number; displacement?: number } | null;
  mileage?: { combined_mpg?: number } | null;
}): MetaTags {
  const { year, make, model, trim, engine, mileage } = vehicle;
  
  const vehicleName = [year, make, model, trim].filter(Boolean).join(' ');
  const engineDesc = engine?.horsepower 
    ? `${engine.horsepower} HP` 
    : engine?.displacement 
      ? `${engine.displacement}L` 
      : '';
  const mpgDesc = mileage?.combined_mpg ? `${mileage.combined_mpg} MPG combined` : '';
  
  const descriptionParts = [engineDesc, mpgDesc].filter(Boolean);
  const descriptionSuffix = descriptionParts.length > 0 
    ? ` ${descriptionParts.join(', ')}.` 
    : '';
  
  return {
    title: `${vehicleName} Specs & Dimensions | ${config.site.name}`,
    description: `Detailed specifications for the ${vehicleName}.${descriptionSuffix} View complete specs including engine, dimensions, fuel economy, and pricing.`,
    canonical: `${config.site.url}/vehicle/${vehicle.year}-${vehicle.make?.toLowerCase()}-${vehicle.model?.toLowerCase()}`,
    ogTitle: `${vehicleName} Specifications`,
    ogDescription: `Complete specs for the ${vehicleName}.${descriptionSuffix}`,
    ogType: 'article',
  };
}

/**
 * Generate meta tags for VIN decoder page
 */
export function getVinDecoderMeta(vin?: string): MetaTags {
  if (vin) {
    return {
      title: `VIN ${vin} | Free VIN Decoder | ${config.site.name}`,
      description: `Decode VIN ${vin}. View complete vehicle information including specifications, manufacturing details, safety features, market value, stolen check, and photos.`,
      canonical: `${config.site.url}/vin?vin=${vin}`,
      robots: 'noindex, follow', // Don't index individual VIN results
      ogTitle: `VIN Decoder: ${vin}`,
      ogDescription: `Complete vehicle information for VIN ${vin}. Specifications, manufacturing details, market value, and more.`,
      ogType: 'website',
    };
  }
  
  return {
    title: `Free VIN Decoder | Decode Any Vehicle VIN Number | ${config.site.name}`,
    description: 'Free VIN decoder tool. Decode any 17-character VIN to get complete vehicle information including specifications, manufacturing details, safety features, market value, stolen check, and photos. No signup required.',
    canonical: `${config.site.url}/vin`,
    ogTitle: 'Free VIN Decoder - Decode Any Vehicle VIN',
    ogDescription: 'Decode VIN numbers for free. Get complete vehicle information including specs, manufacturing details, market value, and more.',
    ogType: 'website',
  };
}

/**
 * Generate meta tags for comparison page
 */
export function getCompareMeta(vehicleCount: number = 0): MetaTags {
  return {
    title: `Compare Vehicles | Side-by-Side Car Comparison | ${config.site.name}`,
    description: `Compare up to 3 vehicles side-by-side. View differences in specs, dimensions, fuel economy, and pricing.`,
    canonical: `${config.site.url}/compare`,
    robots: 'noindex, follow', // Don't index comparison pages
    ogTitle: 'Compare Vehicles Side-by-Side',
    ogDescription: `Compare ${vehicleCount > 0 ? `${vehicleCount} vehicles` : 'vehicles'} side-by-side. Specifications, pricing, and features comparison.`,
    ogType: 'website',
  };
}

/**
 * Generate meta tags for about page
 */
export function getAboutMeta(): MetaTags {
  return {
    title: `About Our Vehicle Database | Data Sources & Coverage | ${config.site.name}`,
    description: `Learn about our free vehicle database. We provide comprehensive car specifications from CarAPI.dev. No accounts, no tracking, completely free.`,
    canonical: `${config.site.url}/about`,
    ogTitle: 'About Our Vehicle Database',
    ogDescription: 'Learn about our free vehicle data source and available specifications.',
    ogType: 'website',
  };
}

/**
 * Generate meta tags for error pages
 */
export function getErrorMeta(statusCode: number): MetaTags {
  const titles: Record<number, string> = {
    404: 'Page Not Found',
    500: 'Server Error',
  };
  
  return {
    title: `${titles[statusCode] || 'Error'} | ${config.site.name}`,
    description: `The page you are looking for could not be found. Browse our vehicle database or use the search to find what you need.`,
    canonical: config.site.url,
    robots: 'noindex, follow',
  };
}

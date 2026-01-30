/**
 * JSON-LD Structured Data Generators
 * Schema.org structured data for SEO
 */

import { config } from '@/lib/config';
import type { JsonLdData } from '@/types';

/**
 * Generate WebSite structured data
 */
export function generateWebSiteSchema(): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.site.name,
    url: config.site.url,
    description: config.site.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.site.url}/cars?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate WebPage structured data
 */
export function generateWebPageSchema(params: {
  title: string;
  description: string;
  path?: string;
  datePublished?: string;
  dateModified?: string;
}): JsonLdData {
  const { title, description, path = '', datePublished, dateModified } = params;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${config.site.url}${path}`,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    isPartOf: {
      '@type': 'WebSite',
      name: config.site.name,
      url: config.site.url,
    },
  };
}

/**
 * Generate Vehicle structured data
 */
export function generateVehicleSchema(vehicle: {
  id: number;
  year?: number | null;
  make?: string | null;
  model?: string | null;
  trim?: string | null;
  description?: string | null;
  msrp?: number | null;
  engine?: {
    engine_type?: string | null;
    displacement?: number | null;
    horsepower?: number | null;
    torque?: number | null;
    cylinders?: number | null;
    fuel_type?: string | null;
  } | null;
  mileage?: {
    combined_mpg?: number | null;
    epa_city_mpg?: number | null;
    epa_highway_mpg?: number | null;
  } | null;
  body?: {
    type?: string | null;
    doors?: number | null;
  } | null;
}): JsonLdData {
  const vehicleName = [vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
    .filter(Boolean)
    .join(' ');
  
  const schema: JsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: vehicleName,
    vehicleModelDate: vehicle.year,
    manufacturer: vehicle.make
      ? {
          '@type': 'Organization',
          name: vehicle.make,
        }
      : undefined,
    model: vehicle.model,
    description: vehicle.description,
    url: `${config.site.url}/vehicle/${vehicle.id}`,
  };

  // Add body type
  if (vehicle.body?.type) {
    schema.bodyType = vehicle.body.type;
  }

  // Add number of doors
  if (vehicle.body?.doors) {
    schema.numberOfDoors = vehicle.body.doors;
  }

  // Add engine specification
  if (vehicle.engine) {
    schema.vehicleEngine = {
      '@type': 'EngineSpecification',
      ...(vehicle.engine.engine_type && { engineType: vehicle.engine.engine_type }),
      ...(vehicle.engine.fuel_type && { fuelType: vehicle.engine.fuel_type }),
      ...(vehicle.engine.cylinders && { cylinders: vehicle.engine.cylinders }),
    };

    // Add displacement
    if (vehicle.engine.displacement) {
      (schema.vehicleEngine as Record<string, unknown>).displacement = {
        '@type': 'QuantitativeValue',
        value: vehicle.engine.displacement,
        unitCode: 'LTR',
      };
    }

    // Add horsepower
    if (vehicle.engine.horsepower) {
      (schema.vehicleEngine as Record<string, unknown>).enginePower = {
        '@type': 'QuantitativeValue',
        value: vehicle.engine.horsepower,
        unitCode: 'BHP',
      };
    }

    // Add torque
    if (vehicle.engine.torque) {
      (schema.vehicleEngine as Record<string, unknown>).torque = {
        '@type': 'QuantitativeValue',
        value: vehicle.engine.torque,
        unitCode: 'F17', // Pound-force foot
      };
    }
  }

  // Add fuel consumption
  if (vehicle.mileage?.combined_mpg) {
    schema.fuelConsumption = {
      '@type': 'QuantitativeValue',
      value: vehicle.mileage.combined_mpg,
      unitText: 'mpg',
    };
  }

  // Add offers/pricing
  if (vehicle.msrp) {
    schema.offers = {
      '@type': 'Offer',
      price: vehicle.msrp,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    };
  }

  return schema;
}

/**
 * Generate ItemList structured data for browse pages
 */
export function generateItemListSchema(items: Array<{
  id: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
}>): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => {
      const vehicleName = [item.year, item.make, item.model, item.trim]
        .filter(Boolean)
        .join(' ');
      
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Vehicle',
          name: vehicleName,
          url: `${config.site.url}/vehicle/${item.id}`,
          vehicleModelDate: item.year,
          manufacturer: item.make,
          model: item.model,
        },
      };
    }),
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{
  name: string;
  path?: string;
}>): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path && { item: `${config.site.url}${item.path}` }),
    })),
  };
}

/**
 * Generate FAQPage structured data
 */
export function generateFaqSchema(faqs: Array<{
  question: string;
  answer: string;
}>): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Serialize structured data for insertion into HTML
 */
export function serializeSchema(schema: JsonLdData): string {
  return JSON.stringify(schema);
}

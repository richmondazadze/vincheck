import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { JsonLd } from "@/components/seo";
import { decodeVin } from "@/lib/api/carapi";
import { generateVehicleSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getVehicleDetailMeta } from "@/lib/seo/meta";
import { formatCurrency } from "@/lib/utils/format";
import type { VinSpecifications } from "@/lib/api/types";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  // For VIN-based lookup, we use the ID as the VIN
  const vehicle = await decodeVin(id);

  if (!vehicle || !vehicle.specifications) {
    return {
      title: "Vehicle Not Found | Vehicle Database",
    };
  }

  const specs = vehicle.specifications;
  const meta = getVehicleDetailMeta({
    year: specs.year,
    make: specs.make,
    model: specs.model,
    trim: specs.trim,
    engine: specs.horsepower ? {
      horsepower: specs.horsepower,
      displacement: specs.displacement ? parseFloat(specs.displacement) : undefined,
    } : null,
    mileage: specs.combinedMpg ? {
      combined_mpg: specs.combinedMpg,
    } : null,
  });

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: meta.canonical,
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      type: meta.ogType as "article",
    },
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // For VIN-based lookup, we use the ID as the VIN
  const vehicle = await decodeVin(id);

  if (!vehicle || !vehicle.specifications) {
    notFound();
  }

  const specs = vehicle.specifications;
  const make = specs.make;
  const model = specs.model;
  const year = specs.year;
  const trim = specs.trim;

  // Generate structured data
  const vehicleSchema = generateVehicleSchema({
    id: 0,
    year: year || 0,
    make: make || '',
    model: model || '',
    trim: trim,
    description: specs.description,
    msrp: specs.msrp,
    engine: specs.engineType || specs.horsepower ? {
      engine_type: specs.engineType,
      displacement: specs.displacement ? parseFloat(specs.displacement) : undefined,
      horsepower: specs.horsepower,
      torque: specs.torque,
      cylinders: specs.cylinders,
      fuel_type: specs.fuelType,
    } : null,
    mileage: specs.combinedMpg || specs.cityMpg ? {
      combined_mpg: specs.combinedMpg,
      epa_city_mpg: specs.cityMpg,
      epa_highway_mpg: specs.highwayMpg,
    } : null,
    body: specs.bodyType || specs.doors ? {
      type: specs.bodyType,
      doors: specs.doors,
    } : null,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Browse", path: "/cars" },
    ...(year ? [{ name: String(year), path: `/cars?year=${year}` }] : []),
    ...(make ? [{ name: make, path: `/cars?make=${encodeURIComponent(make)}` }] : []),
    ...(model
      ? [
          {
            name: model,
            path: `/cars?make=${encodeURIComponent(make || '')}&model=${encodeURIComponent(model)}`,
          },
        ]
      : []),
    { name: trim || "Vehicle Details" },
  ]);

  return (
    <>
      <JsonLd data={[vehicleSchema, breadcrumbSchema]} />

      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <ol className={styles.breadcrumbList}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/cars">Browse</Link>
            </li>
            {year && (
              <li>
                <Link href={`/cars?year=${year}`}>{year}</Link>
              </li>
            )}
            {make && (
              <li>
                <Link href={`/cars?make=${encodeURIComponent(make)}`}>{make}</Link>
              </li>
            )}
            {model && (
              <li>
                <Link
                  href={`/cars?make=${encodeURIComponent(make || '')}&model=${encodeURIComponent(model)}`}
                >
                  {model}
                </Link>
              </li>
            )}
            <li aria-current="page">{trim || "Details"}</li>
          </ol>
        </nav>

        {/* Vehicle Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {year} {make} {model}
            {trim && (
              <span className={styles.trim}>{trim}</span>
            )}
          </h1>
          {specs.msrp && (
            <p className={styles.price}>
              Starting MSRP: {formatCurrency(specs.msrp)}
            </p>
          )}
        </header>

        {/* Overview */}
        <section className={styles.section} aria-labelledby="overview-heading">
          <h2 id="overview-heading" className={styles.sectionTitle}>
            Overview
          </h2>
          <div className={styles.overviewGrid}>
            {specs.make && (
              <div className={styles.overviewItem}>
                <span className={styles.overviewLabel}>Make</span>
                <span className={styles.overviewValue}>{specs.make}</span>
              </div>
            )}
            {specs.model && (
              <div className={styles.overviewItem}>
                <span className={styles.overviewLabel}>Model</span>
                <span className={styles.overviewValue}>{specs.model}</span>
              </div>
            )}
            {specs.year && (
              <div className={styles.overviewItem}>
                <span className={styles.overviewLabel}>Year</span>
                <span className={styles.overviewValue}>{specs.year}</span>
              </div>
            )}
            {specs.trim && (
              <div className={styles.overviewItem}>
                <span className={styles.overviewLabel}>Trim</span>
                <span className={styles.overviewValue}>{specs.trim}</span>
              </div>
            )}
            {specs.bodyType && (
              <div className={styles.overviewItem}>
                <span className={styles.overviewLabel}>Body Type</span>
                <span className={styles.overviewValue}>{specs.bodyType}</span>
              </div>
            )}
            {specs.doors && (
              <div className={styles.overviewItem}>
                <span className={styles.overviewLabel}>Doors</span>
                <span className={styles.overviewValue}>{specs.doors}</span>
              </div>
            )}
          </div>
        </section>

        {/* Engine & Performance */}
        {(specs.engineType || specs.horsepower || specs.cylinders || specs.fuelType) && (
          <section className={styles.section} aria-labelledby="engine-heading">
            <h2 id="engine-heading" className={styles.sectionTitle}>
              Engine & Performance
            </h2>
            <table className={styles.specsTable}>
              <tbody>
                {specs.engineType && (
                  <tr>
                    <th scope="row">Engine Type</th>
                    <td>{specs.engineType}</td>
                  </tr>
                )}
                {specs.fuelType && (
                  <tr>
                    <th scope="row">Fuel Type</th>
                    <td>{specs.fuelType}</td>
                  </tr>
                )}
                {specs.cylinders && (
                  <tr>
                    <th scope="row">Cylinders</th>
                    <td>{specs.cylinders}</td>
                  </tr>
                )}
                {specs.displacement && (
                  <tr>
                    <th scope="row">Displacement</th>
                    <td>{specs.displacement}</td>
                  </tr>
                )}
                {specs.horsepower && (
                  <tr>
                    <th scope="row">Horsepower</th>
                    <td>{specs.horsepower} hp</td>
                  </tr>
                )}
                {specs.torque && (
                  <tr>
                    <th scope="row">Torque</th>
                    <td>{specs.torque} lb-ft</td>
                  </tr>
                )}
                {specs.transmission && (
                  <tr>
                    <th scope="row">Transmission</th>
                    <td>{specs.transmission}</td>
                  </tr>
                )}
                {specs.drivetrain && (
                  <tr>
                    <th scope="row">Drivetrain</th>
                    <td>{specs.drivetrain}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Fuel Economy */}
        {(specs.combinedMpg || specs.cityMpg || specs.highwayMpg) && (
          <section className={styles.section} aria-labelledby="fuel-heading">
            <h2 id="fuel-heading" className={styles.sectionTitle}>
              Fuel Economy
            </h2>
            <table className={styles.specsTable}>
              <tbody>
                {specs.cityMpg && (
                  <tr>
                    <th scope="row">City MPG</th>
                    <td>{specs.cityMpg}</td>
                  </tr>
                )}
                {specs.highwayMpg && (
                  <tr>
                    <th scope="row">Highway MPG</th>
                    <td>{specs.highwayMpg}</td>
                  </tr>
                )}
                {specs.combinedMpg && (
                  <tr>
                    <th scope="row">Combined MPG</th>
                    <td>{specs.combinedMpg}</td>
                  </tr>
                )}
                {specs.fuelTankCapacity && (
                  <tr>
                    <th scope="row">Fuel Tank Capacity</th>
                    <td>{specs.fuelTankCapacity}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Dimensions */}
        {(specs.length || specs.width || specs.height || specs.wheelbase || specs.curbWeight) && (
          <section className={styles.section} aria-labelledby="dimensions-heading">
            <h2 id="dimensions-heading" className={styles.sectionTitle}>
              Dimensions
            </h2>
            <table className={styles.specsTable}>
              <tbody>
                {specs.length && (
                  <tr>
                    <th scope="row">Length</th>
                    <td>{specs.length}</td>
                  </tr>
                )}
                {specs.width && (
                  <tr>
                    <th scope="row">Width</th>
                    <td>{specs.width}</td>
                  </tr>
                )}
                {specs.height && (
                  <tr>
                    <th scope="row">Height</th>
                    <td>{specs.height}</td>
                  </tr>
                )}
                {specs.wheelbase && (
                  <tr>
                    <th scope="row">Wheelbase</th>
                    <td>{specs.wheelbase}</td>
                  </tr>
                )}
                {specs.curbWeight && (
                  <tr>
                    <th scope="row">Curb Weight</th>
                    <td>{specs.curbWeight}</td>
                  </tr>
                )}
                {specs.grossWeight && (
                  <tr>
                    <th scope="row">Gross Weight</th>
                    <td>{specs.grossWeight}</td>
                  </tr>
                )}
                {specs.towingCapacity && (
                  <tr>
                    <th scope="row">Towing Capacity</th>
                    <td>{specs.towingCapacity}</td>
                  </tr>
                )}
                {specs.payloadCapacity && (
                  <tr>
                    <th scope="row">Payload Capacity</th>
                    <td>{specs.payloadCapacity}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Manufacturing Info */}
        {(specs.manufacturer || specs.plantCountry || specs.vehicleType) && (
          <section className={styles.section} aria-labelledby="manufacturing-heading">
            <h2 id="manufacturing-heading" className={styles.sectionTitle}>
              Manufacturing Information
            </h2>
            <table className={styles.specsTable}>
              <tbody>
                {specs.manufacturer && (
                  <tr>
                    <th scope="row">Manufacturer</th>
                    <td>{specs.manufacturer}</td>
                  </tr>
                )}
                {specs.vehicleType && (
                  <tr>
                    <th scope="row">Vehicle Type</th>
                    <td>{specs.vehicleType}</td>
                  </tr>
                )}
                {specs.bodyClass && (
                  <tr>
                    <th scope="row">Body Class</th>
                    <td>{specs.bodyClass}</td>
                  </tr>
                )}
                {specs.plantCity && (
                  <tr>
                    <th scope="row">Plant City</th>
                    <td>{specs.plantCity}</td>
                  </tr>
                )}
                {specs.plantCountry && (
                  <tr>
                    <th scope="row">Plant Country</th>
                    <td>{specs.plantCountry}</td>
                  </tr>
                )}
                {specs.plantState && (
                  <tr>
                    <th scope="row">Plant State</th>
                    <td>{specs.plantState}</td>
                  </tr>
                )}
                {specs.series && (
                  <tr>
                    <th scope="row">Series</th>
                    <td>{specs.series}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Safety Features */}
        {(specs.abs || specs.esc || specs.tractionControl || specs.tpms || specs.frontAirBagLocations) && (
          <section className={styles.section} aria-labelledby="safety-heading">
            <h2 id="safety-heading" className={styles.sectionTitle}>
              Safety Features
            </h2>
            <table className={styles.specsTable}>
              <tbody>
                {specs.frontAirBagLocations && (
                  <tr>
                    <th scope="row">Front Airbags</th>
                    <td>{specs.frontAirBagLocations}</td>
                  </tr>
                )}
                {specs.sideAirBagLocations && (
                  <tr>
                    <th scope="row">Side Airbags</th>
                    <td>{specs.sideAirBagLocations}</td>
                  </tr>
                )}
                {specs.curtainAirBagLocations && (
                  <tr>
                    <th scope="row">Curtain Airbags</th>
                    <td>{specs.curtainAirBagLocations}</td>
                  </tr>
                )}
                {specs.kneeAirBagLocations && (
                  <tr>
                    <th scope="row">Knee Airbags</th>
                    <td>{specs.kneeAirBagLocations}</td>
                  </tr>
                )}
                {specs.abs && (
                  <tr>
                    <th scope="row">ABS</th>
                    <td>{specs.abs}</td>
                  </tr>
                )}
                {specs.esc && (
                  <tr>
                    <th scope="row">ESC</th>
                    <td>{specs.esc}</td>
                  </tr>
                )}
                {specs.tractionControl && (
                  <tr>
                    <th scope="row">Traction Control</th>
                    <td>{specs.tractionControl}</td>
                  </tr>
                )}
                {specs.tpms && (
                  <tr>
                    <th scope="row">TPMS</th>
                    <td>{specs.tpms}</td>
                  </tr>
                )}
                {specs.backupCamera && (
                  <tr>
                    <th scope="row">Backup Camera</th>
                    <td>{specs.backupCamera}</td>
                  </tr>
                )}
                {specs.daytimeRunningLights && (
                  <tr>
                    <th scope="row">Daytime Running Lights</th>
                    <td>{specs.daytimeRunningLights}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <section className={styles.section} aria-labelledby="features-heading">
            <h2 id="features-heading" className={styles.sectionTitle}>
              Features
            </h2>
            <div className={styles.featuresGrid}>
              {vehicle.features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  {feature}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <Link href={`/vin?vin=${vehicle.vin}`} className={styles.actionButton}>
            View Full VIN Report
          </Link>
          <Link href="/cars" className={styles.actionButtonSecondary}>
            Browse More Vehicles
          </Link>
        </div>
      </div>
    </>
  );
}

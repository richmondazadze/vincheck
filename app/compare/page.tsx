import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { JsonLd } from "@/components/seo";
import { getVehicle } from "@/lib/api/carapi";
import { generateWebPageSchema } from "@/lib/seo/structured-data";
import { getCompareMeta } from "@/lib/seo/meta";
import { config } from "@/lib/config";
import {
  formatCurrency,
  formatDisplacement,
  formatHorsepower,
  formatTorque,
  formatMpg,
  formatInches,
  formatWeight,
} from "@/lib/utils/format";
import type { CarApiVehicle } from "@/lib/api/types";
import styles from "./page.module.css";

interface SearchParams {
  vehicles?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const vehicleIds = params.vehicles?.split(",").filter(Boolean) || [];
  const meta = getCompareMeta(vehicleIds.length);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: meta.canonical,
    },
    robots: meta.robots,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      type: meta.ogType as "website",
    },
  };
}

// Helper function to determine best value for comparison
function getBestValue(values: string[], key: string): { bestIndex: number; worstIndex: number } | null {
  if (values.length < 2) return null;
  
  const numericValues = values.map(v => {
    // Extract numeric value from formatted strings
    const match = v.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : null;
  });

  // For MPG, horsepower, torque - higher is better
  const higherIsBetter = ['mpg', 'horsepower', 'torque', 'cylinders'].some(term => key.includes(term));
  
  let bestIndex = -1;
  let worstIndex = -1;
  let bestValue: number | null = null;
  let worstValue: number | null = null;

  numericValues.forEach((value, index) => {
    if (value !== null) {
      if (bestValue === null || 
          (higherIsBetter && value > bestValue) || 
          (!higherIsBetter && value < bestValue)) {
        bestValue = value;
        bestIndex = index;
      }
      
      if (worstValue === null || 
          (higherIsBetter && value < worstValue) || 
          (!higherIsBetter && value > worstValue)) {
        worstValue = value;
        worstIndex = index;
      }
    }
  });

  return bestIndex >= 0 && worstIndex >= 0 ? { bestIndex, worstIndex } : null;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const vehicleIds = params.vehicles?.split(",").filter(Boolean) || [];

  // Fetch vehicle data
  const vehicles: (CarApiVehicle | null)[] = await Promise.all(
    vehicleIds.slice(0, config.comparison.maxVehicles).map((id) =>
      getVehicle(parseInt(id))
    )
  );

  const validVehicles = vehicles.filter(
    (v): v is CarApiVehicle => v !== null
  );

  // Generate structured data
  const webPageSchema = generateWebPageSchema({
    title: getCompareMeta(validVehicles.length).title,
    description: getCompareMeta(validVehicles.length).description,
    path: "/compare",
  });

  // Enhanced comparison specs with categories
  const comparisonSpecs = [
    {
      category: "Basic Information",
      specs: [
        { label: "Year", key: "year" },
        { label: "Make", key: "make_model.make.name" },
        { label: "Model", key: "make_model.name" },
        { label: "Trim", key: "name" },
        { label: "MSRP", key: "msrp", format: "currency" },
      ]
    },
    {
      category: "Body & Dimensions",
      specs: [
        { label: "Body Type", key: "body.type" },
        { label: "Doors", key: "body.doors" },
        { label: "Length", key: "body.length", format: "inches" },
        { label: "Width", key: "body.width", format: "inches" },
        { label: "Height", key: "body.height", format: "inches" },
        { label: "Wheelbase", key: "body.wheel_base", format: "inches" },
        { label: "Curb Weight", key: "body.curb_weight", format: "weight" },
        { label: "Cargo Capacity", key: "body.cargo_capacity" },
      ]
    },
    {
      category: "Engine & Performance",
      specs: [
        { label: "Engine Type", key: "engine.engine_type" },
        { label: "Displacement", key: "engine.displacement", format: "displacement" },
        { label: "Cylinders", key: "engine.cylinders" },
        { label: "Horsepower", key: "engine.horsepower", format: "horsepower" },
        { label: "Torque", key: "engine.torque", format: "torque" },
        { label: "Fuel Type", key: "engine.fuel_type" },
        { label: "Transmission", key: "engine.transmission" },
        { label: "Drive Type", key: "engine.drive_type" },
      ]
    },
    {
      category: "Fuel Economy",
      specs: [
        { label: "City MPG", key: "mileage.epa_city_mpg", format: "mpg" },
        { label: "Highway MPG", key: "mileage.epa_highway_mpg", format: "mpg" },
        { label: "Combined MPG", key: "mileage.combined_mpg", format: "mpg" },
        { label: "Fuel Tank Capacity", key: "mileage.fuel_tank_capacity" },
        { label: "City Range", key: "mileage.range_city" },
        { label: "Highway Range", key: "mileage.range_highway" },
      ]
    },
  ];

  // Helper function to get nested value
  const getValue = (vehicle: CarApiVehicle, key: string, format?: string): string => {
    const keys = key.split(".");
    let value: unknown = vehicle;

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = (value as Record<string, unknown>)[k];
      } else {
        return "—";
      }
    }

    if (value === null || value === undefined || value === "") {
      return "—";
    }

    switch (format) {
      case "currency":
        return formatCurrency(value as number);
      case "displacement":
        return formatDisplacement(value as number);
      case "horsepower":
        return formatHorsepower(value as number);
      case "torque":
        return formatTorque(value as number);
      case "mpg":
        return formatMpg(value as number);
      case "inches":
        return formatInches(value as string);
      case "weight":
        return formatWeight(value as string);
      default:
        return String(value);
    }
  };

  // Calculate comparison statistics
  const getComparisonStats = () => {
    if (validVehicles.length === 0) return null;

    const avgMsrp = validVehicles.reduce((sum, v) => sum + (v.msrp || 0), 0) / validVehicles.length;
    const avgMpg = validVehicles.reduce((sum, v) => sum + (v.mileage?.combined_mpg || 0), 0) / validVehicles.length;
    const avgHorsepower = validVehicles.reduce((sum, v) => sum + (v.engine?.horsepower || 0), 0) / validVehicles.length;
    const uniqueMakes = new Set(validVehicles.map(v => v.make_model?.make?.name)).size;

    return {
      avgMsrp: formatCurrency(avgMsrp),
      avgMpg: avgMpg.toFixed(1),
      avgHorsepower: avgHorsepower.toFixed(0),
      uniqueMakes,
    };
  };

  const stats = getComparisonStats();

  return (
    <>
      <JsonLd data={webPageSchema} />

      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Advanced Vehicle Comparison</h1>
          <p className={styles.subtitle}>
            Compare up to {config.comparison.maxVehicles} vehicles side-by-side with detailed specifications, 
            performance metrics, and intelligent highlighting of best values.
          </p>
        </div>

        {/* Vehicle Selector */}
        <div className={styles.selector}>
          <h2 className={styles.selectorTitle}>Selected Vehicles</h2>
          <div className={styles.selectorGrid}>
            {Array.from({ length: config.comparison.maxVehicles }).map((_, index) => {
              const vehicle = validVehicles[index];
              const otherIds = validVehicles
                .filter((_, i) => i !== index)
                .map((v) => v.id)
                .join(",");

              if (vehicle) {
                return (
                  <div key={index} className={styles.vehicleCard}>
                    <h3 className={styles.vehicleName}>
                      {vehicle.year} {vehicle.make_model?.make?.name}{" "}
                      {vehicle.make_model?.name}
                    </h3>
                    <p className={styles.vehicleTrim}>{vehicle.name}</p>
                    {vehicle.msrp && (
                      <p className={styles.vehicleTrim} style={{ color: '#059669', fontWeight: '600' }}>
                        {formatCurrency(vehicle.msrp)}
                      </p>
                    )}
                    <Link
                      href={`/compare?vehicles=${otherIds}`}
                      className={styles.removeLink}
                    >
                      Remove Vehicle
                    </Link>
                  </div>
                );
              }

              return (
                <div key={index} className={styles.emptyCard}>
                  <p className={styles.emptyText}>Vehicle {index + 1}</p>
                  <p className={styles.emptyHint}>
                    Add a vehicle from the browse page to compare
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Statistics */}
        {stats && validVehicles.length > 0 && (
          <div className={styles.comparisonStats}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{validVehicles.length}</div>
              <div className={styles.statLabel}>Vehicles</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.uniqueMakes}</div>
              <div className={styles.statLabel}>Unique Makes</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.avgMsrp}</div>
              <div className={styles.statLabel}>Average Price</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.avgMpg}</div>
              <div className={styles.statLabel}>Average MPG</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.avgHorsepower}</div>
              <div className={styles.statLabel}>Avg Horsepower</div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {validVehicles.length > 0 && (
          <div className={styles.comparison}>
            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th className={styles.specHeader}>Specification</th>
                    {validVehicles.map((vehicle) => (
                      <th key={vehicle.id} className={styles.vehicleHeader}>
                        <div className={styles.vehicleHeaderContent}>
                          <span className={styles.vehicleHeaderYear}>
                            {vehicle.year}
                          </span>
                          <span className={styles.vehicleHeaderName}>
                            {vehicle.make_model?.make?.name}{" "}
                            {vehicle.make_model?.name}
                          </span>
                          <span className={styles.vehicleHeaderTrim}>
                            {vehicle.name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonSpecs.map((category) => (
                    <React.Fragment key={category.category}>
                      <tr className={styles.categoryRow}>
                        <th colSpan={validVehicles.length + 1} className={styles.categoryHeader}>
                          {category.category}
                        </th>
                      </tr>
                      {category.specs.map((spec) => {
                        const values = validVehicles.map((v) =>
                          getValue(v, spec.key, spec.format)
                        );
                        const hasValue = values.some((v) => v !== "—");
                        const bestValue = getBestValue(values, spec.key);

                        if (!hasValue) return null;

                        return (
                          <tr key={spec.key}>
                            <th scope="row" className={styles.specLabel}>
                              {spec.label}
                            </th>
                            {values.map((value, idx) => (
                              <td 
                                key={idx} 
                                className={`${styles.specValue} ${
                                  bestValue?.bestIndex === idx ? styles.best : ''
                                } ${
                                  bestValue?.worstIndex === idx ? styles.worst : ''
                                }`}
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* View Full Specs Links */}
            <div className={styles.actions}>
              {validVehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicle/${vehicle.id}`}
                  className={styles.viewLink}
                >
                  View {vehicle.year} {vehicle.make_model?.make?.name}{" "}
                  {vehicle.make_model?.name} Full Specs
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {validVehicles.length === 0 && (
          <div className={styles.emptyState}>
            <p>No vehicles selected for comparison.</p>
            <Link href="/cars" className={styles.browseLink}>
              Browse Vehicles to Compare
            </Link>
          </div>
        )}

        {/* Instructions */}
        <div className={styles.instructions}>
          <h2 className={styles.instructionsTitle}>How to Use Vehicle Comparison</h2>
          <ul className={styles.instructionsList}>
            <li data-step="1">
              Browse or search for vehicles on the browse page using filters
            </li>
            <li data-step="2">
              Click "Compare" on any vehicle to add it to your comparison list
            </li>
            <li data-step="3">
              Add up to {config.comparison.maxVehicles} vehicles to compare
            </li>
            <li data-step="4">
              View specifications side-by-side with best values highlighted 🏆
            </li>
            <li data-step="5">
              Click on any vehicle link to view complete specifications
            </li>
            <li data-step="6">
              Remove vehicles by clicking the "Remove Vehicle" button
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

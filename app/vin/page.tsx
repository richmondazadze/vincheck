import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/seo";
import { Button } from "@/components/ui";
import { VinBreakdown } from "@/components/vin/VinBreakdown";
import { PrintButton } from "@/components/vin/PrintButton";
import { decodeVin, getVehiclePhotos, checkStolen, getVehicleValuation } from "@/lib/api/carapi";
import { generateWebPageSchema } from "@/lib/seo/structured-data";
import { getVinDecoderMeta } from "@/lib/seo/meta";
import { isValidVin, formatCurrency } from "@/lib/utils/format";
import type { VinDecodeResponse, VehicleValuationResponse } from "@/lib/api/types";
import styles from "./page.module.css";

interface SearchParams {
  vin?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const meta = getVinDecoderMeta(params.vin);

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

// Helper function to render specification items
function renderSpecItem(label: string, value: string | null | undefined, badge?: 'success' | 'warning' | 'info') {
  if (!value) return null;
  
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>
        {badge ? <span className={`${styles.valueBadge} ${styles[badge]}`}>{value}</span> : value}
      </td>
    </tr>
  );
}

// Helper function to render manufacturing specs
function renderManufacturingSpecs(specs: VinDecodeResponse['specifications']) {
  if (!specs) return null;

  const manufacturingSpecs = [
    { label: "Manufacturer", value: specs.manufacturer },
    { label: "Plant City", value: specs.plantCity },
    { label: "Plant Country", value: specs.plantCountry },
    { label: "Plant State", value: specs.plantState },
    { label: "Vehicle Type", value: specs.vehicleType },
    { label: "Body Class", value: specs.bodyClass },
    { label: "Series", value: specs.series },
    { label: "Destination Market", value: specs.destinationMarket },
  ];

  const safetySpecs = [
    { label: "Airbags - Front", value: specs.frontAirBagLocations },
    { label: "Airbags - Side", value: specs.sideAirBagLocations },
    { label: "Airbags - Curtain", value: specs.curtainAirBagLocations },
    { label: "Airbags - Knee", value: specs.kneeAirBagLocations },
    { label: "ABS", value: specs.abs },
    { label: "ESC", value: specs.esc },
    { label: "Traction Control", value: specs.tractionControl },
    { label: "TPMS", value: specs.tpms },
    { label: "Backup Camera", value: specs.backupCamera },
    { label: "Daytime Running Lights", value: specs.daytimeRunningLights },
  ];

  return (
    <div className={styles.manufacturingSection}>
      <div className={styles.manufacturingCard}>
        <h3>Manufacturing Information</h3>
        <div className={styles.specGrid}>
          {manufacturingSpecs.map((spec, index) => (
            spec.value && (
              <div key={index} className={styles.specItem}>
                <strong>{spec.label}</strong>
                <span>{spec.value}</span>
              </div>
            )
          ))}
        </div>
      </div>
      
      <div className={styles.manufacturingCard}>
        <h3>Safety Features</h3>
        <div className={styles.specGrid}>
          {safetySpecs.map((spec, index) => (
            spec.value && (
              <div key={index} className={styles.specItem}>
                <strong>{spec.label}</strong>
                <span>{spec.value}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function VinDecoderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const vin = params.vin?.toUpperCase().trim();
  
  let decodedVehicle: VinDecodeResponse | null = null;
  let vehiclePhotos = null;
  let stolenCheck = null;
  let valuation: VehicleValuationResponse | null = null;
  let error = null;

  if (vin) {
    if (!isValidVin(vin)) {
      error = "Invalid VIN format. VIN must be 17 characters long and contain only letters (except I, O, Q) and numbers.";
    } else {
      // Fetch all data in parallel
      const [decoded, photos, stolen, value] = await Promise.all([
        decodeVin(vin),
        getVehiclePhotos(vin).catch(() => null),
        checkStolen(vin).catch(() => null),
        getVehicleValuation(vin).catch(() => null),
      ]);

      decodedVehicle = decoded;
      vehiclePhotos = photos;
      stolenCheck = stolen;
      valuation = value;

      if (!decodedVehicle) {
        error = "Unable to decode this VIN. Please check the VIN and try again.";
      }
    }
  }

  const specs = decodedVehicle?.specifications;

  // Generate structured data
  const webPageSchema = generateWebPageSchema({
    title: getVinDecoderMeta(vin).title,
    description: getVinDecoderMeta(vin).description,
    path: "/vin",
  });

  return (
    <>
      <JsonLd data={webPageSchema} />

      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Advanced VIN Decoder</h1>
          <p className={styles.subtitle}>
            Enter a 17-character Vehicle Identification Number (VIN) to unlock comprehensive vehicle information including manufacturing details, safety features, and complete specifications.
          </p>
        </div>

        {/* VIN Input Form */}
        <div className={styles.formSection}>
          <form action="/vin" method="GET" className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="vin" className={styles.label}>
                Vehicle Identification Number (VIN)
              </label>
              <input
                id="vin"
                type="text"
                name="vin"
                placeholder="e.g., 1HGCM82633A123456"
                maxLength={17}
                defaultValue={vin || ""}
                className={styles.input}
                required
              />
              <span className={styles.hint}>
                17 characters, no I, O, or Q
              </span>
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Decode VIN →
            </Button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.error} role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {decodedVehicle && specs && (
          <div className={styles.results}>
            <h2 className={styles.resultsTitle}>🎯 VIN Decoded Successfully</h2>

            {/* VIN Breakdown Visualizer */}
            {vin && (
              <div className={styles.breakdownSection}>
                <VinBreakdown vin={vin} />
              </div>
            )}

            {/* Quick Actions */}
            <div className={styles.actionsBar}>
              <Link href={"/vin/guide" as any} className={styles.actionLink}>
                Learn How to Read VINs →
              </Link>
              <Link href={"/vin/batch" as any} className={styles.actionLink}>
                Batch Decoder →
              </Link>
              <PrintButton />
            </div>

            {/* Vehicle Photos */}
            {vehiclePhotos && vehiclePhotos.photos && vehiclePhotos.photos.length > 0 && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Vehicle Photos</h3>
                <div className={styles.photosGrid}>
                  {vehiclePhotos.photos.slice(0, 6).map((photo, index) => {
                    // Extract photo info from URL if possible, otherwise use generic label
                    const urlParts = photo.url.split('/');
                    const filename = urlParts[urlParts.length - 1] || `photo-${index + 1}`;
                    const photoName = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/[-_]/g, ' ');
                    
                    return (
                      <div key={index} className={styles.photoItem}>
                        <Image
                          src={photo.url}
                          alt={`${specs.make} ${specs.model} - ${photoName}`}
                          width={300}
                          height={200}
                          className={styles.photoImage}
                          unoptimized
                        />
                        <span className={styles.photoLabel}>{photoName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stolen Check */}
            {stolenCheck && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Stolen Vehicle Check</h3>
                <table className={styles.infoTable}>
                  <tbody>
                    <tr>
                      <th scope="row">Status</th>
                      <td>
                        <span className={`${styles.valueBadge} ${stolenCheck.stolen ? styles.error : styles.success}`}>
                          {stolenCheck.stolen ? "⚠️ REPORTED STOLEN" : "✓ NOT REPORTED STOLEN"}
                        </span>
                      </td>
                    </tr>
                    {stolenCheck.countries && (
                      <tr>
                        <th scope="row">Country Checks</th>
                        <td>
                          <div className={styles.countryChecks}>
                            {Object.entries(stolenCheck.countries).map(([country, isStolen]) => (
                              <span key={country} className={styles.countryCheck}>
                                {country.toUpperCase()}: {isStolen ? "⚠️" : "✓"}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Market Valuation */}
            {valuation && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Market Valuation</h3>
                <table className={styles.infoTable}>
                  <tbody>
                    {valuation.originalPrice && (
                      <tr>
                        <th scope="row">Original Price</th>
                        <td>{formatCurrency(valuation.originalPrice)} {valuation.currency || 'USD'}</td>
                      </tr>
                    )}
                    {valuation.priceEstimation && valuation.priceEstimation.length > 0 && (
                      <tr>
                        <th scope="row">Price Estimation by Year</th>
                        <td>
                          <div className={styles.valuationTable}>
                            {valuation.priceEstimation.slice(0, 5).map((est, index) => (
                              <div key={index} className={styles.valuationRow}>
                                <span>{est.year}:</span>
                                <strong>{formatCurrency(est.price)}</strong>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                    {valuation.marketValue && (
                      <tr>
                        <th scope="row">Current Market Value</th>
                        <td>
                          <div className={styles.marketValue}>
                            <span>Low: {formatCurrency(valuation.marketValue.low)}</span>
                            <span>Avg: {formatCurrency(valuation.marketValue.average)}</span>
                            <span>High: {formatCurrency(valuation.marketValue.high)}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Basic Vehicle Information */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Vehicle Details</h3>
              <table className={styles.infoTable}>
                <tbody>
                  {renderSpecItem("VIN", decodedVehicle.vin)}
                  {renderSpecItem("Year", specs.year?.toString())}
                  {renderSpecItem("Make", specs.make)}
                  {renderSpecItem("Model", specs.model)}
                  {renderSpecItem("Trim", specs.trim)}
                  {renderSpecItem("Description", specs.description)}
                </tbody>
              </table>
            </div>

            {/* Engine Information */}
            {(specs.engineType || specs.cylinders || specs.horsepower || specs.fuelType) && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Engine Specifications</h3>
                <table className={styles.infoTable}>
                  <tbody>
                    {renderSpecItem("Engine Type", specs.engineType)}
                    {renderSpecItem("Fuel Type", specs.fuelType, specs.fuelType?.toLowerCase() === 'electric' ? 'success' : 'info')}
                    {renderSpecItem("Cylinders", specs.cylinders?.toString())}
                    {renderSpecItem("Displacement", specs.displacement)}
                    {renderSpecItem("Horsepower", specs.horsepower ? `${specs.horsepower} hp` : null)}
                    {renderSpecItem("Torque", specs.torque ? `${specs.torque} lb-ft` : null)}
                    {renderSpecItem("Transmission", specs.transmission)}
                    {renderSpecItem("Drivetrain", specs.drivetrain)}
                  </tbody>
                </table>
              </div>
            )}

            {/* Fuel Economy */}
            {(specs.combinedMpg || specs.cityMpg || specs.highwayMpg) && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Fuel Economy & Range</h3>
                <table className={styles.infoTable}>
                  <tbody>
                    {renderSpecItem("City MPG", specs.cityMpg?.toString(), 'success')}
                    {renderSpecItem("Highway MPG", specs.highwayMpg?.toString(), 'success')}
                    {renderSpecItem("Combined MPG", specs.combinedMpg?.toString(), 'success')}
                    {renderSpecItem("Fuel Tank Capacity", specs.fuelTankCapacity)}
                  </tbody>
                </table>
              </div>
            )}

            {/* Body & Dimensions */}
            {(specs.bodyType || specs.doors || specs.length || specs.width || specs.height) && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Body & Dimensions</h3>
                <table className={styles.infoTable}>
                  <tbody>
                    {renderSpecItem("Body Type", specs.bodyType)}
                    {renderSpecItem("Doors", specs.doors?.toString())}
                    {renderSpecItem("Length", specs.length)}
                    {renderSpecItem("Width", specs.width)}
                    {renderSpecItem("Height", specs.height)}
                    {renderSpecItem("Wheelbase", specs.wheelbase)}
                    {renderSpecItem("Curb Weight", specs.curbWeight)}
                    {renderSpecItem("Gross Weight", specs.grossWeight)}
                    {renderSpecItem("Towing Capacity", specs.towingCapacity)}
                    {renderSpecItem("Payload Capacity", specs.payloadCapacity)}
                  </tbody>
                </table>
              </div>
            )}

            {/* Manufacturing & Safety Information */}
            {renderManufacturingSpecs(specs)}

            {/* Pricing */}
            {(specs.msrp || specs.invoice) && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Pricing Information</h3>
                <table className={styles.infoTable}>
                  <tbody>
                    {renderSpecItem("MSRP", specs.msrp ? formatCurrency(specs.msrp) : null)}
                    {renderSpecItem("Invoice Price", specs.invoice ? formatCurrency(specs.invoice) : null)}
                  </tbody>
                </table>
              </div>
            )}

            {/* Features */}
            {decodedVehicle.features && decodedVehicle.features.length > 0 && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Features</h3>
                <div className={styles.featuresList}>
                  {decodedVehicle.features.map((feature, index) => (
                    <span key={index} className={styles.featureTag}>{feature}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Plate Number Info */}
            {decodedVehicle.plateNumber && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Registration Information</h3>
                <table className={styles.infoTable}>
                  <tbody>
                    {renderSpecItem("Country", decodedVehicle.plateNumber.country)}
                    {renderSpecItem("Plate Number", decodedVehicle.plateNumber.plateNumber)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>Understanding VIN Numbers</h2>
          <p className={styles.infoText}>
            A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every motor vehicle when it is manufactured. The VIN serves as the car's fingerprint, providing detailed information about its origin, specifications, and history.
          </p>
          
          <div className={styles.infoActions}>
            <Link href={"/vin/guide" as any} className={styles.guideLink}>
              Read Complete VIN Guide →
            </Link>
          </div>

          <h3 className={styles.infoSubtitle}>Quick VIN Structure Reference</h3>
          <div className={styles.vinStructure}>
            <div className={styles.vinPart}>
              <strong>Characters 1-3 (WMI)</strong>
              <span>World Manufacturer Identifier - Identifies the manufacturer and country</span>
            </div>
            <div className={styles.vinPart}>
              <strong>Characters 4-8 (VDS)</strong>
              <span>Vehicle Descriptor Section - Vehicle attributes (engine, body style, etc.)</span>
            </div>
            <div className={styles.vinPart}>
              <strong>Character 9</strong>
              <span>Check digit - Validates the VIN</span>
            </div>
            <div className={styles.vinPart}>
              <strong>Character 10</strong>
              <span>Model year - Indicates the vehicle's model year</span>
            </div>
            <div className={styles.vinPart}>
              <strong>Character 11</strong>
              <span>Plant code - Manufacturing plant location</span>
            </div>
            <div className={styles.vinPart}>
              <strong>Characters 12-17</strong>
              <span>Sequential number - Unique production sequence</span>
            </div>
          </div>

          <h3 className={styles.infoSubtitle}>What You Can Learn</h3>
          <ul className={styles.infoList}>
            <li>Vehicle make, model, and year</li>
            <li>Engine specifications and fuel type</li>
            <li>Manufacturing plant and country</li>
            <li>Safety features and equipment</li>
            <li>Body style and dimensions</li>
            <li>Original factory options</li>
            <li>Market value and price trends</li>
            <li>Stolen vehicle status</li>
          </ul>
        </div>
      </div>
    </>
  );
}

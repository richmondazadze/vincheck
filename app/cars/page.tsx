import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo";
import { Table } from "@/components/ui";
import { getYears, getMakes, searchVehicles } from "@/lib/api/carapi";

// Mock getModels since it's not in the API
async function getModels(_year?: number, _makeId?: number): Promise<Array<{ id: number; name: string }>> {
  return [
    { id: 1, name: 'Camry' },
    { id: 2, name: 'Corolla' },
    { id: 3, name: 'Civic' },
    { id: 4, name: 'Accord' },
    { id: 5, name: 'F-150' },
    { id: 6, name: 'Mustang' },
    { id: 7, name: 'Silverado' },
    { id: 8, name: '3 Series' },
    { id: 9, name: 'C-Class' },
    { id: 10, name: 'A4' },
    { id: 11, name: 'Golf' },
    { id: 12, name: 'Elantra' },
    { id: 13, name: 'Sorento' },
    { id: 14, name: 'Altima' },
    { id: 15, name: 'RX' },
  ];
}
import { generateWebPageSchema } from "@/lib/seo/structured-data";
import { getBrowseMeta } from "@/lib/seo/meta";
import { formatCurrency } from "@/lib/utils/format";
import type { TableColumn } from "@/types";
import styles from "./page.module.css";

interface VehicleSearchResult {
  id: number;
  vin: string;
  year?: number;
  make?: string;
  model?: string;
}

interface SearchParams {
  year?: string;
  make?: string;
  model?: string;
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const meta = getBrowseMeta({
    year: params.year ? parseInt(params.year) : undefined,
    make: params.make,
    model: params.model,
  });

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

export default async function BrowsePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const year = params.year ? parseInt(params.year) : undefined;
  const make = params.make;
  const model = params.model;
  const page = parseInt(params.page || "1");

  // Fetch filter options
  const years = await getYears();
  const recentYears = years.slice(-20).reverse();

  // Fetch makes
  const makes = await getMakes(year);

  // Fetch models if make is selected
  let models: { id: number; name: string }[] = [];
  if (make) {
    models = await getModels(year, makes.find(m => m.name.toLowerCase() === make.toLowerCase())?.id);
  }

  // Fetch vehicles
  const { vehicles: rawVehicles, total } = await searchVehicles({
    year,
    make,
    model,
    page,
    perPage: 25,
  });

  // Transform vehicles for display
  const vehicles: VehicleSearchResult[] = rawVehicles.map((v) => ({
    id: v.id,
    vin: v.vin,
    year: v.year,
    make: v.make,
    model: v.model,
  }));

  const totalPages = Math.ceil(total / 25);

  // Generate structured data
  const webPageSchema = generateWebPageSchema({
    title: getBrowseMeta({ year, make, model }).title,
    description: getBrowseMeta({ year, make, model }).description,
    path: "/cars",
  });

  // Table columns
  const columns: TableColumn<VehicleSearchResult>[] = [
    {
      key: "year",
      header: "Year",
      width: "80px",
      render: (vehicle) => vehicle.year || "N/A",
    },
    {
      key: "make",
      header: "Make",
      render: (vehicle) => vehicle.make || "N/A",
    },
    {
      key: "model",
      header: "Model",
      render: (vehicle) => vehicle.model || "N/A",
    },
    {
      key: "vin",
      header: "VIN",
      render: (vehicle) => vehicle.vin || "N/A",
    },
    {
      key: "action",
      header: "",
      width: "100px",
      render: (vehicle) => (
        <Link
          href={`/vehicle/${vehicle.id}`}
          className={styles.viewLink}
        >
          View Specs
        </Link>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={webPageSchema} />

      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>
            {year && make && model
              ? `${year} ${make} ${model}`
              : year && make
              ? `${year} ${make} Vehicles`
              : year
              ? `${year} Vehicles`
              : "Browse Vehicles"}
          </h1>
          <p className={styles.subtitle}>
            {total > 0
              ? `Found ${total} vehicle${total !== 1 ? "s" : ""}`
              : "Use the filters below to search for vehicles"}
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <form action="/cars" method="GET" className={styles.filterForm}>
            <div className={styles.filterGroup}>
              <label htmlFor="year" className={styles.filterLabel}>
                Year
              </label>
              <select
                id="year"
                name="year"
                className={styles.filterSelect}
                defaultValue={year || ""}
              >
                <option value="">All Years</option>
                {recentYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="make" className={styles.filterLabel}>
                Make
              </label>
              <select
                id="make"
                name="make"
                className={styles.filterSelect}
                defaultValue={make || ""}
              >
                <option value="">All Makes</option>
                {makes.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="model" className={styles.filterLabel}>
                Model
              </label>
              <select
                id="model"
                name="model"
                className={styles.filterSelect}
                defaultValue={model || ""}
                disabled={!make || models.length === 0}
              >
                <option value="">{make ? "All Models" : "Select Make First"}</option>
                {models.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterActions}>
              <button type="submit" className={styles.filterButton}>
                Filter
              </button>
              {(year || make || model) && (
                <Link href="/cars" className={styles.clearLink}>
                  Clear
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {vehicles.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={vehicles}
              keyExtractor={(vehicle) => vehicle.id}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {page > 1 && (
                  <Link
                    href={`/cars?${new URLSearchParams({
                      ...(year && { year: String(year) }),
                      ...(make && { make }),
                      ...(model && { model }),
                      page: String(page - 1),
                    })}`}
                    className={styles.pageLink}
                  >
                    ← Previous
                  </Link>
                )}
                <span className={styles.pageInfo}>
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/cars?${new URLSearchParams({
                      ...(year && { year: String(year) }),
                      ...(make && { make }),
                      ...(model && { model }),
                      page: String(page + 1),
                    })}`}
                    className={styles.pageLink}
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <p>No vehicles found matching your criteria.</p>
            <p className={styles.emptyHint}>
              Try adjusting your filters or browse all vehicles.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

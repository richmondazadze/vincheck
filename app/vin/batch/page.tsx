import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo";
import { Button } from "@/components/ui";
import { Table } from "@/components/ui";
import { ExportButton } from "@/components/vin/ExportButton";
import { decodeVinsBatch } from "@/lib/api/carapi";
import { generateWebPageSchema } from "@/lib/seo/structured-data";
import { isValidVin } from "@/lib/utils/format";
import type { VinDecodeResponse } from "@/lib/api/types";
import type { TableColumn } from "@/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Batch VIN Decoder | Decode Multiple VINs at Once",
  description:
    "Decode up to 50 VINs simultaneously using our free batch VIN decoder. Perfect for bulk vehicle lookups, fleet management, and data processing.",
  alternates: {
    canonical: "/vin/batch",
  },
};

interface SearchParams {
  vins?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

interface BatchResult extends VinDecodeResponse {
  isValid: boolean;
  error?: string;
}

export default async function BatchVinDecoderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const vinsInput = params.vins || "";
  
  let results: BatchResult[] = [];
  let error: string | null = null;
  
  if (vinsInput) {
    // Parse VINs from input (one per line, comma-separated, or space-separated)
    const vins = vinsInput
      .split(/[\n,;]/)
      .map(v => v.trim())
      .filter(v => v.length > 0)
      .slice(0, 50); // Limit to 50 VINs
    
    if (vins.length === 0) {
      error = "Please enter at least one VIN number.";
    } else if (vins.length > 50) {
      error = "Maximum 50 VINs allowed per batch. Only the first 50 will be processed.";
    } else {
      // Validate all VINs first
      const invalidVins = vins.filter(vin => !isValidVin(vin));
      if (invalidVins.length > 0) {
        error = `Invalid VIN format: ${invalidVins.join(", ")}. VINs must be 17 characters.`;
      } else {
        // Decode all VINs
        const decoded = await decodeVinsBatch(vins);
        
        results = decoded.map((result, index) => ({
          ...result,
          isValid: !!result.specifications,
          error: result.specifications ? undefined : "Unable to decode this VIN",
        }));
      }
    }
  }
  
  // Generate structured data
  const webPageSchema = generateWebPageSchema({
    title: "Batch VIN Decoder | Decode Multiple VINs at Once",
    description: "Decode up to 50 VINs simultaneously using our free batch VIN decoder.",
    path: "/vin/batch",
  });
  
  // Table columns for results
  const columns: TableColumn<BatchResult>[] = [
    {
      key: "vin",
      header: "VIN",
      render: (result) => (
        <code className={styles.vinCode}>{result.vin}</code>
      ),
    },
    {
      key: "make",
      header: "Make",
      render: (result) => result.specifications?.make || "—",
    },
    {
      key: "model",
      header: "Model",
      render: (result) => result.specifications?.model || "—",
    },
    {
      key: "year",
      header: "Year",
      render: (result) => result.specifications?.year?.toString() || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (result) => (
        <span className={result.isValid ? styles.statusSuccess : styles.statusError}>
          {result.isValid ? "✓ Decoded" : "✗ Failed"}
        </span>
      ),
    },
    {
      key: "action",
      header: "",
      width: "100px",
      render: (result) => (
        result.isValid ? (
          <Link
            href={`/vin?vin=${result.vin}`}
            className={styles.viewLink}
          >
            View Details
          </Link>
        ) : null
      ),
    },
  ];
  
  return (
    <>
      <JsonLd data={webPageSchema} />
      
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Batch VIN Decoder</h1>
          <p className={styles.subtitle}>
            Decode up to 50 VINs simultaneously. Enter VINs one per line, or separated by commas or semicolons.
          </p>
        </div>
        
        {/* Input Form */}
        <div className={styles.formSection}>
          <form action="/vin/batch" method="GET" className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="vins" className={styles.label}>
                Vehicle Identification Numbers (VINs)
              </label>
              <textarea
                id="vins"
                name="vins"
                placeholder="Enter VINs here, one per line:&#10;1HGBH41JXMN109186&#10;5YJSA1E14HF123456&#10;1FTFW1ET5DFC12345"
                rows={10}
                className={styles.textarea}
                defaultValue={vinsInput}
                required
              />
              <span className={styles.hint}>
                Maximum 50 VINs. One per line, or separated by commas or semicolons.
              </span>
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Decode VINs →
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
        {results.length > 0 && (
          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>
                Decoded {results.filter(r => r.isValid).length} of {results.length} VINs
              </h2>
              {results.some(r => r.isValid) && (
                <ExportButton results={results} />
              )}
            </div>
            
            <Table
              columns={columns}
              data={results}
              keyExtractor={(result) => result.vin}
            />
          </div>
        )}
        
        {/* Info Section */}
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>About Batch VIN Decoding</h2>
          <p className={styles.infoText}>
            Our batch VIN decoder uses the free NHTSA VPIC API to decode up to 50 VINs at once. 
            This is perfect for fleet management, bulk vehicle lookups, and data processing tasks.
          </p>
          <ul className={styles.infoList}>
            <li>Free to use - no API key required</li>
            <li>Decode up to 50 VINs simultaneously</li>
            <li>Export results to CSV format</li>
            <li>Click "View Details" for comprehensive vehicle information</li>
            <li>Uses official NHTSA data for US and Canadian vehicles</li>
          </ul>
          <div className={styles.infoActions}>
            <Link href="/vin" className={styles.infoLink}>
              Single VIN Decoder →
            </Link>
            <Link href="/vin/guide" className={styles.infoLink}>
              Learn About VINs →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo";
import { Button } from "@/components/ui";
import { generateWebSiteSchema, generateWebPageSchema } from "@/lib/seo/structured-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Free VIN Decoder | Decode Any Vehicle VIN Number",
  description:
    "Free VIN decoder tool. Decode any 17-character VIN to get complete vehicle information including specifications, manufacturing details, safety features, market value, and more. No login required.",
  alternates: {
    canonical: "/",
  },
};

// Example VINs for showcase
const EXAMPLE_VINS = [
  { vin: "1HGBH41JXMN109186", description: "Honda Accord" },
  { vin: "5YJSA1E14HF123456", description: "Tesla Model S" },
  { vin: "1FTFW1ET5DFC12345", description: "Ford F-150" },
];

export default async function HomePage() {
  // Generate structured data
  const webSiteSchema = generateWebSiteSchema();
  const webPageSchema = generateWebPageSchema({
    title: "Free VIN Decoder | Decode Any Vehicle VIN Number",
    description: "Free VIN decoder tool. Decode any 17-character VIN to get complete vehicle information.",
    path: "/",
  });

  return (
    <>
      <JsonLd data={[webSiteSchema, webPageSchema]} />

      {/* Hero Section - VIN Decoder First */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Free VIN Decoder</h1>
          <p className={styles.subtitle}>
            Decode any Vehicle Identification Number (VIN) to unlock comprehensive vehicle information including specifications, manufacturing details, safety features, market value, and more.
          </p>

          {/* Primary VIN Search */}
          <div className={styles.vinHeroSection}>
            <form action="/vin" method="GET" className={styles.vinHeroForm}>
              <div className={styles.vinInputWrapper}>
                <label htmlFor="vin" className={styles.vinLabel}>
                  Enter VIN Number
                </label>
                <input
                  id="vin"
                  type="text"
                  name="vin"
                  placeholder="e.g., 1HGBH41JXMN109186"
                  maxLength={17}
                  className={styles.vinHeroInput}
                  autoFocus
                  required
                />
                <span className={styles.vinHint}>
                  17 characters, no I, O, or Q
                </span>
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth>
                Decode VIN →
              </Button>
            </form>
          </div>

          {/* What You Get Section */}
          <div className={styles.featuresSection}>
            <h2 className={styles.featuresTitle}>What You Get</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <strong>Vehicle Specifications</strong>
                <span>Engine, dimensions, fuel economy, and more</span>
              </div>
              <div className={styles.featureItem}>
                <strong>Manufacturing Details</strong>
                <span>Plant location, production date, and origin</span>
              </div>
              <div className={styles.featureItem}>
                <strong>Safety Features</strong>
                <span>Airbags, ABS, ESC, and safety equipment</span>
              </div>
              <div className={styles.featureItem}>
                <strong>Market Value</strong>
                <span>Current market valuation and price trends</span>
              </div>
              <div className={styles.featureItem}>
                <strong>Stolen Check</strong>
                <span>Verify if vehicle is reported stolen</span>
              </div>
              <div className={styles.featureItem}>
                <strong>Vehicle Photos</strong>
                <span>Official vehicle images when available</span>
              </div>
            </div>
          </div>

          {/* Example VINs */}
          <div className={styles.examplesSection}>
            <h2 className={styles.examplesTitle}>Try These Example VINs</h2>
            <div className={styles.examplesGrid}>
              {EXAMPLE_VINS.map((example) => (
                <Link
                  key={example.vin}
                  href={`/vin?vin=${example.vin}`}
                  className={styles.exampleLink}
                >
                  <code className={styles.exampleVin}>{example.vin}</code>
                  <span className={styles.exampleDesc}>{example.description}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className={styles.howItWorksSection}>
            <h2 className={styles.howItWorksTitle}>How It Works</h2>
            <div className={styles.stepsGrid}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <strong>Enter VIN</strong>
                <span>Type or paste your 17-character VIN number</span>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <strong>Decode</strong>
                <span>Our system analyzes and decodes your VIN</span>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <strong>Get Results</strong>
                <span>View complete vehicle information instantly</span>
              </div>
            </div>
          </div>

          {/* Secondary: Browse Option */}
          <div className={styles.browseSection}>
            <p className={styles.browseText}>
              Don't have a VIN? <Link href="/cars" className={styles.browseLink}>Browse vehicles by make and model</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Free VIN Decoding</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>Instant</span>
              <span className={styles.statLabel}>Real-Time Results</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>Complete</span>
              <span className={styles.statLabel}>Full Vehicle Data</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>Private</span>
              <span className={styles.statLabel}>No Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* About VIN Section */}
      <section className={styles.about}>
        <div className="container">
          <div className={styles.aboutContent}>
            <h2 className={styles.sectionTitle}>What is a VIN Number?</h2>
            <p className={styles.aboutText}>
              A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every motor vehicle. 
              It serves as the vehicle's fingerprint, containing information about its manufacturer, specifications, 
              and production details.
            </p>
            <p className={styles.aboutText}>
              Our free VIN decoder provides instant access to comprehensive vehicle information including engine specs, 
              dimensions, fuel economy, manufacturing details, safety features, market value, and more. 
              No account required, no tracking, no cookies — just reliable vehicle data.
            </p>
            <div className={styles.aboutLinks}>
              <Link href="/vin/guide" className={styles.aboutLink}>
                Learn How to Read a VIN →
              </Link>
              <Link href="/about" className={styles.aboutLink}>
                About Our Data →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo";
import { generateWebPageSchema, generateFaqSchema } from "@/lib/seo/structured-data";
import { config } from "@/lib/config";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How to Read a VIN Number | VIN Decoder Guide",
  description:
    "Complete guide to understanding Vehicle Identification Numbers (VIN). Learn how to decode a VIN, what each character means, and how to use our free VIN decoder tool.",
  alternates: {
    canonical: "/vin/guide",
  },
};

export default function VinGuidePage() {
  const webPageSchema = generateWebPageSchema({
    title: "How to Read a VIN Number | VIN Decoder Guide",
    description: "Complete guide to understanding Vehicle Identification Numbers (VIN).",
    path: "/vin/guide",
  });

  const faqSchema = generateFaqSchema([
    {
      question: "What is a VIN number?",
      answer:
        "A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every motor vehicle when it is manufactured. It serves as the vehicle's fingerprint, containing information about its manufacturer, specifications, and production details.",
    },
    {
      question: "Where can I find my VIN?",
      answer:
        "You can find your VIN in several places: on the driver's side dashboard (visible through the windshield), on the driver's side door jamb, on vehicle registration documents, insurance cards, and title documents.",
    },
    {
      question: "What do the 17 characters in a VIN mean?",
      answer:
        "The 17 characters are divided into sections: Characters 1-3 identify the manufacturer (WMI), Characters 4-8 describe vehicle attributes (VDS), Character 9 is a check digit, Character 10 indicates the model year, Character 11 is the plant code, and Characters 12-17 are the sequential production number.",
    },
    {
      question: "Can I decode a VIN for free?",
      answer:
        "Yes! Our free VIN decoder provides comprehensive vehicle information including specifications, manufacturing details, safety features, market value, and more. No account required.",
    },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, faqSchema]} />

      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>How to Read a VIN Number</h1>
          <p className={styles.subtitle}>
            Complete guide to understanding Vehicle Identification Numbers and how to decode them
          </p>
        </div>

        {/* What is a VIN */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What is a VIN Number?</h2>
          <p className={styles.text}>
            A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every motor vehicle 
            when it is manufactured. The VIN serves as the vehicle's fingerprint, providing detailed information 
            about its origin, specifications, and history.
          </p>
          <p className={styles.text}>
            Since 1981, all vehicles manufactured for sale in the United States have been required to have a 
            standardized 17-character VIN. This standardization makes it possible to decode VINs and extract 
            valuable information about any vehicle.
          </p>
        </section>

        {/* Where to Find VIN */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Where Can I Find My VIN?</h2>
          <p className={styles.text}>
            You can find your Vehicle Identification Number in several locations:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Driver's Side Dashboard:</strong> Look through the windshield on the driver's side, 
              at the bottom of the dashboard where it meets the windshield.
            </li>
            <li>
              <strong>Driver's Side Door Jamb:</strong> Open the driver's side door and look on the door frame 
              where the door latches.
            </li>
            <li>
              <strong>Vehicle Registration:</strong> Your VIN is listed on your vehicle registration document.
            </li>
            <li>
              <strong>Insurance Card:</strong> Most insurance cards include the VIN.
            </li>
            <li>
              <strong>Title Document:</strong> The VIN is prominently displayed on the vehicle title.
            </li>
            <li>
              <strong>Under the Hood:</strong> Some vehicles have the VIN stamped on the engine block or firewall.
            </li>
          </ul>
        </section>

        {/* VIN Structure */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>VIN Structure Breakdown</h2>
          <p className={styles.text}>
            The 17-character VIN is divided into specific sections, each providing different information:
          </p>

          <div className={styles.vinBreakdown}>
            <div className={styles.vinExample}>
              <div className={styles.vinChars}>
                {Array.from({ length: 17 }, (_, i) => (
                  <span key={i} className={styles.vinChar}>
                    {i < 3 ? 'W' : i < 8 ? 'D' : i === 8 ? 'C' : i === 9 ? 'Y' : i === 10 ? 'P' : 'S'}
                  </span>
                ))}
              </div>
              <div className={styles.vinLabels}>
                <span className={styles.vinLabel} style={{ width: '17.65%' }}>WMI</span>
                <span className={styles.vinLabel} style={{ width: '29.41%' }}>VDS</span>
                <span className={styles.vinLabel} style={{ width: '5.88%' }}>C</span>
                <span className={styles.vinLabel} style={{ width: '5.88%' }}>Y</span>
                <span className={styles.vinLabel} style={{ width: '5.88%' }}>P</span>
                <span className={styles.vinLabel} style={{ width: '35.29%' }}>VIS</span>
              </div>
            </div>
          </div>

          <div className={styles.vinParts}>
            <div className={styles.vinPart}>
              <div className={styles.vinPartHeader}>
                <span className={styles.vinPartNumber}>1-3</span>
                <strong>World Manufacturer Identifier (WMI)</strong>
              </div>
              <p className={styles.vinPartDesc}>
                Identifies the manufacturer and country of origin. The first character indicates the country, 
                and the next two identify the manufacturer.
              </p>
              <div className={styles.vinPartExamples}>
                <div className={styles.example}>
                  <code>1HG</code> - Honda (USA)
                </div>
                <div className={styles.example}>
                  <code>5YJ</code> - Tesla (USA)
                </div>
                <div className={styles.example}>
                  <code>WBA</code> - BMW (Germany)
                </div>
              </div>
            </div>

            <div className={styles.vinPart}>
              <div className={styles.vinPartHeader}>
                <span className={styles.vinPartNumber}>4-8</span>
                <strong>Vehicle Descriptor Section (VDS)</strong>
              </div>
              <p className={styles.vinPartDesc}>
                Describes vehicle attributes such as model, body style, engine type, transmission, and restraint system.
              </p>
            </div>

            <div className={styles.vinPart}>
              <div className={styles.vinPartHeader}>
                <span className={styles.vinPartNumber}>9</span>
                <strong>Check Digit</strong>
              </div>
              <p className={styles.vinPartDesc}>
                A mathematical validation code used to verify the VIN's authenticity. This character ensures 
                the VIN is valid and hasn't been tampered with.
              </p>
            </div>

            <div className={styles.vinPart}>
              <div className={styles.vinPartHeader}>
                <span className={styles.vinPartNumber}>10</span>
                <strong>Model Year</strong>
              </div>
              <p className={styles.vinPartDesc}>
                Indicates the vehicle's model year. Uses a specific code that cycles every 30 years.
              </p>
              <div className={styles.vinPartExamples}>
                <div className={styles.example}>
                  <code>A</code> = 1980, 2010
                </div>
                <div className={styles.example}>
                  <code>B</code> = 1981, 2011
                </div>
                <div className={styles.example}>
                  <code>...</code>
                </div>
                <div className={styles.example}>
                  <code>H</code> = 1987, 2017
                </div>
              </div>
            </div>

            <div className={styles.vinPart}>
              <div className={styles.vinPartHeader}>
                <span className={styles.vinPartNumber}>11</span>
                <strong>Plant Code</strong>
              </div>
              <p className={styles.vinPartDesc}>
                Identifies the manufacturing plant where the vehicle was assembled.
              </p>
            </div>

            <div className={styles.vinPart}>
              <div className={styles.vinPartHeader}>
                <span className={styles.vinPartNumber}>12-17</span>
                <strong>Vehicle Identifier Section (VIS)</strong>
              </div>
              <p className={styles.vinPartDesc}>
                The sequential production number assigned by the manufacturer. This is the unique serial number 
                for that specific vehicle.
              </p>
            </div>
          </div>
        </section>

        {/* VIN Characters */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Valid VIN Characters</h2>
          <p className={styles.text}>
            VINs can only contain the following characters:
          </p>
          <div className={styles.charactersBox}>
            <div className={styles.charactersSection}>
              <strong>Numbers:</strong> 0-9
            </div>
            <div className={styles.charactersSection}>
              <strong>Letters:</strong> A-H, J-N, P-R, T-Z (excluding I, O, Q)
            </div>
            <p className={styles.charactersNote}>
              The letters I, O, and Q are excluded to avoid confusion with the numbers 1 and 0.
            </p>
          </div>
        </section>

        {/* How to Use */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How to Use Our VIN Decoder</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <strong>Enter Your VIN</strong>
                <p>Type or paste your 17-character VIN into the decoder tool</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <strong>Click Decode</strong>
                <p>Our system will analyze and decode your VIN instantly</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <strong>View Results</strong>
                <p>Get comprehensive vehicle information including specs, manufacturing details, safety features, market value, and more</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Decode Your VIN?</h2>
          <p className={styles.ctaText}>
            Use our free VIN decoder to get complete vehicle information instantly.
          </p>
          <Link href="/vin" className={styles.ctaButton}>
            Decode VIN Now →
          </Link>
        </section>
      </div>
    </>
  );
}

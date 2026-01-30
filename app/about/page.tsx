import type { Metadata } from "next";
import { JsonLd } from "@/components/seo";
import { generateWebPageSchema, generateFaqSchema } from "@/lib/seo/structured-data";
import { getAboutMeta } from "@/lib/seo/meta";
import { API_ENDPOINTS, DATA_POINTS } from "@/lib/utils/constants";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: getAboutMeta().title,
  description: getAboutMeta().description,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: getAboutMeta().ogTitle,
    description: getAboutMeta().ogDescription,
    type: "website",
  },
};

export default function AboutPage() {
  // Generate structured data
  const webPageSchema = generateWebPageSchema({
    title: getAboutMeta().title,
    description: getAboutMeta().description,
    path: "/about",
  });

  const faqSchema = generateFaqSchema([
    {
      question: "Is this service really free?",
      answer:
        "Yes, Vehicle Database is completely free to use. No accounts, no subscriptions, no hidden fees. We believe vehicle information should be accessible to everyone.",
    },
    {
      question: "Where does the data come from?",
      answer:
        "All vehicle data is sourced from CarAPI.dev, a comprehensive automotive data API. We fetch specifications directly from their database to ensure accuracy.",
    },
    {
      question: "Do you track users or store personal data?",
      answer:
        "No. We don't use cookies, don't track users, and don't store any personal information. Your searches are completely private.",
    },
    {
      question: "How often is the data updated?",
      answer:
        "Vehicle data is cached for performance but refreshed regularly. New model year data is typically available as soon as manufacturers release specifications.",
    },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, faqSchema]} />

      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>About Vehicle Database</h1>
          <p className={styles.subtitle}>
            Free, fast, and accessible vehicle specifications for everyone
          </p>
        </div>

        {/* Mission */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.text}>
            Vehicle Database was created with a simple goal: make vehicle
            specifications freely accessible to everyone. Whether you're
            researching your next car purchase, comparing specifications, or
            just curious about vehicle data, we believe this information should
            be available without barriers.
          </p>
          <p className={styles.text}>
            No login required. No paywalls. No tracking. Just reliable vehicle
            data when you need it.
          </p>
        </section>

        {/* Data Coverage */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Coverage</h2>
          <p className={styles.text}>
            Our database includes comprehensive specifications for vehicles from
            major manufacturers, including:
          </p>
          <ul className={styles.dataList}>
            {DATA_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        {/* API Endpoints */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Available Endpoints</h2>
          <p className={styles.text}>
            We utilize the following CarAPI.dev endpoints to provide
            comprehensive vehicle data:
          </p>
          <div className={styles.endpoints}>
            {API_ENDPOINTS.map((endpoint) => (
              <div key={endpoint.name} className={styles.endpoint}>
                <h3 className={styles.endpointName}>{endpoint.name}</h3>
                <code className={styles.endpointPath}>{endpoint.endpoint}</code>
                <p className={styles.endpointDescription}>
                  {endpoint.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Privacy & Data</h2>
          <p className={styles.text}>
            We take privacy seriously. Vehicle Database operates with the
            following principles:
          </p>
          <ul className={styles.privacyList}>
            <li>
              <strong>No Cookies:</strong> We don't use cookies or similar
              tracking technologies.
            </li>
            <li>
              <strong>No Accounts:</strong> No user registration or login
              required.
            </li>
            <li>
              <strong>No Tracking:</strong> We don't track your searches or
              browsing behavior.
            </li>
            <li>
              <strong>No Data Storage:</strong> We don't store personal
              information about visitors.
            </li>
            <li>
              <strong>Server-Side Rendering:</strong> All data fetching happens
              on our servers, not your browser.
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faq}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Is this service really free?</h3>
              <p className={styles.faqAnswer}>
                Yes, Vehicle Database is completely free to use. No accounts, no
                subscriptions, no hidden fees. We believe vehicle information
                should be accessible to everyone.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Where does the data come from?</h3>
              <p className={styles.faqAnswer}>
                All vehicle data is sourced from{" "}
                <a
                  href="https://carapi.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CarAPI.dev
                </a>
                , a comprehensive automotive data API. We fetch specifications
                directly from their database to ensure accuracy.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Do you track users or store personal data?
              </h3>
              <p className={styles.faqAnswer}>
                No. We don't use cookies, don't track users, and
                don't store any personal information. Your searches are
                completely private.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                How often is the data updated?
              </h3>
              <p className={styles.faqAnswer}>
                Vehicle data is cached for performance but refreshed regularly.
                New model year data is typically available as soon as
                manufacturers release specifications.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Source</h2>
          <p className={styles.text}>
            Vehicle data provided by{" "}
            <a
              href="https://carapi.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              CarAPI.dev
            </a>
            . Visit their website for more information about their automotive
            data API.
          </p>
        </section>
      </div>
    </>
  );
}

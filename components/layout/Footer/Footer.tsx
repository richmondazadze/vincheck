/**
 * Footer Component
 * Site footer
 */

import Link from 'next/link';
import { config } from '@/lib/config';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>{config.site.name}</h3>
            <p className={styles.description}>
              Free vehicle specifications database. Search by year, make, model, or VIN.
              No login required. No tracking. Completely free.
            </p>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Quick Links</h4>
            <ul className={styles.links}>
              <li>
                <Link href="/cars">Browse Vehicles</Link>
              </li>
              <li>
                <Link href="/vin">VIN Decoder</Link>
              </li>
              <li>
                <Link href="/compare">Compare</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Data Source</h4>
            <p className={styles.description}>
              Vehicle data provided by{' '}
              <a 
                href="https://carapi.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                CarAPI.dev
              </a>
            </p>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} {config.site.name}. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            Data provided for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

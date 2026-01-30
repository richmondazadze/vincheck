'use client';

import { isValidVin } from '@/lib/utils/format';
import styles from './VinBreakdown.module.css';

interface VinBreakdownProps {
  vin: string;
}

export function VinBreakdown({ vin }: VinBreakdownProps) {
  if (!vin || !isValidVin(vin)) {
    return null;
  }

  const vinUpper = vin.toUpperCase();
  const chars = vinUpper.split('');

  const getCharInfo = (index: number) => {
    const char = chars[index];
    switch (index) {
      case 0:
      case 1:
      case 2:
        return { label: 'WMI', description: 'World Manufacturer Identifier' };
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return { label: 'VDS', description: 'Vehicle Descriptor Section' };
      case 8:
        return { label: 'Check', description: 'Check Digit' };
      case 9:
        return { label: 'Year', description: 'Model Year' };
      case 10:
        return { label: 'Plant', description: 'Plant Code' };
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
        return { label: 'VIS', description: 'Vehicle Identifier Section' };
      default:
        return { label: '', description: '' };
    }
  };

  return (
    <div className={styles.breakdown}>
      <h3 className={styles.title}>VIN Breakdown</h3>
      <div className={styles.vinDisplay}>
        {chars.map((char, index) => {
          const info = getCharInfo(index);
          return (
            <div key={index} className={styles.charGroup}>
              <div className={styles.charBox}>
                <span className={styles.char}>{char}</span>
                <span className={styles.charIndex}>{index + 1}</span>
              </div>
              {index === 0 || index === 3 || index === 8 || index === 9 || index === 10 || index === 11 ? (
                <div className={styles.charLabel}>
                  <strong>{info.label}</strong>
                  <span>{info.description}</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#2563eb' }}></span>
          <span>WMI (1-3): Manufacturer & Country</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#16a34a' }}></span>
          <span>VDS (4-8): Vehicle Attributes</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#dc2626' }}></span>
          <span>Check (9): Validation Digit</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#f59e0b' }}></span>
          <span>Year (10): Model Year</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#8b5cf6' }}></span>
          <span>Plant (11): Manufacturing Plant</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#64748b' }}></span>
          <span>VIS (12-17): Serial Number</span>
        </div>
      </div>
    </div>
  );
}

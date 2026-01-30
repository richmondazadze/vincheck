'use client';

import styles from './PrintButton.module.css';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={styles.actionButton}
      type="button"
    >
      Print Report
    </button>
  );
}

/**
 * Table Component
 * Ultra-minimal data table
 */

import React from 'react';
import type { TableColumn } from '@/types';
import styles from './Table.module.css';

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
  caption?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  caption,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={styles.th}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)} className={styles.tr}>
              {columns.map((column) => (
                <td key={`${keyExtractor(row)}-${String(column.key)}`} className={styles.td}>
                  {column.render
                    ? column.render(row)
                    : String((row as Record<string, unknown>)[column.key as string] ?? 'N/A')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

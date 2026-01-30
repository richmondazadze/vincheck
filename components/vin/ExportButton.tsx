'use client';

import { Button } from '@/components/ui';
import type { VinDecodeResponse } from '@/lib/api/types';

interface ExportButtonProps {
  results: Array<VinDecodeResponse & { isValid: boolean }>;
}

export function ExportButton({ results }: ExportButtonProps) {
  const handleExport = () => {
    const csv = [
      ['VIN', 'Make', 'Model', 'Year', 'Trim', 'Status'].join(','),
      ...results.map(r => [
        r.vin,
        r.specifications?.make || '',
        r.specifications?.model || '',
        r.specifications?.year?.toString() || '',
        r.specifications?.trim || '',
        r.isValid ? 'Decoded' : 'Failed',
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vin-batch-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleExport}
      variant="secondary"
      size="md"
      type="button"
    >
      Export to CSV
    </Button>
  );
}

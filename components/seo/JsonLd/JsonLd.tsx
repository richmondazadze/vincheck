/**
 * JSON-LD Component
 * Renders structured data script tags
 */

import type { JsonLdData } from '@/types';

interface JsonLdProps {
  data: JsonLdData | JsonLdData[];
}

export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

export default JsonLd;

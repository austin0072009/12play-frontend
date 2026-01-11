import { useEffect } from 'react';
import { setSEOMetadata, setStructuredData, removeStructuredData, pageMetadata, SEOMetadata } from '../utils/seo';

/**
 * Hook to manage SEO metadata for a page
 * @param metadata - SEO metadata object
 * @param structuredDataId - Optional ID for structured data
 * @param structuredData - Optional structured data object
 */
export function useSEO(
  metadata: SEOMetadata,
  structuredData?: any,
  structuredDataId?: string
) {
  useEffect(() => {
    // Set page metadata
    setSEOMetadata(metadata);

    // Set structured data if provided
    let scriptId: string | undefined;
    if (structuredData) {
      scriptId = structuredDataId || `structured-data-${Date.now()}`;
      setStructuredData(structuredData, scriptId);
    }

    // Cleanup
    return () => {
      if (scriptId) {
        removeStructuredData(scriptId);
      }
    };
  }, [metadata, structuredData, structuredDataId]);
}

/**
 * Hook to use pre-defined page metadata
 * @param pageKey - Key from pageMetadata object
 */
export function usePageSEO(pageKey: keyof typeof pageMetadata, structuredData?: any) {
  useSEO(pageMetadata[pageKey], structuredData, `${pageKey}-structured-data`);
}

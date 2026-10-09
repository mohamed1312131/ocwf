import { useEffect } from 'react';

interface DocumentMeta {
  title?: string;
  description?: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Sets the document title and description for the current route.
 * Kept dependency-free and SSR-safe (no-op when `document` is unavailable).
 */
export function useDocumentMeta({ title, description }: DocumentMeta) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (title) document.title = title;
    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
      upsertMeta('name', 'twitter:description', description);
    }
    if (title) {
      upsertMeta('property', 'og:title', title);
      upsertMeta('name', 'twitter:title', title);
    }
  }, [title, description]);
}

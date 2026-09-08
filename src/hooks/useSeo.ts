import { useEffect } from 'react'
import { site } from '@/data/site'

interface SeoOptions {
  /** Page title, without the site suffix. */
  title: string
  description?: string
  /** Path only, e.g. '/work/atlas-freight-os'. */
  path?: string
  type?: 'website' | 'article'
  publishedTime?: string
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}
 
/**
 * Per-route metadata. This is a client-rendered site, so these tags are for
 * the browser, bookmarks and crawlers that execute JavaScript; the static tags
 * in `index.html` remain the fallback for those that do not.
 */
export function useSeo({ title, description, path, type = 'website', publishedTime }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title.includes(site.name) ? title : `${title} — ${site.name}`
    document.title = fullTitle

    const desc = description ?? site.tagline
    const url = `${site.url}${path ?? window.location.pathname}`

    setMeta('meta[name="description"]', 'name', 'description', desc)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)

    if (publishedTime) {
      setMeta('meta[property="article:published_time"]', 'property', 'article:published_time', publishedTime)
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path, type, publishedTime])
}

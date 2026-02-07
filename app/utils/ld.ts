import type { ContentArticle } from '@/app/types/content'
import type { ProductEntry } from '@/app/data/products'
import { brand } from '@/app/data/brand'
import { companyInfo } from '@/app/data/team'

export const organizationLd = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.organizationName,
    legalName: brand.legalName,
    url: brand.siteUrl,
    telephone: brand.tel,
    address: {
      '@type': 'PostalAddress',
      addressCountry: brand.address.country,
      postalCode: brand.address.postalCode,
      addressRegion: brand.address.region,
      addressLocality: brand.address.locality,
      streetAddress: brand.address.streetAddress
    },
    alternateName: brand.brandAliases
  }
}

export const articleLd = (doc: ContentArticle, url: string) => {
  const published = doc.publishedAt || undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: doc.title,
    description: doc.description || '',
    datePublished: published,
    dateModified: published,
    url,
    mainEntityOfPage: url,
    author: {
      '@type': 'Organization',
      name: brand.organizationName
    },
    publisher: {
      '@type': 'Organization',
      name: brand.organizationName
    }
  }
}

export const productLd = (product: ProductEntry, url: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.blurb || product.subtitle || '',
    sku: product.slug,
    url,
    brand: {
      '@type': 'Organization',
      name: brand.organizationName
    },
    offers: product.primaryOffer
      ? {
          '@type': 'Offer',
          url,
          priceCurrency: 'JPY',
          availability: 'https://schema.org/InStock',
          name: product.primaryOffer.label,
          description: product.primaryOffer.description || ''
        }
      : undefined
  }
}

export const faqLdFromArticle = (doc: ContentArticle, url: string) => {
  if (!doc.faq || !doc.faq.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: doc.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    })),
    mainEntityOfPage: url
  }
}

export const faqLdFromProduct = (product: ProductEntry, url: string) => {
  if (!product.faq || !product.faq.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    })),
    mainEntityOfPage: url
  }
}

/**
 * パンくずリスト JSON-LD
 * @param items パンくず項目の配列 [{ name, path }]
 * @param siteUrl サイトURL
 */
export const breadcrumbLd = (
  items: Array<{ name: string; path: string }>,
  siteUrl: string = 'https://iyasaka.co.jp'
) => {
  const baseURL = '/iyasaka'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${baseURL}${item.path}`
    }))
  }
}

/**
 * LocalBusiness JSON-LD
 * 会社概要ページ用
 */
export const localBusinessLd = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${brand.siteUrl}/#organization`,
    name: companyInfo.name,
    alternateName: brand.brandAliases,
    description: 'IYASAKAは、中小企業のDX支援を専門とする会社です。弱電×AI×ホテルDXを横断し、予防保全で"止まる前"に手を打つ統括パートナーです。',
    url: brand.siteUrl,
    telephone: brand.tel,
    foundingDate: '2006-04-26',
    founder: {
      '@type': 'Person',
      name: companyInfo.representative
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: brand.address.country,
      postalCode: brand.address.postalCode,
      addressRegion: brand.address.region,
      addressLocality: brand.address.locality,
      streetAddress: brand.address.streetAddress
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.9756,
      longitude: 139.7526
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    sameAs: [],
    priceRange: '$$'
  }
}


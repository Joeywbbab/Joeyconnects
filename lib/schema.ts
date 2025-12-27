import { type Person, type WebSite, type Article, type SoftwareApplication, type ProfilePage, type WithContext } from 'schema-dts';

const BASE_URL = 'https://joeyconnects.world';

export function generatePersonSchema(): WithContext<Person> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Joey',
    url: BASE_URL,
    image: `${BASE_URL}/images/joey-photo.jpg`,
    jobTitle: 'Product Architect',
    worksFor: {
      '@type': 'Organization',
      name: 'Manus',
    },
    knowsAbout: [
      'Generative Engine Optimization',
      'Answer Engine Optimization',
      'AI Search Optimization',
      'Product Development',
      'AI Applications',
    ],
    sameAs: [
      'https://twitter.com/joey',
      'https://linkedin.com/in/joey',
      'https://github.com/joey',
    ],
  };
}

export function generateWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Joey Connects',
    description: "Joey's personal website - I find problems, I build solutions.",
    publisher: {
      '@id': `${BASE_URL}/#person`,
    },
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  date: string;
  modifiedDate?: string;
  image?: string;
  slug: string;
}): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${BASE_URL}/og-image.png`,
    datePublished: article.date,
    dateModified: article.modifiedDate || article.date,
    author: {
      '@id': `${BASE_URL}/#person`,
    },
    publisher: {
      '@id': `${BASE_URL}/#person`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/writing/${article.slug}`,
    },
  };
}

export function generateSoftwareApplicationSchema(app: {
  name: string;
  description: string;
  price?: number;
  applicationCategory?: string;
}): WithContext<SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description,
    applicationCategory: app.applicationCategory || 'ProductivityApplication',
    author: {
      '@id': `${BASE_URL}/#person`,
    },
    offers: {
      '@type': 'Offer',
      price: app.price || 0,
      priceCurrency: 'USD',
    },
  };
}

export function generateProfilePageSchema(): WithContext<ProfilePage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
      name: 'Joey',
      description: 'Problem-solving architect who builds products and writes about ideas.',
      image: `${BASE_URL}/images/joey-photo.jpg`,
      jobTitle: 'Product Architect',
      worksFor: {
        '@type': 'Organization',
        name: 'Manus',
      },
      knowsAbout: [
        'Generative Engine Optimization',
        'Answer Engine Optimization',
        'Product Development',
        'AI Applications',
        'Data Analysis',
      ],
      sameAs: [
        'https://twitter.com/joey',
        'https://linkedin.com/in/joey',
        'https://github.com/joey',
      ],
    },
  };
}

export function renderSchema(schema: WithContext<any>) {
  return {
    __html: JSON.stringify(schema),
  };
}

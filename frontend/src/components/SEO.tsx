import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  datePublished?: string;
}

export const SEO = ({
  title = "Ta'anga - AI Image Generator | Create Unique AI Art",
  description = "Create stunning AI-generated artwork with Ta'anga. Transform your ideas into beautiful images using advanced AI technology.",
  keywords = "AI art, image generator, artificial intelligence art, AI artwork, text to image, creative AI, digital art, Ta'anga",
  canonicalUrl = window.location.href,
  imageUrl = '/og-image.jpg',
  type = 'website',
  author,
  datePublished
}: SEOProps) => {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || '';
  const fullCanonicalUrl = canonicalUrl.startsWith('http')
    ? canonicalUrl
    : `${baseUrl}${canonicalUrl}`;
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${baseUrl}${imageUrl}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type':
      type === 'website'
        ? 'WebSite'
        : type === 'article'
          ? 'Article'
          : 'WebPage',
    name: title,
    description,
    url: fullCanonicalUrl,
    image: fullImageUrl,
    ...(author && {
      author: {
        '@type': 'Person',
        name: author
      }
    }),
    ...(datePublished && {
      datePublished,
      dateModified: new Date().toISOString()
    }),
    publisher: {
      '@type': 'Organization',
      name: "Ta'anga",
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      {author && <meta name="author" content={author} />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Dynamic JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

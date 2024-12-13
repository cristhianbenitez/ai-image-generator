import prisma from '../lib/prisma';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:5173';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

// Static routes that don't change
const staticRoutes: SitemapUrl[] = [
  {
    loc: '/',
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    loc: '/generate',
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    loc: '/explore',
    changefreq: 'hourly',
    priority: '0.8'
  },
  {
    loc: '/collections',
    changefreq: 'daily',
    priority: '0.7'
  }
];

async function getLatestContent() {
  try {
    // Get latest images
    const images = await prisma.generatedImage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000, // Limit to last 1000 images
      select: {
        id: true,
        createdAt: true,
        userId: true
      }
    });

    // Get collections
    const collections = await prisma.collection.findMany({
      take: 100, // Limit to last 100 collections
      select: {
        id: true,
        userId: true
      }
    });

    return { images, collections };
  } catch (error) {
    console.error('Error fetching content:', error);
    return { images: [], collections: [] };
  }
}

function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlElements = urls
    .map(({ loc, lastmod, changefreq, priority }) => {
      return `
    <url>
      <loc>${BASE_URL}${loc}</loc>
      ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
      ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
      ${priority ? `<priority>${priority}</priority>` : ''}
    </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlElements}
</urlset>`;
}

async function updateSitemap() {
  try {
    const { images, collections } = await getLatestContent();

    // Generate dynamic routes for images
    const imageUrls: SitemapUrl[] = images.map((image) => ({
      loc: `/image/${image.id}`,
      lastmod: image.createdAt.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.6'
    }));

    // Generate dynamic routes for user profiles
    const userIds = new Set([
      ...images.map((img) => img.userId),
      ...collections.map((col) => col.userId)
    ]);

    const userUrls: SitemapUrl[] = Array.from(userIds).map((userId) => ({
      loc: `/profile/${userId}`,
      changefreq: 'weekly',
      priority: '0.5'
    }));

    // Combine all routes
    const allUrls = [...staticRoutes, ...imageUrls, ...userUrls];

    // Generate sitemap XML
    const sitemapXML = generateSitemapXML(allUrls);

    // Write to file
    const sitemapPath = path.join(process.cwd(), '..', 'frontend', 'public', 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemapXML, 'utf-8');

    console.log('Sitemap updated successfully!');
    console.log(`Total URLs: ${allUrls.length}`);
    console.log(`- Static routes: ${staticRoutes.length}`);
    console.log(`- Image pages: ${imageUrls.length}`);
    console.log(`- User profiles: ${userUrls.length}`);
  } catch (error) {
    console.error('Error updating sitemap:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateSitemap();

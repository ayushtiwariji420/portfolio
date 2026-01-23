const { Pool } = require('pg');
require('dotenv').config();

async function updateProjectImages() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Updating project images to internet URLs...');

    const imageUpdates = [
      {
        title: 'End-to-End Guard Service Automation using Zoho CRM & Zoho Books',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
      },
      {
        title: 'RAG-Based Quotation PDF Generator',
        image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop'
      },
      {
        title: 'Remote Photoplethysmography (rPPG) Pipeline',
        image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop'
      },
      {
        title: 'Bzail Site Selection Tool',
        image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'
      },
      {
        title: 'Peerbie AI Platform Integration',
        image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop'
      },
      {
        title: 'POS AUTOMATION',
        image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop'
      },
      {
        title: 'ChatPDF Powered by Azure - Automation',
        image_url: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=600&h=400&fit=crop'
      },
      {
        title: 'SRS Agent: AI-Powered Medical Documentation',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop'
      },
      {
        title: 'FinChat: AI-Powered Assistant',
        image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop'
      }
    ];

    let updatedCount = 0;

    for (const update of imageUpdates) {
      const updateQuery = `
        UPDATE projects
        SET
          image_url = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE title = $2
      `;

      const result = await client.query(updateQuery, [update.image_url, update.title]);

      if (result.rowCount > 0) {
        updatedCount++;
        console.log(`✅ Updated: ${update.title}`);
      } else {
        console.log(`❌ Not found: ${update.title}`);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} project images!`);

    await client.release();
  } catch (error) {
    console.error('Error updating project images:', error);
  } finally {
    await pool.end();
  }
}

updateProjectImages();
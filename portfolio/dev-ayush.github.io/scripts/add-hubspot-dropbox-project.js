const { Pool } = require('pg');
require('dotenv').config();

async function addHubSpotDropboxProject() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Adding HubSpot Dropbox Integration project...');

    const insertQuery = `
      INSERT INTO projects (
        id, title, description, long_description, technologies,
        image_url, live_url, github_url, featured, category,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    const projectData = {
      id: 'hubspot-dropbox-integration-' + Date.now(),
      title: 'HubSpot Dropbox Integration',
      description: 'A comprehensive integration solution that connects HubSpot CRM with Dropbox, enabling seamless file synchronization, automated document management, and enhanced collaboration workflows.',
      long_description: `I developed a robust integration platform that bridges HubSpot CRM and Dropbox, creating a unified ecosystem for document management and customer relationship workflows.

Key Features Implemented:
- Real-time file synchronization between HubSpot deals/contacts and Dropbox folders
- Automated document generation and storage based on HubSpot triggers
- Custom workflow automation for document approval processes
- Advanced permission management and access controls
- Comprehensive API integration with both platforms
- Real-time notifications and status updates

Technical Implementation:
The solution leverages HubSpot's Operations Hub and Dropbox Business API to create bidirectional data flows. Custom webhooks handle real-time synchronization, while background processing ensures reliable file transfers. The system includes comprehensive error handling, retry mechanisms, and detailed logging for enterprise-grade reliability.

Business Impact:
This integration reduced manual document handling time by 80%, improved team collaboration efficiency, and provided a seamless experience for sales and marketing teams working with customer documents.`,
      technologies: ['Node.js', 'HubSpot API', 'Dropbox API', 'Express.js', 'PostgreSQL', 'Redis', 'Webhooks'],
      image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
      live_url: '',
      github_url: '',
      featured: true,
      category: 'web'
    };

    const values = [
      projectData.id,
      projectData.title,
      projectData.description,
      projectData.long_description,
      JSON.stringify(projectData.technologies),
      projectData.image_url,
      projectData.live_url,
      projectData.github_url,
      projectData.featured,
      projectData.category
    ];

    const result = await client.query(insertQuery, values);

    if (result.rowCount > 0) {
      console.log('✅ HubSpot Dropbox Integration project added successfully!');
      console.log(`Added project: ${projectData.title}`);
    } else {
      console.log('❌ Failed to add project');
    }

    await client.release();
  } catch (error) {
    console.error('Error adding HubSpot Dropbox project:', error);
  } finally {
    await pool.end();
  }
}

addHubSpotDropboxProject();
const { Pool } = require('pg');
require('dotenv').config();

async function addNewProjects() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Adding new projects to database...');

    const newProjects = [
      {
        id: 'peerbie-ai-platform-' + Date.now(),
        title: 'Peerbie AI Platform Integration',
        description: 'I implemented end-to-end AI integration on the Peerbie AI platform using Python and third-party AI APIs. The goal was to enhance task management, workflow automation, and collaboration features by embedding AI-driven intelligence directly into the platform.',
        long_description: `I implemented end-to-end AI integration on the Peerbie AI platform using Python and third-party AI APIs. The goal was to enhance task management, workflow automation, and collaboration features by embedding AI-driven intelligence directly into the platform.

Key Features & Implementations:
I developed an AI Copilot to assist users with queries, updates, and routine interactions. Workflow automation with smart triggers enabled auto-assignments, real-time updates, and SLA rules. Autofill and content generation reduced manual effort by automatically creating descriptions, summaries, and notes. I also integrated advanced NLP and summarization capabilities from APIs like OpenAI and Hugging Face. On the backend, I built Python modules for request handling, asynchronous processing, and error management, while the interface supported prompts, feedback capture, and correction workflows.

Challenges & Solutions:
Managing multiple APIs with different schemas and limits required normalization and orchestration. To ensure performance, I used caching, batching, and horizontal scaling. Validation layers and fallback logic addressed errors and unreliable outputs, while sensitive data was anonymized and protected with strict security controls. For user adoption, manual overrides and a predictable assistant experience were prioritized. I also set up continuous monitoring and feedback loops to address model drift and handled edge cases like ambiguous or multilingual queries with clarifying prompts.

Impact & Benefits:
The integration reduced repetitive work, automated task assignments, and improved reporting consistency. It boosted productivity by freeing teams to focus on higher-value tasks and delivered an improved user experience with instant, reliable AI-powered responses.`,
        technologies: ['Python', 'AI APIs', 'OpenAI', 'Hugging Face', 'NLP', 'FastAPI', 'Asynchronous Processing'],
        image_url: '/project_images/peerbie-ai.png',
        live_url: '',
        github_url: '',
        featured: true,
        category: 'ai'
      },
      {
        id: 'bzail-site-selection-' + Date.now(),
        title: 'Bzail Site Selection Tool',
        description: 'The Bzail Site Selection Tool is a state-of-the-art, fully automated platform designed for brokers and land developers to search parcels and perform complex analyses using Agentic AI. It reduces manual site selection work from weeks to just a few seconds, with over 95% accuracy.',
        long_description: `The Bzail Site Selection Tool is a state-of-the-art, fully automated platform designed for brokers and land developers to search parcels and perform complex analyses using Agentic AI. It reduces manual site selection work from weeks to just a few seconds, with over 95% accuracy. The system integrates seamlessly with major real estate data providers such as Regrid, Dataplor, and Shovel. Capable of handling terabytes of parcel data, Bzail performs searches at high speed through advanced optimization techniques.

Technical Overview:
To process massive parcel datasets, Bzail leverages AWS services, automating data ingestion with AWS Glue, PySpark with Sedona, EventBridge, S3, and RDS. The backend is developed in Python using FastAPI, supported by PostgreSQL with extensions like PostGIS, pgvector, pg_trgm, and optimized partitioning strategies along with GIN and B-tree indexes.

For AI integration, Bzail employs OpenAI, Anthropic, Gemini, and AWS Bedrock, orchestrated through an optimized agentic structure. Model Context Protocol, RAG, and fine-tuning approaches are used for specialized tasks. On the frontend, Bzail is built with React TypeScript and Mapbox. To efficiently visualize large numbers of parcels, it applies clustering techniques, custom tile layers, and Mapbox Studio for creating geoJSON datasets and tileservers.

Impact & Benefits:
Bzail revolutionizes real estate site selection by combining large-scale geospatial data handling with advanced AI intelligence. It saves weeks of manual effort, delivers accurate and fast results, and empowers brokers and developers with data-driven insights for decision-making.`,
        technologies: ['Python', 'FastAPI', 'PostgreSQL', 'PostGIS', 'AWS', 'React', 'TypeScript', 'Mapbox', 'OpenAI', 'Anthropic', 'Gemini', 'AWS Bedrock', 'PySpark'],
        image_url: '/project_images/bzail.png',
        live_url: 'https://bzail.com/',
        github_url: '',
        featured: true,
        category: 'web'
      },
      {
        id: 'rppg-pipeline-' + Date.now(),
        title: 'Remote Photoplethysmography (rPPG) Pipeline',
        description: 'I built a remote photoplethysmography (rPPG) pipeline using Mediapipe for face detection and masking. This enabled automatic selection of skin regions of interest (ROI) for reliable signal capture.',
        long_description: `I built a remote photoplethysmography (rPPG) pipeline using Mediapipe for face detection and masking. This enabled automatic selection of skin regions of interest (ROI) for reliable signal capture. I designed a skin segmentation and preprocessing pipeline with adaptive filters to exclude pixels affected by low light, shadows, or poor intensity, reducing noise in the process. From the cleaned ROI, I extracted RGB time-series data and applied a bandpass filter to eliminate unwanted frequency components, improving the signal-to-noise ratio. I then processed the filtered signals to estimate heart rate non-invasively while compensating for motion, lighting changes, and environmental noise. By combining artifact removal, adaptive segmentation, and temporal filtering, I improved signal stability and accuracy for more consistent physiological measurements.

Challenges & Solutions:
Accurate ROI Selection for Face Mask: Extracting precise skin regions was critical, as inaccurate masks produced noisy signals. After evaluating multiple libraries, I found Mediapipe provided the most accurate and consistent results. By using facial landmarks, I generated reliable skin masks, ensuring only relevant regions were included in signal extraction.

Lighting Variations and Dark Pixels: Poor lighting and shadowed pixels introduced instability in heart rate estimation. I addressed this by implementing adaptive skin segmentation, calculating average skin pixel values, and defining valid intensity ranges. Pixels outside this range were excluded, significantly improving the signal-to-noise ratio and measurement accuracy.

Impact & Benefits:
The rPPG pipeline provided a non-invasive, camera-based method for estimating heart rate with improved reliability. Through adaptive segmentation, filtering, and motion compensation, the system delivered stable physiological measurements even in challenging conditions, paving the way for practical remote health monitoring applications.`,
        technologies: ['Python', 'Mediapipe', 'Computer Vision', 'Signal Processing', 'OpenCV', 'NumPy', 'SciPy'],
        image_url: '/project_images/rppg.png',
        live_url: '',
        github_url: '',
        featured: true,
        category: 'ai'
      },
      {
        id: 'rag-quotation-generator-' + Date.now(),
        title: 'RAG-Based Quotation PDF Generator',
        description: 'I developed an AI-powered quotation generation system to automate the manual creation of product quotations for a furniture retail business. The system streamlined quotation generation by leveraging a Flask backend integrated with OpenAI\'s language models.',
        long_description: `Client: Furniture Retail Business
Tech Stack: Flask (Backend), React (Frontend), OpenAI (LLM), Pinecone (Vector DB), PDFKit

Project Description:
I developed an AI-powered quotation generation system to automate the manual creation of product quotations for a furniture retail business. The system streamlined quotation generation by leveraging a Flask backend integrated with OpenAI's language models to process natural language product queries. A React-based frontend dashboard allowed clients to input custom quotation requests and view results dynamically.

Product catalog data—including product names, IDs, prices, and accessories—was structured and embedded in Pinecone for fast semantic search. I designed a Retrieval-Augmented Generation (RAG) pipeline with multiple LLM filters to accurately retrieve relevant product data. The system automatically generated price estimates, which were then converted into downloadable PDF quotations using PDFKit. Real-time product price editing was also supported via the dashboard, with updates reflected instantly across the system.

Challenges & Solutions:
The main challenge was retrieving the exact product price from Pinecone, since many products had similar names and retrieval often returned multiple options. Token limits also restricted the LLM's ability to disambiguate all results. To solve this, I stored only product names in Pinecone. During queries, the system retrieved 5-10 candidate names, and the LLM selected the correct one. Metadata was then used to fetch accurate product details for quotation generation. This approach ensured precise and reliable quotations.

Impact & Benefits:
The system significantly reduced manual effort for creating quotations, improved retrieval accuracy through RAG and filters, and delivered client-ready PDF quotations in seconds. It enhanced efficiency, minimized errors, and provided a scalable solution for the retail business.`,
        technologies: ['Flask', 'React', 'OpenAI', 'Pinecone', 'PDFKit', 'RAG', 'Vector Database'],
        image_url: '/project_images/quotation-generator.png',
        live_url: '',
        github_url: '',
        featured: false,
        category: 'web'
      },
      {
        id: 'guard-service-automation-' + Date.now(),
        title: 'End-to-End Guard Service Automation using Zoho CRM & Zoho Books',
        description: 'I developed a fully automated guard service quotation and invoicing system to streamline customer onboarding and reduce manual workload for the sales team.',
        long_description: `Client: FastGuard Security Services
Tech Stack: Flask (Backend), React (Frontend), Zoho CRM, Zoho Books, Zoho API, Webhooks

Project Description:
I developed a fully automated guard service quotation and invoicing system to streamline customer onboarding and reduce manual workload for the sales team. A React-based frontend form was embedded on the FastGuard website to capture customer requirements such as service type, number of guards, and duration. The Flask backend processed submissions, fetched pricing details from a dynamic guard pricing list, and calculated quotation data.

The system was integrated with Zoho CRM API to automatically create and send quotations based on inputs, eliminating manual follow-ups. Once a quotation was approved, automation in Zoho Books generated invoices with payment links sent directly to customers. Real-time synchronization and automated workflows were enabled via Zoho APIs and webhooks, ensuring seamless transitions from quotation to invoicing.

Impact & Benefits:
The solution reduced quotation turnaround time from hours to seconds, significantly improving customer experience and operational efficiency. It eliminated repetitive manual tasks, ensured real-time accuracy in pricing and invoicing, and optimized the sales team's productivity.`,
        technologies: ['Flask', 'React', 'Zoho CRM', 'Zoho Books', 'Zoho API', 'Webhooks'],
        image_url: '/project_images/guard-service.png',
        live_url: '',
        github_url: '',
        featured: false,
        category: 'web'
      },
      {
        id: 'campaign-social-scheduler-' + Date.now(),
        title: 'Campaign Creation & Social Media Scheduler',
        description: 'I developed an application to create campaigns automatically by scraping data from websites, generating campaigns based on collected data, and scheduling posts on multiple social media platforms.',
        long_description: `Problem Statement:
The client needed an application to create campaigns automatically. The requirement was to scrape data from a particular website or topic, generate campaigns based on the collected data, and then schedule posts on multiple social media platforms.

Approach & Implementation:
To solve this, I used Browser Use AI Web Scraping Agent, a modern scraping tool capable of bypassing bot detection while delivering reliable data. Using this tool, I scraped and structured large volumes of data related to specific topics or websites. From this data, campaigns were generated, and multiple social media posts were prepared.

For posting, I implemented OAuth 2.0 authentication along with the official APIs of various social media platforms, ensuring secure and reliable publishing. Posts were scheduled through the dashboard, enabling automation of weeks' worth of content.

Impact & Benefits:
With this approach, the client was able to generate around two months of content in advance, saving significant time while maintaining a consistent posting schedule. The system streamlined campaign creation, enhanced social media presence, and improved audience engagement through automation.`,
        technologies: ['Python', 'Browser Use AI', 'Web Scraping', 'OAuth 2.0', 'Social Media APIs', 'Automation'],
        image_url: '/project_images/campaign-scheduler.png',
        live_url: '',
        github_url: '',
        featured: false,
        category: 'web'
      }
    ];

    let insertedCount = 0;

    for (const project of newProjects) {
      try {
        const insertQuery = `
          INSERT INTO projects (
            id, title, description, long_description, technologies,
            image_url, live_url, github_url, featured, category,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;

        const values = [
          project.id,
          project.title,
          project.description,
          project.long_description,
          JSON.stringify(project.technologies),
          project.image_url,
          project.live_url,
          project.github_url,
          project.featured,
          project.category
        ];

        await client.query(insertQuery, values);
        insertedCount++;
        console.log(`✅ Added: ${project.title}`);

      } catch (error) {
        console.error(`❌ Error adding ${project.title}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully added ${insertedCount} new projects to the database!`);

    // Show summary of added projects
    console.log('\n=== NEWLY ADDED PROJECTS ===');
    const addedProjects = await client.query(`
      SELECT title, category, featured, technologies
      FROM projects
      WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '1 minute'
      ORDER BY created_at DESC
    `);

    addedProjects.rows.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   Category: ${project.category} | Featured: ${project.featured}`);
      console.log(`   Technologies: ${project.technologies.slice(0, 3).join(', ')}${project.technologies.length > 3 ? '...' : ''}`);
      console.log('---');
    });

    await client.release();
  } catch (error) {
    console.error('Error adding projects:', error);
  } finally {
    await pool.end();
  }
}

addNewProjects();
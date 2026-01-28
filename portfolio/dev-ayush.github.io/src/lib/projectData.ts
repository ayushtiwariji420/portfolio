

export const projects = [
    {
      title: 'POS AUTOMATION',
      description: 'The POS Automation project involved integrating multiple Point of Sale (POS) systems, including NCR Aloha, QuBeyond, Clover, and Square, into the client software. By using AWS services like Lambda and API Gateway, the integration allowed real-time synchronization of sales, inventory, and customer data across all systems, providing businesses with a unified platform for managing their operations. AWS Lambda handled event-driven transaction processing, while API Gateway ensured secure communication between client and the POS systems. SAM CLI was utilized to deploy serverless applications efficiently, and Pytest was used to validate functionality with unit and integration tests.',
      startDate: '24-Aug-2022',
      endDate: '7-Apr-2023',
      tags: ['Python', 'AWS Cloud Formation', 'AWS SAM CLI'],
      icons: ['bxl:react', 'bxl-typescript', 'fa6-brands:github'],
      imageUrl: '/project_images/pos.png',
      githubLink: 'https://github.com/dev-Naveen PatidarK/Clover-POS-third-party-api-intg.git',
      demoLink: 'https://youtu.be/drI_J-anbps?si=59KWMAZqoaspKqpJ',
      show: true,
    },

    {
      title: 'Hubspot-DropBox Integration',
      description: 'Worked with large team where I generated access Token from the hubspot, the process was autometed',
      startDate: "11-Oct-2022",
      endDate: "12-Jan-2023",
      tags: ['Python', 'Hubspot', 'Dropbox'],
      icons: ['bxl:vue-js', 'bxl-javascript', 'fa6-brands:github'],
      imageUrl: 'https://via.placeholder.com/400x320',
      githubLink: '',
      demoLink: 'https://youtu.be/ai-xvKxqdyk?si=t1xKMhJQoGOq3EVI',
      show: false
    },
    {
      title: "FinChat: AI-Powered Assistant",
      description: "An AI-powered chatbot designed for financial institutions, FinChat serves as a multi-agent assistant integrated with OpenAI. Users can inquire about various banking services, from checking account balances to raising service requests, enhancing customer engagement and support through intelligent automation.",
      startDate: '4-Dec-2023',
      endDate: '23-Jan-2024',
      tags: ["OpenAI", "Python", "AI", "Chatbot", "Financial Services", "Machine Learning", "NLP"],
      icons: ["bxl:openai", "bxl-python", "fa6-brands:github"],
      imageUrl: "/project_images/finchat.png",
      githubLink: "https://github.com/dev-Naveen PatidarK/Finchat.git",
      demoLink: "https://youtu.be/AWGilgp66j0",
      show: true
    },

    {
      title: "SRS Agent: AI-Powered Medical Documentation",
      description: "The SRS Agent is an innovative solution designed to identify deficiencies within Software Requirement Specification (SRS) documents specifically tailored for medical software applications. This AI-powered tool leverages OpenAI's capabilities and advanced Natural Language Processing (NLP) techniques to analyze and improve SRS documents. By automating the review process, it replaces traditional manual checking methods, providing users with a refined SRS document after thorough modifications. Built using Python and the python-docx library, this project enhances the accuracy and efficiency of SRS documentation, making it an essential tool for medical software developers and medical professionals alike.",
      startDate: "9-Jun-2023",
      endDate: "14-Nov-2023",
      tags: ["OpenAI", "Python", "NLP", "Medical Software", "AI", "Documentation"],
      icons: ["bxl:python", "bxl-openai", "fa6-brands:github"],
      imageUrl: "/project_images/SRS.png",
      githubLink: "https://github.com/dev-Naveen PatidarK/SRS_medical_softwares.git",
      demoLink: "https://youtu.be/U-jn0PO2mzg",
      show: true
    },    
    {
      title: 'ChatPDF Powered by Azure - Automation',
      description: 'This application leverages Azure AI alongside other Azure services like Blob Storage, Cognitive Search, and Azure Function App to create an automated AI assistant. Users can upload knowledge bases in PDF format, and the AI assistant is automatically generated to answer questions from the provided documents. Originally designed to assist doctors in clinical trials, this tool simplifies the process by automatically retrieving relevant findings from lengthy reports, eliminating the need for manual searches. It greatly enhances efficiency and decision-making in medical research and other document-heavy domains.',
      startDate: "13-Oct-2023",
      endDate: "31-Oct-2023",
      tags: ['Azure AI', 'Azure CLI', 'Python', 'Automation', 'Cognitive Search'],
      icons: ['bxl:azure', 'bxl-python', 'fa6-brands:github'],
      imageUrl: '/project_images/azureChatPdf.png',
      githubLink: 'https://github.com/dev-Naveen PatidarK/Azure_chatpdf.git',
      demoLink: 'https://youtu.be/blSaRQ2o3ic',
      show: true
    }
    
  ];
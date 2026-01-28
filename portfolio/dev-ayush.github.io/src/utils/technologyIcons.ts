// Technology to icon mapping
const technologyIconMap: Record<string, string> = {
  // Frontend
  'React': 'logos:react',
  'react': 'logos:react',
  'Next.js': 'logos:nextjs-icon',
  'next': 'logos:nextjs-icon',
  'nextjs': 'logos:nextjs-icon',
  'Vue.js': 'logos:vue',
  'vue': 'logos:vue',
  'Angular': 'logos:angular-icon',
  'angular': 'logos:angular-icon',
  'HTML': 'logos:html-5',
  'html': 'logos:html-5',
  'CSS': 'logos:css-3',
  'css': 'logos:css-3',
  'JavaScript': 'logos:javascript',
  'javascript': 'logos:javascript',
  'js': 'logos:javascript',
  'TypeScript': 'logos:typescript-icon',
  'typescript': 'logos:typescript-icon',
  'ts': 'logos:typescript-icon',
  'Tailwind CSS': 'logos:tailwindcss-icon',
  'tailwind': 'logos:tailwindcss-icon',
  'tailwindcss': 'logos:tailwindcss-icon',
  'Bootstrap': 'logos:bootstrap',
  'bootstrap': 'logos:bootstrap',
  'Sass': 'logos:sass',
  'sass': 'logos:sass',
  'SCSS': 'logos:sass',
  'scss': 'logos:sass',

  // Backend
  'Node.js': 'logos:nodejs-icon',
  'node': 'logos:nodejs-icon',
  'nodejs': 'logos:nodejs-icon',
  'Express.js': 'logos:express',
  'express': 'logos:express',
  'Python': 'logos:python',
  'python': 'logos:python',
  'Django': 'logos:django-icon',
  'django': 'logos:django-icon',
  'Flask': 'logos:flask',
  'flask': 'logos:flask',
  'Java': 'logos:java',
  'java': 'logos:java',
  'Spring': 'logos:spring-icon',
  'spring': 'logos:spring-icon',
  'C#': 'logos:c-sharp',
  'csharp': 'logos:c-sharp',
  'C++': 'logos:cplusplus',
  'cpp': 'logos:cplusplus',
  'Go': 'logos:go',
  'go': 'logos:go',
  'golang': 'logos:go',
  'Rust': 'logos:rust',
  'rust': 'logos:rust',
  'PHP': 'logos:php',
  'php': 'logos:php',
  'Laravel': 'logos:laravel',
  'laravel': 'logos:laravel',
  'Ruby': 'logos:ruby',
  'ruby': 'logos:ruby',
  'Ruby on Rails': 'logos:rails',
  'rails': 'logos:rails',

  // Databases
  'MongoDB': 'logos:mongodb-icon',
  'mongo': 'logos:mongodb-icon',
  'mongodb': 'logos:mongodb-icon',
  'MySQL': 'logos:mysql-icon',
  'mysql': 'logos:mysql-icon',
  'PostgreSQL': 'logos:postgresql',
  'postgres': 'logos:postgresql',
  'postgresql': 'logos:postgresql',
  'SQLite': 'logos:sqlite',
  'sqlite': 'logos:sqlite',
  'Redis': 'logos:redis',
  'redis': 'logos:redis',
  'Firebase': 'logos:firebase',
  'firebase': 'logos:firebase',
  'Supabase': 'logos:supabase-icon',
  'supabase': 'logos:supabase-icon',

  // Cloud & DevOps
  'AWS': 'logos:aws',
  'aws': 'logos:aws',
  'Azure': 'logos:microsoft-azure',
  'azure': 'logos:microsoft-azure',
  'Google Cloud': 'logos:google-cloud',
  'gcp': 'logos:google-cloud',
  'Docker': 'logos:docker-icon',
  'docker': 'logos:docker-icon',
  'Kubernetes': 'logos:kubernetes',
  'kubernetes': 'logos:kubernetes',
  'k8s': 'logos:kubernetes',
  'Vercel': 'logos:vercel-icon',
  'vercel': 'logos:vercel-icon',
  'Netlify': 'logos:netlify',
  'netlify': 'logos:netlify',
  'Heroku': 'logos:heroku-icon',
  'heroku': 'logos:heroku-icon',

  // AI/ML
  'TensorFlow': 'logos:tensorflow',
  'tensorflow': 'logos:tensorflow',
  'PyTorch': 'logos:pytorch-icon',
  'pytorch': 'logos:pytorch-icon',
  'OpenAI': 'simple-icons:openai',
  'openai': 'simple-icons:openai',
  'Hugging Face': 'simple-icons:huggingface',
  'huggingface': 'simple-icons:huggingface',
  'Scikit-learn': 'devicon:scikitlearn',
  'sklearn': 'devicon:scikitlearn',
  'Pandas': 'logos:pandas',
  'pandas': 'logos:pandas',
  'NumPy': 'logos:numpy',
  'numpy': 'logos:numpy',

  // Tools & Others
  'Git': 'logos:git-icon',
  'git': 'logos:git-icon',
  'GitHub': 'logos:github-icon',
  'github': 'logos:github-icon',
  'GitLab': 'logos:gitlab',
  'gitlab': 'logos:gitlab',
  'VS Code': 'logos:visual-studio-code',
  'vscode': 'logos:visual-studio-code',
  'Figma': 'logos:figma',
  'figma': 'logos:figma',
  'Postman': 'logos:postman-icon',
  'postman': 'logos:postman-icon',
  'Jest': 'logos:jest',
  'jest': 'logos:jest',
  'Cypress': 'logos:cypress-icon',
  'cypress': 'logos:cypress-icon',
  'Webpack': 'logos:webpack',
  'webpack': 'logos:webpack',
  'Vite': 'logos:vitejs',
  'vite': 'logos:vitejs',
  'ESLint': 'logos:eslint',
  'eslint': 'logos:eslint',
  'Prettier': 'logos:prettier',
  'prettier': 'logos:prettier',

  // Mobile
  'React Native': 'logos:react',
  'react-native': 'logos:react',
  'Flutter': 'logos:flutter',
  'flutter': 'logos:flutter',
  'Dart': 'logos:dart',
  'dart': 'logos:dart',
  'Swift': 'logos:swift',
  'swift': 'logos:swift',
  'Kotlin': 'logos:kotlin-icon',
  'kotlin': 'logos:kotlin-icon',

  // Default/Generic
  'API': 'mdi:api',
  'api': 'mdi:api',
  'REST': 'mdi:api',
  'rest': 'mdi:api',
  'GraphQL': 'logos:graphql',
  'graphql': 'logos:graphql',
  'WebSocket': 'mdi:web',
  'websocket': 'mdi:web',
}

/**
 * Maps an array of technologies to their corresponding icons
 * @param technologies - Array of technology strings
 * @returns Array of icon strings
 */
export function mapTechnologiesToIcons(technologies: string[]): string[] {
  if (!technologies || technologies.length === 0) {
    return ['mdi:code-braces'] // Generic code icon as fallback
  }

  const icons = technologies
    .map(tech => {
      // Try exact match first
      const exactMatch = technologyIconMap[tech]
      if (exactMatch) return exactMatch

      // Try lowercase match
      const lowerMatch = technologyIconMap[tech.toLowerCase()]
      if (lowerMatch) return lowerMatch

      // Try to find partial matches
      const techLower = tech.toLowerCase()
      for (const [key, icon] of Object.entries(technologyIconMap)) {
        if (key.toLowerCase().includes(techLower) || techLower.includes(key.toLowerCase())) {
          return icon
        }
      }

      return null
    })
    .filter(Boolean) as string[]

  // Return unique icons, fallback to generic code icon if no matches
  const uniqueIcons = Array.from(new Set(icons))
  return uniqueIcons.length > 0 ? uniqueIcons : ['mdi:code-braces']
}

/**
 * Gets a single representative icon for a project based on its primary technology
 * @param technologies - Array of technology strings
 * @returns Single icon string
 */
export function getPrimaryTechnologyIcon(technologies: string[]): string {
  const icons = mapTechnologiesToIcons(technologies)
  return icons[0] || 'mdi:code-braces'
}

export default technologyIconMap
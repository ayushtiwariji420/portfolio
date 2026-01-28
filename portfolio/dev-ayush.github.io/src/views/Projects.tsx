// import Project from '@/components/Projects/ProjectCard';
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { projects as staticProjects } from '@/lib/projectData'; // Fallback for static export
// import { mapTechnologiesToIcons } from '@/utils/technologyIcons';

// // Define project categories
// const categories = [
//   'All',
//   'AI/ML',
//   'Cloud',
//   'Python',
//   'Automation',
//   'Integration'
// ] as const;

// type Category = typeof categories[number];

// interface ApiProject {
//   id: string;
//   title: string;
//   description: string;
//   longDescription?: string;
//   startDate?: string;
//   endDate?: string;
//   created_at?: string;
//   updated_at?: string;
//   tags?: string[];
//   technologies?: string[];
//   icons?: string[];
//   imageUrl?: string;
//   image_url?: string;
//   githubLink?: string;
//   githubUrl?: string;
//   github_url?: string;
//   demoLink?: string;
//   liveUrl?: string;
//   live_url?: string;
//   show?: boolean;
// }

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   longDescription?: string;
//   startDate: string;
//   endDate: string;
//   tags: string[];
//   icons: string[];
//   imageUrl: string;
//   githubLink: string;
//   demoLink: string;
//   show: boolean;
// }

// const Projects: React.FC = () => {
//   const [activeCategory, setActiveCategory] = useState<Category>('All');
//   const [hoveredProject, setHoveredProject] = useState<string | null>(null);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Categorize projects dynamically based on current projects state
//   const categorizedProjects: Record<Category, Project[]> = {
//     'All': projects.filter(project => project.show),
//     'AI/ML': projects.filter(project => 
//       project.show && (
//         project.tags.some(tag => 
//           ['AI', 'Machine Learning', 'NLP', 'OpenAI'].includes(tag)
//         )
//       )
//     ),
//     'Cloud': projects.filter(project => 
//       project.show && (
//         project.tags.some(tag => 
//           ['AWS', 'Azure', 'Cloud'].includes(tag)
//         )
//       )
//     ),
//     'Python': projects.filter(project => 
//       project.show && project.tags.includes('Python')
//     ),
//     'Automation': projects.filter(project => 
//       project.show && project.tags.includes('Automation')
//     ),
//     'Integration': projects.filter(project => 
//       project.show && project.tags.includes('Integration')
//     ),
//   };

//   // Fetch projects from API with fallback to static data
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch('/api/projects');
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch projects');
//         }
        
//         const data = await response.json();
//         // Map the API response to match the expected Project interface
//         const mappedProjects = (data.projects || []).map((project: any) => ({
//           id: project.id,
//           title: project.title,
//           description: project.description,
//           longDescription: project.longDescription,
//           startDate: project.startDate || project.created_at || '',
//           endDate: project.endDate || project.updated_at || '',
//           tags: project.tags || project.technologies || [],
//           icons: project.icons || mapTechnologiesToIcons(project.technologies || project.tags || []), // Dynamic icons
//           imageUrl: project.imageUrl || project.image_url || '',
//           githubLink: project.githubLink || project.githubUrl || project.github_url || '',
//           demoLink: project.demoLink || project.liveUrl || project.live_url || '',
//           show: project.show !== undefined ? project.show : true
//         }));
//         setProjects(mappedProjects);
//       } catch (error) {
//         console.error('Error fetching projects from API, falling back to static data:', error);
//         // Fallback to static projects data
//         const mappedStaticProjects = staticProjects.map((project, index) => ({
//           id: `static-${index}`,
//           title: project.title,
//           description: project.description,
//           longDescription: project.longDescription || project.description,
//           startDate: project.startDate || '',
//           endDate: project.endDate || '',
//           tags: project.tags || [],
//           icons: project.icons || mapTechnologiesToIcons(project.tags || []),
//           imageUrl: project.imageUrl || '',
//           githubLink: project.githubLink || '',
//           demoLink: project.demoLink || '',
//           show: project.show !== undefined ? project.show : true
//         }));
//         setProjects(mappedStaticProjects);
//         setError(null); // Clear error since we have fallback data
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center py-12">
//             <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
//             <button 
//               onClick={() => window.location.reload()} 
//               className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto">
//         <motion.h1 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 leading-tight pb-1"
//         >
//           My Projects
//         </motion.h1>

//         {/* Category Filter */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="flex flex-wrap justify-center gap-4 mb-12"
//         >
//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => setActiveCategory(category)}
//               className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                 activeCategory === category
//                   ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
//                   : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </motion.div>

//         {/* Projects Grid */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//         >
//           <AnimatePresence>
//             {categorizedProjects[activeCategory].map((project, index) => (
//               <motion.div
//                 key={project.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 onHoverStart={() => setHoveredProject(project.title)}
//                 onHoverEnd={() => setHoveredProject(null)}
//                 className={`transform transition-all duration-300 ${
//                   hoveredProject === project.title ? 'scale-105' : 'scale-100'
//                 }`}
//               >
//                 <Project {...project} />
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </motion.div>

//         {/* Empty State */}
//         {categorizedProjects[activeCategory].length === 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-12"
//           >
//             <p className="text-gray-500 dark:text-gray-400 text-lg">
//               No projects found in this category.
//             </p>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Projects;


import Project from '@/components/Projects/ProjectCard';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects as staticProjects } from '@/lib/projectData'; // Fallback for static export
import { mapTechnologiesToIcons } from '@/utils/technologyIcons';

// Define project categories
const categories = [
  'All',
  'AI/ML',
  'Cloud',
  'Python',
  'Automation',
  'Integration'
] as const;

type Category = typeof categories[number];

interface ApiProject {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  startDate?: string;
  endDate?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  technologies?: string[];
  icons?: string[];
  imageUrl?: string;
  image_url?: string;
  githubLink?: string;
  githubUrl?: string;
  github_url?: string;
  demoLink?: string;
  liveUrl?: string;
  live_url?: string;
  show?: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  startDate: string;
  endDate: string;
  tags: string[];
  icons: string[];
  imageUrl: string;
  githubLink: string;
  demoLink: string;
  show: boolean;
}

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categorize projects dynamically based on current projects state
  const categorizedProjects: Record<Category, Project[]> = {
    'All': projects.filter(project => project.show),
    'AI/ML': projects.filter(project => 
      project.show && (
        project.tags.some(tag => 
          ['AI', 'Machine Learning', 'NLP', 'OpenAI'].includes(tag)
        )
      )
    ),
    'Cloud': projects.filter(project => 
      project.show && (
        project.tags.some(tag => 
          ['AWS', 'Azure', 'Cloud'].includes(tag)
        )
      )
    ),
    'Python': projects.filter(project => 
      project.show && project.tags.includes('Python')
    ),
    'Automation': projects.filter(project => 
      project.show && project.tags.includes('Automation')
    ),
    'Integration': projects.filter(project => 
      project.show && project.tags.includes('Integration')
    ),
  };

  // Fetch projects from API with fallback to static data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        // Map the API response to match the expected Project interface
        const mappedProjects = (data.projects || []).map((project: ApiProject) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          longDescription: project.longDescription,
          startDate: project.startDate || project.created_at || '',
          endDate: project.endDate || project.updated_at || '',
          tags: project.tags || project.technologies || [],
          icons: project.icons || mapTechnologiesToIcons(project.technologies || project.tags || []), // Dynamic icons
          imageUrl: project.imageUrl || project.image_url || '',
          githubLink: project.githubLink || project.githubUrl || project.github_url || '',
          demoLink: project.demoLink || project.liveUrl || project.live_url || '',
          show: project.show !== undefined ? project.show : true
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error('Error fetching projects from API, falling back to static data:', error);
        // Fallback to static projects data with type assertion
        const mappedStaticProjects = staticProjects.map((project, index) => ({
          id: `static-${index}`,
          title: project.title,
          description: project.description,
          longDescription: (project as any).longDescription || project.description,
          startDate: project.startDate || '',
          endDate: project.endDate || '',
          tags: project.tags || [],
          icons: project.icons || mapTechnologiesToIcons(project.tags || []),
          imageUrl: project.imageUrl || '',
          githubLink: project.githubLink || '',
          demoLink: project.demoLink || '',
          show: project.show !== undefined ? project.show : true
        }));
        setProjects(mappedStaticProjects);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 leading-tight pb-1"
        >
          My Projects
        </motion.h1>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {categorizedProjects[activeCategory].map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredProject(project.title)}
                onHoverEnd={() => setHoveredProject(null)}
                className={`transform transition-all duration-300 ${
                  hoveredProject === project.title ? 'scale-105' : 'scale-100'
                }`}
              >
                <Project {...project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {categorizedProjects[activeCategory].length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;
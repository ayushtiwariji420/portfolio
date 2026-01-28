import { FC } from "react";
import { motion } from "framer-motion";
import { BiLinkExternal } from "react-icons/bi";
import { AiFillGithub, AiFillYoutube } from "react-icons/ai";
import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

type ProjectProps = {
  id: string;
  title: string;
  description: string;
  tags: readonly string[];
  icons: readonly string[];
  imageUrl: string;
  githubLink?: string;
  demoLink?: string;
  urlLink?: string;
};

const Project: FC<ProjectProps> = ({
  id,
  title,
  description,
  tags,
  icons,
  imageUrl,
  githubLink,
  demoLink,
  urlLink,
}) => {
  const router = useRouter();
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/projects/${id}`);
  };
  return (
    <div className="group">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        onClick={handleViewDetails}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>

          {/* Tech Stack Icons */}
          <div className="flex items-center gap-3 mb-4">
            {icons.map((icon, index) => (
              <div
                key={index}
                className="text-2xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Icon icon={icon} />
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2 mt-auto">
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <Eye size={14} />
              <span>Details</span>
            </button>
            {urlLink && (
              <a
                href={urlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <BiLinkExternal size={14} />
                <span>Live</span>
              </a>
            )}
            {demoLink && (
              <a
                href={demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <AiFillYoutube size={14} />
                <span>Demo</span>
              </a>
            )}
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <AiFillGithub size={14} />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Project;
import React, { useState } from 'react';

// Import all React Icons libraries
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as CgIcons from 'react-icons/cg';
import * as DiIcons from 'react-icons/di';
import * as FcIcons from 'react-icons/fc';
import * as FiIcons from 'react-icons/fi';
import * as GoIcons from 'react-icons/go';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import * as Hi2Icons from 'react-icons/hi2';
import * as ImIcons from 'react-icons/im';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as TbIcons from 'react-icons/tb';
import * as TiIcons from 'react-icons/ti';
import * as VscIcons from 'react-icons/vsc';

interface IconRendererProps {
  iconName?: string;
  iconLibrary?: string;
  iconUrl?: string;
  iconEmoji?: string;
  iconType?: 'react' | 'url' | 'emoji';
  size?: number;
  className?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ 
  iconName, 
  iconLibrary, 
  iconUrl,
  iconEmoji,
  iconType = 'react',
  size = 24, 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  // Handle emoji icons
  if (iconType === 'emoji' && iconEmoji) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.8 }}
      >
        {iconEmoji}
      </div>
    );
  }

  // Handle URL icons
  if (iconType === 'url' && iconUrl && !imageError) {
    return (
      <img 
        src={iconUrl} 
        alt="Skill icon" 
        width={size} 
        height={size} 
        className={`object-contain ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Handle React Icons (default)
  if (iconType === 'react' && iconName && iconLibrary) {
    // Map library keys to their icon objects
    const iconLibraries = {
      'fa': FaIcons,
      'ai': AiIcons,
      'bi': BiIcons,
      'bs': BsIcons,
      'cg': CgIcons,
      'di': DiIcons,
      'fc': FcIcons,
      'fi': FiIcons,
      'go': GoIcons,
      'gr': GrIcons,
      'hi': HiIcons,
      'hi2': Hi2Icons,
      'im': ImIcons,
      'io': IoIcons,
      'io5': Io5Icons,
      'md': MdIcons,
      'ri': RiIcons,
      'si': SiIcons,
      'tb': TbIcons,
      'ti': TiIcons,
      'vsc': VscIcons,
    } as Record<string, Record<string, React.ComponentType<any>>>;

    // Get the library and icon component
    const library = iconLibraries?.[iconLibrary as keyof typeof iconLibraries];
    const IconComponent = library?.[iconName as keyof typeof library] as React.ComponentType<any> | undefined;

    if (IconComponent) {
      return <IconComponent size={size} className={className} />;
    }
  }

  // Return fallback div if no valid icon found
  return (
    <div 
      className={`bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-xs text-gray-500 dark:text-gray-400">?</span>
    </div>
  );
};

export default IconRenderer;
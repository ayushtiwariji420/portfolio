import { IconType } from 'react-icons';
import { 
  FaPython, 
  FaAws, 
  FaReact, 
  FaJava, 
  FaCloud, 
  FaDatabase,
  FaBrain,
  FaRobot,
  FaMicrosoft,
  FaGoogle,
  FaCode
} from 'react-icons/fa';
import { 
  SiTensorflow, 
  SiPytorch, 
  SiScikitlearn, 
  SiMicrosoft, 
  SiGooglecloud, 
  SiFastapi, 
  SiAew, 
  SiJavascript, 
  SiTypescript,
  SiHuggingface,
  SiOpenai
} from 'react-icons/si';

export interface Skill {
  name: string;
  level: number;
  icon: IconType;
  color: string;
}

export const coreSkills: Skill[] = [
  { name: 'Python', level: 95, icon: FaPython, color: 'from-blue-500 to-blue-700' },
  { name: 'Machine Learning', level: 90, icon: FaBrain, color: 'from-green-500 to-green-700' },
  { name: 'Deep Learning', level: 85, icon: SiTensorflow, color: 'from-orange-500 to-orange-700' },
  { name: 'AWS', level: 90, icon: FaAws, color: 'from-orange-400 to-orange-600' },
  { name: 'Azure', level: 85, icon: FaMicrosoft, color: 'from-blue-400 to-blue-600' },
  { name: 'Google Cloud', level: 80, icon: FaGoogle, color: 'from-red-400 to-red-600' },
  { name: 'LLMs', level: 88, icon: FaRobot, color: 'from-purple-500 to-purple-700' },
  { name: 'RAG', level: 85, icon: FaDatabase, color: 'from-blue-500 to-blue-700' },
  { name: 'FastAPI', level: 90, icon: FaCode, color: 'from-green-400 to-green-600' },
  { name: 'Java', level: 75, icon: FaJava, color: 'from-red-500 to-red-700' },
  { name: 'React', level: 80, icon: FaReact, color: 'from-blue-400 to-blue-600' },
  { name: 'TypeScript', level: 75, icon: SiTypescript, color: 'from-blue-600 to-blue-800' },
];

export const additionalSkills: string[] = [
  'LangChain',
  'LlamaIndex',
  'HuggingFace',
  'TensorFlow',
  'PyTorch',
  'Scikit-learn',
  'NLP',
  'Computer Vision',
  'AWS Lambda',
  'AWS Glue',
  'AWS Bedrock',
  'CloudFormation',
  'CI/CD',
  'Docker',
  'Kubernetes',
  'MLOps',
  'Data Engineering',
  'ETL/ELT Pipelines',
  'API Development',
  'JavaScript',
  'SQL',
  'NoSQL',
  'GraphQL',
  'Agile/Scrum'
];

export const profileDescription = `I'm an AI/ML Engineer and Python Developer with over 6 years of experience delivering intelligent, data-driven solutions across diverse industries. 
I specialize in designing and deploying scalable machine learning systems on leading cloud platforms including AWS, Azure, and Google Cloud. 
With a deep passion for innovation and problem-solving, I translate complex challenges into elegant, high-performance solutions that drive measurable impact.`;
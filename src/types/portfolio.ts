export interface PersonalInfo {
  name: string;
  age: number;
  location: string;
  title: string;
  email: string;
  phone?: string;
  handle: string;
  bio: string;
  avatar: string;
  fallbackAvatar: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  duration: string;
  cgpa: string;
  graduationDate?: string;
  completionDate?: string;
  location?: string;
}

export interface Education {
  current: EducationEntry;
  previous?: EducationEntry;
  achievements: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  achievement?: string;
}

export interface Research {
  title: string;
  role: string;
  organization: string;
  conference: string;
  status: string;
  topics: string[];
  summary: string;
}

export interface Experience {
  company: string;
  position: string;
  type: string;
  duration: string;
  location?: string;
  description: string;
  technologies: string[];
}

export interface Skills {
  programming: string[];
  ml_ai: string[];
  web_development: string[];
  databases: string[];
  devops_cloud: string[];
  iot_hardware: string[];
  soft_skills: string[];
  // Additional optional categories
  data_analytics?: string[];
  blockchain?: string[];
  devops_tools?: string[];
  security?: string[];
  // Index signature for any future categories
  [key: string]: string[] | undefined;
}

export interface ProjectLink {
  name: string;
  url: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  techStack: string[];
  date: string;
  status: string;
  featured: boolean;
  achievements?: string[];
  metrics?: string[];
  links: ProjectLink[];
  images: ProjectImage[];
}

export interface Social {
  linkedin: string;
  github: string;
  twitter: string;
  kaggle: string;
  leetcode: string;
  fiverr: string;
}

export interface Internship {
  seeking: boolean;
  duration: string;
  startDate: string;
  preferredLocation: string;
  focusAreas: string[];
  availability: string;
  workStyle: string;
  goals: string;
}

export interface Personality {
  traits: string[];
  interests: string[];
  hobbies?: string[];
  sports?: string[];
  funFacts: string[];
  workingStyle: string;
  motivation: string;
}

export interface Resume {
  title: string;
  description: string;
  fileType: string;
  lastUpdated: string;
  fileSize: string;
  downloadUrl: string;
}

export interface Chatbot {
  name: string;
  personality: string;
  tone: string;
  language: string;
  responseStyle: string;
  useEmojis: boolean;
  topics: string[];
}

export interface PresetQuestions {
  me: string[];
  professional: string[];
  projects: string[];
  achievements?: string[];
  contact: string[];
  fun: string[];
}

export interface Meta {
  configVersion: string;
  lastUpdated: string;
  generatedBy: string;
  description: string;
}

export interface PortfolioConfig {
  personal: PersonalInfo;
  education: Education;
  experience: Experience[];
  skills: Skills;
  certifications?: Certification[];
  projects: Project[];
  social: Social;
  internship: Internship;
  personality: Personality;
  resume: Resume;
  chatbot: Chatbot;
  presetQuestions: PresetQuestions;
  highlights?: string[];
  research?: Research;
  meta: Meta;
}

// Utility types for component props
export interface ProjectContentProps {
  project: {
    title: string;
  };
}

export interface ContactInfo {
  name: string;
  email: string;
  handle: string;
  socials: Array<{
    name: string;
    url: string;
  }>;
}

export interface ProfileInfo {
  name: string;
  age: string;
  location: string;
  description: string;
  src: string;
  fallbackSrc: string;
}

export interface SkillCategory {
  category: string;
  icon: React.ReactNode;
  skills: string[];
  color: string;
}

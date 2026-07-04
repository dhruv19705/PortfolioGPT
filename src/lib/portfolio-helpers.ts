import type { PortfolioConfig, Experience, Skills } from '@/types/portfolio';

/** Read first non-empty skill array from config (supports legacy key names). */
export function readSkills(
  skills: Skills,
  ...keys: string[]
): string[] {
  for (const key of keys) {
    const value = skills[key];
    if (Array.isArray(value) && value.length > 0) return value;
  }
  return [];
}

/** All skill categories present in config, in display order. */
export function getSkillCategories(config: PortfolioConfig) {
  const { skills } = config;
  const categories: { key: string; label: string }[] = [
    { key: 'programming', label: 'Programming Languages' },
    { key: 'ml_ai', label: 'ML & AI' },
    { key: 'data_analytics', label: 'Data Analytics' },
    { key: 'web_development', label: 'Web Development' },
    { key: 'blockchain', label: 'Blockchain & Security' },
    { key: 'databases', label: 'Databases' },
    { key: 'devops_tools', label: 'DevOps & Tools' },
    { key: 'devops_cloud', label: 'DevOps & Cloud' },
    { key: 'security', label: 'Cybersecurity' },
    { key: 'coursework', label: 'Relevant Coursework' },
    { key: 'iot_hardware', label: 'IoT & Hardware' },
    { key: 'soft_skills', label: 'Soft Skills' },
  ];

  return categories
    .map(({ key, label }) => ({
      label,
      skills: readSkills(skills, key),
    }))
    .filter((c) => c.skills.length > 0);
}

export function getInternshipAndResearchExperience(
  experience: Experience[]
): Experience[] {
  return experience.filter(
    (e) => e.type === 'Internship' || e.type === 'Research'
  );
}

export function getFeaturedProjects(config: PortfolioConfig) {
  return [...config.projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );
}

export function buildHighlightsSummary(config: PortfolioConfig): string[] {
  const highlights = config.highlights ?? [];
  const fromEducation = config.education.achievements?.slice(0, 3) ?? [];
  return highlights.length > 0 ? highlights : fromEducation;
}

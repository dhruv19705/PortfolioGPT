import { tool } from 'ai';
import { emptyToolParameters } from '@/lib/tool-schemas';
import { getConfig } from '@/lib/config-loader';
import { getSkillCategories } from '@/lib/portfolio-helpers';

export const getResume = tool({
  description:
    'Use when the user asks for resume, CV, background summary, or wants to download/view professional history.',
  parameters: emptyToolParameters,
  execute: async () => {
    const config = getConfig();

    return {
      personalInfo: {
        name: config.personal.name,
        email: config.personal.email,
        phone: config.personal.phone ?? null,
        location: config.personal.location,
        title: config.personal.title,
      },
      summary: config.personal.bio,
      education: {
        current: config.education.current,
        previous: config.education.previous ?? null,
        achievements: config.education.achievements ?? [],
      },
      experience: config.experience.map((exp) => ({
        company: exp.company,
        position: exp.position,
        duration: exp.duration,
        location: exp.location,
        type: exp.type,
        description: exp.description,
        technologies: exp.technologies,
      })),
      skillCategories: getSkillCategories(config),
      certifications: config.certifications ?? [],
      research: config.research ?? null,
      highlights: config.highlights ?? config.education.achievements ?? [],
      resumeFile: {
        title: config.resume.title,
        description: config.resume.description,
        lastUpdated: config.resume.lastUpdated,
        downloadUrl: config.resume.downloadUrl,
        fileType: config.resume.fileType,
      },
      social: {
        github: config.social.github,
        linkedin: config.social.linkedin,
        kaggle: config.social.kaggle,
        leetcode: config.social.leetcode,
      },
    };
  },
});

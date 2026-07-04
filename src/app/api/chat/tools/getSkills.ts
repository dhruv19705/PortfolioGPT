import { tool } from 'ai';
import { getConfig } from '@/lib/config-loader';
import { emptyToolParameters } from '@/lib/tool-schemas';
import { getSkillCategories } from '@/lib/portfolio-helpers';

export const getSkills = tool({
  description:
    'Use for technical skills, CGPA, education, certifications, experience timeline, "why hire you", and qualifications questions.',
  parameters: emptyToolParameters,
  execute: async () => {
    const config = getConfig();

    return {
      skillCategories: getSkillCategories(config),
      education: {
        current: config.education.current,
        previous: config.education.previous ?? null,
        achievements: config.education.achievements ?? [],
      },
      certifications: config.certifications ?? [],
      experience: config.experience.map((exp) => ({
        position: exp.position,
        company: exp.company,
        duration: exp.duration,
        location: exp.location,
        type: exp.type,
        technologies: exp.technologies,
        description: exp.description,
      })),
      research: config.research ?? null,
      personality: {
        workingStyle: config.personality.workingStyle,
        traits: config.personality.traits,
      },
    };
  },
});

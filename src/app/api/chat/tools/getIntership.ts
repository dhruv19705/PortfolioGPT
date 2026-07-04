import { tool } from 'ai';
import { getConfig } from '@/lib/config-loader';
import { emptyToolParameters } from '@/lib/tool-schemas';
import {
  buildHighlightsSummary,
  getInternshipAndResearchExperience,
  getSkillCategories,
} from '@/lib/portfolio-helpers';

export const getInternship = tool({
  description:
    'Use for internship availability, full-time roles, hiring, "are you open to opportunities", career goals, and what kind of work you want.',
  parameters: emptyToolParameters,
  execute: async () => {
    const config = getConfig();
    const { internship, personal, social, personality } = config;

    if (!internship.seeking) {
      return {
        seeking: false,
        message: 'Not currently seeking new opportunities.',
      };
    }

    const relevantExperience = getInternshipAndResearchExperience(
      config.experience
    );

    return {
      seeking: true,
      availability: internship.availability,
      preferences: {
        duration: internship.duration,
        startDate: internship.startDate,
        preferredLocation: internship.preferredLocation,
        focusAreas: internship.focusAreas,
        workStyle: internship.workStyle,
        goals: internship.goals,
      },
      relevantExperience: relevantExperience.map((exp) => ({
        position: exp.position,
        company: exp.company,
        duration: exp.duration,
        type: exp.type,
        highlights: exp.description,
      })),
      highlights: buildHighlightsSummary(config),
      topSkills: getSkillCategories(config)
        .slice(0, 4)
        .map((c) => ({ category: c.label, skills: c.skills.slice(0, 5) })),
      personality: {
        traits: personality.traits,
        workingStyle: personality.workingStyle,
        motivation: personality.motivation,
      },
      contact: {
        email: personal.email,
        phone: personal.phone ?? null,
        linkedin: social.linkedin,
        github: social.github,
      },
    };
  },
});

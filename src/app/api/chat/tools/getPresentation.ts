import { tool } from 'ai';
import { getConfig } from '@/lib/config-loader';
import { emptyToolParameters } from '@/lib/tool-schemas';
import { buildHighlightsSummary } from '@/lib/portfolio-helpers';

export const getPresentation = tool({
  description:
    'Use for introductions: who are you, tell me about yourself, background, passions, personality, fun facts, motivations, and general "about me" questions.',
  parameters: emptyToolParameters,
  execute: async () => {
    const config = getConfig();
    const { personal, education, personality } = config;

    return {
      name: personal.name,
      title: personal.title,
      location: personal.location,
      age: personal.age,
      bio: personal.bio,
      education: {
        current: education.current,
        previous: education.previous ?? null,
      },
      traits: personality.traits,
      interests: personality.interests,
      hobbies: personality.hobbies ?? [],
      sports: personality.sports ?? [],
      funFacts: personality.funFacts,
      workingStyle: personality.workingStyle,
      motivation: personality.motivation,
      highlights: buildHighlightsSummary(config),
      research: config.research
        ? {
            title: config.research.title,
            conference: config.research.conference,
            status: config.research.status,
          }
        : null,
    };
  },
});

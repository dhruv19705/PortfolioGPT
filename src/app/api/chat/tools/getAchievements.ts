import { tool } from 'ai';
import { emptyToolParameters } from '@/lib/tool-schemas';
import { getConfig } from '@/lib/config-loader';
import { buildHighlightsSummary } from '@/lib/portfolio-helpers';

export const getAchievements = tool({
  description:
    'Use for hackathons, awards, exam scores (JEE/MHTCET), IEEE research, certifications, competitions, and "what are your achievements" questions.',
  parameters: emptyToolParameters,
  execute: async () => {
    const config = getConfig();

    return {
      highlights: buildHighlightsSummary(config),
      educationAchievements: config.education.achievements ?? [],
      certifications: config.certifications ?? [],
      research: config.research ?? null,
      hackathons: [
        {
          name: 'CipherCop – 1st National Police Hackathon',
          result: '4th Place',
          project: 'ChainBreak – Blockchain Forensics Platform',
        },
        {
          name: 'WorldQuant Brain Hackathon',
          result: 'Gold Level, Top 25 Rank',
        },
      ],
      examScores: {
        jeeMains: '95.98 percentile',
        mhtcet: '98.62 percentile',
      },
    };
  },
});

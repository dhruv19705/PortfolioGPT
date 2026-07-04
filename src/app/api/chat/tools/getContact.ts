import { tool } from 'ai';
import { emptyToolParameters } from '@/lib/tool-schemas';
import { getConfig } from '@/lib/config-loader';

export const getContact = tool({
  description:
    'Use for contact info, email, phone, LinkedIn, GitHub, social profiles, location, and how to reach you.',
  parameters: emptyToolParameters,
  execute: async () => {
    const config = getConfig();
    const { personal, social, internship } = config;

    const socialProfiles = [
      { name: 'GitHub', url: social.github },
      { name: 'LinkedIn', url: social.linkedin },
      { name: 'Kaggle', url: social.kaggle },
      { name: 'LeetCode', url: social.leetcode },
      ...(social.twitter ? [{ name: 'Twitter', url: social.twitter }] : []),
      ...(social.fiverr ? [{ name: 'Fiverr', url: social.fiverr }] : []),
    ].filter((p) => p.url);

    return {
      contact: {
        name: personal.name,
        email: personal.email,
        phone: personal.phone ?? null,
        location: personal.location,
        handle: personal.handle,
        availability: internship.availability,
      },
      socialProfiles,
      focusAreas: internship.focusAreas,
      preferredLocation: internship.preferredLocation,
    };
  },
});

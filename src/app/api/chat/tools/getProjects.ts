import { tool } from 'ai';
import { emptyToolParameters } from '@/lib/tool-schemas';
import { getConfig } from '@/lib/config-loader';
import { getFeaturedProjects } from '@/lib/portfolio-helpers';

export const getProjects = tool({
  description:
    'Use for any project questions: portfolio overview, ChainBreak, Bitcoin classification, gold price NLP, stock screener, mutual funds, PDF Q&A, micro-conversion ML, or "what have you built".',
  parameters: emptyToolParameters,
  execute: async () => {
    const config = getConfig();
    const projects = getFeaturedProjects(config);

    return {
      totalCount: projects.length,
      featuredCount: projects.filter((p) => p.featured).length,
      projects: projects.map((project) => ({
        title: project.title,
        category: project.category,
        date: project.date,
        description: project.description,
        techStack: project.techStack,
        status: project.status,
        featured: project.featured,
        links: project.links,
        metrics: project.metrics ?? [],
        achievements: project.achievements ?? [],
      })),
      flagship: projects.find((p) => p.featured)?.title ?? projects[0]?.title,
    };
  },
});

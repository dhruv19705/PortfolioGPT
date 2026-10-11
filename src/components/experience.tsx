'use client';

import { motion } from 'framer-motion';
import { Briefcase, ExternalLink, FlaskConical, GraduationCap, Users } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';

const TYPE_ICON: Record<string, React.ElementType> = {
  Internship: Briefcase,
  Research: FlaskConical,
  Leadership: Users,
};

/** Split a long description into readable bullet points. */
function toBullets(description: string): string[] {
  return description
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function Experience() {
  const { experience, education } = getConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-4xl px-1 py-4 sm:px-4"
    >
      <h2 className="text-foreground mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
        Experience
      </h2>

      <ol className="border-border relative ml-3 space-y-6 border-l">
        {experience.map((job, i) => {
          const Icon = TYPE_ICON[job.type] ?? Briefcase;
          const isCurrent = /present/i.test(job.duration);
          return (
            <motion.li
              key={`${job.company}-${job.position}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.06 * i }}
              className="ml-6"
            >
              <span
                className={`ring-background absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ${
                  isCurrent ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-3 w-3" />
              </span>

              <div className="bg-card rounded-2xl border p-4 sm:p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <h3 className="text-foreground font-semibold leading-snug">
                      {job.position}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ''}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isCurrent
                        ? 'bg-brand/15 text-brand'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {job.duration}
                  </span>
                </div>

                <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-4 text-sm leading-relaxed marker:text-border">
                  {toBullets(job.description).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                {job.technologies?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    View certificate <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      <h2 className="text-foreground mt-10 mb-4 text-xl font-bold tracking-tight sm:text-2xl">
        Education
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {[education.current, education.previous]
          .filter((e): e is NonNullable<typeof e> => Boolean(e?.institution))
          .map((edu) => (
            <div key={edu.institution} className="bg-card rounded-2xl border p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2">
                <GraduationCap className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-xs">{edu.duration}</span>
              </div>
              <h3 className="text-foreground font-semibold leading-snug">{edu.institution}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{edu.degree}</p>
              <p className="text-foreground mt-2 text-sm font-medium">CGPA {edu.cgpa}</p>
            </div>
          ))}
      </div>
    </motion.div>
  );
}

export default Experience;

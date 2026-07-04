'use client';

import { motion } from 'framer-motion';
import { Award, GraduationCap, Trophy } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';
import { buildHighlightsSummary } from '@/lib/portfolio-helpers';

export function Achievements() {
  const config = getConfig();
  const highlights = buildHighlightsSummary(config);
  const certifications = config.certifications ?? [];
  const research = config.research;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-accent mx-auto w-full max-w-4xl rounded-3xl px-6 py-8 sm:px-10"
    >
      <div className="mb-6 flex items-center gap-3">
        <Trophy className="text-primary h-6 w-6" />
        <h2 className="text-foreground text-xl font-semibold">
          Achievements & Recognition
        </h2>
      </div>

      <ul className="space-y-3">
        {highlights.map((item, i) => (
          <li
            key={i}
            className="bg-background flex gap-3 rounded-xl border p-4 text-sm"
          >
            <Award className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {research && (
        <div className="bg-background mt-6 rounded-xl border p-5">
          <div className="mb-2 flex items-center gap-2">
            <GraduationCap className="text-primary h-5 w-5" />
            <h3 className="font-medium">Research</h3>
          </div>
          <p className="text-sm font-medium">{research.title}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {research.conference} · {research.status}
          </p>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <span
                key={cert.name}
                className="bg-background rounded-full border px-3 py-1 text-xs"
              >
                {cert.name} ({cert.issuer})
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

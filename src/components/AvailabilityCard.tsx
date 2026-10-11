'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Code2, Globe, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getConfig } from '@/lib/config-loader';

const AvailabilityCard = () => {
  const router = useRouter();
  const config = getConfig();
  const { personal, internship, education } = config;
  const readSkills = (...keys: string[]) => {
    for (const key of keys) {
      const value = config.skills[key];
      if (Array.isArray(value)) return value;
    }
    return [];
  };

  const handleContactClick = () => {
    // Navigate to home page with the contact preset question
    router.push('/?query=How can I reach you?');
  };

  // Get technical skills from config
  const technicalSkills = [
    ...readSkills('programming'),
    ...readSkills('ml_ai').slice(0, 2),
    ...readSkills('web_development').slice(0, 2),
    ...readSkills('devops_cloud', 'devops_tools').slice(0, 2),
  ].slice(0, 8);

  const softSkills = readSkills('soft_skills');

  // Get key achievements
  const keyAchievements = education.achievements ? education.achievements.slice(0, 3) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card mx-auto w-full max-w-4xl rounded-3xl border px-5 py-6 font-sans sm:px-8 sm:py-8"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {/* Avatar placeholder */}
          <div className="bg-muted h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
            <img
              src={personal.avatar}
              alt={personal.name}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-foreground text-xl font-semibold sm:text-2xl">
              {personal.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {internship.seeking ? 'Available for Opportunities' : 'Open to Connections'}
            </p>
          </div>
        </div>

        {/* Enhanced Live badge with availability status */}
        {internship.seeking && (
          <span className="flex shrink-0 items-center gap-1.5 self-start rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 sm:self-auto dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Open to opportunities
          </span>
        )}
      </div>

      {/* Availability Highlight Section */}
      {internship.seeking && (
        <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Current Availability Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Status</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                {internship.availability}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Looking for</p>
              <div className="flex flex-wrap gap-1.5">
                {internship.focusAreas.map((area) => (
                  <span key={area} className="bg-muted text-foreground rounded-full px-2.5 py-0.5 text-xs">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internship Info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Preferred duration</p>
            <p className="text-muted-foreground text-sm">
              {internship.seeking ? internship.duration : 'Open to opportunities'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-green-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">
              Based in {personal.location} · {internship.preferredLocation}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex items-start gap-3 sm:col-span-2">
          <Code2 className="mt-1 h-5 w-5 text-purple-500" />
          <div className="w-full">
            <p className="text-foreground text-sm font-medium">Tech Stack</p>
            <div className="text-muted-foreground grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
              <ul className="decoration-none list-disc pl-4">
                {technicalSkills.slice(0, 4).map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
              <ul className="list-disc pl-4">
                {technicalSkills.slice(4, 8).map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
                <li>
                  <a
                    href="/?query=What%20are%20your%20skills%3F%20Give%20me%20a%20list%20of%20your%20soft%20and%20hard%20skills."
                    className="cursor-pointer items-center text-blue-500 underline"
                  >
                    See more
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What I bring */}
      <div className="mt-10">
        <p className="text-foreground mb-2 text-lg font-semibold">
          What I bring
        </p>
        <ul className="text-muted-foreground list-disc space-y-1.5 pl-5 text-sm">
          {(config.highlights?.length ? config.highlights : keyAchievements).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Goal */}
      <div className="mt-8">
        <p className="text-foreground mb-2 text-lg font-semibold">Goal</p>
        <p className="text-muted-foreground text-sm">
          {internship.goals || 'Looking to make a meaningful impact through innovative technology solutions.'}
        </p>
      </div>

      {/* Contact button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleContactClick}
          className="bg-foreground text-background cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Contact me
        </button>
      </div>
    </motion.div>
  );
};

export default AvailabilityCard;

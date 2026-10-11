'use client';

import { motion, Variants } from 'framer-motion';
import {
  Award,
  Blocks,
  Briefcase,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Trophy,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { presetReplies, getConfig } from '@/lib/config-loader';

interface ChatLandingProps {
  submitQuery: (query: string) => void;
  handlePresetReply?: (question: string, reply: string, tool: string) => void;
}

// `label` is what's shown; `query` must match a preset key in config-parser
const SUGGESTED_QUESTIONS = [
  { icon: MessageSquare, label: 'Who are you?', query: 'Who are you?', hint: 'Background & interests' },
  { icon: Briefcase, label: 'Where have you worked?', query: 'Tell me about your internship experience', hint: 'Veefin, Ashna AI, EUCLID…' },
  { icon: Blocks, label: 'Tell me about ChainBreak', query: 'Tell me about ChainBreak', hint: 'Blockchain forensics platform' },
  { icon: Trophy, label: 'Biggest achievements?', query: 'What are your major achievements?', hint: 'IEEE paper, hackathons' },
  { icon: Award, label: 'What are your skills?', query: 'What are your skills?', hint: 'ML, NLP, blockchain, finance' },
  { icon: Mail, label: 'How can I reach you?', query: 'How can I reach you?', hint: 'Email, LinkedIn, GitHub' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const ChatLanding: React.FC<ChatLandingProps> = ({ submitQuery, handlePresetReply }) => {
  const config = getConfig();
  const { personal, education, social, resume, internship } = config;
  const currentRole = config.experience.find((e) => /present/i.test(e.duration));
  const cgpa = Number.parseFloat(education.current.cgpa);

  const stats = [
    { value: Number.isFinite(cgpa) ? cgpa.toFixed(2) : education.current.cgpa, label: 'CGPA' },
    { value: 'IEEE', label: 'ICCCNT 2025 paper' },
    { value: '4th', label: 'of 1000+ teams, CipherCop' },
  ];

  const links = [
    { label: 'GitHub', href: social.github, icon: Github },
    { label: 'LinkedIn', href: social.linkedin, icon: Linkedin },
    { label: 'Email', href: `mailto:${personal.email}`, icon: Mail },
    { label: 'Resume', href: resume.downloadUrl, icon: FileText },
  ].filter((l) => l.href);

  const handleQuestionClick = (questionText: string) => {
    const preset = presetReplies[questionText];
    if (preset && handlePresetReply) {
      handlePresetReply(questionText, preset.reply, preset.tool);
    } else {
      submitQuery(questionText);
    }
  };

  return (
    <motion.div
      className="flex w-full flex-col items-center px-4 pt-6 pb-4 sm:pt-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero */}
      <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
        <Image
          src="/avatar.png"
          alt={personal.name}
          width={96}
          height={96}
          priority
          className="bg-muted ring-border h-20 w-20 rounded-full object-cover object-top ring-1 sm:h-24 sm:w-24"
        />
        <h1 className="text-foreground mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Hi, I&apos;m {personal.name.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1.5 max-w-md text-sm sm:text-base">
          {personal.title.replace(/\s*\|\s*/g, ' · ')}
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-4 flex flex-wrap items-center justify-center gap-2"
      >
        <span className="bg-muted text-muted-foreground flex items-center gap-1 rounded-full px-3 py-1 text-xs">
          <MapPin className="h-3 w-3" /> {personal.location}
        </span>
        {currentRole && (
          <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
            {currentRole.position} @ <span className="text-foreground font-medium">{currentRole.company}</span>
          </span>
        )}
        {internship.seeking && (
          <button
            type="button"
            onClick={() => handleQuestionClick('Am I available for opportunities?')}
            className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Open to opportunities
          </button>
        )}
      </motion.div>

      {/* Quick links */}
      <motion.div variants={itemVariants} className="mt-4 flex items-center gap-2">
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.dl
        variants={itemVariants}
        className="mt-6 grid w-full max-w-md grid-cols-3 gap-2"
      >
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border px-3 py-2.5 text-center">
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-foreground text-lg font-semibold tabular-nums">{s.value}</dd>
            <dd className="text-muted-foreground text-[11px] leading-tight">{s.label}</dd>
          </div>
        ))}
      </motion.dl>

      {/* Suggested questions */}
      <motion.p
        variants={itemVariants}
        className="text-muted-foreground mt-8 mb-3 text-xs font-medium tracking-wide uppercase"
      >
        Ask my AI twin
      </motion.p>
      <motion.div
        className="grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2"
        variants={containerVariants}
      >
        {SUGGESTED_QUESTIONS.map(({ icon: Icon, label, query, hint }) => (
          <motion.button
            key={query}
            type="button"
            className="bg-card hover:bg-muted group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors"
            onClick={() => handleQuestionClick(query)}
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
          >
            <span className="bg-muted text-muted-foreground group-hover:text-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="text-foreground block truncate text-sm font-medium">{label}</span>
              <span className="text-muted-foreground block truncate text-xs">{hint}</span>
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChatLanding;

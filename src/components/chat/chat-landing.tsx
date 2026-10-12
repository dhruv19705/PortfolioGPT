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
import { CountUp } from '@/components/fx/count-up';
import { RotatingText } from '@/components/fx/rotating-text';
import { SpotlightCard, trackSpotlight } from '@/components/fx/spotlight';

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

const BUILDS = [
  'RAG assistants',
  'blockchain forensics',
  'ML for finance',
  'NLP pipelines',
  'enterprise AI',
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 260, damping: 28 },
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
      className="relative flex w-full flex-col items-center px-4 pt-6 pb-4 sm:pt-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Soft brand glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 mx-auto h-80 max-w-2xl bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_22%,transparent),transparent)] blur-2xl"
      />

      {/* Hero */}
      <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
        <div className="rounded-full bg-gradient-to-br from-brand via-violet-500 to-emerald-400 p-[2px] shadow-[0_0_40px_-8px_var(--brand)]">
        <Image
          src="/avatar.png"
          alt={personal.name}
          width={96}
          height={96}
          priority
          className="bg-muted ring-background h-20 w-20 rounded-full object-cover object-top ring-2 sm:h-24 sm:w-24"
        />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-shimmer">Hi, I&apos;m {personal.name.split(' ')[0]}</span>{' '}
          <motion.span
            className="inline-block origin-[70%_70%]"
            animate={{ rotate: [0, 16, -8, 16, 0] }}
            transition={{ duration: 1.6, delay: 0.6, repeat: Infinity, repeatDelay: 4 }}
          >
            👋
          </motion.span>
        </h1>
        <p className="text-muted-foreground mt-1.5 max-w-md text-sm sm:text-base">
          {personal.title.replace(/\s*\|\s*/g, ' · ')}
        </p>
        <p className="text-foreground/90 mt-2 text-base sm:text-lg">
          I build <RotatingText words={BUILDS} />
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
            className="border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-brand/60 hover:shadow-[0_0_18px_-4px_var(--brand)] flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
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
          <SpotlightCard key={s.label} className="bg-card/60 rounded-xl border px-3 py-2.5 text-center backdrop-blur-md">
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-foreground text-lg font-semibold tabular-nums">
              <CountUp value={s.value} />
            </dd>
            <dd className="text-muted-foreground text-[11px] leading-tight">{s.label}</dd>
          </SpotlightCard>
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
            className="spotlight-card bg-card/60 group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left backdrop-blur-md"
            onPointerMove={trackSpotlight}
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

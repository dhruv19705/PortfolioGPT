'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Trophy,
} from 'lucide-react';
import { contactInfo, getConfig, resumeDetails } from '@/lib/config-loader';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Kaggle: Trophy,
  LeetCode: Code2,
};

export function Contact() {
  const { personal } = getConfig();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the mailto link still works
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="bg-card w-full overflow-hidden rounded-3xl border px-5 py-6 font-sans sm:px-8 sm:py-8">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              Let&apos;s talk
            </h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5" /> {personal.location}
            </p>
          </div>
          <span className="text-muted-foreground text-sm">{contactInfo.handle}</span>
        </div>

        {/* Primary channels */}
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="bg-muted/60 flex items-center gap-2 rounded-xl border p-1.5 pl-3">
            <Mail className="text-brand h-4 w-4 shrink-0" />
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-foreground min-w-0 flex-1 truncate text-sm font-medium hover:underline"
            >
              {contactInfo.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
              className="text-muted-foreground hover:text-foreground hover:bg-background flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          {personal.phone && (
            <a
              href={`tel:${personal.phone.replace(/\s+/g, '')}`}
              className="bg-muted/60 hover:bg-muted flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors"
            >
              <Phone className="text-brand h-4 w-4 shrink-0" />
              <span className="text-foreground text-sm font-medium">{personal.phone}</span>
            </a>
          )}
        </div>

        {/* Profiles */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {contactInfo.socials.map((social) => {
            const Icon = SOCIAL_ICONS[social.name] ?? ArrowUpRight;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:bg-muted group flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{social.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            );
          })}
          {resumeDetails.downloadUrl && (
            <a
              href={resumeDetails.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground hover:bg-muted group flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors"
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="flex-1">Resume</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;

'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, Code, Cpu, Users, Database, Shield, Link, BarChart2, Wrench, Brain, Microchip } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';

const categoryConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  programming: {
    icon: <Code className="h-5 w-5" />,
    color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30',
  },
  ml_ai: {
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30',
  },
  data_analytics: {
    icon: <BarChart2 className="h-5 w-5" />,
    color: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30',
  },
  web_development: {
    icon: <Cpu className="h-5 w-5" />,
    color: 'bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30',
  },
  blockchain: {
    icon: <Link className="h-5 w-5" />,
    color: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30',
  },
  databases: {
    icon: <Database className="h-5 w-5" />,
    color: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30',
  },
  devops_cloud: {
    icon: <Wrench className="h-5 w-5" />,
    color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
  },
  devops_tools: {
    icon: <Wrench className="h-5 w-5" />,
    color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
  },
  iot_hardware: {
    icon: <Microchip className="h-5 w-5" />,
    color: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30',
  },
  security: {
    icon: <Shield className="h-5 w-5" />,
    color: 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30',
  },
  coursework: {
    icon: <BookOpen className="h-5 w-5" />,
    color: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30',
  },
  soft_skills: {
    icon: <Users className="h-5 w-5" />,
    color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
  },
};

// Human-readable labels for each key
const categoryLabels: Record<string, string> = {
  programming: 'Programming Languages',
  ml_ai: 'ML / AI Technologies',
  data_analytics: 'Data & Analytics',
  web_development: 'Web Development',
  blockchain: 'Blockchain',
  databases: 'Databases',
  devops_cloud: 'DevOps & Cloud',
  devops_tools: 'DevOps & Tools',
  iot_hardware: 'IoT & Hardware',
  security: 'Security & OSINT',
  coursework: 'Relevant Coursework',
  soft_skills: 'Soft Skills',
};

const Skills = () => {
  const config = getConfig();
  const skills = config.skills as Record<string, string[]>;

  // Build skill sections dynamically from whatever keys exist in config
  const skillsData = Object.entries(skills)
    .filter(([, items]) => Array.isArray(items) && items.length > 0)
    .map(([key, items]) => ({
      key,
      category: categoryLabels[key] ?? key,
      icon: categoryConfig[key]?.icon ?? <Code className="h-5 w-5" />,
      color: categoryConfig[key]?.color ?? 'bg-muted text-muted-foreground border border-border',
      skills: items,
    }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl px-1 pb-6 sm:px-4"
    >
      <Card className="w-full gap-0 border-none bg-transparent p-0 shadow-none">
        <CardHeader className="p-0">
          <CardTitle className="text-foreground mt-4 mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <motion.div
            className="grid grid-cols-1 gap-3 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section) => (
              <motion.section
                key={section.key}
                className={`bg-card rounded-2xl border p-4 sm:p-5 ${
                  section.skills.length > 12 ? 'md:col-span-2' : ''
                }`}
                variants={itemVariants}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">{section.icon}</span>
                  <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-1.5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge
                        className={`${section.color} rounded-full border px-2.5 py-1 text-xs leading-snug font-normal`}
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;

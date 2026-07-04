'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, Cpu, Users, Database, Shield, Link, BarChart2, Wrench, Brain, Microchip } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';

const categoryConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  programming: {
    icon: <Code className="h-5 w-5" />,
    color: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  },
  ml_ai: {
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
  },
  data_analytics: {
    icon: <BarChart2 className="h-5 w-5" />,
    color: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
  },
  web_development: {
    icon: <Cpu className="h-5 w-5" />,
    color: 'bg-green-500/15 text-green-300 border border-green-500/30',
  },
  blockchain: {
    icon: <Link className="h-5 w-5" />,
    color: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
  },
  databases: {
    icon: <Database className="h-5 w-5" />,
    color: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
  },
  devops_cloud: {
    icon: <Wrench className="h-5 w-5" />,
    color: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  },
  devops_tools: {
    icon: <Wrench className="h-5 w-5" />,
    color: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  },
  iot_hardware: {
    icon: <Microchip className="h-5 w-5" />,
    color: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
  },
  security: {
    icon: <Shield className="h-5 w-5" />,
    color: 'bg-red-500/15 text-red-300 border border-red-500/30',
  },
  soft_skills: {
    icon: <Users className="h-5 w-5" />,
    color: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
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
      className="mx-auto w-full max-w-5xl rounded-4xl px-5 sm:px-8 pb-10 sm:pb-14"
    >
      <Card className="w-full gap-0 border-none bg-transparent p-0 shadow-none">
        <CardHeader className="p-0">
          <CardTitle className="text-primary mt-6 sm:mt-8 mb-10 sm:mb-12 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <motion.div
            className="flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section, sectionIndex) => (
              <motion.section
                key={section.key}
                className={
                  sectionIndex > 0
                    ? 'mt-12 sm:mt-14 border-t border-border/40 pt-12 sm:pt-14'
                    : ''
                }
                variants={itemVariants}
              >
                <div className="mb-5 sm:mb-6 flex items-center gap-3">
                  <span className="text-muted-foreground">{section.icon}</span>
                  <h3 className="text-accent-foreground text-base sm:text-lg font-semibold tracking-tight">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2.5 sm:gap-3"
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
                        className={`${section.color} rounded-full border px-3.5 py-2 sm:px-4 sm:py-2.5 font-normal text-xs sm:text-sm leading-snug`}
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

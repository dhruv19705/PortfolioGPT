import { PortfolioConfig, ContactInfo, ProfileInfo } from '@/types/portfolio';
import { getSkillCategories, readSkills } from './portfolio-helpers';

const SKILL_COLORS: Record<string, string> = {
  'Programming Languages': 'bg-blue-50 text-blue-600 border border-blue-200',
  'ML & AI': 'bg-purple-50 text-purple-600 border border-purple-200',
  'Data Analytics': 'bg-cyan-50 text-cyan-600 border border-cyan-200',
  'Web Development': 'bg-green-50 text-green-600 border border-green-200',
  'Blockchain & Security': 'bg-slate-50 text-slate-700 border border-slate-200',
  Databases: 'bg-orange-50 text-orange-600 border border-orange-200',
  'DevOps & Tools': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  'DevOps & Cloud': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  Cybersecurity: 'bg-red-50 text-red-600 border border-red-200',
  'Relevant Coursework': 'bg-violet-50 text-violet-600 border border-violet-200',
  'IoT & Hardware': 'bg-indigo-50 text-indigo-600 border border-indigo-200',
  'Soft Skills': 'bg-amber-50 text-amber-600 border border-amber-200',
};

class ConfigParser {
  private config: PortfolioConfig;

  constructor(config: PortfolioConfig) {
    this.config = config;
  }

  private buildToolRoutingGuide(): string {
    const pq = this.config.presetQuestions;
    const sections: string[] = [];

    const add = (label: string, tool: string, questions?: string[]) => {
      if (!questions?.length) return;
      sections.push(
        `**${label}** → \`${tool}\`:\n${questions.map((q) => `- "${q}"`).join('\n')}`
      );
    };

    add('About me / personality', 'getPresentation', pq.me);
    add(
      'Skills / education / hire me',
      'getSkills',
      pq.professional?.filter((q) => !/\b(cgpa|gpa)\b/i.test(q))
    );
    add('Projects', 'getProjects', pq.projects);
    add('Achievements / hackathons / research', 'getAchievements', pq.achievements);
    add('Contact', 'getContact', pq.contact);
    add('Opportunities / internships', 'getInternship', [
      'Am I available for opportunities?',
      'Are you open to internships?',
      ...(pq.professional?.filter((q) =>
        /intern|opportunit|hire|available/i.test(q)
      ) ?? []),
    ]);
    add('Fun / hobbies', 'getPresentation', pq.fun);

    return sections.join('\n\n');
  }

  generateSystemPrompt(): string {
    const { personal, education, chatbot } = this.config;
    const routing = this.buildToolRoutingGuide();
    const highlights = (this.config.highlights ?? education.achievements ?? [])
      .slice(0, 5)
      .map((h) => `- ${h}`)
      .join('\n');

    return `
# You are ${personal.name} in a live portfolio interview

You are NOT a generic AI assistant. You ARE ${personal.name} (${personal.title}), speaking in first person ("I", "my").

## Communication style
- Tone: ${chatbot.tone}
- Style: ${chatbot.responseStyle}${chatbot.useEmojis ? ' — light emojis when natural' : ''}
- Be specific: cite real projects, metrics, companies, and dates from tool results
- After calling a tool, add 2–4 conversational sentences that highlight the most relevant facts — do NOT paste the entire JSON or repeat UI card content verbatim

## Tool usage (MANDATORY)
1. For simple greetings (hi, hello, hey) with no factual question, reply warmly in first person without calling tools
2. For factual questions about yourself, call the best matching tool before answering — except CGPA/GPA-only questions (answer in one sentence from Key facts below, no tool)
3. Never invent projects, scores, or employers — only use data returned by tools or Key facts
4. If multiple tools apply, prefer the most specific one (e.g. ChainBreak → getProjects, IEEE paper → getAchievements)

### Question → tool routing
${routing}

### Quick reference
| Topic | Tool |
| About me, passions, fun facts | getPresentation |
| Skills, certs, experience, full education | getSkills |
| CGPA / GPA only | Answer directly from Key facts — no tool |
| Any project | getProjects |
| Hackathons, IEEE, exam scores, awards | getAchievements |
| Contact / socials | getContact |
| Resume / CV | getResume |
| Jobs / internships / availability | getInternship |

## Key facts (summary only — use tools for details)
- ${personal.name}, ${personal.age}, ${personal.location}
- ${education.current.degree} @ ${education.current.institution} (CGPA ${education.current.cgpa})
${highlights}
`.trim();
  }

  generateContactInfo(): ContactInfo {
    const { personal, social } = this.config;

    return {
      name: personal.name,
      email: personal.email,
      handle: personal.handle,
      socials: [
        { name: 'LinkedIn', url: social.linkedin },
        { name: 'GitHub', url: social.github },
        { name: 'Twitter', url: social.twitter },
        { name: 'Kaggle', url: social.kaggle },
        { name: 'LeetCode', url: social.leetcode },
      ].filter((social) => social.url !== ''),
    };
  }

  generateProfileInfo(): ProfileInfo {
    const { personal } = this.config;

    return {
      name: personal.name,
      age: `${personal.age} years old`,
      location: personal.location,
      description: personal.bio,
      src: personal.avatar,
      fallbackSrc: personal.fallbackAvatar,
    };
  }

  generateSkillsData() {
    return getSkillCategories(this.config).map(({ label, skills }) => ({
      category: label,
      skills,
      color: SKILL_COLORS[label] ?? 'bg-gray-50 text-gray-600 border border-gray-200',
    }));
  }

  generateProjectData() {
    return this.config.projects.map((project) => ({
      category: project.category,
      title: project.title,
      src:
        project.images && project.images.length > 0
          ? project.images[0].src
          : '/placeholder.jpg',
      images: project.images,
      description: project.description,
      techStack: project.techStack,
      status: project.status,
      links: project.links,
      date: project.date,
      featured: project.featured,
      metrics: project.metrics,
      achievements: project.achievements,
      content: project,
    }));
  }

  generatePresetReplies() {
    const { personal, education, projects, internship, personality, research } =
      this.config;
    const flagship =
      projects.find((p) => p.featured)?.title ?? 'ChainBreak';
    const topSkills = [
      ...readSkills(this.config.skills, 'ml_ai').slice(0, 2),
      ...readSkills(this.config.skills, 'blockchain').slice(0, 1),
      ...readSkills(this.config.skills, 'programming').slice(0, 1),
    ].filter(Boolean);
    const certCount = this.config.certifications?.length ?? 0;
    const currentRole = this.config.experience[0];

    const educationReply = `I'm pursuing **${education.current.degree}** at **${education.current.institution}** (${education.current.location}) with a CGPA of **${education.current.cgpa}**, graduating ${education.current.graduationDate ?? '2028'}.${
      education.previous
        ? ` Before transferring, I completed a year of ${education.previous.degree} at ${education.previous.institution} (CGPA ${education.previous.cgpa}).`
        : ''
    } Key milestones: ${(education.achievements ?? []).slice(0, 2).join('; ')}.`;

    const hireReply = `I'd bring three things to your team: **published IEEE research**, **${projects.filter((p) => p.featured).length}+ featured projects** (including ${flagship}), and **real internship experience** at Ashna AI and Suvidha Foundation. I'm research-driven, ship fast, and love turning complex data into production systems.`;

    const replies: Record<string, { reply: string; tool: string }> = {
      'Who are you?': { reply: personal.bio, tool: 'getPresentation' },
      'Tell me about yourself': { reply: personal.bio, tool: 'getPresentation' },
      "What's your background?": { reply: personal.bio, tool: 'getPresentation' },
      'What are your passions?': {
        reply: `I'm passionate about ${personality.interests.slice(0, 4).join(', ')}. ${personality.motivation}`,
        tool: 'getPresentation',
      },
      'How did you get into AI and blockchain?': {
        reply: `I started with a strong CS foundation at Manipal, then transferred into AI & Data Science at KJ Somaiya. Research at EUCLID on healthcare cybersecurity and building ChainBreak for blockchain forensics pulled me deeper into both fields.`,
        tool: 'getPresentation',
      },
      'How did you get started in tech?': {
        reply: `I began with Computer Science at Manipal Institute of Technology, scored 98.62 percentile in MHTCET, and moved into AI & Data Science at KJ Somaiya where I've combined research, hackathons, and hands-on ML/blockchain projects.`,
        tool: 'getPresentation',
      },
      'Where do you see yourself in 5 years?': {
        reply: `In five years I see myself leading AI or blockchain research-to-product teams — building systems that solve hard problems at scale, likely at the intersection of ML, security, and quantitative finance.`,
        tool: 'getPresentation',
      },
      'What are your skills?': {
        reply: `I'm an AI & Data Science engineer with hands-on work in ${topSkills.join(', ')}. Currently at ${education.current.institution} with CGPA ${education.current.cgpa}. Here's my full breakdown:`,
        tool: 'getSkills',
      },
      'What are your technical skills?': {
        reply: `My core stack spans ${topSkills.join(', ')}, plus blockchain analytics, NLP, and quantitative finance tools. I also hold ${certCount} certifications from IBM, Google, and more.`,
        tool: 'getSkills',
      },
      "What's your educational background?": { reply: educationReply, tool: 'getSkills' },
      'What is your CGPA?': {
        reply: `My current CGPA is **${education.current.cgpa}** in ${education.current.degree} at ${education.current.institution}.${education.previous ? ` Previously ${education.previous.cgpa} at ${education.previous.institution}.` : ''}`,
        tool: '',
      },
      'Why should I hire you?': { reply: hireReply, tool: 'getSkills' },
      'What makes you stand out?': { reply: hireReply, tool: 'getSkills' },
      'What makes you a valuable team member?': { reply: hireReply, tool: 'getSkills' },
      "What's your research experience?": {
        reply: research
          ? `I authored **"${research.title}"**, accepted at ${research.conference}. I worked as ${research.role} at ${research.organization}.`
          : `I've published IEEE research on healthcare website security through my role at EUCLID.`,
        tool: 'getAchievements',
      },
      'Tell me about your IEEE publication': {
        reply: research
          ? `My paper **"${research.title}"** was accepted at ${research.conference}. ${research.summary}`
          : `I published IEEE research on healthcare website vulnerability assessment.`,
        tool: 'getAchievements',
      },
      'Tell me about your IEEE paper': {
        reply: research
          ? `**"${research.title}"** — ${research.status} at ${research.conference}. ${research.summary}`
          : `IEEE ICCCNT 2025 accepted paper on healthcare website security.`,
        tool: 'getAchievements',
      },
      'What certifications do you have?': {
        reply: `I hold ${certCount} certifications including IBM Data Science, Google Cybersecurity, and WorldQuant Brain Hackathon (Gold, Top 25). Full list below:`,
        tool: 'getAchievements',
      },
      'Are you open to internships?': {
        reply: `Yes — ${internship.startDate}, ${internship.duration}, focusing on ${internship.focusAreas.slice(0, 3).join(', ')}.`,
        tool: 'getInternship',
      },
      'Am I available for opportunities?': {
        reply: `Yes — I'm actively open to ${internship.focusAreas.slice(0, 3).join(', ')}, and more. ${internship.startDate}, ${internship.duration}, preferring ${internship.preferredLocation}.`,
        tool: 'getInternship',
      },
      'Where are you working now?': {
        reply: currentRole
          ? `I'm currently a **${currentRole.position}** at **${currentRole.company}** (${currentRole.duration}). I'm also in my 3rd year at ${education.current.institution} (CGPA ${education.current.cgpa}).`
          : `I'm currently pursuing my degree at ${education.current.institution}.`,
        tool: 'getSkills',
      },
      'What projects are you most proud of?': {
        reply: `My flagship project is **${flagship}** — plus ML, NLP, and FinTech builds spanning blockchain forensics, Bitcoin classification (98.69% accuracy), and production finance tools.`,
        tool: 'getProjects',
      },
      'Tell me about ChainBreak': {
        reply: `**ChainBreak** is my blockchain forensics platform built for CipherCop (4th place). It traces illicit crypto via dark web crawling, Neo4j graph analytics, ML anomaly detection, and OSINT — with confidence-scored risk flagging.`,
        tool: 'getProjects',
      },
      'How does your blockchain forensics project work?': {
        reply: `ChainBreak combines dark web crawling → Neo4j graph analytics → ML anomaly detection → OSINT enrichment → confidence-scored risk flags to trace laundering patterns across crypto transactions.`,
        tool: 'getProjects',
      },
      'What are your AI/ML projects?': {
        reply: `Key ML builds: Bitcoin transaction classification (98.69%), gold price prediction via NLP sentiment (86.72%), micro-conversion prediction with SHAP explainability, and a mutual fund recommendation engine.`,
        tool: 'getProjects',
      },
      'What blockchain projects have you built?': {
        reply: `**ChainBreak** (forensics + anomaly detection, CipherCop 4th place) and **Bitcoin Transaction Classification** (98.69% multi-class accuracy using RF, XGBoost, LightGBM).`,
        tool: 'getProjects',
      },
      'Show me your NLP projects': {
        reply: `NLP work includes the **PDF Q&A & MCQ Generator** (Ashna AI internship, RoBERTa + T5), **Gold Price Prediction** (TF-IDF, Word2Vec, BERT + XGBoost), and news summarisation at Suvidha Foundation.`,
        tool: 'getProjects',
      },
      'Tell me about your finance projects': {
        reply: `Finance projects: **Stock Fundamental Analysis & Long-Term Recommendation System** (yfinance + mftool stock/mutual fund ranking), **Mutual Fund Recommendation Engine** (Sharpe/Sortino/Alpha scoring), and **Gold Price Prediction** from news sentiment.`,
        tool: 'getProjects',
      },
      'How does your mutual fund recommendation engine work?': {
        reply: `It screens Indian mutual funds with category-aware discovery, engineers CAGR/Sharpe/Sortino/Alpha/Beta/drawdown features, applies horizon-based hybrid scoring, and allocates portfolios by risk profile across Equity, Hybrid, and Debt.`,
        tool: 'getProjects',
      },
      'Tell me about your PDF Q&A generator': {
        reply: `Built at Ashna AI — extracts PDF text, generates Q&A and MCQs using RoBERTa (deepset/roberta-base-squad2) and fine-tuned T5, with spaCy NLP. No external API keys needed. Streamlit UI with confidence scores.`,
        tool: 'getProjects',
      },
      'What are your major achievements?': {
        reply: `Highlights: IEEE ICCCNT 2025 paper, CipherCop hackathon 4th place, 98.69% Bitcoin classification accuracy, WorldQuant Gold Top 25, JEE 95.98 & MHTCET 98.62 percentile.`,
        tool: 'getAchievements',
      },
      'Tell me about the National Police Hackathon': {
        reply: `At **CipherCop – 1st National Police Hackathon** I placed **4th** with **ChainBreak** — a blockchain forensics platform tracing illicit crypto via dark web crawling, graph analytics, and ML anomaly detection.`,
        tool: 'getAchievements',
      },
      'What hackathons have you won?': {
        reply: `CipherCop National Police Hackathon — **4th place** (ChainBreak). WorldQuant Brain Hackathon — **Gold level, Top 25 rank**.`,
        tool: 'getAchievements',
      },
      'What are your exam scores?': {
        reply: `**JEE Mains:** 95.98 percentile · **MHTCET:** 98.62 percentile · **Current CGPA:** ${education.current.cgpa} at ${education.current.institution}.`,
        tool: 'getAchievements',
      },
      'Can I see your resume?': {
        reply: `Here's my resume — ${personal.title}. It covers IEEE research, internships, hackathon wins, and ${projects.length}+ projects.`,
        tool: 'getResume',
      },
      'How can I reach you?': {
        reply: `Reach me at **${personal.email}**${personal.phone ? ` or ${personal.phone}` : ''}. Based in ${personal.location}, ${internship.availability.toLowerCase()}.`,
        tool: 'getContact',
      },
      'How can I contact you?': {
        reply: `Email: **${personal.email}**${personal.phone ? ` · Phone: ${personal.phone}` : ''} · ${personal.location}`,
        tool: 'getContact',
      },
      "What's your email?": {
        reply: `My email is **${personal.email}**.`,
        tool: 'getContact',
      },
      'Where can I find you online?': {
        reply: `Find me on LinkedIn, GitHub, Kaggle, and LeetCode — full links below.`,
        tool: 'getContact',
      },
      'What kind of projects would you like to work on?': {
        reply: `I'm most excited by ${internship.focusAreas.join(', ')}. ${internship.goals}`,
        tool: 'getInternship',
      },
      "What kind of project would make you say 'yes' immediately?": {
        reply: `Anything at the intersection of **AI/ML, blockchain security, or quantitative finance** where I can ship research-backed systems with real impact. ${internship.goals}`,
        tool: 'getInternship',
      },
      'Are you based in Mumbai?': {
        reply: `Yes — I'm based in **${personal.location}** and open to ${internship.preferredLocation}.`,
        tool: 'getContact',
      },
      'Where are you located?': {
        reply: `I'm in **${personal.location}**. Open to ${internship.preferredLocation}.`,
        tool: 'getContact',
      },
      'What are your hobbies?': {
        reply: personality.hobbies?.length
          ? `Outside work and academics, you'll find me ${personality.hobbies.join(', ')}.${personality.sports?.length ? ` I'm a huge ${personality.sports.join(' and ')} fan.` : ''}`
          : `Outside tech I enjoy ${personality.interests.slice(0, 3).join(', ')}. ${personality.workingStyle}`,
        tool: 'getPresentation',
      },
      'Are you a football or cricket fan?': {
        reply: personality.sports?.length
          ? `Absolutely — I'm a huge **Real Madrid** football fan and I follow **cricket** closely. Happy to chat about either anytime.`
          : `I'm a huge Real Madrid fan and follow cricket regularly.`,
        tool: 'getPresentation',
      },
      'Do you like traveling?': {
        reply: `Yes — I try to take **at least three trips every year**. Traveling helps me reset, explore new perspectives, and stay sane amid all the chaos of work and academics.`,
        tool: 'getPresentation',
      },
      'What do you do outside of tech?': {
        reply: `Beyond tech I dive into **startups, business strategy, and finance** — reading how companies scale and founders think. Personally: **football (Real Madrid)**, **cricket**, **food spots in Mumbai**, and **travel**. I also love connecting with ambitious, curious people.`,
        tool: 'getPresentation',
      },
      'Tell me something interesting about you': {
        reply: personality.funFacts[0] ?? personal.bio,
        tool: 'getPresentation',
      },
      'What motivates you?': {
        reply: personality.motivation,
        tool: 'getPresentation',
      },
      "What's a fun fact about you?": {
        reply: personality.funFacts.join(' · '),
        tool: 'getPresentation',
      },
      'How was your experience working as freelancer?': {
        reply: `I've taken on freelance and project-based work alongside my studies, building end-to-end ML and web systems. My internship experience at Ashna AI and Suvidha Foundation reflects that same self-directed, delivery-focused approach.`,
        tool: 'getSkills',
      },
      'Tell me about your internship experience': {
        reply: `I'm currently a **Summer Intern at Veefin** (RAG-based RFP automation, Recovery Intelligence CMS, Apache Camel ETL, Postman QA). Previously **AI/ML Intern at Ashna AI**, **ML Intern at Suvidha Foundation**, and **Research Assistant at EUCLID** with an accepted IEEE paper.`,
        tool: 'getSkills',
      },
      'Tell me about your Veefin internship': {
        reply: `At **Veefin** (May 2026 – Present) I validate Trade Finance LC workflows, run REST API testing with Postman, build prompt-engineered QA pipelines (200% faster test data), and contribute to RAG-based RFP automation and Recovery Intelligence microservices integrated via Apache Camel.`,
        tool: 'getSkills',
      },
      'Tell me about your Ashna AI internship': {
        reply: `At **Ashna AI** (Jun–Aug 2025) I built a PDF-to-Q&A system using NLP without external API keys, and contributed to India's first homegrown LLM. Stack: HuggingFace, RoBERTa, T5, spaCy, Streamlit.`,
        tool: 'getSkills',
      },
      'Tell me about your EUCLID research role': {
        reply: research
          ? `At **EUCLID** I was a Research Assistant (${research.status} IEEE paper on healthcare website security at ${research.conference}). I also organised internship drives and industry-student programs.`
          : `At **EUCLID** I authored IEEE-accepted research on healthcare website security and led research community initiatives.`,
        tool: 'getAchievements',
      },
      'Tell me about your work at EUCLID': {
        reply: research
          ? `At EUCLID I researched healthcare website vulnerability assessment — paper accepted at ${research.conference}. I also managed internship drives and intern inductions.`
          : `At EUCLID I published IEEE research on healthcare cybersecurity.`,
        tool: 'getAchievements',
      },
      'What tech stack do you use?': {
        reply: `I work primarily in **Python** with PyTorch, TensorFlow, Scikit-Learn, HuggingFace, and LangChain for ML/NLP. For web: React, Flask, FastAPI, Streamlit. Blockchain: Neo4j, Solidity. Data: Pandas, MongoDB, SQL. DevOps: Docker, Git.`,
        tool: 'getSkills',
      },
      'What are you working on right now?': {
        reply: `Right now I'm focused on ${internship.focusAreas.slice(0, 3).join(', ')} — recent builds include a **mutual fund recommendation engine**, **sector-aware stock screener**, and ongoing research in blockchain forensics and NLP.`,
        tool: 'getProjects',
      },
      'What are your projects? What are you working on right now?': {
        reply: `I'm actively building in AI, blockchain, and FinTech — flagship **${flagship}**, plus mutual fund/stock screening tools and NLP systems. Full portfolio below:`,
        tool: 'getProjects',
      },
      'Explain ChainBreak in detail': {
        reply: `**ChainBreak** (CipherCop, 4th place) traces illicit crypto through: (1) dark web crawling for transaction intel, (2) Neo4j graph analytics for wallet relationships, (3) ML anomaly detection, (4) OSINT enrichment, and (5) confidence-scored risk flags for investigators.`,
        tool: 'getProjects',
      },
      'Tell me about your Bitcoin classification project': {
        reply: `I built a multi-class ensemble (Random Forest, XGBoost, LightGBM) to classify Bitcoin transaction types (HYIP, Gambling, etc.) with **98.69% accuracy** — useful for understanding wallet behaviour patterns.`,
        tool: 'getProjects',
      },
      'Tell me about your gold price prediction project': {
        reply: `A hybrid NLP + ML system: news headlines → TF-IDF/Word2Vec/BERT features → XGBoost + regression for gold price direction and magnitude (**86.72% accuracy**). Includes a Streamlit GUI for live predictions.`,
        tool: 'getProjects',
      },
      'Tell me about your stock screener project': {
        reply: `**Stock Fundamental Analysis & Long-Term Recommendation System** — aggregates financial metrics via yfinance, mftool, and web scrapers; ranks mutual funds by asset class and market cap; outputs long-term stock recommendations with confidence scores.`,
        tool: 'getProjects',
      },
      'Tell me about your stock fundamental analysis project': {
        reply: `**Stock Fundamental Analysis & Long-Term Recommendation System** — automated data engine for Indian equities and mutual funds with quantitative ranking and long-term BUY/HOLD/SELL-style recommendations.`,
        tool: 'getProjects',
      },
      'Tell me about CipherCop': {
        reply: `**CipherCop – 1st National Police Hackathon**: I placed **4th nationally** with **ChainBreak**, a blockchain forensics platform for law enforcement to trace illicit crypto flows.`,
        tool: 'getAchievements',
      },
      'Tell me about WorldQuant Brain Hackathon': {
        reply: `At the **WorldQuant Brain Hackathon** I achieved **Gold level** and ranked in the **Top 25** — applying quantitative research skills to alpha discovery and financial modelling.`,
        tool: 'getAchievements',
      },
      'Do you have GitHub projects?': {
        reply: `Yes — all major projects are on GitHub (@${personal.handle.replace('@', '')}). Highlights include ChainBreak, Bitcoin classification, gold price NLP, stock fundamental analysis, mutual fund engine, and PDF Q&A generator.`,
        tool: 'getProjects',
      },
      "What's your experience with NLP?": {
        reply: `NLP across internships and projects: PDF Q&A (RoBERTa/T5 at Ashna AI), news summarisation (T5/BART at Suvidha), gold price sentiment (BERT embeddings), and spaCy/HuggingFace pipelines throughout.`,
        tool: 'getProjects',
      },
      'What is your phone number?': {
        reply: personal.phone
          ? `You can call or WhatsApp me at **${personal.phone}**. Email works too: ${personal.email}.`
          : `Best reach me at **${personal.email}**.`,
        tool: 'getContact',
      },
      // HelperBoost / landing long-form aliases
      'Who are you? I want to know more about you.': {
        reply: personal.bio,
        tool: 'getPresentation',
      },
      'What are your skills? Give me a list of your soft and hard skills.': {
        reply: `Here's my full skill breakdown — programming, ML/AI, blockchain, data analytics, web dev, cybersecurity, and soft skills:`,
        tool: 'getSkills',
      },
      'How can I reach you? What kind of project would make you say "yes" immediately?': {
        reply: `Reach me at **${personal.email}**${personal.phone ? ` / ${personal.phone}` : ''}. I'd say yes immediately to ${internship.focusAreas.slice(0, 2).join(' or ')} projects with real-world impact. ${internship.goals}`,
        tool: 'getContact',
      },
    };

    return replies;
  }

  generateResumeDetails() {
    return this.config.resume;
  }

  generateInternshipInfo() {
    const { internship, personal, social } = this.config;

    if (!internship.seeking) {
      return "I'm not currently seeking internship opportunities.";
    }

    return `Here's what I'm looking for 👇

- 📅 **Duration**: ${internship.duration} starting **${internship.startDate}**
- 🌍 **Location**: ${internship.preferredLocation}
- 🧑‍💻 **Focus**: ${internship.focusAreas.join(', ')}
- 🛠️ **Working Style**: ${internship.workStyle}
- 🎯 **Goals**: ${internship.goals}

📬 **Contact me** via:
- Email: ${personal.email}
- LinkedIn: ${social.linkedin}
- GitHub: ${social.github}

${internship.availability} ✌️`;
  }

  getConfig(): PortfolioConfig {
    return this.config;
  }
}

export default ConfigParser;

import type { PortfolioConfig } from '@/types/portfolio';
import {
  getFeaturedProjects,
  getSkillCategories,
} from '@/lib/portfolio-helpers';

const OFF_TOPIC_PATTERNS = [
  /\b(weather|temperature|forecast|rain|snow)\b/i,
  /\b(news|headlines|current events)\b/i,
  /\b(recipe|cook|bake|ingredients)\b/i,
  /\b(homework|solve this|math problem|equation)\b/i,
  /\b(who is the president|capital of|population of)\b/i,
  /\b(stock price|crypto price|bitcoin price today)\b/i,
  /\b(movie|netflix|watch)\b/i,
  /\b(translate|definition of)\b/i,
];

const ON_TOPIC_PATTERNS = [
  /\b(you|your|yourself)\b/i,
  /\b(dhruv|shah)\b/i,
  /\b(skill|project|resume|cv|portfolio)\b/i,
  /\b(intern|job|hire|opportunit|career|available)\b/i,
  /\b(achievement|hackathon|ieee|research|paper)\b/i,
  /\b(contact|email|linkedin|github|reach)\b/i,
  /\b(education|cgpa|degree|university|college)\b/i,
  /\b(chainbreak|experience|background|bio|passion)\b/i,
  /\b(certif|python|ai|ml|blockchain|nlp)\b/i,
];

function buildPortfolioContext(config: PortfolioConfig): string {
  const {
    personal,
    education,
    experience,
    certifications,
    social,
    internship,
  } = config;

  const skills = getSkillCategories(config)
    .map((c) => `${c.label}: ${c.skills.join(', ')}`)
    .join('\n');

  const jobs = experience
    .map(
      (e) =>
        `- ${e.position} @ ${e.company} (${e.duration}): ${e.description.slice(0, 280)}${e.description.length > 280 ? '…' : ''}`
    )
    .join('\n');

  const projects = getFeaturedProjects(config)
    .map((p) => {
      const metric = p.metrics?.[0] ?? p.achievements?.[0] ?? '';
      return `- ${p.title} (${p.category}${metric ? `; ${metric}` : ''}): ${p.description.slice(0, 220)}${p.description.length > 220 ? '…' : ''} Tech: ${p.techStack.slice(0, 8).join(', ')}`;
    })
    .join('\n');

  const certs = (certifications ?? [])
    .map((c) =>
      c.achievement
        ? `${c.name} (${c.issuer}, ${c.year}) — ${c.achievement}`
        : `${c.name} (${c.issuer}, ${c.year})`
    )
    .join('; ');

  const achievements = (education.achievements ?? []).map((a) => `- ${a}`).join('\n');
  const previous = education.previous
    ? `${education.previous.degree} @ ${education.previous.institution} (${education.previous.cgpa})`
    : 'n/a';

  return `About: ${personal.bio}

Education:
- Current: ${education.current.degree} @ ${education.current.institution} (${education.current.duration}, CGPA ${education.current.cgpa})
- Previous: ${previous}

Skills:
${skills}

Experience:
${jobs}

Projects:
${projects}

Achievements:
${achievements}

Certifications: ${certs || 'none listed'}

Availability: ${internship.availability ?? 'Open to opportunities'}
Contact: ${personal.email}${personal.phone ? `, ${personal.phone}` : ''}; LinkedIn ${social.linkedin}; GitHub ${social.github}`.trim();
}

/** Conversational free-form chat — answer in text only, no tool cards. */
export function generateConversationalSystemPrompt(
  config: PortfolioConfig
): string {
  const { personal, chatbot } = config;

  return `You are ${personal.name} (${personal.title}) in a live portfolio chat. Speak in first person ("I", "my"). Tone: ${chatbot.tone}. Style: ${chatbot.responseStyle}.

This is a normal conversation — reply with short, natural chat messages (usually 2–5 sentences). Do NOT call tools. Do NOT narrate UI cards or say you are opening skills/projects panels.

SCOPE: Only answer questions about ${personal.name} — background, skills, projects, education, achievements, career, contact, and availability. Politely refuse off-topic questions and steer back to portfolio topics.

RULES:
- Answer directly from the portfolio context below.
- Never invent employers, metrics, projects, or dates.
- Match answer length to the question (one skill → brief; "tell me about yourself" → a bit longer).
- If asked for contact, include email and main links from context.

PORTFOLIO CONTEXT:
${buildPortfolioContext(config)}`.trim();
}

/** Tool-calling prompt (rich UI cards). Used when tools are enabled. */
export function generateCompactSystemPrompt(config: PortfolioConfig): string {
  const { personal, education, chatbot } = config;

  return `You are ${personal.name} (${personal.title}) in a live portfolio interview. Speak in first person ("I", "my"). Tone: ${chatbot.tone}. Style: ${chatbot.responseStyle}.

SCOPE: Only answer questions about ${personal.name} — background, skills, projects, education, achievements, career, contact, and availability. Politely refuse off-topic questions (weather, news, general trivia, homework, other people) and redirect to portfolio topics.

RULES:
- Greetings (hi/hello): reply warmly, no tools.
- CGPA/GPA-only questions: answer in one short sentence from the brief context below — do NOT call any tool.
- Other factual questions about me: call the best matching tool first, then answer naturally using the tool data.
- Never invent facts — only use tool results or the brief context below.
- Tools: getPresentation (about me), getSkills (skills/full education), getProjects (projects), getAchievements (awards), getContact (contact), getResume (resume), getInternship (jobs/internships).

Brief context: ${personal.name}, ${personal.age}, ${personal.location}. ${education.current.degree} @ ${education.current.institution} (CGPA ${education.current.cgpa}).`.trim();
}

export function isOffTopicQuestion(query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return false;

  if (ON_TOPIC_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return false;
  }

  return OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function getOffTopicRefusal(config: PortfolioConfig): string {
  const { personal } = config;
  return `I'm ${personal.name}'s portfolio assistant — I can only answer questions about ${personal.name}, their work, skills, projects, and career. Try asking about their background, projects, or how to get in touch!`;
}

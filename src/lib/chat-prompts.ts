import type { PortfolioConfig } from '@/types/portfolio';

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

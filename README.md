# PortfolioGPT

An AI-powered developer portfolio built with Next.js. Visitors chat with a conversational assistant that answers questions about your background, projects, skills, and experience — backed by structured data from a single JSON config file.

## Features

- **AI chat assistant** — Powered by [Groq](https://groq.com/) (`llama-3.1-8b-instant`) via the [Vercel AI SDK](https://sdk.vercel.ai/docs), with streaming responses and tool calling.
- **Portfolio tools** — The model can invoke tools to fetch real data and render rich UI cards:
  - `getPresentation` — About you, bio, highlights
  - `getProjects` — Project carousel
  - `getSkills` — Skills, education, certifications
  - `getResume` — Resume view
  - `getContact` — Contact details
  - `getAchievements` — Hackathons, research, awards
  - `getInternship` — Availability and opportunities
- **HelperBoost** — Quick-prompt drawer with categorized preset questions from config.
- **Instant preset replies** — Common questions show structured UI immediately; users can optionally ask the AI for a deeper follow-up.
- **Config-driven content** — All portfolio data lives in `portfolio-config.json`; the system prompt and tool routing are generated automatically via `src/lib/config-parser.ts`.
- **Modern UI** — Framer Motion animations, Radix UI primitives, Tailwind CSS 4, dark/light theme support.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| AI | [Vercel AI SDK](https://sdk.vercel.ai/docs) + [@ai-sdk/groq](https://sdk.vercel.ai/providers/ai-sdk-providers/groq) |
| UI | [Radix UI](https://www.radix-ui.com/), [Lucide](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| Markdown | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm, pnpm, or yarn
- A free [Groq API key](https://console.groq.com/keys)

### Installation

1. Clone the repository and enter the project folder:

   ```bash
   git clone <your-repo-url>
   cd PortfolioGPT
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set your Groq API key:

   ```env
   GROQ_API_KEY=gsk_your_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## Configuration

All portfolio content is defined in **`portfolio-config.json`**. Update this file to personalize the site — no UI code changes required for most edits.

| Section | Purpose |
|---------|---------|
| `personal` | Name, title, bio, avatar, contact |
| `education` | Current/previous degrees, achievements |
| `experience` | Work and research history |
| `projects` | Featured projects with links and images |
| `skills` | Technical and soft skills by category |
| `certifications` | Credentials and badges |
| `chatbot` | AI personality, tone, response style |
| `presetQuestions` | Suggested prompts (me, professional, projects, achievements, contact, fun) |
| `highlights` | Key facts surfaced in the system prompt |
| `research` | Publications and conference details |

The config parser (`src/lib/config-parser.ts`) builds the chat system prompt and maps preset questions to the correct tools. After editing the JSON, restart the dev server if prompts do not refresh.

### Optional environment variables

```env
# Custom site URL (metadata, sharing)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Project structure

```
PortfolioGPT/
├── portfolio-config.json    # All portfolio content
├── src/
│   ├── app/
│   │   ├── api/chat/        # Chat API route + AI tools
│   │   └── page.tsx         # Chat-first landing page
│   ├── components/
│   │   ├── chat/            # Chat UI, HelperBoost, presets
│   │   ├── projects/        # Project carousel
│   │   └── ui/              # Shared UI primitives
│   ├── lib/
│   │   ├── config-parser.ts # JSON → system prompt & tools
│   │   └── config-loader.ts # Config access for client
│   └── types/
│       └── portfolio.ts     # TypeScript types for config
└── public/                  # Static assets (avatar, resume, etc.)
```

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended):

1. Push your repo to GitHub.
2. Import the project in Vercel.
3. Add `GROQ_API_KEY` in **Project → Settings → Environment Variables**.
4. Deploy.

## About

Built by **Dhruv Amit Shah** — AI & Data Science Engineer | Blockchain & NLP Researcher.

- [LinkedIn](https://linkedin.com/in/dhruvshah)
- [GitHub](https://github.com/dhruvshah)
- [X](https://x.com/Dhruvainbatu)

## License

MIT — feel free to fork and adapt for your own portfolio.

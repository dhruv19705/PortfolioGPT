# PortfolioGPT

An AI-powered developer portfolio built with Next.js. Visitors chat with a conversational assistant that answers questions about your background, projects, skills, and experience — backed by structured data from a single JSON config file.

**Live demo:** [portfolio-gpt-tau.vercel.app](https://portfolio-gpt-tau.vercel.app/)

## Features

- **AI chat assistant** — Powered by [Groq](https://groq.com/) (`llama-3.1-8b-instant`) via the [Vercel AI SDK](https://sdk.vercel.ai/docs), with streaming responses and tool calling.
- **Portfolio tools** — The model invokes tools to fetch real data and render rich UI cards:
  - `getPresentation` — About you, bio, highlights, personality
  - `getProjects` — Project carousel
  - `getSkills` — Skills, education, certifications
  - `getResume` — Resume view and download
  - `getContact` — Contact details and social links
  - `getAchievements` — Hackathons, research, awards
  - `getInternship` — Availability and opportunities
- **HelperBoost** — Quick-prompt drawer with categorized preset questions from config.
- **Instant preset replies** — Common questions show structured UI immediately; users can optionally ask the AI for a deeper follow-up.
- **Smart caching** — Client- and server-side response caching for text-only follow-ups, with TTL and version-based invalidation.
- **Off-topic filtering** — Text-only follow-ups skip the API for clearly off-topic questions (weather, homework, etc.) and redirect visitors back to portfolio topics.
- **Config-driven content** — All portfolio data lives in `portfolio-config.json`; the system prompt and tool routing are generated automatically via `src/lib/config-parser.ts`.
- **Modern UI** — Framer Motion animations, Radix UI primitives, Tailwind CSS 4, dark/light theme support, and [Vercel Analytics](https://vercel.com/analytics).

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| UI | [React 19](https://react.dev/), [Radix UI](https://www.radix-ui.com/), [Lucide](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| AI | [Vercel AI SDK](https://sdk.vercel.ai/docs) + [@ai-sdk/groq](https://sdk.vercel.ai/providers/ai-sdk-providers/groq) |
| Validation | [Zod](https://zod.dev/) (tool schemas) |
| Markdown | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |
| Analytics | [@vercel/analytics](https://vercel.com/analytics) |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm, pnpm, or yarn
- A free [Groq API key](https://console.groq.com/keys)

### Installation

1. Clone the repository and enter the project folder:

   ```bash
   git clone https://github.com/dhruv19705/PortfolioGPT.git
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
| `social` | LinkedIn, GitHub, Kaggle, LeetCode, etc. |
| `internship` | Availability, focus areas, and career goals |
| `personality` | Traits, interests, hobbies, fun facts |
| `resume` | Resume metadata and download URL |
| `chatbot` | AI personality, tone, response style |
| `presetQuestions` | Suggested prompts (me, professional, projects, achievements, contact, fun) |
| `highlights` | Key facts surfaced in the system prompt |
| `research` | Publications and conference details |
| `meta` | Config version and last-updated metadata |

The config parser (`src/lib/config-parser.ts`) builds the chat system prompt and maps preset questions to the correct tools. After editing the JSON, restart the dev server if prompts do not refresh.

Place static assets (avatar, resume PDF, project images) in the `public/` folder and reference them with paths like `/profile.jpeg` or `/DhruvShah_Resume.pdf`.

### Environment variables

```env
# Required — Groq API key for chat
GROQ_API_KEY=your_groq_api_key_here

# Optional — custom site URL (metadata, sharing)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional — analytics
# NEXT_PUBLIC_GA_ID=your_google_analytics_id
# VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

## Project structure

```
PortfolioGPT/
├── portfolio-config.json       # All portfolio content
├── src/
│   ├── app/
│   │   ├── api/chat/           # Chat API route, prompt, and AI tools
│   │   │   └── tools/          # getPresentation, getProjects, getSkills, etc.
│   │   ├── layout.tsx          # Root layout, metadata, analytics
│   │   └── page.tsx            # Chat-first landing page
│   ├── components/
│   │   ├── chat/               # Chat UI, HelperBoost, presets, toolbar
│   │   ├── projects/           # Apple-style project carousel
│   │   └── ui/                 # Shared UI primitives (Radix + Tailwind)
│   ├── lib/
│   │   ├── config-parser.ts    # JSON → system prompt & tool routing
│   │   ├── config-loader.ts    # Config access for client components
│   │   ├── chat-cache.ts       # Client/server response caching
│   │   ├── chat-prompts.ts     # System prompt & off-topic detection
│   │   └── tool-schemas.ts     # Zod schemas for AI tools
│   └── types/
│       └── portfolio.ts        # TypeScript types for config
└── public/                     # Static assets (avatar, resume, favicon)
```

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended):

1. Push your repo to GitHub.
2. Import the project in Vercel.
3. Add `GROQ_API_KEY` in **Project → Settings → Environment Variables**.
4. Optionally set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Deploy.

## About

Built by **Dhruv Amit Shah** — AI & Data Science Engineer | Blockchain & NLP Researcher.

- [LinkedIn](https://www.linkedin.com/in/dhruv-shah-670141282)
- [GitHub](https://github.com/dhruv19705)
- [X](https://x.com/Dhruvainbatu)

## License

MIT — feel free to fork and adapt for your own portfolio.

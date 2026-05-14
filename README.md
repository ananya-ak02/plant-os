# PlantOS

PlantOS is an AI-powered plant intelligence platform for Indian gardeners. It combines Gemini Vision, Groq, LangChain-style tools, Supabase pgvector, Supabase Realtime, Open-Meteo, HuggingFace embeddings, Upstash Redis, and Vercel cron jobs into a living plant operating system.

## Architecture

```text
Browser / Mobile
  |
  | photos, care actions, community posts
  v
Next.js 14 App Router
  |
  +-- /api/analyze --------------------+
  |                                    |
  |  Supabase Storage <--- image upload|
  |        |                           |
  |        v                           |
  |  Gemini Vision <--- RAG context ---+--- Supabase pgvector disease_patterns
  |        |                                   ^
  |        v                                   |
  |  plant_photos + diagnoses -----------------+
  |
  +-- /api/care-schedule
  |        |
  |        +-- weatherFetcher -> Open-Meteo
  |        +-- speciesLookup -> Supabase pgvector species_care
  |        +-- historyAnalyzer -> care_logs
  |        +-- Groq llama-3.3-70b-versatile -> care_schedules
  |
  +-- /api/community
  |        |
  |        +-- Groq moderation
  |        +-- Gemini Vision auto diagnosis
  |        +-- HuggingFace embeddings
  |        +-- disease_patterns flywheel enrichment
  |        +-- Supabase Realtime community feed
  |
  +-- /api/cron/daily-care -> morning schedules
  +-- /api/cron/weekly-digest -> city problem summaries
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. Create a Supabase project, enable Storage bucket `plantos`, and run:

```bash
supabase db push
```

4. Seed the intelligence base:

```bash
npm run seed:diseases
npm run seed:species
```

5. Start development:

```bash
npm run dev
```

## Key Features

- Multimodal plant analysis with Gemini Vision and structured JSON output.
- Configurable Gemini model via `GEMINI_MODEL`; default is `gemini-2.5-flash`.
- RAG over Supabase pgvector disease patterns and species care requirements.
- Self-improving community diagnosis flywheel.
- Dynamic daily care schedules using real weather from Open-Meteo.
- Bilingual Hindi/English diagnosis and care messages.
- Supabase Realtime diagnosis feed.
- Growth journal, health history, milestones, and CSS-only shareable Plant Story cards.

## Production Notes

- Use Vercel environment variables for all keys in `.env.local.example`.
- Protect cron routes with `CRON_SECRET`.
- Keep Supabase RLS enabled; server API routes use `SUPABASE_SERVICE_ROLE_KEY`.
- Create public Storage bucket `plantos` or switch `storage.ts` to signed URLs for private deployments.

# BrainFlo - Brain Dump & Content Ideas App

A web application for writers and content creators to capture thoughts (text or voice) and generate X/Twitter content ideas using AI.

## Tech Stack

- **Frontend:** React 18+ with TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Email/Password + Google OAuth)
- **AI:** OpenAI GPT-4
- **Voice:** Web Speech API (browser native)
- **Hosting:** Vercel (recommended)

## Features

- Brain dump with text or voice input
- AI-powered content idea generation
- Brain dump history with search
- Weekly/monthly summaries with insights
- Freemium model with usage limits
- Clean black & white design

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd brainflo
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project at https://supabase.com
   - Run the migration SQL from `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor
   - Enable Email and Google OAuth providers in Authentication settings
   - Copy your project URL and anon key

4. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up Supabase Edge Functions:

Install Supabase CLI:
```bash
npm install -g supabase
```

Login and link your project:
```bash
supabase login
supabase link --project-ref your-project-ref
```

Deploy the Edge Functions:
```bash
supabase functions deploy generate-ideas
supabase functions deploy generate-summary
```

Set the OpenAI API key secret:
```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

6. Start the development server:
```bash
npm run dev
```

The app should now be running at http://localhost:5173

## Usage Limits

**Free Tier:**
- 5 brain dumps per month
- 10 AI content generation requests per month

**Premium Tier:**
- Unlimited brain dumps
- Unlimited AI requests

## Voice Input

Voice input requires:
- Chrome or Safari browser
- HTTPS in production (or localhost in development)
- Microphone permissions
- Internet connection (uses Google's speech recognition API)

## Project Structure

```
brainflo/
├── src/
│   ├── components/
│   │   ├── layout/          # App layout components
│   │   ├── dump/            # Brain dump related components
│   │   ├── history/         # History page components
│   │   ├── summaries/       # Summaries page components
│   │   ├── auth/            # Authentication components
│   │   └── common/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Supabase client and types
│   ├── utils/               # Utility functions
│   └── App.tsx              # Main app with routing
├── supabase/
│   ├── migrations/          # Database migrations
│   └── functions/           # Edge functions (AI)
└── public/                  # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Design System

The app uses a strict black, white, and gray color palette. See `tailwind.config.js` for the complete design tokens.

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT License - feel free to use this code for your own projects.

## Support

For issues or questions, please open an issue on GitHub.

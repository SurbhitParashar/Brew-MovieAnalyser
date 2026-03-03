# 🎬 Movie Insight Builder

An AI-powered web application that analyzes any movie using its IMDb ID and generates structured audience insights including sentiment, emotional tone, polarization level, viewer targeting, and watch guidance.

Live Demo: https://brew-movie-analyser.vercel.app/

---

## 📌 Overview

Movie Insight Builder allows users to enter an IMDb ID (e.g., `tt0816692`) and receive:

- 🎥 Movie title & poster  
- 👥 Cast list  
- 📅 Release year & IMDb rating  
- 📖 Full plot summary  
- 🤖 AI-generated audience perception  
- 🎭 Emotional tone  
- 🕰 Best time to watch  
- 👶 Ideal age range  
- ⚖️ Polarization level  
- 📊 Overall sentiment (positive / mixed / negative)

The app combines official metadata with LLM-based analysis to produce structured, decision-support insights in a clean, responsive dashboard.

---

## 🏗 Architecture

User → Next.js Frontend (React) → API Route (/api/movie) → OMDb API → Hugging Face Router (LLM) → Structured JSON → Insight Dashboard UI

Backend logic is implemented using Next.js API routes running on the Node.js runtime (serverless-ready).

---

## 🛠 Tech Stack & Rationale

**Next.js (App Router) + React**  
Single framework for frontend and backend, serverless-friendly, clean structure, no separate Express server required.

**Node.js Runtime (via API Routes)**  
Handles secure API calls, AI requests, and structured response formatting.

**OMDb API**  
Used for title, poster, cast, year, IMDb rating, full plot, and aggregated ratings. Chosen for reliability and to avoid unstable scraping.

**Hugging Face Router (OpenAI-compatible endpoint)**  
Model: `moonshotai/Kimi-K2-Instruct-0905`  
Used for generating audience summary, emotional tone, best time to watch, age targeting, polarization reasoning, and sentiment classification. Chosen for flexibility and cost-effectiveness.

**UI Styling**  
Custom CSS, responsive layout, loading skeleton, and error handling animations.

---

## ⚙️ Setup Instructions

1. Clone repository:
```

git clone https://github.com/SurbhitParashar/Brew-MovieAnalyser.git
cd your-repo-name

```

2. Install dependencies:
```

npm install

```

3. Create `.env.local`:
```

OMDB_API_KEY=your_omdb_api_key
HF_TOKEN=your_huggingface_token

```

4. Run locally:
```

npm run dev

```
Open `http://localhost:3000`

### API Keys
- OMDb: http://www.omdbapi.com/apikey.aspx  
- Hugging Face Token: https://huggingface.co/settings/tokens (Read permission)

### Deployment (Vercel Recommended)
Push to GitHub → Import into Vercel → Add environment variables → Deploy.  
API routes run as serverless Node.js functions automatically.

---

## ⚠️ Engineering Decisions & Attempts

**IMDb Web Scraping (Attempted)**  
Tried Axios + Cheerio to scrape IMDb reviews. Failed due to dynamic rendering, anti-scraping protection, HTML instability, and deployment unreliability. Removed in favor of official APIs.

**Direct OpenAI API (Attempted)**  
Used `gpt-4o-mini` initially but faced quota and billing constraints (429 errors). Switched to Hugging Face Router for flexibility.

**TMDB Reviews API (Attempted)**  
Explored TMDB reviews but encountered limited and inconsistent data coverage. Final approach uses OMDb metadata + structured LLM analysis.

---

## 🧠 Assumptions

- IMDb ID is valid.
- OMDb metadata is accurate.
- LLM follows structured output instructions.
- Hugging Face inference credits are available.
- Application focuses on movies (not series).

---

## 🌟 Key Design Decisions

- Avoided unstable scraping.
- Used official APIs for reliability.
- Structured AI output into separate UI cards.
- Built serverless-first architecture.
- Prioritized clarity, responsiveness, and production-readiness.

---

## 🚀 Future Improvements

- IMDb ID validation regex.
- Caching for repeated queries.
- Review-level sentiment breakdown.
- Streaming AI responses.
- Visual analytics dashboard.
- Search history tracking.

---

## 👨‍💻 Author

Built as part of a Fullstack Developer assignment with emphasis on system design clarity, AI integration, and production-ready architecture.


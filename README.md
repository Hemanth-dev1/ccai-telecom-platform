# Aurora Telecom AI Platform

Enterprise-grade telecom customer support orchestration platform combining Conversational AI, orchestration intelligence, telemetry, escalation workflows, and analytics.

Built with **Dialogflow CX** for intent routing, **Gemini 2.5 Flash** for reasoning & response generation, **FastAPI** backend, and a **React + Vite** frontend — deployed on **Google Cloud Run**.

---

## Live Demo

**Frontend:** https://aurora-frontend-925349905681.us-central1.run.app  
**Login:** `Hemanth` / `Hemanth@123`  
**Backend API:** https://aurora-backend-925349905681.us-central1.run.app

---

## Architecture

```text
User Browser
     ↓
Nginx (reverse proxy with HTTP Basic Auth)
     ↓  /api/* → proxy_pass to Backend
React (Vite SPA)
     ↓
────────────────────────────────────
FastAPI Backend
     ↓    ↓        ↓          ↓
Dialogflow  Gemini   ChromaDB   SQLite
   CX        LLM       RAG     (GCS FUSE)
```

### Deployment Architecture

- **Frontend**: Docker → Cloud Run with nginx reverse proxy
  - Serves React SPA
  - Proxies `/api/*` requests to backend
  - HTTP Basic Auth via nginx (configurable via build args `AUTH_USERNAME` / `AUTH_PASSWORD`)
- **Backend**: Docker → Cloud Run with GCS FUSE volume for SQLite persistence
- **Storage**: Google Cloud Storage bucket (`aurora-sqlite-data`) mounted as a volume for persistent SQLite data

---

## Core Features

### Conversational AI Workspace
- Real-time telecom support conversations
- AI-generated responses using Gemini
- Intent-aware orchestration via Dialogflow CX
- Flow-based CX routing
- Context panel with live orchestration status
- Execution trace drawer with latency metrics

### Agent Desk (Escalation Queue)
- Real-time escalation queue with search & filtering
- Detail panel with case info, sentiment, risk, message preview
- Action buttons (assign, view conversation, resolve)
- Stats cards (total, high risk, medium risk, angry)
- Auto-polling from backend every 5 seconds

### Analytics Dashboard
- KPI cards: total conversations, escalations, top intents, sentiment distribution
- Charts: message timeline, flow distribution, sentiment distribution, risk distribution
- Business impact analysis with donut charts
- Customer state distribution
- Auto-refresh toggle (15s interval)
- Date range filtering (passed to backend API)

### AI & Orchestration
- Dialogflow CX intent detection & flow routing
- Gemini-powered response generation with RAG context
- Sentiment analysis (positive, neutral, negative, angry)
- Risk & urgency assessment
- Escalation detection with deterministic overrides
- Customer state classification
- Business impact analysis

### Telemetry & Observability
- Event-driven telemetry (intent, sentiment, RAG, response stages)
- Latency tracking per pipeline step
- Session-level event history API
- Analytics aggregation from persisted data

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Recharts, Lucide React |
| Backend | FastAPI, SQLAlchemy, SQLite, Python 3.11+ |
| AI | Dialogflow CX, Google Gemini 2.5 Flash |
| Storage | ChromaDB (RAG), Google Cloud Storage (SQLite) |
| Deployment | Docker, Google Cloud Run, Cloud Scheduler |

---

## Performance Optimizations

### Latency optimizations implemented (~40% reduction):

| Optimization | Description | Impact |
|-------------|-------------|--------|
| **Parallel pipeline** | Dialogflow CX + Memory history + RAG run concurrently via `asyncio.to_thread` + `asyncio.gather` | ~1-2s saved |
| **Batch DB writes** | Both conversation messages saved in a single SQLAlchemy session | ~1s saved |
| **Fire-and-forget events** | Analytics event logging moved to background `asyncio.create_task` (response doesn't wait) | ~2s saved |

**Before:** ~10.9s backend → **After:** ~6.7s backend (~38% faster)  
**Via proxy:** ~14.4s → ~8.4s (~42% faster)

### Nginx proxy fix
- Changed `proxy_set_header Host $host` → `$proxy_host` to ensure Cloud Run routes proxied requests to the correct backend service

---

## Project Structure

```text
ccai-telecom-platform/
│
├── backend/
│   ├── main.py              # FastAPI app entrypoint
│   ├── Dockerfile           # Backend container
│   ├── requirements.txt
│   ├── config.py
│   ├── routers/
│   │   ├── chat.py          # Chat orchestration endpoint
│   │   ├── webhook.py       # Dialogflow webhook flows
│   │   ├── analytics.py     # Analytics dashboard API
│   │   ├── agent_desk.py    # Escalation queue API
│   │   └── events.py        # Session event history API
│   ├── services/
│   │   ├── gemini_client.py # Gemini API client setup
│   │   ├── gemini_service.py # Orchestration, response generation
│   │   ├── dialogflow_service.py # Dialogflow CX integration
│   │   ├── sentiment_service.py # Sentiment & risk analysis
│   │   ├── memory_service.py # Conversation persistence
│   │   ├── event_service.py  # Telemetry event persistence
│   │   ├── analytics_service.py # Analytics aggregation
│   │   ├── billing_service.py  # Billing inquiry handling
│   │   ├── ticket_service.py   # Ticket creation & management
│   │   └── dialogflow_service.py # Dialogflow client
│   ├── database/
│   │   ├── db.py             # SQLAlchemy engine & session
│   │   ├── models.py         # Declarative base
│   │   ├── conversation_model.py
│   │   ├── event_model.py
│   │   └── init_db.py        # Table creation
│   ├── rag/
│   │   ├── retriever.py      # ChromaDB retrieval
│   │   ├── ingest.py         # Knowledge base ingestion
│   │   ├── chroma_db/        # Vector store (persistent)
│   │   └── knowledge_base/   # Telecom domain texts
│   └── data/
│       └── mock_bills.json   # Sample billing data
│
├── frontend/
│   ├── Dockerfile            # Frontend container with nginx
│   ├── nginx.conf            # Reverse proxy config
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           # Router (/, /workspace, /analytics, /agent-desk)
│       ├── index.css         # Tailwind + custom styles
│       ├── pages/
│       │   ├── Workspace.jsx     # Main chat workspace
│       │   ├── Analytics.jsx     # Dashboard with auto-refresh
│       │   ├── AgentDesk.jsx     # Escalation queue UI
│       │   └── ChatPage.jsx      # Standalone chat page
│       ├── components/
│       │   ├── ChatStream.jsx    # Messages, typewriter, pipeline indicator, empty state
│       │   ├── TopNav.jsx        # Navigation bar
│       │   ├── ContextPanel.jsx  # Live orchestration status
│       │   ├── OrchestrationDrawer.jsx  # Trace-level execution details
│       │   └── AnalyticsCards.jsx # KPI cards & charts
│       ├── hooks/
│       │   └── useChat.js        # Chat state management, pipeline step tracking
│       ├── services/
│       │   ├── analyticsApi.js   # Analytics API client
│       │   └── agentDeskApi.js   # Agent desk API client
│       ├── api/
│       │   └── client.js         # Backend chat request wrapper
│       └── lib/
│           └── mockData.js       # Static conversation metadata
│
├── deploy.sh                 # One-command deployment script
├── docker-compose.yml        # Local development compose
├── cloudbuild.yaml           # Cloud Build CI config
└── README.md
```

---

## API Endpoints

### Chat
```http
POST /chat
Content-Type: application/json

{
  "message": "My bill is too high",
  "session_id": "user-123"
}
```

**Response:**
```json
{
  "reply": "I understand your concern...",
  "intent": "high_bill_complaint",
  "confidence": 0.95,
  "flow": "Billing Flow",
  "sentiment": "negative",
  "urgency": "medium",
  "risk_level": "medium",
  "requires_escalation": false,
  "customer_state": "frustrated",
  "business_impact": "medium",
  "trace": { "latency_ms": 2340, "rag": true, "parallel": true }
}
```

### Analytics
```http
GET /analytics/?range=7d
```

Returns: `total_conversations`, `top_intents`, `flow_distribution`, `sentiment_distribution`, `risk_distribution`, `escalations`, `customer_states`, `business_impact`, `message_timeline`, `volume`

### Agent Desk
```http
GET /agent-desk/escalations
```

Returns escalation queue with messages requiring human review.

### Events
```http
GET /events/{session_id}
```

Returns event telemetry history for a session.

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 20+
- Google Cloud credentials for Dialogflow CX + Gemini API

### Backend Setup

```bash
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
PROJECT_ID=your_gcp_project_id
LOCATION_ID=us-central1
AGENT_ID=your_dialogflow_agent_id
```

Run:
```bash
uvicorn main:app --reload --port 8080
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, proxies API calls to backend.

### Docker Build (Full Stack)

```bash
# Backend
docker build -t aurora-backend ./backend
docker run -p 8080:8080 \
  -e GEMINI_API_KEY=... \
  -e PROJECT_ID=... \
  -e AGENT_ID=... \
  aurora-backend

# Frontend
docker build \
  --build-arg AUTH_USERNAME=admin \
  --build-arg AUTH_PASSWORD=password \
  -t aurora-frontend ./frontend

docker run -p 8080:8080 \
  -e BACKEND_URL=http://host.docker.internal:8080 \
  aurora-frontend
```

Or use docker-compose:
```bash
docker-compose up
```

---

## Deploying to Cloud Run

### One-command deploy:
```bash
./deploy.sh
```

### Manual deployment:

**Backend:**
```bash
gcloud run deploy aurora-backend \
  --image=us-central1-docker.pkg.dev/$PROJECT/aurora-repo/aurora-backend:latest \
  --region=us-central1 \
  --allow-unauthenticated \
  --port=8080 \
  --memory=1Gi \
  --cpu=1 \
  --set-env-vars="GEMINI_API_KEY=...,PROJECT_ID=...,LOCATION_ID=us-central1,AGENT_ID=..." \
  --add-volume=name=aurora-data,type=cloud-storage,bucket=aurora-sqlite-data \
  --add-volume-mount=volume=aurora-data,mount-path=/app/data
```

**Frontend:**
```bash
docker build \
  --build-arg AUTH_USERNAME=Hemanth \
  --build-arg AUTH_PASSWORD=Hemanth@123 \
  -t aurora-frontend:latest \
  -f frontend/Dockerfile ./frontend

docker tag aurora-frontend:latest $REPO/aurora-frontend:latest
docker push $REPO/aurora-frontend:latest

gcloud run deploy aurora-frontend \
  --image=$REPO/aurora-frontend:latest \
  --region=us-central1 \
  --allow-unauthenticated \
  --port=8080 \
  --update-env-vars="BACKEND_URL=https://aurora-backend-...run.app"
```

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `PROJECT_ID` | GCP project ID |
| `LOCATION_ID` | GCP location (e.g. `us-central1`) |
| `AGENT_ID` | Dialogflow CX agent ID |

### Frontend (Docker build args)
| Arg | Description |
|-----|-------------|
| `AUTH_USERNAME` | HTTP Basic Auth username |
| `AUTH_PASSWORD` | HTTP Basic Auth password |

### Frontend (Cloud Run env vars)
| Variable | Description |
|----------|-------------|
| `BACKEND_URL` | Backend Cloud Run URL for nginx proxy |

---

## Current Capabilities

- ✅ Dialogflow CX intent detection & flow routing
- ✅ Gemini-powered response generation with RAG context
- ✅ Sentiment, urgency, risk, and escalation analysis
- ✅ Escalation detection with human handoff workflows
- ✅ Agent desk with real-time queue, search, and filtering
- ✅ Analytics dashboard with auto-refresh & date filtering
- ✅ Telemetry event logging for every pipeline stage
- ✅ Latency tracking per orchestration step
- ✅ ChromaDB RAG retrieval for domain knowledge
- ✅ Persistent SQLite storage on GCS FUSE
- ✅ HTTP Basic Auth on frontend via nginx
- ✅ Full Docker + Cloud Run deployment
- ✅ Performance-optimized (~40% faster with parallel pipeline + batch writes + fire-and-forget events)

---

## Current Limitations

| Limitation | Description | Future Improvement |
|------------|-------------|-------------------|
| SQLite | Prototype storage, GCS FUSE adds write latency | PostgreSQL + JSONB |
| Synthetic telemetry | Some timeline analytics are simulated | Real event streaming |
| No streaming | Gemini responses are synchronous | WebSockets + token streaming |
| Basic auth | Simple HTTP auth via nginx | OAuth2 / Firebase Auth |
| No RBAC | Role-based access not implemented | Auth0 / Firebase Auth |

---

## Data Flow

```text
User Message
     ↓
Dialogflow CX → intent, flow, confidence
     ↓        ↘
  Memory (read)  RAG (ChromaDB)
     ↓        ↗
  [Parallel execution via asyncio.gather]
     ↓
Gemini → response + sentiment + urgency + risk + escalation + customer_state + business_impact
     ↓
Backend Response (immediate)
     ↓
Save conversation (batch, single DB session)
     ↓
Log events (fire-and-forget background task)
     ↓
Frontend renders with typewriter effect + pipeline indicator
```

---

## Author

**Hemanth**  
AI & Conversational Systems Engineering

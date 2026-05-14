# Aurora Telecom AI Platform

## Overview

Aurora Telecom AI Platform is an enterprise-style conversational AI orchestration system built for telecom customer support operations.

The platform combines:

* Dialogflow CX orchestration
* Gemini-powered reasoning
* Sentiment intelligence
* Escalation detection
* Operational analytics
* Agent handoff workflows
* Real-time orchestration telemetry

Unlike traditional chatbot projects, this platform focuses on:

* AI orchestration
* customer state intelligence
* escalation workflows
* operational observability
* analytics-driven support operations

---

# System Architecture

```text
Frontend (React + Vite)
        ↓
FastAPI Backend
        ↓
Dialogflow CX
        ↓
Gemini AI Layer
        ↓
Telemetry + Analytics Layer
```

---

# Core Features

## Conversational AI Workspace

* Real-time telecom support conversations
* AI-generated responses using Gemini
* Intent-aware orchestration
* Flow-based CX routing
* Operational metadata rendering
* Escalation-aware interaction handling

---

## Dialogflow CX Orchestration

Dialogflow CX is used as:

* Intent detection engine
* Flow router
* Conversational state machine

Implemented telecom support flows include:

* Billing Flow
* Recharge Flow
* Escalation Flow
* Network Support Flow

Sample intents include:

* high_bill_complaint
* autopay_issue
* legal_threat
* complaint_repeat
* cancel_subscription
* customer_escalation

---

## Gemini Intelligence Layer

Gemini powers:

* Telecom response generation
* Sentiment analysis
* Risk analysis
* Escalation intelligence
* Customer state detection
* Business impact analysis

The orchestration layer evaluates:

* sentiment
* urgency
* risk level
* escalation probability
* customer state
* business impact

This enables the system to behave like an operational AI assistant rather than a simple chatbot.

---


## Analytics Dashboard

The analytics system provides:

* Conversation telemetry
* Intent distribution
* Sentiment distribution
* Escalation analytics
* Customer state analytics
* Risk distribution
* Flow distribution
* Hourly operational telemetry

The platform includes:

* KPI dashboards
* Volume analytics
* Escalation trend charts
* Operational telemetry visualization

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Recharts
* Lucide React

## Backend

* FastAPI
* SQLAlchemy
* SQLite
* Dialogflow CX SDK
* Gemini API

## AI & Orchestration

* Dialogflow CX
* Gemini 2.5 Flash

---

# Project Structure

```text
ccai-telecom-platform/
│
├── backend/
│   ├── database/
│   ├── routes/
│   ├── services/
│   ├── rag/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── api/
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Backend Architecture

## Main Backend Responsibilities

### Intent Orchestration

The backend receives customer messages and forwards them to Dialogflow CX for:

* intent detection
* flow routing
* conversational state tracking

---

### Sentiment Intelligence

Gemini analyzes customer behavior and operational risk.

The system evaluates:

* angry customers
* escalation risk
* churn probability
* legal threats
* high urgency cases

---

### Response Generation

Gemini generates telecom-aware conversational responses using:

* conversation history
* CX intent
* operational context
* orchestration intelligence
* RAG context

---

### Event Telemetry

The platform stores orchestration telemetry events including:

* detected intents
* escalation events
* sentiment analysis
* AI-generated orchestration metadata

This powers the analytics system.

---

# Frontend Architecture

## Workspace

The Workspace page acts as:

* AI support console
* orchestration viewer
* customer interaction workspace

It includes:

* ChatStream
* ContextPanel
* OrchestrationDrawer

---

## Analytics Dashboard

The analytics dashboard visualizes:

* AI operational telemetry
* orchestration analytics
* escalation metrics
* telecom conversation trends

---

## Agent Desk

The Agent Desk provides:

* escalation queues
* operational prioritization
* human handoff workflows

---

# Conversation Lifecycle

```text
Customer Message
        ↓
Dialogflow CX Intent Detection
        ↓
Flow Routing
        ↓
Gemini Sentiment Analysis
        ↓
Risk Evaluation
        ↓
Escalation Detection
        ↓
RAG Context Retrieval
        ↓
Gemini Response Generation
        ↓
Telemetry Logging
        ↓
Frontend Rendering
```

---

# Analytics & Observability

The platform includes an observability layer that tracks:

* orchestration events
* AI routing behavior
* escalation frequency
* customer frustration
* customer state transitions
* operational telemetry

This transforms the system into an AI operations platform.

---

# Environment Variables

Create a `.env` file inside `backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key
PROJECT_ID=your_gcp_project_id
LOCATION_ID=global
AGENT_ID=your_dialogflow_agent_id
```

---

# Installation

## Backend Setup

```bash
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

Run backend:

```bash
uvicorn main:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

---

# API Endpoints

## Chat

```http
POST /chat
```

Handles:

* CX orchestration
* sentiment analysis
* escalation detection
* AI response generation

---

## Analytics

```http
GET /analytics/
```

Returns:

* telemetry analytics
* escalation metrics
* operational distributions
* timeline analytics

---

## Agent Desk

```http
GET /agent-desk/escalations
```

Returns escalation queue telemetry.

---

# Current Capabilities

* Dialogflow CX orchestration
* Gemini response generation
* Sentiment intelligence
* Escalation analysis
* Operational telemetry
* Analytics dashboards
* Human handoff workflows
* Customer state intelligence
* Risk analysis

---

# Current Limitations

## SQLite

SQLite is currently used for rapid prototyping.

Future migration target:

* PostgreSQL
* JSONB telemetry storage

---

## Synthetic Telemetry

Some timeline analytics are currently simulated for dashboard visualization.

---

## No Streaming Yet

Gemini responses are synchronous.

Future improvements:

* WebSockets
* token streaming
* live telemetry updates

---

# Future Roadmap

## Planned Improvements

* PostgreSQL migration
* Vector database integration
* Real RAG pipeline
* WebSocket telemetry
* Live orchestration streaming
* Agent assignment workflows
* SLA tracking
* CX health analytics
* LLM observability traces
* Prompt analytics
* Real telecom API integration

---

# Why This Project Matters

Most chatbot systems only implement:

```text
User → LLM → Response
```

Aurora Telecom AI Platform implements:

```text
User
 ↓
CX Orchestration
 ↓
Intent Routing
 ↓
Sentiment Intelligence
 ↓
Escalation Detection
 ↓
Operational Analytics
 ↓
Telemetry Logging
 ↓
Human Handoff
 ↓
Agent Operations
```

This architecture is closer to enterprise conversational AI systems than traditional chatbot demos.

---

# Author

Hemanth

AI & Conversational Systems Engineering

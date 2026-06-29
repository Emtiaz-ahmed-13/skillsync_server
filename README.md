# SkillSync Server

Backend API for **SkillSync** — a collaboration platform connecting freelancers and clients with milestone-based payments, AI-assisted planning, and project management.

**Production:** https://skillsync-server-emtiaz.vercel.app  
**Client:** https://skillsync-client-emtiaz.vercel.app

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Language | TypeScript 5 |
| Database | MongoDB (Mongoose 8) |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Payments | Stripe |
| File storage | ImageKit |
| AI | Groq (sprint planning, PDF analysis, timeline estimation) |
| Email | Nodemailer (SMTP) |
| Real-time | Socket.io (local / persistent server only) |
| Deploy | Vercel Serverless |

---

## Features

- **Authentication** — Signup, login, email verification, forgot/reset password, GitHub OAuth sync
- **Roles** — `client`, `freelancer`, `admin` with RBAC middleware
- **Projects** — Create, approve (admin), search/filter, assign freelancer on bid accept
- **Bids** — Freelancers bid; clients accept → auto milestones + project assignment
- **Milestones & payments** — Escrow-style milestone payments via Stripe
- **Sprints & tasks** — Sprint planning (AI-powered), task boards
- **Work submissions** — Freelancer deliverables with GitHub/live links
- **Reviews** — Post-project ratings
- **Notifications** — In-app notification system
- **Chat** — REST messaging + Socket.io (requires persistent server)
- **Admin** — Analytics, user management, project approval, disputes
- **AI** — PDF project brief analysis, text analysis, timeline estimation
- **Public stats** — Aggregate platform metrics for landing page

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm

### Installation

```bash
cd skillsync_server
npm install
cp .env.production.example .env   # then fill in values
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/skillsync

JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_TOKEN_SECRET=your-refresh-secret
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

SESSION_SECRET=your-session-secret
CLIENT_URL=http://localhost:3000

GROQ_API_KEY=your_groq_api_key

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

SMTP_HOST=smtp.gmail.com
SMTP_USER=
SMTP_PASS=
```

> **Production:** Use MongoDB Atlas. Localhost URIs are blocked when `NODE_ENV=production`.

### Run locally

```bash
# Development (with Socket.io)
npm run dev

# Production build
npm run build
npm start
```

Server runs at **http://localhost:5001**.

### Seed admin account

```bash
npm run seed:admin
```

Default credentials:

| Field | Value |
|-------|-------|
| Email | `admin@skillsync.dev` |
| Password | `Admin@123456` |

---

## API Overview

Base URL: `/api/v1`

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server status |
| GET | `/health` | Health check |
| GET | `/api/v1` | API index |

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | — | Register (multipart avatar optional) |
| POST | `/auth/login` | — | Login |
| POST | `/auth/github` | — | GitHub OAuth user sync (auto freelancer) |
| POST | `/auth/forgot-password` | — | Send reset email |
| POST | `/auth/reset-password` | — | Reset password with token |
| POST | `/auth/verify-email` | — | Verify email with token |
| POST | `/auth/resend-verification` | — | Resend verification email |
| GET | `/auth/users/:id` | JWT | Get user by ID |

### Core resources

| Prefix | Description |
|--------|-------------|
| `/profile` | User profile (me + public freelancer directory) |
| `/projects` | CRUD, approved/pending lists, approve, owner projects |
| `/bids` | Create, list, accept/reject |
| `/milestones` | Project milestones |
| `/payments` | Stripe intents, webhooks, project payments |
| `/sprints` | Sprint CRUD |
| `/sprint-planning` | AI sprint generation |
| `/tasks` | Task management |
| `/work-submissions` | Deliverable submissions |
| `/reviews` | Ratings and comments |
| `/notifications` | User notifications |
| `/chat` | Conversations, history, REST messages |
| `/files` | File uploads (ImageKit) |
| `/ai` | PDF/text analysis, timeline estimation |
| `/articles` | Blog/articles |
| `/admin` | Analytics, users, disputes |
| `/disputes` | Create and resolve disputes |
| `/stats/public` | Public platform statistics |

### Example requests

```bash
# Health
curl https://skillsync-server-emtiaz.vercel.app/health

# Public stats
curl https://skillsync-server-emtiaz.vercel.app/api/v1/stats/public

# Login
curl -X POST https://skillsync-server-emtiaz.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skillsync.dev","password":"Admin@123456"}'
```

Protected routes require header: `Authorization: Bearer <accessToken>`

---

## Project Structure

```
skillsync_server/
├── api/
│   └── index.ts              # Vercel serverless entry
├── scripts/
│   └── seed-admin.js         # Admin seed script
├── src/
│   ├── app.ts                # Express app + routes
│   ├── server.ts             # HTTP + Socket.io (local dev)
│   ├── config/               # DB and app config
│   ├── controllers/          # Request handlers
│   ├── middlewares/          # Auth, validation, DB connect, errors
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Route definitions
│   ├── services/             # Business logic
│   ├── utils/                # Email, JWT, Stripe, Groq, ImageKit
│   └── validations/          # Zod schemas
├── vercel.json
├── .env.production.example
└── package.json
```

---

## Deployment (Vercel)

1. Link project: `vercel link`
2. Set environment variables in Vercel dashboard (see `.env.production.example`)
3. Deploy:

```bash
vercel --prod
```

### Required production env vars

- `MONGODB_URI` — MongoDB Atlas connection string (must include `/skillsync` database name)
- `JWT_SECRET`, `JWT_REFRESH_TOKEN_SECRET`, `SESSION_SECRET`
- `CLIENT_URL` — e.g. `https://skillsync-client-emtiaz.vercel.app`
- `GROQ_API_KEY` — for AI features
- `SMTP_*` — for email verification and password reset

### Stripe webhook

Configure webhook URL in Stripe dashboard:

```
https://skillsync-server-emtiaz.vercel.app/api/v1/payments/webhook
```

### Limitations on Vercel

- **Socket.io** does not work on serverless. Use Railway/Render for real-time chat, or rely on REST + polling (`POST /chat/messages`).
- Cold starts may add ~1–2s latency on first request.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run vercel-build` | Build for Vercel |
| `npm run seed:admin` | Create default admin user |
| `npm run lint:fix` | Fix ESLint issues |

---

## License

MIT

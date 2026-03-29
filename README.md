# GNHS SSLG Portal

**Gumaca National High School — Supreme Secondary Learner Government**
_"Happy, Ready, and Willing to Serve"_

A full-stack React + TypeScript SPA for the GNHS student government portal.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS v3     |
| Routing   | React Router v6                                 |
| State     | Zustand + TanStack React Query                  |
| Forms     | React Hook Form + Zod                           |
| Backend   | Node.js + Express + TypeScript                  |
| Database  | Firebase Firestore                              |
| Auth      | Firebase Authentication (Email + Google OAuth)  |
| Storage   | Firebase Storage                                |
| Email     | Nodemailer (Gmail) + Firebase Cloud Functions   |
| Charts    | Recharts                                        |
| Deploy    | Vercel (frontend) + Firebase Functions (backend)|

---

## Project Structure

```
gnhs-sslg/
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── types/          # All TypeScript interfaces
│       ├── lib/            # Firebase, Firestore, Storage, API client, utils
│       ├── context/        # AuthContext
│       ├── hooks/          # Data-fetching hooks (React Query)
│       ├── components/
│       │   ├── layout/     # Navbar, Footer, Layout
│       │   ├── ui/         # Button, Card, Modal, Badge, Input, Spinner, Toast
│       │   └── guards/     # ProtectedRoute, RoleGuard
│       ├── pages/          # One .tsx per route
│       └── store/          # Zustand stores
├── backend/                # Express API
│   └── src/
│       ├── routes/         # One file per resource
│       ├── middleware/     # authMiddleware, roleMiddleware, errorHandler
│       ├── services/       # Firebase Admin, email (Nodemailer)
│       └── types/          # express.d.ts (Request extension)
├── functions/              # Firebase Cloud Functions
│   └── src/
│       ├── onRegistration.ts   # Email on event registration
│       └── onRequest.ts        # Email on service request
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Composite indexes
├── storage.rules           # Firebase Storage rules
├── firebase.json           # Firebase project config
└── vercel.json             # Vercel deployment config
```

---

## Routes

| Route           | Page               | Access     |
|-----------------|--------------------|------------|
| `/`             | Home               | Public     |
| `/about`        | About              | Public     |
| `/officers`     | Officers           | Public     |
| `/announcements`| Announcements      | Public     |
| `/events`       | Events             | Public     |
| `/scs`          | SCS                | Public     |
| `/services`     | Services           | Public     |
| `/documents`    | Documents          | Public     |
| `/organizations`| Organizations      | Public     |
| `/history`      | History            | Public     |
| `/contact`      | Contact            | Public     |
| `/login`        | Login              | Public     |
| `/evaluations`  | Evaluations        | Student+   |
| `/dashboard`    | Dashboard          | Officer+   |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/KOS-CDG/GumacaNHS.git
cd GumacaNHS
npm install
```

### 2. Firebase setup

1. Go to [Firebase Console](https://console.firebase.google.com) and create a project.
2. Enable **Authentication** (Email/Password + Google).
3. Create a **Firestore** database in production mode.
4. Enable **Storage**.
5. Copy your web app config values.

### 3. Configure environment variables

**Frontend** — create `frontend/.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend** — create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

> **Get the service account key:** Firebase Console → Project Settings → Service Accounts → Generate new private key.

### 4. Deploy Firestore rules and indexes

```bash
firebase login
firebase use --add          # select your project
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Run locally

```bash
# Both frontend + backend concurrently
npm run dev

# Or individually:
npm run dev --workspace=frontend   # http://localhost:3000
npm run dev --workspace=backend    # http://localhost:5000
```

### 6. Deploy

**Frontend → Vercel:**
```bash
vercel --prod
```
Set all `VITE_*` environment variables in the Vercel dashboard.

**Functions → Firebase:**
```bash
cd functions
firebase functions:config:set email.user="your@gmail.com" email.password="app_password"
firebase deploy --only functions
```

---

## Role System

| Role          | Access                                                   |
|---------------|----------------------------------------------------------|
| `public`      | Read-only public pages                                   |
| `student`     | Public pages + submit evaluations                        |
| `officer`     | All above + dashboard, create/edit announcements/events  |
| `super_admin` | All above + delete records, admin settings               |

To promote a user to officer, update their Firestore document:
```
users/{uid} → role: "officer"
```

---

## Firestore Collections

| Collection            | Description                        |
|-----------------------|------------------------------------|
| `users`               | User profiles and roles            |
| `announcements`       | SSLG announcements                 |
| `events`              | School events                      |
| `registrations`       | Event registrations                |
| `requests`            | Service/concern requests           |
| `organizations`       | Accredited student organizations   |
| `documents`           | Uploaded SSLG documents            |
| `evaluations`         | Event/org evaluation submissions   |
| `scs_members`         | Sectoral Committee System members  |
| `officers`            | Current and past SSLG officers     |
| `history_milestones`  | Historical timeline milestones     |
| `past_administrations`| Past officer administrations       |

---

## Design System

| Token     | Value     |
|-----------|-----------|
| Primary   | `#E91E8C` |
| Secondary | `#C0392B` |
| Accent    | `#FFFFFF` |
| Heading   | Times New Roman / Georgia |
| Body      | Inter / Arial             |

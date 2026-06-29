# 🔄 Universal Converter

> Convert any file format instantly — Documents, Images, Video, Audio, OCR, and more.

![CI/CD](https://github.com/wasimahmedqureshi/universal-converter/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-orange)

---

## 📸 Screenshots

> _Add screenshots here after first deployment_

---

## ✨ Features

- **30+ conversion formats** — PDF, DOCX, XLSX, PNG, JPG, WebP, MP4, MP3, and more
- **Firebase Realtime Database** — Live job queue with real-time progress tracking
- **Firebase Auth** — Google OAuth + Email/Password login
- **Firebase Storage** — Secure file uploads with progress indicator
- **Guest conversions** — No login required for basic conversions
- **Dashboard** — Full conversion history, favourites, recent files
- **Admin panel** — Live analytics, server status, queue monitoring
- **Dark / Light mode** — System preference + manual toggle
- **PWA-ready** — Works offline, installable on mobile
- **Docker support** — One-command local dev with FFmpeg, LibreOffice, Pandoc
- **CI/CD** — GitHub Actions pipeline with lint, type-check, build

---

## 🛠 Tech Stack

| Layer        | Technology                              |
|-------------|------------------------------------------|
| Frontend     | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend      | Next.js API Routes, FFmpeg, LibreOffice, Pandoc, ImageMagick |
| Database     | Firebase Realtime Database + Firestore   |
| Auth         | Firebase Authentication                  |
| Storage      | Firebase Storage                         |
| Deployment   | Vercel (frontend) + Railway/Render (backend with FFmpeg) |
| DevOps       | Docker, GitHub Actions, Dependabot       |

---

## 🚀 Installation

### Prerequisites
- Node.js 22+
- npm 10+
- Git
- Firebase project (see Firebase Setup below)

### Clone & Install

```bash
git clone https://github.com/wasimahmedqureshi/universal-converter.git
cd universal-converter
npm install
```

### Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
```

### Run Development Server

```bash
npm run dev
# → http://localhost:3000
```

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use `universal-converter-89139`)
3. Enable the following services:
   - **Authentication** → Email/Password + Google
   - **Realtime Database** → Start in test mode
   - **Firestore** → Start in test mode
   - **Storage** → Start in test mode
4. Go to **Project Settings → Your Apps → Web App**
5. Copy the config values into your `.env.local`

### Firebase Realtime Database Rules

```json
{
  "rules": {
    "conversionQueue": {
      "$jobId": {
        ".read": "auth != null && data.child('userId').val() === auth.uid || root.child('admins/' + auth.uid).exists()",
        ".write": "auth != null"
      }
    },
    "history": {
      "$userId": {
        ".read": "auth != null && auth.uid === $userId",
        ".write": "auth != null && auth.uid === $userId"
      }
    },
    "serverStatus": {
      ".read": true,
      ".write": "root.child('admins/' + auth.uid).exists()"
    },
    "analytics": {
      ".read": "root.child('admins/' + auth.uid).exists()",
      ".write": "root.child('admins/' + auth.uid).exists()"
    }
  }
}
```

---

## 📁 Folder Structure

```
universal-converter/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Register page
│   ├── admin/page.tsx              # Admin dashboard
│   ├── api/
│   │   └── convert/route.ts        # Conversion API endpoint
│   ├── convert/page.tsx            # Main converter UI
│   ├── dashboard/page.tsx          # User dashboard
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Homepage
├── components/
│   ├── converter/
│   │   ├── ConversionProgress.tsx  # Live progress tracker
│   │   ├── FileDropzone.tsx        # Drag & drop upload
│   │   └── FormatSelector.tsx      # Output format picker
│   └── layout/
│       └── Navbar.tsx              # Navigation bar
├── firebase/
│   ├── auth.ts                     # Auth helpers
│   ├── config.ts                   # Firebase init (RTDB + Firestore + Storage)
│   ├── rtdb.ts                     # Realtime Database: queue, history, analytics
│   └── storage.ts                  # File upload helpers
├── hooks/
│   ├── useAuth.tsx                 # Auth context
│   ├── useConversion.ts            # Conversion flow hook
│   └── useHistory.ts               # History from RTDB
├── utils/
│   ├── formats.ts                  # Format registry & helpers
│   └── helpers.ts                  # Common utilities
├── styles/globals.css
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## 🐳 Docker

```bash
# Build and run
docker-compose up --build

# Production build
docker build -t universal-converter .
docker run -p 3000:3000 --env-file .env.local universal-converter
```

---

## 🌐 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel Dashboard
# Project → Settings → Environment Variables
```

### Railway / Render (Backend with FFmpeg)

The conversion API requires FFmpeg, LibreOffice, Pandoc, and ImageMagick. These are NOT available on Vercel Edge. Use Railway or Render:

1. Create a new service on [Railway](https://railway.app) or [Render](https://render.com)
2. Connect your GitHub repo
3. Set the same environment variables
4. The Dockerfile installs all system dependencies automatically

---

## 📡 API Documentation

### `POST /api/convert`

Convert a file from one format to another.

**Request Body:**
```json
{
  "jobId": "string",
  "inputUrl": "string (Firebase Storage URL)",
  "inputFormat": "pdf",
  "outputFormat": "docx",
  "category": "document",
  "userId": "string",
  "originalName": "document.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "string",
  "outputUrl": "string",
  "command": "pandoc input.pdf -o output.docx"
}
```

---

## 🔧 NPM Scripts

| Script              | Description                    |
|--------------------|--------------------------------|
| `npm run dev`      | Start development server       |
| `npm run build`    | Build for production           |
| `npm run start`    | Start production server        |
| `npm run lint`     | Run ESLint                     |
| `npm run lint:fix` | Fix ESLint errors              |
| `npm run type-check` | TypeScript strict check      |
| `npm run test`     | Run Jest tests                 |
| `npm run format`   | Format with Prettier           |

---

## 🔍 Troubleshooting

**`firebase is not defined`** → Make sure all `NEXT_PUBLIC_FIREBASE_*` vars are set in `.env.local`

**`Conversion not working`** → The API route runs the conversion logic. For FFmpeg/LibreOffice, deploy to Railway/Render with Docker (not Vercel serverless)

**`RTDB permission denied`** → Update Firebase Realtime Database security rules (see Firebase Setup section)

**`Build fails on Vercel`** → Remove `output: "standalone"` from `next.config.ts` for Vercel, add it back for Docker

---

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md)

---

## 📄 License

MIT — see [LICENSE](LICENSE)

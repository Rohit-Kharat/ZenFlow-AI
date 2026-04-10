# 🌿 ZenFlow AI: Your Mental Wellness Partner

**ZenFlow AI** is a comprehensive, data-driven wellness companion that helps you find balance through a personalized yoga practice. By analyzing your daily mood and sleep metrics, ZenFlow creates a tailored experience that adapts to your body's rhythm in real-time.

---

## 🚀 Key Features

### 🧠 ZenFlow Logic Engine
Move beyond generic routines with our **Deterministic Recommendation Engine**. It uses a sophisticated tag-matching algorithm—not a "black box" AI—ensuring your practice is always science-backed and safe.
- **State-Aware**: Prioritizes recovery if you're sleep-deprived and builds heat when you're feeling energetic.
- **Time-Sensitive**: Automatically suggests energizing sun salutations in the morning and calming restorative flows in the evening.
- **Granular Personalization**: Maps 40+ biometric tags to a curated library for the perfect fit.

### 📊 Visual Wellness Analytics
Understand your progress with a high-fidelity dashboard built on **Recharts**.
- **7-Day Trend Analysis**: Track how your mood and sleep correlate over time.
- **Activity Mix**: See which mindfulness practices you engage in most frequently.
- **Instant KPIs**: Real-time feedback on your average wellness scores.

### 🧘‍♂️ Curated Yoga Library
A professional library of **15+ specialized routines**, including:
- **Relief**: Neck & Shoulder Release, Lower Back Healing.
- **Focus**: Power Yoga for Mental Clarity, Core Stability.
- **Recovery**: Wall Yoga, Deep Sleep Sequences, Yin Yoga for Tissue.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Framer Motion (for smooth, premium animations)
- **Data Fetching**: TanStack React Query
- **Charts**: Recharts (High-performance SVG visualizations)

### Backend
- **Runner**: Hono (Lightweight, ultra-fast Node.js framework)
- **Database**: MongoDB
- **ORM**: Prisma (Type-safe database interactions)
- **Authentication**: JWT-based secure sessions

---

## 📂 Project Structure

```bash
├── backend/           # Hono API & Prisma Schema
│   ├── src/api        # Routes & Controllers
│   ├── src/services   # Recommendation & Analytics Logic
│   └── src/seeds      # Curated Routine Content
└── frontend/          # Next.js Application
    ├── src/app        # Dashboard & Wellness Pages
    └── src/components # Reusable UI & Analytics Packages
```

---

## ⚡ Getting Started

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/Rohit-Kharat/ZenFlow-AI.git
    ```
2.  **Environment Setup**: Add your `DATABASE_URL` and `JWT_SECRET` to `backend/.env`.
3.  **Install & Generate**: 
    ```bash
    cd backend && npm install && npx prisma generate
    cd ../frontend && npm install
    ```
4.  **Run Development**:
    ```bash
    # Run in separate terminals
    cd backend && npm run dev
    cd frontend && npm run dev
    ```

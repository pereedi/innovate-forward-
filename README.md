# Innovate Forward — Technology & Digital Innovation Symposium

A modern, high-performance, and responsive single-page symposium landing website built with **React**, **Vite**, and modern **Vanilla CSS**.

Official Symposium Date: **22 September 2026**

---

## 🚀 How to Deploy on Vercel

This repository is pre-configured with `vercel.json` for zero-configuration, production-grade deployment on **Vercel**.

### Option 1: Deploy via GitHub (Recommended)
1. Initialize git and push this project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Innovate Forward React App"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Import your GitHub repository.
5. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your site will be live on a secure `https://*.vercel.app` URL with automatic continuous deployments on every push.

---

### Option 2: Deploy directly via Vercel CLI
If you prefer deploying directly from your terminal without Git:
1. Install the Vercel CLI globally (if not already installed):
   ```bash
   npm install -g vercel
   ```
2. Log in and deploy from the project folder:
   ```bash
   vercel
   ```
3. To deploy to production:
   ```bash
   vercel --prod
   ```

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
This generates the optimized static assets inside the `dist/` directory.

---

## 🎨 Key Features & Architecture
- **Official Brand Assets**: Uses the official `public/logo.png` without distortion or replacement.
- **Interactive 3D Point-Cloud Globe**: Canvas-driven Fibonacci particle sphere with interactive click-and-drag 3D rotation and dynamic constellation lines.
- **Concentric Gyroscopic Orbital Rings**: Multi-axis rotating celestial radar rings with orbiting telemetry nodes and 3D parallax tilt HUD preview cards.
- **Dual Theme System**: Full Luminous Light Mode and Cyber Dark Mode with one-click toggle in the navbar and persistent storage in `localStorage`.
- **Live Countdown to 22 September 2026**: Animated SVG circular progress stroke dials with automatic timezone calibration and event-day state.
- **"Watch Teaser" Video Modal**: Ambient conference trailer screen with soundwave visualization, playback controls, and registration triggers.
- **All 13 Structured Sections**: Navigation, Hero, Intro, What to Expect, Programme Schedule, Keynote Speakers, Target Audience, Logistics & Venue, Final Call to Action, Registration Modal, and Footer.

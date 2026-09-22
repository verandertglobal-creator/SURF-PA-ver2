# Surf South Africa 🇿🇦 🏄‍♂️

Comprehensive South African coastal surf guide with GPS spot finding, live marine & swell forecasts, stay & eat booking integration, tiered sponsors, swell push alerts, and community wave reports.

---

## 🚀 Quick Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```
The compiled static website will be created in the `dist/` directory.

---

## 🌐 Deploying to GitHub Pages (Fixing the White Screen)

If your app displays a blank white screen on GitHub Pages, it is typically because GitHub Pages is trying to serve raw `.tsx` source files from the `main` branch instead of running the production build.

### Recommended Fix: Enable GitHub Actions Deployment (Automatic)

This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. On GitHub, navigate to your repository.
2. Click **Settings** (top tab) ➔ **Pages** (in the left sidebar).
3. Under **Build and deployment** ➔ **Source**, select **GitHub Actions** (instead of "Deploy from a branch").
4. Go to the **Actions** tab on your repository and trigger the **Deploy to GitHub Pages** workflow, or simply push a new commit to `main`.
5. Once complete, your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.

---

## 🛠️ Built With

- **React 19 & TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React Icons**
- **Framer Motion**
- **Open-Meteo Marine API**

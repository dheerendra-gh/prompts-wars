# Carbon Footprint Awareness Program

This workspace contains a small, static web application to help users estimate their annual carbon dioxide (CO₂) emissions and learn simple ways to reduce them.

Files added:

- [index.html](index.html) — main UI and calculator
- [styles.css](styles.css) — stylesheet
- [app.js](app.js) — calculation logic and interactivity

Quick start:

1. Open [index.html](index.html) in your browser (double-click the file).
2. Or serve the folder with a simple local server, e.g.:

```powershell
# from workspace root
python -m http.server 8000
# then open http://localhost:8000/index.html
```

Notes: This app provides approximate estimates for awareness and learning only. Factors are simplified and will vary by region and behavior.

GitHub Pages deployment

1. Create a GitHub repository and push this project to the `main` branch.

```bash
git init
git add .
git commit -m "Add carbon awareness app"
# create repo on GitHub and replace <user>/<repo>
git remote add origin https://github.com/<user>/<repo>.git
git branch -M main
git push -u origin main
```

2. The included GitHub Action (`.github/workflows/deploy.yml`) will publish the repository root to GitHub Pages (the action uses the `GITHUB_TOKEN` and will create/update the `gh-pages` branch).

3. After the first successful deployment, enable GitHub Pages in the repository settings (if needed) and point to the `gh-pages` branch (root). Your site will be available at `https://<user>.github.io/<repo>/`.

If you'd rather deploy manually, push the `gh-pages` branch with the site files.


Repo is for assessments for prompts wars events.

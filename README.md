# Md Asad Uddin Anas — Portfolio

Personal portfolio website for **Md Asad Uddin Anas** — Windows Administrator · VMware Administrator · Software Engineer · Cybersecurity Enthusiast, based in Hyderabad, India.

**Live site:** https://md-asad-uddin-anas.netlify.app

---

## ✨ Features

- Dark/light theme toggle with two distinct premium color palettes (not a simple invert)
- Animated hero section with a lightweight canvas particle background
- Fully responsive — mobile, tablet, and desktop
- Sections: About, Experience, Skills, Projects, Certifications, Education, Contact
- Multi-resume download dropdown (served locally from `/resumes`)
- Contact form with client-side validation, [EmailJS](https://www.emailjs.com/) integration, and Cloudflare Turnstile human verification
- Social links: GitHub, LinkedIn, WhatsApp, Email, plus a "Book a Meeting" Calendly link
- Progressive Web App: installable, works offline via a network-first service worker
- SEO-ready: meta tags, Open Graph, canonical URL, `robots.txt`, `sitemap.xml`
- Google Analytics 4 + Microsoft Clarity + Google Search Console integrated
- Accessibility: skip link, focus states, `aria-invalid`, focus-managed modal, keyboard-dismissible menus, respects `prefers-reduced-motion`

## 🧱 Tech Stack

Plain **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no build step, no dependencies to install. Fonts via Google Fonts CDN. Form delivery via EmailJS. Spam mitigation via Cloudflare Turnstile.

## 📁 Project Structure

```
├── index.html                 → main page
├── style.css                  → all styling, themes, animations
├── script.js                  → all interactivity and logic
├── manifest.json               → PWA manifest
├── service-worker.js           → offline support (network-first)
├── 404.html                    → custom error page
├── robots.txt                  → search engine crawl rules
├── sitemap.xml                 → search engine sitemap
├── icons/                      → favicons + PWA app icons
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── favicon-32x32.png
│   ├── favicon-16x16.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   └── android-chrome-512x512.png
├── resumes/                    → downloadable resume PDFs
│   ├── Java-Cybersecurity-Hybrid.pdf
│   ├── Cybersecurity-Analyst.pdf
│   ├── Java-Developer.pdf
│   └── Windows-VMware-Linux-Azure.pdf
├── images/                     → reserved for future photos/screenshots
└── assets/                     → reserved for any future misc. files
```

## 🚀 Deployment

This is a static site — no build step required.

**Netlify (current host):**
1. Connected to this GitHub repository for continuous deployment
2. Build command: *(none)*
3. Publish directory: `/`
4. Every push to the main branch redeploys automatically

**To run locally:** just open `index.html` in a browser, or serve the folder with any static file server (e.g. `npx serve`).

## 🔧 Configuration

Editable constants live at the top of `script.js`:
- `RESUME_OPTIONS` — labels + file paths for the resume dropdown
- `EMAILJS_PUBLIC_KEY` / `EMAILJS_SERVICE_ID` / `EMAILJS_TEMPLATE_ID` / `EMAILJS_AUTOREPLY_TEMPLATE_ID`
- `TURNSTILE_ENABLED` — toggle the human-verification gate on the contact form

Analytics/verification tags live in `index.html` `<head>`: Google Analytics 4, Microsoft Clarity, Google Search Console verification meta tag.

## 📬 Contact

- Email: mdasaduddinanas2@gmail.com
- LinkedIn: [md-asad-uddin-anas-a6a9702b5](https://www.linkedin.com/in/md-asad-uddin-anas-a6a9702b5)
- GitHub: [MdAsadUddin-Anas-12](https://github.com/MdAsadUddin-Anas-12)
- WhatsApp: +91 93987 89281

## 📄 License

© 2026 Md Asad Uddin Anas. All rights reserved. This code is shared publicly for portfolio/demonstration purposes; please don't reuse the personal content (name, resume, contact details) as your own.
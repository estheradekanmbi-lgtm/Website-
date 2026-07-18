# Esther Adekanmbi — Data Analyst Portfolio

A premium, production-ready portfolio website built with pure HTML5, CSS3, and Vanilla JavaScript.
Fully deployable on GitHub Pages with zero dependencies.

---

## Quick Start

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git

# Copy portfolio files into repo root
cp -r portfolio/* .

# Open locally
open index.html
```

---

## Customisation Guide

Before going live, update every item in this table:

| File | What to change | Where |
|------|---------------|-------|
| `index.html` | Your real email | ebunoluwadekanmbi@gmail.com (×3) |
| `index.html` | LinkedIn URL | `YOUR_LINKEDIN` (×3) |
| `index.html` | GitHub URL | `YOUR_GITHUB` (×3) |
| `index.html` | University name | Ladoke Akintola University of Technology(×2) |
| `index.html` | Graduation year | Expected Graduation: 2027 |
| `index.html` | OG/Twitter image | `assets/images/og-image.jpg` |
| `index.html` | Canonical URL | `https://yourdomain.github.io/` |
| `index.html` | Schema.org URLs | sameAs LinkedIn + GitHub |
| `assets/images/placeholder.jpg` | **Replace with your real headshot** (square, min 400×400px) |
| `assets/resume/Esther_Adekanmbi_CV.pdf` | **Replace with your real CV** |
| `assets/images/project-1.jpg` through `project-6.jpg` | Replace with real dashboard screenshots |
| `assets/images/og-image.jpg` | Social share preview image (1200×630px) |

---

## Project Sections — What to Update

### Hero
- Typing phrases in `script.js` → `initTyping()` → `phrases` array
- Stats counters: `data-count` attributes on `.hero__stat-number` elements

### About
- Personal story paragraphs in the `.about__narrative` div
- Education details, focus areas, location

### Case Study
- All text within `.case-study__steps` — replace with your real project details
- Dashboard mock numbers in `.dashboard-mock__kpis`
- GitHub and Live Demo button `href` values

### Projects Gallery
- Each `<article class="project-card">`: title, description, tags, GitHub link
- `data-category` attribute controls filter behaviour: `sql`, `excel`, `powerbi`, `python`

### Learning Journey
- Each `.timeline__item`: date, title, organisation, description

### Certificates
- Each `.cert-card`: organisation, title, date, skills, certificate URL

### Contact
- Form submissions: connect `#contactForm` to Formspree, EmailJS, or your backend

---

## Deploying to GitHub Pages

### Option A — Personal site (yourname.github.io)

```bash
# 1. Create a repo named: YOUR_USERNAME.github.io
# 2. Push portfolio files to the main branch

git init
git add .
git commit -m "feat: launch portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main

# 3. GitHub Pages activates automatically — live in ~60 seconds
```

Your site will be at: `https://YOUR_USERNAME.github.io`

### Option B — Project site (yourname.github.io/portfolio)

```bash
# 1. Create any repo, e.g. "portfolio"
# 2. Push files
git push -u origin main

# 3. Go to Settings → Pages → Source: main branch / root
# 4. Your site: https://YOUR_USERNAME.github.io/portfolio
```

---

## File Structure

```
portfolio/
├── index.html                      ← Single-page site
├── style.css                       ← ~1,400 lines of premium CSS
├── script.js                       ← 19 named init functions
├── README.md                       ← This file
└── assets/
    ├── images/
    │   ├── placeholder.jpg         ← Replace with your headshot
    │   ├── og-image.jpg            ← Social share image
    │   ├── project-1.jpg           ← Corporate Blueprint
    │   ├── project-2.jpg           ← SQL Sales Analysis
    │   ├── project-3.jpg           ← HR Analytics
    │   ├── project-4.jpg           ← Python EDA
    │   ├── project-5.jpg           ← Financial Analysis
    │   └── project-6.jpg           ← Supply Chain
    └── resume/
        └── Esther_Adekanmbi_CV.pdf ← Replace with your real CV
```

---

## Features

| Feature | Status |
|---------|--------|
| Dark / Light mode | Persisted via localStorage |
| Sticky glass navigation | Scroll-activated blur |
| Scroll progress bar | Fixed top edge |
| Typing effect | 5 rotating phrases |
| Animated counters | EaseOut easing |
| Skills tab system | Keyboard accessible |
| Project filter | Category-based |
| IntersectionObserver reveals | Staggered per grid |
| Contact form validation | Real-time + on-submit |
| Back to top | Appears after 400px |
| Lazy image loading | Native + fallback SVG |
| Mobile navigation | Hamburger + focus trap |
| Keyboard accessibility | Full WCAG 2.1 AA |
| SEO metadata | Title, description, keywords |
| Open Graph | Facebook, LinkedIn |
| Twitter Cards | Summary large image |
| Schema.org | Person structured data |
| Reduced motion | Respects prefers-reduced-motion |
| Print stylesheet | Clean print output |

---

## Connecting the Contact Form

The form is client-side only. To receive emails, connect it to a service:

**Formspree (free tier, easiest):**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**EmailJS (no backend needed):**
Replace the `setTimeout` in `initContactForm()` in `script.js` with:
```javascript
emailjs.send('SERVICE_ID', 'TEMPLATE_ID', formData);
```

---

## Performance Tips

- Replace SVG placeholder images with real WebP screenshots (compress to <150KB each)
- Host fonts locally for faster load on slow connections
- Add a `sitemap.xml` and `robots.txt` to the repo root for SEO

---

© 2026 Esther Adekanmbi. All rights reserved.

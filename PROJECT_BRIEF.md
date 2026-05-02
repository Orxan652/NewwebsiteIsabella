# YOUR SKIN CLINIC — Project Brief & Design System

> **Purpose:** Single source of truth for AI assistants and developers working on this project.
> Read this file FIRST before making any changes to the website.

---

## 1. BUSINESS INFO

- **Name:** Your Skin Clinic
- **Type:** Premium beauty/skin clinic
- **Location:** Gallerian, Stockholm, Sweden
- **Language:** Swedish (sv)
- **Tone:** Luxurious, trustworthy, professional, Scandinavian-minimal
- **Focus treatments:** Microneedling, chemical peels, advanced skin treatments
- **Booking:** https://www.bokadirekt.se/places/your-skin-clinic-48263
- **Instagram (PMU):** https://www.instagram.com/your.skin.clinic.pmu
- **Instagram (Skincare):** https://www.instagram.com/your.skin.clinic
- **Email:** info@yourskinclinic.se
- **Phone:** 073-123 45 67
- **Hours:** Mån–Fre 09:00–18:00
- **Address:** Hamngatan 37 (Gallerian), Stockholm City
- **Google Maps:** Clickable address linking to Google Maps search

---

## 2. DESIGN SYSTEM (STRICT — follow exactly)

### Colors

| Token              | Hex       | Usage                              |
|--------------------|-----------|-------------------------------------|
| `--bg-primary`     | `#F6F1EB` | Main background, header, footer     |
| `--bg-secondary`   | `#EFE7DE` | Alternate sections, CTA blocks      |
| `--white`          | `#FFFFFF` | Cards, contrast blocks, trust bar   |
| `--text-heading`   | `#1A1A1A` | All headings                        |
| `--text-body`      | `#6B6B6B` | Body text, descriptions             |
| `--accent`         | `#2F2A26` | Primary buttons, CTA backgrounds    |
| `--accent-hover`   | `#4A433E` | Button hover states                 |
| `--border`         | `#E5DED6` | Borders, dividers, card strokes     |
| `--gold`           | `#C6A27E` | Stars, labels, highlights           |

### Typography

| Element   | Font Family              | Weight   | Notes                    |
|-----------|--------------------------|----------|--------------------------|
| Headings  | Playfair Display (serif) | 500–700  | All h1–h6 elements       |
| Body      | Inter (sans-serif)       | 400–600  | All body/UI text          |
| Labels    | Inter                    | 600      | Uppercase, letter-spaced  |

- Google Fonts CDN: `Playfair Display:wght@500;600;700` + `Inter:wght@400;500;600;700`
- Large, airy spacing between sections (clamp-based)

### Spacing & Sizing

| Token            | Value                           |
|------------------|---------------------------------|
| `--radius-sm`    | `8px`                           |
| `--radius-md`    | `12px` (cards)                  |
| `--radius-lg`    | `24px` (hero image, about img)  |
| `--shadow-subtle`| `0 2px 12px rgba(0,0,0,0.04)`  |
| `--shadow-card`  | `0 4px 24px rgba(0,0,0,0.06)`  |
| `--section-pad`  | `clamp(3rem, 8vw, 7rem)`       |
| `--max-width`    | `1240px`                        |

### Buttons

| Type        | Background    | Text          | Border              |
|-------------|---------------|---------------|----------------------|
| Primary     | `#2F2A26`     | `#FFFFFF`     | `#2F2A26`            |
| Outline     | `transparent` | `#2F2A26`     | `1.5px solid #2F2A26`|
| Hover (pri) | `#4A433E`     | `#FFFFFF`     | `#4A433E`            |
| Hover (out) | `#2F2A26`     | `#FFFFFF`     | `#2F2A26`            |

- All buttons: uppercase, letter-spacing 0.12em, font-weight 600, font-size 0.8125rem
- Standard padding: 0.875rem 2rem
- Small variant (`.btn-sm`): 0.625rem 1.5rem

---

## 3. PAGE STRUCTURE (index.html)

### Sections (in order)

1. **Header** — Sticky, white bg, stacked logo left, nav center (uppercase), "BOKA TID" button right, hamburger on mobile
2. **Mobile Nav** — Full-screen overlay, visible on mobile only
3. **Hero** — Full-width background image with dark warm gradient overlay, white text, buttons on left side
4. **Trust Bar** — White bg, 4 items with icons above + title + subtitle, vertical dividers on desktop
5. **Treatments Grid** — 8 cards (4-col desktop, 2-col tablet, 1-col mobile)
6. **Results (Före & efter)** — Side-by-side layout: title+button left, horizontal scroll gallery right
7. **Reviews** — "Omdömen från Bokadirekt" label, left score summary + right 3 review cards (3-col desktop)
8. **About** — Split image/text layout, white bg
9. **Final CTA** — Compact rounded card on beige bg, "Följ oss på Instagram" link
10. **Footer** — 6-column grid: logo, address, contact, links, info, social icons

### Navigation Items

| Label         | Link / Anchor     | Notes            |
|---------------|-------------------|------------------|
| Behandlingar  | `#behandlingar`   | Has dropdown     |
| Resultat      | `#resultat`       |                  |
| Priser        | `#priser`         |                  |
| Om oss        | `#om-oss`         |                  |
| Omdömen       | `#omdomen`        |                  |
| Kontakt       | `#kontakt`        |                  |
| BOKA TID      | `#boka`           | Primary CTA btn  |

### Treatment Cards (8 total)

1. Avancerade ansiktsbehandlingar
2. Kemisk peeling
3. Microneedling
4. Laser hårborttagning
5. PMU – Bryn & Läppar
6. PMU borttagning
7. Borttagning av prickar & hudförändringar
8. Fransar & Bryn

---

## 4. TECH STACK & CONVENTIONS

- **Plain HTML + CSS + JS** (no framework, no build step)
- Mobile-first responsive (breakpoints: 640px, 768px, 1024px)
- CSS custom properties defined in `:root` in `style.css`
- Scroll animations via IntersectionObserver (`.fade-in` → `.visible`)
- Smooth anchor scrolling with header offset
- Images: Unsplash placeholders (replace with real clinic photos)
- Semantic HTML5 (`<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`)
- `loading="lazy"` on all images except hero (hero uses `fetchpriority="high"`)
- All text content in Swedish

### File Structure

```
/home/ubuntu/newwebsite/
├── index.html          # Main page
├── style.css           # All styles (design system + components)
├── script.js           # Interactions (menu, scroll, animations)
├── images/
│   ├── hero.jpg        # Hero background image (microneedling treatment)
│   └── clinic.jpg      # Clinic interior photo (About section)
└── PROJECT_BRIEF.md    # THIS FILE — design reference
```

### CSS Class Naming

- `.section-header`, `.section-label`, `.section-title` — reusable section headers
- `.btn`, `.btn-primary`, `.btn-outline`, `.btn-sm` — button system
- `.container` — max-width wrapper
- `.fade-in` / `.visible` — scroll animation
- `.stagger` — child animation delay
- Component classes: `.treatment-card`, `.review-card`, `.result-card`, etc.

---

## 5. KEY COPY / CONTENT

### Hero (dark overlay, white text)
- **Label:** "Expertis. Trygghet. Naturliga resultat." (italic)
- **Headline:** "Avancerade behandlingar för din hud, ditt välmående och din självkänsla."
- **Subtext:** "Kliniska behandlingar med fokus på säkerhet, resultat och skräddarsydda lösningar för dig."
- **Buttons:** "BOKA TID" (white) + "SE BEHANDLINGAR" (outline-white)
- **Rating:** "★★★★★ 4.9/5 från 300+ kunder" (below buttons)
- **Background:** Hero image with dark warm gradient overlay from left

### Trust Bar (icons above, title + subtitle)
- "Certifierade specialister" / "Trygghet & säkerhet"
- "300+ nöjda kunder" / "Verkliga resultat"
- "Centralt i Stockholm" / "Gallerian, Hamngatan 37"
- "Flexibla bokningar" / "Enkelt online"

### Treatments Section Title
- "Avancerade behandlingar för huden du vill ha"

### Results Section Title
- "Före & efter"

### Reviews
- Label: "Omdömen från Bokadirekt"
- Score: "4.9/5"
- Subtext: "Baserat på 300+ verifierade omdömen"
- Reviewers: Emma S., Sofia K., Maria N.

### About Title
- "Din klinik för hud, skönhet och välmående"

### Final CTA (card style)
- "Redo att boka din tid?"
- "Välkommen att boka din behandling enkelt online."
- Button: "BOKA TID" → Bokadirekt
- Two Instagram links:
  - PMU: @your.skin.clinic.pmu (small "PMU" label above)
  - Skincare: @your.skin.clinic (small "Skincare" label above)

### Footer
- 6 columns: Logo, Address (clickable → Google Maps), Contact, Links, Info, Följ oss
- Two Instagram links with labels (same as CTA)
- No Facebook icon

---

## 6. TODO / FUTURE PAGES

> Update this section as the project grows.

- [ ] Individual treatment detail pages
- [ ] Results gallery page
- [ ] Full reviews/testimonials page
- [ ] About us full page
- [ ] Contact / booking page
- [ ] Blog / skincare tips (optional)
- [ ] Replace Unsplash placeholders with real clinic photography
- [ ] Connect real booking system URL
- [ ] Add cookie consent banner
- [ ] SEO: Open Graph meta tags, structured data (LocalBusiness schema)
- [ ] Favicon / touch icons with brand logomark

---

*Last updated: 2026-05-02 (v3 – real booking URL, dual Instagram, clickable address)*

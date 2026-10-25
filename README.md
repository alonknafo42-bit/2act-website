# 2Act website

Static marketing site for 2Act. Plain HTML, CSS and a small JS file, no build step.
Status: **draft for the founder's review. Not published anywhere.**

## Structure

```
website/
  index.html            Hebrew (main, rtl)
  en/index.html         English (ltr), the page Garmin reviewers read
  404.html
  assets/css/site.css   one stylesheet, logical properties so it serves rtl and ltr
  assets/js/site.js     scroll reveals, sticky feature phone, screens gallery (no dependencies)
  assets/fonts/         Heebo variable font, self-hosted (OFL licence alongside)
  assets/img/           WebP images in two sizes each; og-image.jpg for link previews
  robots.txt, sitemap.xml, site.webmanifest, favicon-32.png, apple-touch-icon.png
```

Image sources: App Store 1.2.0 material (`~/Downloads/1-תמונות-לחנות-6.9-אינץ`, `~/Desktop/app-store-1.2.0`), the app icon from `assets/icon.png`, and Apple's Hebrew "Download on the App Store" badge (unchanged, as Apple requires).

## Preview locally

```bash
python3 -m http.server 4610 --directory website
```

Then open http://localhost:4610 (Hebrew) and http://localhost:4610/en/ (English). Links are relative; serving it is still recommended so the browser treats it like the real site.

## Content status

All numbers are real (production data and Apple's public lookup, checked 2026-10-25): 3,400+ women signed up, 40,000+ days logged, 6,000+ meals scanned, 500+ joined the 75-day challenge, 4.7★ App Store rating (count deliberately not shown), one real anonymous App Store review. Invented quotes and unverifiable claims were removed. No `ph` placeholders remain. To mark something as unconfirmed again, wrap it in `<span class="ph" data-ph="key">` and add `class="draft"` to `<html>` (dashed outline).

## Before publishing

1. **Domain**: absolute URLs (`canonical`, `hreflang`, `og:url`, `og:image`, JSON-LD, `robots.txt`, `sitemap.xml`) use `https://2act-app.com`. Asset and page links are relative, so the site also works on a temporary GitHub Pages address. For GitHub Pages with the custom domain, add a `CNAME` file containing `2act-app.com` at the site root.
2. **Optional**: replace the English text button with Apple's official English badge (`assets/img/appstore-badge-en.svg`, unmodified).
3. **Cache version**: bump `?v=` on the CSS and JS links after changing either file.

## Design notes

- Tokens follow `DESIGN.md`: sage brand, clay accent kept small, warm cream ground, warm shadows, Heebo only, no em dashes, no pure black or white (the only exception is Apple's badge artwork, which must not be altered).
- Motion: IntersectionObserver reveals and a sticky phone that swaps screens as features scroll (desktop), transform and opacity only, ease-out, no bounce. Scroll-linked depth uses CSS `animation-timeline` where supported. `prefers-reduced-motion` turns all of it off, and content is fully visible without JavaScript (elements are hidden only after the inline script adds the `js` class).
- The running-coach section is the page's one deep anchor. Its claims mirror the Garmin application pack (Training API pushes structured workouts, Activity API returns completed runs, plan changes come from server-side rules, Garmin data never reaches AI, analytics or ads). Keep them in step with the published privacy policy.
- The age split of real users is deliberately not shown anywhere.
- The 404 page uses root-absolute paths on purpose (it is served at any URL depth), so it only renders fully on the custom domain.

# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** and `canvas-design` skill** before writing any frontend code, every session, no exceptions.

## Stack — Next.js (Default)
- **All projects use Next.js (App Router) unless the user explicitly says otherwise.**
- Bootstrap with: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" -- --port 3005`
- Use the **App Router** (`/src/app/`) — never the Pages Router.
- Default dependencies: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@types/react`, `@types/node`
- For animations: `framer-motion`. For icons: `lucide-react`. Install only when needed.
- Component files go in `src/components/`. Shared utilities in `src/lib/`. Types in `src/types/`.
- Use **Server Components** by default. Add `"use client"` only when the component needs browser APIs, state, or event handlers.
- **Never use** `next/head` — use the `metadata` export in `layout.tsx` instead.
- Environment variables: `NEXT_PUBLIC_` prefix for client-side vars; plain for server-side only.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `npm run dev -- --port 3005` (runs on `http://localhost:3005`)
- Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3005`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3005 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Next.js App Router project structure (see Stack section above)
- Tailwind CSS via `tailwind.config.ts` — **not CDN** (Next.js integrates it natively)
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive using Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- `next/image` for all `<img>` tags — never raw `<img>` unless unavoidable
- `next/link` for all internal navigation — never raw `<a href>`
- `next/font` for web fonts — never a `<link>` to Google Fonts in `<head>`

## File & Folder Conventions
```
src/
  app/
    layout.tsx       ← root layout, global metadata
    page.tsx         ← home route
    globals.css      ← global styles + Tailwind directives
  components/
    ui/              ← primitive/shared UI components
  lib/               ← utilities, helpers, constants
  types/             ← shared TypeScript types
public/
  images/            ← all property photos go here
tailwind.config.ts
next.config.ts
```

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Sample colors from the provided property photos and define them as custom tokens in `tailwind.config.ts`. Never assume or invent a palette before seeing the images.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity — define them as custom `boxShadow` values in `tailwind.config.ts`.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing. Prefer `framer-motion` for complex sequences.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Use `next/image` with a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens defined in `tailwind.config.ts` — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Luxury & Dynamic Feel

### Aesthetic Principles
- **Less is more.** Luxury is restraint — generous whitespace, fewer elements, nothing that feels "busy". If a section feels crowded, remove something.
- **Colors come from the photos — always.** Before writing a single hex value, sample the property images in `brand_assets/` or `public/images/`. Pull a background tone, a surface mid-tone, and a highlight accent directly from the shots. Define these as custom tokens in `tailwind.config.ts`. Do not invent or assume a palette.
- **Dark or light is decided by the photos.** If the property images skew bright, airy, and minimal → light palette. If they skew moody, dramatic, or richly textured → dark palette. Match the mood of the space, not a generic luxury template.
- **Typography does the heavy lifting.** Use `next/font` to load a refined serif or editorial display font for headlines paired with a geometric sans for body. Font choices, sizing, tracking, and line-height are the coder's call — match the vibe of the property.
- **Material richness.** Simulate texture: subtle grain overlays (SVG `feTurbulence` noise at ~3% opacity), glass morphism (`backdrop-blur-md bg-white/5 border border-white/10`), or layered shadows that echo the material feel of the space in the photos.
- **Asymmetry and editorial layout.** Break the grid intentionally — oversized type bleeding into negative space, images offset from their captions, text at unexpected scale contrasts.

### Layout & Alignment
- **Centered by default.** Every section's content lives inside a centered max-width container. `max-w-6xl mx-auto px-6` is the baseline — adjust max-width per section as needed for editorial effect. Nothing hugs the left edge unless it is deliberately full-bleed.
- **Full-bleed is intentional, not accidental.** Hero images, gallery sections, and cinematic dividers are full-bleed. Text content is never full-bleed — it always has a max-width container with horizontal padding.
- **Text alignment:** Body copy and labels are left-aligned within their container. Section headings and hero text are left-aligned to their container (not the viewport edge). Center-aligning text is reserved for short, isolated moments like stat blocks or pull quotes — never for body paragraphs.
- **No orphaned content.** If a grid or flex layout has unequal items on the last row, handle it — use `justify-start` with consistent gap, never let a single card stretch to fill the row.

### Buttons — Non-Negotiable Sizing
Buttons are a primary trust signal on a luxury rental listing. Small or timid buttons kill conversions and feel cheap. Follow these rules absolutely:

- **Primary CTA minimum size:** `px-8 py-4` padding, full text in uppercase spaced tracking, never smaller. On desktop the primary CTA should feel like something you'd see on a hotel website — substantial and confident.
- **Two CTA styles only:**
  - **Filled primary:** Solid background using the accent color, contrasting text, `px-8 py-4`, subtle border of the same color. Used for "Book a Viewing", "Submit Enquiry".
  - **Outlined secondary:** Transparent background, `border-2` in accent color, accent-colored text, same `px-8 py-4` sizing. Used for "View Gallery", secondary actions.
- **Never** use text-only links as CTAs. If something is a call to action, it gets a button treatment.
- **Never** let a button shrink below its content on mobile — use `w-full sm:w-auto` so it fills mobile width and sits naturally on desktop.
- **Icon arrows** (`→`) inside buttons should have `ml-2` spacing and animate `translate-x-1` on hover.
- **The sticky bottom bar** (mobile: rent + Book a Viewing) must have the CTA button at full tap-target height — minimum `h-12`.

### Motion & Dynamics
- **Every scroll is an event.** Use `framer-motion` `whileInView` with `once: true` to animate elements as they enter. Default: fade up (`y: 40 → 0, opacity: 0 → 1`) over `0.8s` with `ease: [0.16, 1, 0.3, 1]` (expo out — feels expensive).
- **Stagger children.** When a list or grid of items enters, stagger them with `0.1s` delay between each child.
- **Parallax on hero.** Apply a slow `y` parallax to hero background using `useScroll` + `useTransform`. Background drifts at 30–50% scroll speed.
- **Number counters.** Any stat or metric counts up when it scrolls into view using `framer-motion`'s `useMotionValue` + `useSpring`.
- **Hover reveals.** Cards and gallery items reveal on hover with a slow scale (`1.0 → 1.03`, `0.6s`) and an overlay that fades in — never a sudden jump.
- **Line reveals.** For section headings, use a clip-path reveal: `clipPath: 'inset(0 100% 0 0)'` → `inset(0 0% 0 0)`. Duration `1s`.

### Gallery — 49 Images
This property has 49 photographs. Handle them properly:

- **Do not dump all 49 into a grid.** Curate and group them into named categories matching the property sections: Exterior, Living Spaces, Kitchen & Dining, Bedrooms, Bathrooms, Garden & Terrace, Additional.
- **Hero gallery:** The first 5–6 best shots form a hero carousel or split-screen at the top of the Gallery page. These are full-bleed, full-height. Use a `useInterval` or `framer-motion` `AnimatePresence` crossfade — no jarring cuts.
- **Section galleries:** Each category gets its own masonry or editorial grid. Use `columns-2 md:columns-3` CSS columns for a natural masonry layout — no JS masonry library needed.
- **Lightbox:** Every image opens a full-screen lightbox with keyboard navigation (arrow keys, Escape). Use `framer-motion` for the open/close transition. Show the category name and photo count (`3 / 12`) in the lightbox.
- **Lazy loading:** All gallery images use `next/image` with `loading="lazy"` and appropriate `sizes` prop. Never load all 49 images eagerly.
- **Thumbnails:** In grid view, images use `aspect-[4/3]` or `aspect-square` consistently within each category — no jagged mixed-ratio grids unless it's an intentional masonry layout.
- **Performance:** Use `next/image` with `quality={85}` for gallery images. For the hero carousel use `priority` on the first image only.

### Specific Component Rules
- **Hero:** Full-viewport (`min-h-screen`), full-bleed property photo as background with a dark overlay (`bg-gradient-to-t from-black/70 via-black/20 to-transparent`), large editorial headline bottom-left, key stats bar pinned to the bottom. Two CTAs side by side — filled primary + outlined secondary, both substantial (see Button rules above).
- **Sections:** Separated by generous padding (`py-24` to `py-40`). Never use `<hr>` — use whitespace as the divider.
- **Stat blocks:** Icon + large number + small label. Numbers animate on scroll. Separated by subtle vertical dividers, never cards.
- **Feature sections (image + text):** Alternating left/right layout on desktop. Image takes 55% width, text 45%. On mobile: image on top, text below. The text column is left-aligned within its container.
- **Enquiry form:** The form is a premium touchpoint — treat it like a hotel booking form. Labels are small-caps above inputs, not inside them as placeholders. Input borders are subtle (1px, low-opacity). The submit button is the largest, most confident element on the form — full-width, filled, accent color.
- **Images:** Always `next/image` with `object-cover`. Add gradient overlay and warm color treatment via `mix-blend-mode: multiply`.
- **Grid layouts:** Prefer unequal column splits (`grid-cols-[3fr_2fr]`, `grid-cols-[1fr_2fr]`) over symmetric grids.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not use raw `<img>`, `<a href>`, or Google Fonts `<link>` — use Next.js equivalents
- Do not use the Pages Router (`/pages/`) — always use the App Router (`/src/app/`)
- **Do not make buttons small.** If a button looks like a link, it is wrong. Go back and make it bigger.
- **Do not left-align content to the viewport edge.** All text content must be inside a centered container with padding.
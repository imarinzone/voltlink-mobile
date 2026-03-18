# VoltLink Design System v1.0

> Comprehensive design tokens, component patterns, and visual guidelines for the VoltLink platform.
> Use this document as the single source of truth to replicate the VoltLink visual identity across any project (web, mobile, companion apps).

---

## 1. Brand Identity

**Platform**: VoltLink — Grid-Aware EV Charging Intelligence
**Design Philosophy**: Swedish Minimalism — clean, functional, confidence-inspiring. Dark-only UI with subtle glassmorphism, restrained gradients, and purposeful motion.
**Theme Mode**: Dark only. No light mode toggle.

---

## 2. Color System

### 2.1 Brand Colors

| Name       | Hex       | Usage                                      |
|------------|-----------|---------------------------------------------|
| EcoGreen   | `#04eaaa` | Primary brand color, success states, CTAs    |
| EcoBlue    | `#10a6de` | Secondary brand color, info states, accents  |
| EcoTeal    | `#207071` | Tertiary, muted accents, chart fills         |

### 2.2 Brand Color Scales

**EcoGreen (emerald)**
| Stop | Hex       |
|------|-----------|
| 50   | `#e6fff8` |
| 100  | `#b3ffec` |
| 200  | `#80ffe0` |
| 300  | `#4dffd4` |
| 400  | `#1affc8` |
| 500  | `#04eaaa` |
| 600  | `#03bb88` |
| 700  | `#028c66` |
| 800  | `#025d44` |
| 900  | `#014433` |
| 950  | `#002e22` |

**EcoBlue (cyan)**
| Stop | Hex       |
|------|-----------|
| 50   | `#e6f7fd` |
| 100  | `#b3e8fa` |
| 200  | `#80d9f7` |
| 300  | `#4dcaf4` |
| 400  | `#1abaf1` |
| 500  | `#10a6de` |
| 600  | `#0d85b2` |
| 700  | `#0a6486` |
| 800  | `#074359` |
| 900  | `#053244` |
| 950  | `#03212d` |

**EcoTeal (teal)**
| Stop | Hex       |
|------|-----------|
| 50   | `#e8f4f4` |
| 100  | `#bfe0e0` |
| 200  | `#96cccd` |
| 300  | `#6db8b9` |
| 400  | `#44a4a6` |
| 500  | `#207071` |
| 600  | `#1a5a5b` |
| 700  | `#144345` |
| 800  | `#0d2d2e` |
| 900  | `#0a2223` |
| 950  | `#071617` |

### 2.3 Neutral-Teal Scale (UI Grays)

Desaturated blue-gray scale (hue locked at ~200 degrees). These replace standard grays throughout the UI.

| Stop | Hex       | Role                          |
|------|-----------|-------------------------------|
| 50   | `#F2F5F7` | Foreground text               |
| 100  | `#E5EAED` | Emphasized text               |
| 200  | `#CBD5DB` | Secondary text                |
| 300  | `#A8B8C2` | Muted text, chart axis labels |
| 400  | `#7A8D9A` | Placeholder, disabled text    |
| 500  | `#5A6D7A` | Borders                       |
| 600  | `#455661` | Heavy borders                 |
| 700  | `#344149` | Hover backgrounds             |
| 800  | `#243038` | Card borders, dividers        |
| 900  | `#152128` | Card/surface backgrounds      |
| 950  | `#040C10` | Page background               |

### 2.4 Status/Warning Colors

| Name    | Hex       | Background             | Text        | Border                  |
|---------|-----------|------------------------|-------------|--------------------------|
| Success | `#04eaaa` | `rgba(4,234,170,0.15)` | `#04eaaa`   | `rgba(4,234,170,0.2)`    |
| Warning | `#f59e0b` | `rgba(245,158,11,0.15)`| `#f59e0b`   | `rgba(245,158,11,0.2)`   |
| Critical| `#ef4444` | `rgba(239,68,68,0.10)` | `#ef4444`   | `rgba(239,68,68,0.25)`   |
| Info    | `#10a6de` | `rgba(16,166,222,0.1)` | `#10a6de`   | `rgba(16,166,222,0.25)`  |
| Offline | N/A       | `rgba(NT-800,0.5)`    | `#7A8D9A`   | Neutral-Teal 800         |

### 2.5 Amber Scale (Warning/Attention)

| Stop | Hex       |
|------|-----------|
| 50   | `#fff8eb` |
| 100  | `#ffecc6` |
| 200  | `#ffd98a` |
| 300  | `#ffc54e` |
| 400  | `#ffb224` |
| 500  | `#f59e0b` |
| 600  | `#d97706` |
| 700  | `#b45309` |
| 800  | `#92400e` |
| 900  | `#78350f` |
| 950  | `#451a03` |

### 2.6 Brand Gradient

```
Direction: -136.286deg (top-right to bottom-left)
From: #04eaaa (EcoGreen)
To:   #10a6de (EcoBlue)

CSS: linear-gradient(-136.286deg, #04eaaa 0%, #10a6de 100%)
```

**Gradient Variants:**
- **Primary**: `linear-gradient(-136.286deg, #04eaaa 0%, #10a6de 100%)`
- **Reversed**: `linear-gradient(-136.286deg, #10a6de 0%, #04eaaa 100%)`
- **Horizontal**: `linear-gradient(90deg, #04eaaa 0%, #10a6de 100%)`
- **Subtle Green**: `linear-gradient(180deg, rgba(4,234,170,0.1) 0%, rgba(4,234,170,0) 100%)`
- **Subtle Blue**: `linear-gradient(180deg, rgba(16,166,222,0.1) 0%, rgba(16,166,222,0) 100%)`
- **Subtle Primary**: `linear-gradient(-136.286deg, rgba(4,234,170,0.1) 0%, rgba(16,166,222,0.1) 100%)`

### 2.7 Semantic Color Variables (Dark Mode)

These are the CSS custom property values used for the dark theme:

| Variable                  | HSL Value (H S% L%)    | Usage                    |
|---------------------------|------------------------|--------------------------|
| `--background`            | `200 60% 4%`           | Page background          |
| `--foreground`            | `204 24% 96%`          | Primary text             |
| `--border`                | `200 30% 12%`          | Default borders          |
| `--card`                  | `200 43% 7%`           | Card backgrounds         |
| `--card-foreground`       | `204 24% 96%`          | Card text                |
| `--card-border`           | `200 40% 8%`           | Card borders             |
| `--popover`               | `200 35% 10%`          | Popover/dropdown bg      |
| `--popover-foreground`    | `204 24% 96%`          | Popover text             |
| `--popover-border`        | `200 30% 12%`          | Popover borders          |
| `--primary`               | `165 97% 46%`          | Primary actions (EcoGreen)|
| `--primary-foreground`    | `200 60% 4%`           | Text on primary          |
| `--secondary`             | `197 88% 47%`          | Secondary actions (EcoBlue)|
| `--secondary-foreground`  | `200 60% 4%`           | Text on secondary        |
| `--muted`                 | `200 25% 16%`          | Muted backgrounds        |
| `--muted-foreground`      | `203 18% 71%`          | Muted text               |
| `--accent`                | `200 30% 12%`          | Accent backgrounds       |
| `--accent-foreground`     | `204 24% 96%`          | Accent text              |
| `--destructive`           | `0 84% 35%`            | Destructive actions      |
| `--destructive-foreground`| `204 24% 96%`          | Text on destructive      |
| `--input`                 | `200 30% 12%`          | Input borders            |
| `--ring`                  | `165 97% 46%`          | Focus rings              |

### 2.8 Elevation Variables (Dark Mode)

| Variable       | Value                       | Usage                  |
|----------------|------------------------------|------------------------|
| `--elevate-1`  | `rgba(4, 234, 170, 0.04)`   | Hover elevation        |
| `--elevate-2`  | `rgba(4, 234, 170, 0.09)`   | Active/toggle elevation|

---

## 3. Typography

### 3.1 Font Families

| Role      | Font             | Fallback Stack                                          | Usage                              |
|-----------|------------------|---------------------------------------------------------|------------------------------------|
| Heading   | Montserrat       | -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif | All headings, body text, UI labels |
| Body/Sans | Montserrat       | (same as heading)                                       | Default body text                  |
| Display   | Address Sans Pro | -apple-system, BlinkMacSystemFont, sans-serif            | Numeric values, overlines, captions, buttons |

**Font Loading:**
- Montserrat: Google Fonts (weights 100-900, italic)
- Address Sans Pro: Self-hosted OTF files (weights: 300 Light, 400 Regular, 600 SemiBold, 700 Bold, 800 ExtraBold)

### 3.2 Type Scale — Headings

| Token            | Size     | Line Height | Letter Spacing | Weight |
|------------------|----------|-------------|----------------|--------|
| `heading-5xl`    | 5rem     | 1.1         | -0.02em        | —      |
| `heading-4xl`    | 3.813rem | 1.1         | -0.02em        | —      |
| `heading-3xl`    | 2.938rem | 1.15        | -0.02em        | —      |
| `heading-2xl`    | 2.25rem  | 1.2         | -0.02em        | 700    |
| `heading-xl`     | 1.688rem | 1.25        | -0.02em        | —      |
| `heading-lg`     | 1.313rem | 1.3         | -0.02em        | —      |
| `heading-base`   | 1rem     | 1.4         | -0.02em        | —      |
| `heading-sm`     | 0.75rem  | 1.4         | -0.02em        | —      |
| `heading-xs`     | 0.563rem | 1.4         | -0.02em        | —      |

### 3.3 Type Scale — Body

| Token        | Size     | Line Height |
|--------------|----------|-------------|
| `body-3xl`   | 3rem     | 1.2         |
| `body-2xl`   | 2.5rem   | 1.2         |
| `body-xl`    | 2.063rem | 1.25        |
| `body-lg`    | 1.75rem  | 1.3         |
| `body-md`    | 1.438rem | 1.35        |
| `body-base`  | 1.188rem | 1.4         |
| `body-sm`    | 1rem     | 1.5         |
| `body-xs`    | 0.688rem | 1.4         |
| `xs`         | 0.75rem  | 1rem        |
| `micro`      | 10px     | 1.4         |

### 3.4 Semantic Heading Styles

| Element/Class       | Size     | Weight | Line Height | Letter Spacing |
|---------------------|----------|--------|-------------|----------------|
| `h1` / `.heading-hero`     | 2.25rem  | 800    | 1.1         | -0.025em       |
| `h2` / `.heading-section`  | 1.5rem   | 700    | 1.2         | —              |
| `h3` / `.heading-card`     | 1.125rem | 600    | 1.3         | —              |

### 3.5 Special Text Classes

| Class           | Font            | Size      | Weight | Transform  | Tracking | Other                      |
|-----------------|-----------------|-----------|--------|------------|----------|----------------------------|
| `.status-value` | Address Sans Pro| 2.5rem    | 700    | —          | —        | `line-height: 1.2`, `font-feature-settings: "tnum"` |
| `.status-label` | Montserrat      | 0.75rem   | 500    | UPPERCASE  | 0.05em   | —                          |
| `.label-upper`  | —               | 0.6875rem | 600    | UPPERCASE  | 0.15em   | —                          |
| `.text-overline`| Address Sans Pro| 0.625rem  | 500    | UPPERCASE  | 0.1em    | `line-height: 1`           |
| `.text-caption` | Address Sans Pro| 0.625rem  | 400    | —          | 0.02em   | `font-feature-settings: "tnum"` |
| `.text-gradient-primary` | —   | —         | —      | —          | —        | Brand gradient as text fill |

### 3.6 Font Weight Rules

- **Maximum weight**: `font-bold` (700). Never use `font-black` (900) or `font-extrabold` (800).
- **Default `.text-sm`**: Has `font-weight: 500` applied globally.
- **Chart card titles**: `text-lg font-semibold leading-none tracking-tight font-heading`
- **Chart card subtitles**: `text-sm text-muted-foreground mt-2`

---

## 4. Spacing & Layout

### 4.1 Base Spacing Unit

`--spacing: 0.25rem` (4px). All spacing derives from 4px multiples.

### 4.2 Border Radius

| Token  | Value   | Usage                           |
|--------|---------|----------------------------------|
| `sm`   | 0.5rem  | Small elements, inner containers |
| `md`   | 0.75rem | Default (also `--radius`)        |
| `lg`   | 1rem    | Cards, panels                    |
| `xl`   | 1.25rem | Large containers                 |
| `2xl`  | 1.5rem  | Extra large containers           |
| `full` | 9999px  | Pills, badges, avatars           |

**Default radius**: `--radius: 0.75rem`

### 4.3 Page Layout

```
.page-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 3rem;     /* 32px 48px */
}

/* Mobile (< 768px) */
padding: 1.5rem 1rem;     /* 24px 16px */
```

### 4.4 Grid Systems

**Dashboard Grid (12-column)**
```
gap: 1.5rem (24px)
Columns: repeat(12, 1fr)
```

**Status Cards Grid (4-column)**
```
gap: 1.5rem (24px)
Columns: repeat(4, 1fr)
Breakpoint 1280px: repeat(2, 1fr)
Breakpoint 768px: 1fr
```

**Vehicles Grid (4-column)**
```
gap: 1.5rem (24px)
Columns: repeat(4, 1fr)
Breakpoint 1280px: repeat(2, 1fr)
Breakpoint 768px: 1fr
```

### 4.5 Standard Gaps

| Context           | Gap      |
|--------------------|----------|
| Card grid          | 1.5rem   |
| Button group       | 0.5rem   |
| Tab group items    | 0.25rem  |
| Metric card inner  | 0.75rem  |
| Card meta rows     | 0.625rem |

---

## 5. Shadows

### 5.1 Dark Mode Card Shadows

```css
/* Default card */
box-shadow: 0 4px 16px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2);

/* Card hover */
box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(4,234,170,0.12);
```

### 5.2 Button Shadows

```css
/* Primary button */
box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(4,234,170,0.2);

/* Primary button hover */
box-shadow: 0 2px 4px rgba(0,0,0,0.12), 0 6px 16px rgba(4,234,170,0.3);
```

### 5.3 Tab Active Shadow

```css
box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
```

---

## 6. Glassmorphism

### 6.1 Standard Glass Panel (Dark Mode)

```css
background: rgba(255,255,255,0.08);
border: 1px solid rgba(255,255,255,0.15);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-radius: 1rem;
box-shadow: 0 4px 16px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2);
```

**Hover:**
```css
background: rgba(255,255,255,0.12);
border-color: rgba(255,255,255,0.25);
box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(4,234,170,0.12);
```

### 6.2 Page Header (Sticky Glassmorphism)

```css
position: sticky;
top: 0;
z-index: 100;
background: hsl(var(--background) / 0.78);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);
border-bottom: 1px solid hsl(var(--border) / 0.2);
```

### 6.3 Tooltip Glassmorphism (Dark Mode)

```css
background: rgba(10,20,25,0.85);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(48,64,76,0.5);
color: #F2F5F7;
box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
```

### 6.4 Tab Group Glass

```css
background: rgba(21,33,40,0.75);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(36,48,56,0.8);
box-shadow: 0 4px 16px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2);
```

---

## 7. Component Patterns

### 7.1 Buttons

**Primary Button (`.btn-primary`)**
```
Background: linear-gradient(135deg, #04eaaa 0%, #10a6de 100%)
Text: #0a0a0a (dark on gradient)
Font: Address Sans Pro, 14px, weight 600, tracking 0.02em
Padding: 12px 24px
Border: none
Border-radius: var(--radius) (0.75rem)
Shadow: 0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(4,234,170,0.2)
Icon size: 18px
Gap: 0.5rem

Hover: translateY(-1px), shadow intensifies
Active: translateY(0)
```

**Secondary Button (`.btn-secondary`) — Dark Mode**
```
Background: transparent
Text: rgba(255,255,255,0.9)
Border: 1.5px solid rgba(255,255,255,0.15)
Font: Address Sans Pro, 14px, weight 600, tracking 0.02em
Padding: 12px 24px
Icon size: 18px
Gap: 0.5rem

Hover: background rgba(255,255,255,0.06), border rgba(255,255,255,0.25), translateY(-1px)
Active: translateY(0)
```

**Icon Button (Subtle)**
```
Classes: bg-muted text-muted-foreground hover:text-foreground
```

### 7.2 Status Metric Cards

**Container (`.status-card-gradient`)**
```
Padding: 1.5rem
Border-radius: 1rem
Min-height: 180px
Layout: flex column, gap 0.75rem
Transition: background 0.3s, box-shadow 0.3s

Dark mode base:
  background: radial-gradient(circle at top left, rgba(4,234,170,0.03), rgba(16,166,222,0.02), transparent 70%)
  background-color: rgba(4,12,16,0.5)
  backdrop-filter: blur(12px)

Gradient border (::before pseudo):
  1px gradient border using mask technique
  background: linear-gradient(135deg, rgba(16,166,222,0.3) 0%, rgba(4,234,170,0.3) 100%)
  filter: drop-shadow(0 0 8px rgba(4,234,170,0.12))
```

**Variant Modifiers:**
- `.variant-success` — EcoGreen tints
- `.variant-warning` — Amber tints
- `.variant-critical` — Red tints
- `.variant-neutral` — Slate/blue tints

**Icon Container (`.status-icon-minimal`)**
```
Width/Height: 40px
Border-radius: var(--radius)
Layout: flex center
Hover: scale(1.1) transition 0.3s

Dark mode backgrounds by variant:
  success: rgba(4,234,170,0.15), color #04eaaa
  warning: rgba(245,158,11,0.15), color #f59e0b
  critical: rgba(239,68,68,0.10), color #ef4444
  neutral: rgba(16,166,222,0.15), color #10a6de
```

**Value (`.status-value`)**: 2.5rem, weight 700, Address Sans Pro, color `#F2F5F7`
**Label (`.status-label`)**: 0.75rem, weight 500, uppercase, tracking 0.05em, Montserrat, color `#A8B8C2`

### 7.3 Cards

**Standard Card (`.card-with-corners`)**
```
Padding: 1.25rem
Border-radius: var(--radius)
Background: hsl(var(--card))
Border: 1px solid hsl(var(--border))

Hover corner accents:
  20px corner marks at all four corners
  Dark mode: rgba(242,245,247,0.25) border color
  Opacity 0 → 1 on hover (0.25s ease)
```

**Gradient Border Card (`.gradient-border-card`)**
```
Dark mode:
  Background: radial-gradient(circle at top left, rgba(4,234,170,0.03), rgba(16,166,222,0.02), transparent 70%)
  Background-color: #0A1419
  Gradient border (::before): linear-gradient(135deg, #10a6de 0%, #04eaaa 100%)
  Drop shadow: 0 0 8px rgba(4,234,170,0.2)
```

**Hover Accent Card (`.hover-accent-card`)**
```
4 corner accent marks (12px each)
2px border width on corners
Opacity 0 → 1 on hover (0.25s ease)
```

### 7.4 Badges

**Badge Pattern:**
```
display: inline-flex
align-items: center
padding: 0.25rem 0.625rem
border-radius: 9999px (pill)
font-size: 0.625rem
font-weight: 700
letter-spacing: 0.05em
text-transform: uppercase
```

**Variants (Dark Mode):**
| Variant    | Background               | Color     | Border                    |
|------------|--------------------------|-----------|---------------------------|
| Success    | `rgba(4,234,170,0.15)`   | `#04eaaa` | `rgba(4,234,170,0.2)`     |
| Warning    | `rgba(245,158,11,0.15)`  | `#f59e0b` | `rgba(245,158,11,0.2)`    |
| Critical   | `rgba(239,68,68,0.10)`   | `#ef4444` | `rgba(239,68,68,0.25)`    |
| Offline    | `bg-neutral-teal-800/50` | `#7A8D9A` | `neutral-teal-800`        |

### 7.5 Tabs

**Tab Group Container (`.tab-group`)**
```
display: inline-flex
align-items: center
gap: 0.25rem
padding: 0.25rem
border-radius: 1rem
background: hsl(var(--muted) / 0.4)
border: 1px solid hsl(var(--border) / 0.4)
```

**Tab Button (`.tab-button`)**
```
padding: 0.375rem 0.75rem
border-radius: calc(var(--radius) - 2px)
font-size: 0.875rem
font-weight: 600
border: 1px solid transparent
background: transparent
white-space: nowrap
display: inline-flex, align-items center, justify-content center
gap: 0.375rem
color: hsl(var(--muted-foreground))
Icon size: 18px

Hover: color foreground, background hsl(var(--background) / 0.5)

Active (.active):
  color: foreground
  background: hsl(var(--background))
  border-color: hsl(var(--border) / 0.6)
  shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)
```

### 7.6 Toggle Switch

```
Container: w-10 (40px), h-[22px], rounded-full
  ON:  bg-[#2ba19f]
  OFF: bg-neutral-teal-700

Thumb: w-4 (16px), h-4, rounded-full, bg-white
  ON:  left 22px
  OFF: left 3px
  Top: 3px
```

### 7.7 Search Input

**Dark Mode (`.search-input`)**
```
width: 100%, max-width: 450px
padding: 0.75rem 1rem 0.75rem 2.75rem
border-radius: var(--radius)
font-size: 0.875rem
background: rgba(242,245,247,0.06)
color: #E5EAED
border: 1px solid rgba(242,245,247,0.08)
placeholder color: #7A8D9A

Focus:
  background: rgba(242,245,247,0.1)
  border-color: rgba(4,234,170,0.4)
  box-shadow: 0 0 0 3px rgba(4,234,170,0.08)
```

### 7.8 Input Focus Style (Global)

```
Dark mode:
  outline: none
  box-shadow: 0 0 0 3px rgba(4,234,170,0.08)
  border-color: rgba(4,234,170,0.4)
```

### 7.9 Range Slider

```
Track: 8px height, rounded-full
  Fill: #207071 (EcoTeal)
  Empty: hsl(var(--muted) / 0.4)

Thumb: 18px, rounded-full
  Background: #04eaaa
  Border: 2px solid hsl(var(--background))
  Shadow: 0 0 0 2px rgba(4,234,170,0.2)
  Hover shadow: 0 0 0 4px rgba(4,234,170,0.25)
```

### 7.10 Scrollbar

```css
scrollbar-width: thin;
scrollbar-color: neutral-teal-700 transparent;

/* Webkit */
width: 4px;
track: transparent;
thumb: neutral-teal-700, border-radius 4px;
```

---

## 8. Icons

### 8.1 Icon Library

**Primary**: Phosphor Icons (duotone weight)
- Package: `@phosphor-icons/react`
- Default weight: `duotone`
- Standard sizes: 24px (default), 18px (buttons), 16px (inline/small), 14px (compact)

### 8.2 Icon Sizing Rules

| Context          | Size   |
|------------------|--------|
| Default          | 24px   |
| Button icons     | 18px   |
| Inline/meta      | 16px   |
| Compact/info     | 14px   |
| Status card icon | Within 40px container |

---

## 9. Animations & Motion

### 9.1 CSS Transitions

| Property    | Duration | Easing              | Usage               |
|-------------|----------|---------------------|---------------------|
| Default     | 0.3s     | ease                | Most transitions    |
| Fast        | 0.15s    | ease                | Tab switches, hover |
| Buttons     | 0.3s     | ease                | Buttons             |
| Opacity     | 0.25s    | ease                | Corner accents      |
| Scroll      | smooth   | —                   | Page scroll         |

### 9.2 CSS Keyframe Animations

**Fade In**
```css
@keyframes fade-in {
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
duration: 0.5s ease-out forwards
```

**Slide Up**
```css
@keyframes slide-up {
  0%   { transform: translateY(40px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
duration: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards
```

**Pulse Glow (EcoGreen)**
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(4,234,170,0.4); }
  50%      { box-shadow: 0 0 40px rgba(4,234,170,0.8); }
}
duration: 2s ease-in-out infinite
```

**Float**
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
duration: 6s ease-in-out infinite
```

**Shimmer**
```css
@keyframes shimmer {
  0%   { backgroundPosition: -200% 0; }
  100% { backgroundPosition: 200% 0; }
}
duration: 2s linear infinite
```

**Glow Ring**
```css
@keyframes glow-ring {
  0%, 100% { box-shadow: 0 0 8px rgba(4,234,170,0.3); }
  50%      { box-shadow: 0 0 20px rgba(4,234,170,0.6); }
}
duration: 2s ease-in-out infinite
```

**Pulse Critical (Red)**
```css
@keyframes pulse-critical {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
  50%      { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
}
duration: 2s ease-in-out infinite
```

**Pulse Border (Red)**
```css
@keyframes pulse-border {
  0%, 100% { border-color: rgba(239,68,68,0.2); }
  50%      { border-color: rgba(239,68,68,0.5); }
}
duration: 2s ease-in-out infinite
```

### 9.3 GSAP Animation Patterns

**Metric Counter Animation**
```
From: 0
To: target value
Duration: 1.5s
Ease: power2.out
Feature: Tabular numerics enabled, formatted with locale string
```

**Progress Bar Animation (Charging Sessions)**
```
Bar width: from 0% → target
Duration: 1.2s
Ease: power2.out

Shimmer overlay (GSAP timeline, repeat -1):
  1. Start at x: -100%
  2. Animate to x: 200%
  3. Duration: 2s, ease: power1.inOut
  4. Repeat delay: 0.5s

Glow effect:
  Box-shadow pulse between 0.2 and 0.6 opacity
  Duration: 2s, yoyo, repeat -1
```

**Card Entrance (Staggered)**
```
From: { opacity: 0, y: 20 }
To: { opacity: 1, y: 0 }
Duration: 0.5s
Stagger: 0.05s
Ease: power2.out
```

### 9.4 Live Indicator (Animated Ping Dot)

```html
<span class="relative flex h-2.5 w-2.5">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-green-500 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-eco-green-500"></span>
</span>
```

### 9.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Accessibility

### 10.1 Standards

- WCAG 2.1 AA compliance (dark mode)
- Keyboard navigation support on all interactive elements
- Focus-visible ring: `ring-2 ring-ring ring-offset-2 ring-offset-background`
- All interactive elements require `data-testid` attributes

### 10.2 Focus Styles

```css
/* Focus visible ring */
outline: none;
ring: 2px solid hsl(var(--ring));    /* EcoGreen */
ring-offset: 2px;
ring-offset-color: hsl(var(--background));

/* Input focus (override) */
outline: none;
box-shadow: 0 0 0 3px rgba(4,234,170,0.08);
border-color: rgba(4,234,170,0.4);
```

### 10.3 Test ID Convention

```
Interactive: {action}-{target}         (e.g., button-submit, input-email)
Display:     {type}-{content}          (e.g., text-username, status-payment)
Dynamic:     {type}-{description}-{id} (e.g., card-vehicle-${vehicleId})
```

---

## 11. Chart & Data Visualization

### 11.1 Chart Color Palette (LOCKED)

Charts must ONLY use these named colors. The names map to brand values:

| Name      | Maps To    | Hex at 500  | Usage                         |
|-----------|------------|-------------|-------------------------------|
| `emerald` | EcoGreen   | `#04eaaa`   | Primary series                |
| `cyan`    | EcoBlue    | `#10a6de`   | Secondary series              |
| `teal`    | EcoTeal    | `#207071`   | Tertiary series               |
| `amber`   | Warning    | `#f59e0b`   | Status/warning series         |
| `slate`   | Neutral    | `#5A6D7A`   | Muted/secondary series        |

### 11.2 Chart Axis Styles (LOCKED)

```css
Axis tick text:
  fill: #A8B8C2
  font-family: Montserrat
  font-size: 0.875rem

Grid lines:
  stroke: #A8B8C2
```

### 11.3 Chart Tooltip (Glassmorphism)

```css
Dark mode:
  background: rgba(21,33,40,0.9)
  backdrop-filter: blur(20px)
  border: 1px solid #243038
  box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2)

Label text: #7A8D9A (Montserrat, 14px)
Value text: #F2F5F7 (Address Sans Pro, 14px, weight 700)
Divider: 1px solid #243038
```

---

## 12. Patterns & Recipes

### 12.1 Live Status Badge

```
Container: flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted/30
Content: Animated ping dot + label text
```

### 12.2 Page Header Structure

```
No icon in title row
Title: h1 heading
Subtitle: text-base text-neutral-teal-300 mt-1 tracking-[0.02em]
Wrapper: <div className="mb-8">
```

### 12.3 Filter Dropdown

```
Trigger: Button variant="outline" with CaretDown icon
Do NOT use search-input class for filter triggers
search-input class is ONLY for text search inputs
```

### 12.4 Card Meta Row

```
Container: flex items-center gap-0.625rem, font-size 0.875rem
Icon: 24px circle, bg muted/50, centered
Label: flex-shrink-0, opacity 0.7
Value: margin-left auto, text-align right, weight 500, foreground color
```

### 12.5 Action Menu Item

```
Container: flex items-center gap-0.625rem, width 100%, padding 0.5rem 0.75rem
Border-radius: 0.5rem
Font: 0.875rem, weight 500
Background: transparent, hover muted/60
Danger variant: destructive color, hover destructive/10 background
```

### 12.6 Shimmer Overlay

```css
position: absolute;
top: 0; left: -100%;
width: 100%; height: 100%;
background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
pointer-events: none;
z-index: 1;
```

---

## 13. Mobile App Adaptation Notes

When adapting this design system for React Native or mobile frameworks:

1. **Colors**: All hex values and RGBA values translate directly. Use the exact color scales.
2. **Typography**: Montserrat is available on Google Fonts for mobile. Address Sans Pro needs to be bundled as a custom font.
3. **Shadows**: React Native uses `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` (iOS) and `elevation` (Android). Translate the CSS shadows accordingly.
4. **Glassmorphism**: React Native supports `@react-native-community/blur` for blur effects. Use the same opacity and blur values.
5. **Border Radius**: Map directly (e.g., `borderRadius: 12` for 0.75rem at standard density).
6. **Animations**: Use `react-native-reanimated` for GSAP-equivalent animations. Match durations and easing curves.
7. **Icons**: Phosphor Icons has a React Native package: `phosphor-react-native`.
8. **Gradients**: Use `react-native-linear-gradient` with the same color stops and angles.
9. **No Hover States on Mobile**: Replace hover interactions with `onPressIn`/`onPressOut` active states using the elevation values.
10. **Status Bar**: Dark content style to match the dark theme.

---

## 14. Version History

| Version | Date       | Changes                           |
|---------|------------|-----------------------------------|
| 1.0     | 2026-03-18 | Initial design system extraction  |

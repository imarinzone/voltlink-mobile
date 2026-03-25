# VoltLink Design Tokens — Strict Specification

This is the **binding contract** for all VoltLink UI surfaces (web, mobile, any platform).
Every value below is exact. Do not approximate, substitute, or "interpret" — copy the values precisely.

---

## 1. Color System (Dark Mode Only)

### 1.1 Brand Colors (Primary Palette)

| Token            | Hex       | Usage                                      |
|------------------|-----------|---------------------------------------------|
| EcoGreen-500     | `#04eaaa` | Primary accent, active states, success       |
| EcoGreen-400     | `#1affc8` | Hover states on green elements               |
| EcoGreen-600     | `#03bb88` | Pressed states on green elements             |
| EcoGreen-100     | `#b3ffec` | Light tint (badges, subtle backgrounds)      |
| EcoBlue-500      | `#10a6de` | Secondary accent, links, info states         |
| EcoBlue-400      | `#1abaf1` | Hover on blue elements                       |
| EcoBlue-600      | `#0d85b2` | Pressed on blue elements                     |
| EcoTeal-500      | `#207071` | Tertiary, supporting charts, muted accent    |
| EcoTeal-400      | `#44a4a6` | Hover on teal elements                       |
| EcoTeal-600      | `#1a5a5b` | Pressed on teal elements                     |

### 1.2 Brand Gradient

```
Direction: -136.286deg (top-right to bottom-left)
Start: #04eaaa (EcoGreen-500)
End:   #10a6de (EcoBlue-500)
```
Use sparingly: hero banner accent lines, progress bar fills, decorative strokes. Never for button fills.

### 1.3 Neutral-Teal Scale (Dark Mode Grays)

These are NOT standard grays. They are desaturated teal-hued neutrals (hue 200°, decreasing saturation).

| Token              | Hex       | HSL               | Usage                                           |
|--------------------|-----------|--------------------|-------------------------------------------------|
| neutral-teal-950   | `#040C10` | 200° 60% 4%       | App background, deepest surface                  |
| neutral-teal-900   | `#152128` | 200° 30% 12%      | Subtle borders, dividers                         |
| neutral-teal-800   | `#243038` | 200° 25% 18%      | Card borders, input borders, grid lines          |
| neutral-teal-700   | `#344149` | 200° 18% 24%      | Hover backgrounds, elevated surfaces             |
| neutral-teal-600   | `#455661` | 200° 15% 32%      | Disabled text, inactive icons                    |
| neutral-teal-500   | `#5A6D7A` | 200° 14% 41%      | Placeholder text                                 |
| neutral-teal-400   | `#7A8D9A` | 203° 13% 54%      | Muted foreground, secondary text, labels         |
| neutral-teal-300   | `#A8B8C2` | 203° 18% 71%      | Body text (secondary), axis labels, captions     |
| neutral-teal-200   | `#CBD5DB` | 204° 20% 83%      | Subtle emphasis text                             |
| neutral-teal-100   | `#E5EAED` | 204° 22% 91%      | Strong emphasis text                             |
| neutral-teal-50    | `#F2F5F7` | 204° 24% 96%      | Primary foreground text (headings, values)        |

### 1.4 Semantic Surface Colors

| Surface              | Hex       | Derivation                         |
|----------------------|-----------|------------------------------------|
| Background           | `#040C10` | neutral-teal-950                   |
| Card / Container     | `#0A1419` | Between 950 and 900 (hsl 200 43% 7%) |
| Popover / Dropdown   | `#0F1C23` | Between card and 900 (hsl 200 35% 10%) |
| Accent / Hover       | `#152128` | neutral-teal-900                   |
| Border               | `#152128` | neutral-teal-900                   |
| Input border         | `#152128` | neutral-teal-900                   |
| Muted background     | `#1C2B34` | hsl 200 25% 16%                   |

### 1.5 Status Colors

| Status      | Hex       | Background (10% opacity)   | Border (25% opacity)      |
|-------------|-----------|----------------------------|---------------------------|
| Success     | `#04eaaa` | `rgba(4, 234, 170, 0.10)`  | `rgba(4, 234, 170, 0.25)` |
| Warning     | `#f59e0b` | `rgba(245, 158, 11, 0.10)` | `rgba(245, 158, 11, 0.25)` |
| Error / Red | `#ef4444` | `rgba(239, 68, 68, 0.10)`  | `rgba(239, 68, 68, 0.25)` |
| Info        | `#10a6de` | `rgba(16, 166, 222, 0.10)` | `rgba(16, 166, 222, 0.25)` |

Pattern for status badges: `background: <color>/10%`, `border: 1px solid <color>/25%`, `text: <color>`.

### 1.6 Chart Colors (Strict Mapping)

| Series Name | Hex       | When to Use                           |
|-------------|-----------|---------------------------------------|
| emerald     | `#04eaaa` | Primary series, positive values        |
| cyan        | `#10a6de` | Secondary series, DC/fast charge       |
| teal        | `#207071` | Tertiary series, AC/slow charge        |
| amber       | `#f59e0b` | Warning series, status indicators      |
| slate       | `#5A6D7A` | Muted/secondary series, backgrounds    |

Never use arbitrary hex colors in charts. Only these five.

---

## 2. Typography

### 2.1 Font Families

| Token      | Family                        | Usage                                    |
|------------|-------------------------------|------------------------------------------|
| `heading`  | Montserrat                    | ALL headings, body text, labels, buttons |
| `display`  | Address Sans Pro              | Numeric values, stat cards, KPIs, captions, overlines |
| `mono`     | SF Mono, Consolas             | Code, IDs, technical values              |

Montserrat is the **primary font** — used for everything except numbers/stats.
Address Sans Pro is **only** for large numeric displays (stat values, KPIs).

### 2.2 Type Scale — Headings (Montserrat)

| Token          | Size (rem) | Size (px) | Line Height | Letter Spacing | Weight |
|----------------|------------|-----------|-------------|----------------|--------|
| heading-5xl    | 5.000      | 80        | 1.1         | -0.02em        | 700    |
| heading-4xl    | 3.813      | 61        | 1.1         | -0.02em        | 700    |
| heading-3xl    | 2.938      | 47        | 1.15        | -0.02em        | 700    |
| heading-2xl    | 2.250      | 36        | 1.2         | -0.02em        | 700    |
| heading-xl     | 1.688      | 27        | 1.25        | -0.02em        | 700    |
| heading-lg     | 1.313      | 21        | 1.3         | -0.02em        | 600    |
| heading-base   | 1.000      | 16        | 1.4         | -0.02em        | 600    |
| heading-sm     | 0.750      | 12        | 1.4         | -0.02em        | 600    |

### 2.3 Type Scale — Body (Montserrat)

| Token      | Size (rem) | Size (px) | Line Height | Weight |
|------------|------------|-----------|-------------|--------|
| body-3xl   | 3.000      | 48        | 1.2         | 400    |
| body-2xl   | 2.500      | 40        | 1.2         | 400    |
| body-xl    | 2.063      | 33        | 1.25        | 400    |
| body-lg    | 1.750      | 28        | 1.3         | 400    |
| body-md    | 1.438      | 23        | 1.35        | 400    |
| body-base  | 1.188      | 19        | 1.4         | 400    |
| body-sm    | 1.000      | 16        | 1.5         | 500    |
| body-xs    | 0.688      | 11        | 1.4         | 400    |

### 2.4 Special Sizes

| Token   | Size     | Usage                                         |
|---------|----------|-----------------------------------------------|
| text-xs | 12px     | Small labels, meta text, timestamps            |
| text-sm | 14px     | Default body text, descriptions, weight: 500   |
| micro   | 10px     | Overlines, section labels (uppercase, tracking-widest) |
| 3xl     | 40px     | Status card values (font-display, weight: 700) |

### 2.5 Numeric Values (Address Sans Pro)

For stat card large numbers:
```
font-family: Address Sans Pro
font-size: 2.5rem (40px)
font-weight: 700
line-height: 1.2
```

### 2.6 Maximum Weight Rule

**Never use `font-weight: 800` or `900`**. Maximum allowed is `700` (bold).

---

## 3. Spacing System

Base unit: `4px` (0.25rem). All spacing is multiples of this.

| Token  | Value  | Usage                                           |
|--------|--------|-------------------------------------------------|
| 0.5    | 2px    | Tight inline spacing                             |
| 1      | 4px    | Minimum gap                                      |
| 1.5    | 6px    | Small padding (badges)                            |
| 2      | 8px    | Icon-to-text gap, tight card padding              |
| 3      | 12px   | Standard inner padding                            |
| 4      | 16px   | Default card padding, section gap                 |
| 5      | 20px   | Card content padding (1.25rem)                    |
| 6      | 24px   | Section spacing, card gap in grids                |
| 8      | 32px   | Page horizontal padding                           |
| 10     | 40px   | Page vertical padding                             |
| 12     | 48px   | Large section spacing                             |

### Page Layout

| Property          | Value          |
|-------------------|----------------|
| Page padding      | `px-8 py-8` (32px horizontal, 32px vertical) |
| Section gap       | `24px` (gap-6)                             |
| Card grid gap     | `24px` (gap-6)                             |
| Card inner padding| `20px` (p-5 or 1.25rem)                   |
| Card border-radius| `12px` (0.75rem)                           |

---

## 4. Cards & Containers

### 4.1 Standard Card

```
background: #0A1419 (card surface)
border: 1px solid #152128 (neutral-teal-900)
border-radius: 12px (0.75rem)
padding: 20px (1.25rem)
```

### 4.2 Card with Corner Accents (Hover Effect)

On hover, four corner L-brackets (20×20px) appear at the card's four corners:
```
border-color: rgba(242, 245, 247, 0.25)
size: 20px × 20px per corner
opacity: 0 → 1 on hover (0.25s ease)
```

### 4.3 Status/Metric Cards

```
background: #0A1419
border: 1px solid #152128
padding: 20px
border-radius: 12px
```
- Label: 12px Montserrat, weight 500, color #7A8D9A, with icon (16×16px) to the left
- Value: 40px Address Sans Pro, weight 700, color #F2F5F7
- Grid: 4 columns, gap 24px (`grid-template-columns: repeat(4, 1fr)`)

### 4.4 Glassmorphism Panel

```
background: rgba(4, 12, 16, 0.70)
backdrop-filter: blur(20px)
border: 1px solid rgba(242, 245, 247, 0.08)
border-radius: 12px
```

---

## 5. Interactive Elements

### 5.1 Primary Button (Default)

```
background: hsl(165 97% 46%)  →  #04eaaa (EcoGreen-500)
text-color: #040C10 (neutral-teal-950, dark text on bright bg)
font-family: Montserrat
font-size: 14px
font-weight: 600
padding: 8px 16px
border-radius: 12px
border: none
```
Hover: slight opacity reduction (opacity: 0.9)
This is the STANDARD button. No gradients.

### 5.2 Secondary/Outline Button

```
background: transparent
border: 1px solid #243038 (neutral-teal-800)
text-color: #A8B8C2 (neutral-teal-300)
font-family: Montserrat
font-size: 14px
font-weight: 500
padding: 8px 16px
border-radius: 12px
```
Hover: `background: #152128`, `text-color: #F2F5F7`

### 5.3 Ghost/Icon Button

```
background: transparent
text-color: #7A8D9A (neutral-teal-400)
padding: 8px
border-radius: 12px
```
Hover: `background: rgba(255,255,255,0.05)`, `text-color: #F2F5F7`

### 5.4 Input Fields

```
background: transparent
border: 1px solid #152128 (neutral-teal-900)
border-radius: 12px
padding: 8px 12px
font-size: 14px
font-family: Montserrat
text-color: #F2F5F7
placeholder-color: #5A6D7A (neutral-teal-500)
```
Focus: `border-color: #04eaaa`, `ring: 2px #04eaaa at 20% opacity`

---

## 6. Icons

Library: **Phosphor Icons**, weight: **duotone**, size: **24px** default (20px in nav, 16px inline with text).

Do not use any other icon library. All icons must be Phosphor duotone weight.

---

## 7. Borders & Dividers

| Context            | Color     | Width |
|--------------------|-----------|-------|
| Card border        | `#152128` | 1px   |
| Divider / separator| `#243038` | 1px   |
| Input border       | `#152128` | 1px   |
| Focus ring         | `#04eaaa` at 20% | 2px   |
| Subtle border      | `rgba(242, 245, 247, 0.08)` | 1px |

---

## 8. Border Radius

| Token     | Value  | Usage                           |
|-----------|--------|---------------------------------|
| DEFAULT   | 12px   | Cards, buttons, inputs, modals  |
| sm        | 8px    | Badges, small tags              |
| full      | 9999px | Avatars, dot indicators, pills  |

---

## 9. Shadows

Dark mode uses **no visible box shadows** on cards. Elevation is conveyed through background color shifts:
- Base level: `#040C10` (background)
- Level 1 (card): `#0A1419`
- Level 2 (popover): `#0F1C23`
- Level 3 (modal overlay): `rgba(0, 0, 0, 0.60)` backdrop

---

## 10. Animation & Transitions

| Property               | Duration | Easing       |
|------------------------|----------|--------------|
| Color/opacity changes  | 150ms    | ease         |
| Hover state transitions| 200ms    | ease         |
| Corner accent appear   | 250ms    | ease         |
| Page entrance (GSAP)   | 600ms    | power2.out   |
| Card stagger delay     | 50ms     | —            |

---

## 11. Component Patterns

### 11.1 Section Header

```
<Overline>
  font-family: Address Sans Pro
  font-size: 10px
  font-weight: 600
  letter-spacing: 0.2em
  text-transform: uppercase
  color: #7A8D9A (neutral-teal-400)
  icon: 12×12px Phosphor duotone, color: #04eaaa
</Overline>
```

### 11.2 Card Title

```
font-family: Montserrat
font-size: 18px (text-lg)
font-weight: 600
line-height: 1 (leading-none)
letter-spacing: -0.02em (tracking-tight)
color: #F2F5F7
```

### 11.3 Card Subtitle / Description

```
font-family: Montserrat
font-size: 14px (text-sm)
font-weight: 500
color: #7A8D9A (neutral-teal-400 / muted-foreground)
margin-top: 8px
```

### 11.4 Badge

```
font-family: Montserrat
font-size: 12px
font-weight: 500
padding: 2px 8px
border-radius: 8px
```
Status badge colors follow Section 1.5 pattern.

### 11.5 Progress Bar

```
track-background: #152128 (neutral-teal-900)
fill: linear-gradient(90deg, #04eaaa, #10a6de)
height: 6px
border-radius: 9999px
```

### 11.6 Donut / Circular Progress

```
track-color: #243038 (neutral-teal-800)
fill-color: #04eaaa (EcoGreen-500)
stroke-width: proportional to size
center-label: Address Sans Pro, bold
```

---

## 12. Specific UI Patterns from Web Platform

### 12.1 Vehicle Card (Hero Banner)

```
background: #0A1419
border: 1px solid #152128
border-radius: 12px
padding: 20px
```
- Circular battery gauge: EcoGreen-500 fill on neutral-teal-800 track
- Vehicle name: Montserrat 18px bold #F2F5F7
- License plate: Montserrat 14px 500 #A8B8C2
- Range text: Montserrat 14px 400 #04eaaa

### 12.2 Stat Row (Charging Stats)

3-column grid, gap: 24px. Each cell:
```
background: #0A1419
border: 1px solid #152128
border-radius: 12px
padding: 16px 20px
```
- Icon: 16px Phosphor duotone, color #04eaaa or #10a6de
- Label: Montserrat 12px 500 #7A8D9A
- Value: Address Sans Pro 28px 700 #F2F5F7
- Unit suffix: Address Sans Pro 14px 400 #A8B8C2

### 12.3 Recommendation Card

```
background: #0A1419
border: 1px solid #152128
border-radius: 12px
padding: 16px
```
- Station name: Montserrat 14px 600 #F2F5F7 (truncate with ellipsis)
- "VoltLink Optimized" tag: Montserrat 11px 500 #04eaaa
- Time slot: Montserrat 12px 400 #A8B8C2, with Clock icon 12px
- Price: Address Sans Pro 20px 700 #F2F5F7, unit (/kWh): 12px 400 #A8B8C2
- Meta row (distance, availability): Montserrat 12px 400 #7A8D9A
- AI reason text: Montserrat 12px 400 #04eaaa (italic optional)
- CTA "Book Now >": Montserrat 14px 600 #04eaaa, no background, no border

### 12.4 Section Title with "See All"

```
Left: Overline pattern (Section 11.1)
Right: "See All" — Montserrat 14px 500 #10a6de
```

---

## 13. Anti-Patterns (DO NOT DO)

1. Never use pure black (`#000000`) or pure white (`#FFFFFF`) — always use the neutral-teal scale
2. Never use gradient fills on buttons — buttons are solid EcoGreen-500
3. Never use font-weight 800+ (extrabold/black) — max is 700 (bold)
4. Never use box-shadows on dark mode cards — use background color elevation
5. Never use colors outside the defined palette for charts
6. Never mix icon libraries — Phosphor duotone only
7. Never use border-radius values other than 12px (cards/buttons), 8px (badges), or 9999px (pills/dots)
8. Never put decorative gradients on functional UI elements (only on accent strokes, progress bars)

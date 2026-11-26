## all-styles

The chosen style's numbers are ALREADY applied by Prompify in `src/theme.css`: light or dark, font,
base text size (every size scales with it), heading weight (page titles and the issue title), letter
spacing, card padding (board cards), control padding and height (buttons, inputs, dropdowns), corner
radius (cards, inputs, dialogs, columns), button shape, badge shape (status and epic tags) and
shadows. Do not edit those values.

Your job is what variables cannot express: the character of the style. This template uses
styled-components (one `Styles.js` next to each component), not Tailwind. Work in this order and stop
when the app clearly feels like the style:
1. Shared pieces: `src/shared/components/Button/Styles.js` (variants: primary / success / danger =
   `colored`, `secondary`, `empty`), `Input/Styles.js`, `Textarea/Styles.js`, `Select/Styles.js`
   (field, Dropdown, Option), `Modal/Styles.js` (StyledModal: radius, shadow; ClickableOverlay),
   `ConfirmModal/Styles.js`, `mixin.tag` in `src/shared/utils/styles.js` (every tag: statuses,
   epics, multi-select values).
2. The frame: `src/Project/NavbarLeft/Styles.js` (the left bar), `src/Project/Sidebar/Styles.js`
   (project tile, links), `src/shared/components/Breadcrumbs/Styles.js`, page titles
   (`Project/Board/Header/Styles.js` BoardName, `Project/Backlog/Styles.js` Title,
   `Project/Roadmap/Styles.js` Title).
3. Work surfaces: board columns `Project/Board/Lists/List/Styles.js`, cards
   `Project/Board/Lists/List/Issue/Styles.js`, filters `Project/Board/Filters/Styles.js`; backlog
   sections and rows `Project/Backlog/Styles.js`; roadmap chart, bars and zoom
   `Project/Roadmap/Styles.js`; the issue panel `Project/Board/IssueDetails/Styles.js` (+ the section
   folders); settings `Project/ProjectSettings/Styles.js`.

Keep: every screen, button and behaviour, drag and drop, the wording (src/config/text.js), label
colours, styled-components and the existing components (no Tailwind, no other UI library, no other
icon set). Use `color.*`, `font.*` and `mixin.*` from `src/shared/utils/styles.js` (see colours.md);
fonts come from the theme. Read-only, do not edit: the `.jsx` files of Select, Modal and DatePicker,
`TextEditor/`, `shared/hooks/`, `shared/constants/`, `App/NormalizeStyles.js`, `App/assets/`.

Current look (for orientation):
- Left bar: 64px, `color.backgroundDarkPrimary`, widens to 200px with labels on hover.
- Sidebar: 230px, `color.backgroundLightest`, right border; links 8px 12px padding, active link
  `color.primary` on `color.backgroundLight`.
- Board columns: `color.backgroundLightest`, `var(--radius)`, 10px apart (`margin: 0 5px`); cards `color.backgroundWhite`,
  `var(--card-padding)`, `var(--shadow-card)`, hover `color.backgroundLight`.
- Backlog: sections `color.backgroundLightest` with a header row; issue rows 42px tall, white,
  separated by borders.
- Buttons: `colored` filled, `secondary` on `color.secondary`, `empty` transparent; 14.5px.
- Tags (`mixin.tag`): 24px tall, bold 12px; status tags upper-case.
- Dialogs: `color.backgroundWhite`, `var(--radius)`, `mixin.boxShadowMedium`; overlay dark blue at 54%.
- Page titles: 24px, `font.heading`.

## apple

Calm, airy, premium.
- Left bar: light instead of brand-filled — `color.backgroundWhite` with a right border,
  `color.textDark` icons and labels, the logo in `color.primary`. (Keep the hover labels.)
- Sidebar: no border, `color.backgroundPage`; links `border-radius: 10px`, active
  `background: ${mixin.rgba(color.primary, 0.1)}`.
- Board columns: `border-radius: 16px`, 12px gaps; cards no shadow at rest, a soft one on hover,
  `border-radius: 12px`.
- Backlog sections `border-radius: 16px`; rows 48px tall.
- Buttons: secondary → `background: ${mixin.rgba(color.primary, 0.08)}; color: ${color.primary}`.
- Inputs / selects: no border, `color.backgroundLightest`, focus ring
  `0 0 0 4px ${mixin.rgba(color.primary, 0.2)}`.
- Dialogs: `border-radius: 18px`, softer shadow; tags without upper-case.
- Page titles: 28px, `letter-spacing: -0.02em`.

## airbnb

Warm, friendly, rounded.
- Cards and columns: `border-radius: 16px`; cards keep the three-layer shadow (already set) and lift
  on hover (`transform: translateY(-1px)`).
- Buttons: primary `font.bold`; secondary → white with a 1px `color.borderLight` border, hover border
  `color.textDarkest`.
- Sidebar links pill-shaped (`border-radius: 999px`), active `color.textDarkest` on
  `color.backgroundLight`.
- Status tags: not upper-case, `font.medium`; epic tags `border-radius: 999px`.
- Inputs: visible 1px border, focus border `color.textDarkest`.
- Dialogs: `border-radius: 16px`.

## stripe

Precise, refined, trustworthy.
- Cards and backlog rows: 1px `color.borderLightest` border, `var(--radius)`, subtle shadow.
- Buttons: primary adds `box-shadow: 0 1px 2px ${mixin.rgba(color.textDarkest, 0.15)}`; secondary
  white with a border.
- Page titles: `letter-spacing: -0.01em`; counts, estimates and dates `font-variant-numeric: tabular-nums`.
- Inputs: white with a border, focus `0 0 0 3px ${mixin.rgba(color.primary, 0.2)}`.
- Tags: small corners, not upper-case.

## notion

Quiet, document-like.
- No shadows: cards get a 1px `color.borderLightest` border instead; dialogs a light shadow only.
- Left bar: `color.backgroundLightest` with `color.textDark` icons (no brand fill).
- Board columns: transparent background with a column title only; cards white with a border.
- Buttons: secondary → transparent, hover `color.backgroundLight`; primary small and solid.
- Tags: `font.regular`, not upper-case; status tags the tone colour at low opacity
  (`mixin.rgba(...)`) with the full colour as text.
- Generous spacing in the issue panel (section gaps 24px).

## linear

Dense, precise, dark.
- Left bar: `color.backgroundPage` with a right border, icons `color.textMedium`, active
  `color.textDarkest`.
- Sidebar: `color.backgroundPage`, links 6px 10px, 13.5px.
- Board columns: transparent with thin dividers; cards `color.backgroundWhite`, 1px
  `color.borderLightest` border, no shadow, 8px padding.
- Backlog rows 36px tall, 13.5px titles.
- Buttons and inputs one step smaller (28px controls are fine); secondary
  `background: ${mixin.rgba(color.textDarkest, 0.04)}`.
- Tags: 20px tall, `font.medium`, not upper-case.
- Dialogs: 1px border, compact padding (20px).

## figma

Playful and bold.
- Buttons: pill (already); secondary with a 2px `color.textDarkest` border.
- Cards: `border-radius: 14px`, 2px border on hover in `color.primary`.
- Sidebar links pill-shaped; active `color.textOnPrimary` on `color.primary`.
- Tags: pill-shaped, `font.medium`, not upper-case.
- Roadmap bars `border-radius: 999px`.

## spotify

Bold, dense, dark.
- Columns and cards: no borders, cards `color.backgroundWhite`, hover `filter: brightness(1.1)`.
- Buttons: pill (already), primary `font.bold`; secondary transparent with a
  `color.textMedium` border, hover border `color.textDarkest`.
- Tags: `font.bold`.
- Page titles: `font.black`, 28px.

## framer

Cinematic, dark, motion-forward.
- Page titles: `letter-spacing: -0.02em`, 30px.
- Cards and dialogs: `border-radius: 16px`, 1px `color.borderLightest` border.
- Buttons: pill (already); secondary frosted (`background: ${mixin.rgba(color.textDarkest, 0.08)};
  backdrop-filter: blur(8px)`).
- Motion: cards and roadmap bars `transition: transform 0.15s` and `transform: scale(1.01)` on hover.

## raycast

A precision instrument.
- Cards and dialogs: 1px `color.borderLightest` border with the inset highlight shadow (already set).
- Buttons: hover `opacity: 0.85`; secondary `background: ${mixin.rgba(color.textDarkest, 0.03)}` with a border.
- Tags: keyboard-key look — 1px `color.borderLight` border on `color.backgroundLightest`, `font.medium`.
- Compact backlog rows (36px).

## supabase

A developer tool.
- Cards and columns: `var(--radius)`, 1px border, no shadow.
- Buttons: primary pill (already); secondary pill with a 1px border, hover border `color.textMedium`.
- Active sidebar link and active filter: 1px `mixin.rgba(color.primary, 0.4)` border on
  `mixin.rgba(color.primary, 0.1)`, text `color.primary`.
- Issue keys, estimates, dates and counts: `font-family: ui-monospace, monospace`, 12px.
- Tags: small corners, `font.regular`.

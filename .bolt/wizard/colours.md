## colours

The user's palette is ALREADY applied: Prompify rewrote `src/theme.css` from it (the chosen mode on
`:root`, the other mode in `.light` / `.dark`). Do not edit that file's colour values and do not add
colours anywhere else.

How the palette was mapped (for reference):

| Wizard colour | Theme variables | Where it shows in this app |
|---|---|---|
| Primary | `--primary` (+ `--primary-foreground`, `--ring`) | The main actions only: primary buttons (Create Issue, Save, Start sprint, Create epic), links, "In progress" tags, the selected day in date pickers, focus rings, active filter buttons |
| Secondary | `--secondary` (+ `--secondary-foreground`) = `color.brandSecondary` / `color.textOnSecondary`; also lightly tints `--background`, `--card`, `--muted`, `--hover`, `--input`, `--border` | The left bar (filled with the colour); page, sidebar, columns and cards carry a light tint |
| Accent | `--accent` (+ `--accent-foreground`) = `color.accent` / `color.textOnAccent` for fills; `--accent-strong` = `color.accentStrong` for text / lines | The active sidebar link, the project tile, the roadmap's "Today" label (fill) and line (`accentStrong`) |
| (from the style) | `--foreground`, `--muted-foreground` | Main and secondary text (in-between shades are mixed from these) |
| (fixed meaning) | `--success`, `--warning`, `--destructive` | "Done" tags and success toasts, warning-tone statuses, Delete buttons, errors and error toasts |

How styles use them: every `Styles.js` imports `color` from `src/shared/utils/styles.js` and writes
`${color.primary}`, `${color.backgroundWhite}` (cards, dialogs), `${color.backgroundLightest}`
(sidebar, columns, inputs), `${color.backgroundLight}` (hover), `${color.backgroundMedium}` (neutral
tags), `${color.textDarkest}` / `textDark` / `textMedium` / `textLight`, `${color.borderLightest}`,
`${color.textOnPrimary}` … Transparency: `mixin.rgba(color.primary, 0.15)`; shades:
`mixin.darken(color.primary, 0.1)` (both work with theme colours).

Rules:
- Balance the three colours: primary for the main action of each screen, `color.brandSecondary`
  for structural bands (the left bar, section headers you add), `color.accent` for selected /
  active states, highlights and counts. Do not make everything primary.
- Never write raw colours (`#fff`, `white`, `rgba(…)`, `#0052cc`) in a Styles.js file or a
  component; use `color.*`. Text on a filled colour uses its pair: `color.primary` →
  `color.textOnPrimary`, `color.danger` → `color.textOnDanger`, `color.success` → `color.textOnSuccess`.
- Status tags take their colour from the status's `tone` in `src/config/app.js` (neutral, primary,
  success, warning, danger); change the tone there, not the CSS.
- Label colours stay as they are, not recoloured to the palette: epic colours (`EPIC_COLORS`),
  issue-type and priority icon colours (`ISSUE_TYPES`, `PRIORITIES` in src/config/app.js), avatar
  colours.
- If a genuinely new colour role is needed (rare), add a variable to EVERY colour block in
  `src/theme.css` and a name to `color` in `src/shared/utils/styles.js`, then use that name.

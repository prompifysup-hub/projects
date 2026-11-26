# Wizard mapping files

How each wizard answer changes this template. One file per question. Prompify reads them while it
imports the template (they are never copied into the user's project) and adds only the parts that
match the user's answers to the AI's instructions:

| File | Sent to the AI | Covers |
|---|---|---|
| `description.md` | always | The backbone: how the user's own description adjusts the placeholders and the logic, what may change, what must never change, and recipes for common requests. |
| `colours.md` | when the user picked colours or a style | What Prompify already set in `src/theme.css` and how styles must use the colours (`color.*` from `src/shared/utils/styles.js`). |
| `style.md` | `## all-styles` plus the section of each style picked (`## apple`, `## airbnb`…) | What Prompify already set (type, spacing, shapes) and how to restyle this template's styled-components for that style. A style without a section here falls back to the full design file in Prompify. |
| `audience.md` | the section for the answer (`## team`, `## customers`, `## both`) | This is a team tool in every case; what to adapt when the work is for clients. |

Section headings (`## <id>`) are how Prompify finds the parts to send, so keep them exactly.

What Prompify applies by itself, with no AI tokens: `src/theme.css` (colours for light and dark,
font, base size, heading weight, letter spacing, card and control padding, radius, button and badge
shape, shadows). This template has no `src/prompify-settings.ts`: there is no audience switch and no
light / dark switch (the app shows the mode of the chosen style).

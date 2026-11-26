import { css } from 'styled-components';
import Color from 'color';

import { ISSUE_TYPES, STATUSES, PRIORITIES } from 'config/app';

/*
 * Colours come from the theme (src/theme.css, rewritten by Prompify from the user's palette and
 * style). Values are CSS expressions on the theme's "R G B" variables; never write raw colours in a
 * Styles.js file, add a name here instead. Shades the theme does not define are mixed from it.
 */
const v = name => `rgb(var(--${name}))`;
const mix = (a, percent, b) => `color-mix(in srgb, ${a} ${percent}%, ${b})`;

export const color = {
  primary: v('primary'),
  success: v('success'),
  danger: v('destructive'),
  warning: v('warning'),
  secondary: v('muted'), // secondary buttons
  brandSecondary: v('secondary'), // the left bar (the brand's second colour)
  accent: v('accent'), // active sidebar link, project tile, Today label (fills)
  accentStrong: v('accent-strong'), // accent as text, icons or lines on cards

  textDarkest: v('foreground'),
  textDark: mix(v('foreground'), 75, v('muted-foreground')),
  textMedium: v('muted-foreground'),
  textLight: mix(v('muted-foreground'), 75, v('card')),
  textLink: v('primary'),
  textOnPrimary: v('primary-foreground'),
  textOnAccent: v('accent-foreground'),
  textOnSecondary: v('secondary-foreground'),
  textOnDanger: v('destructive-foreground'),
  textOnSuccess: v('card'),

  backgroundPage: v('background'),
  backgroundWhite: v('card'), // cards, dialogs, dropdowns, focused inputs
  backgroundMedium: mix(v('muted'), 92, v('foreground')), // tags, neutral statuses
  backgroundLight: mix(v('muted'), 96, v('foreground')), // hover
  backgroundLightest: v('muted'), // sidebar, board columns, inputs
  backgroundLightPrimary: mix(v('primary'), 18, v('card')),
  backgroundLightSuccess: mix(v('success'), 15, v('card')),

  borderLightest: v('border'),
  borderLight: mix(v('border'), 80, v('muted-foreground')),
  borderInputFocus: v('ring'),
};

// Icon colours of issue types and priorities come from src/config/app.js (label colours).
export const issueTypeColors = Object.fromEntries(ISSUE_TYPES.map(t => [t.value, t.color]));
export const issuePriorityColors = Object.fromEntries(PRIORITIES.map(p => [p.value, p.color]));

// Status tags: the `tone` of each status in src/config/app.js picks a theme colour.
const TONES = {
  neutral: { background: color.backgroundMedium, text: color.textDark },
  primary: { background: color.primary, text: color.textOnPrimary },
  success: { background: color.success, text: color.textOnSuccess },
  warning: { background: color.warning, text: color.textDarkest },
  danger: { background: color.danger, text: color.textOnDanger },
};
const toneOf = status => TONES[status.tone] || TONES.neutral;
export const issueStatusColors = Object.fromEntries(STATUSES.map(s => [s.value, toneOf(s).text]));
export const issueStatusBackgroundColors = Object.fromEntries(STATUSES.map(s => [s.value, toneOf(s).background]));

export const sizes = {
  appNavBarLeftWidth: 64,
  secondarySideBarWidth: 230,
  minViewportWidth: 1000,
};

export const zIndexValues = {
  modal: 1000,
  dropdown: 101,
  navLeft: 100,
};

const sans = 'font-family: var(--font-sans, system-ui, sans-serif);';

// Sizes are written in px for the default 16px base and scale with the theme's --font-size-base.
export const font = {
  regular: `${sans} font-weight: 400;`,
  medium: `${sans} font-weight: 500;`,
  bold: `${sans} font-weight: 700;`,
  black: `${sans} font-weight: 800;`,
  heading: `${sans} font-weight: var(--heading-weight, 500);`, // page and dialog titles
  size: size => `font-size: calc(${size / 16} * var(--font-size-base, 16px));`,
};

const isPlainColor = value => /^(#|rgba?\(\d)/.test(String(value));

export const mixin = {
  // Hex colours (epic and label colours) use the color library; theme colours use color-mix.
  darken: (colorValue, amount) =>
    isPlainColor(colorValue)
      ? Color(colorValue).darken(amount).string()
      : `color-mix(in srgb, ${colorValue} ${Math.round((1 - amount) * 100)}%, black)`,
  lighten: (colorValue, amount) =>
    isPlainColor(colorValue)
      ? Color(colorValue).lighten(amount).string()
      : `color-mix(in srgb, ${colorValue} ${Math.round((1 - amount) * 100)}%, white)`,
  rgba: (colorValue, opacity) =>
    isPlainColor(colorValue)
      ? Color(colorValue).alpha(opacity).string()
      : `color-mix(in srgb, ${colorValue} ${Math.round(opacity * 100)}%, transparent)`,
  boxShadowMedium: css`
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  `,
  boxShadowDropdown: css`
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px;
  `,
  truncateText: css`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `,
  clickable: css`
    cursor: pointer;
    user-select: none;
  `,
  hardwareAccelerate: css`
    transform: translateZ(0);
  `,
  cover: css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `,
  placeholderColor: colorValue => css`
    ::-webkit-input-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
    :-moz-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
    ::-moz-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
    :-ms-input-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
  `,
  scrollableY: css`
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  `,
  customScrollbar: ({ width = 8, background = color.backgroundMedium } = {}) => css`
    &::-webkit-scrollbar {
      width: ${width}px;
    }
    &::-webkit-scrollbar-track {
      background: none;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 99px;
      background: ${background};
    }
  `,
  backgroundImage: imageURL => css`
    background-image: url("${imageURL}");
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: ${color.backgroundLight};
  `,
  link: (colorValue = color.textLink) => css`
    cursor: pointer;
    color: ${colorValue};
    ${font.medium}
    &:hover, &:visited, &:active {
      color: ${colorValue};
    }
    &:hover {
      text-decoration: underline;
    }
  `,
  tag: (background = color.backgroundMedium, colorValue = color.textDarkest) => css`
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: var(--radius-badge, var(--radius, 4px));
    cursor: pointer;
    user-select: none;
    color: ${colorValue};
    background: ${background};
    ${font.bold}
    ${font.size(12)}
    i {
      margin-left: 4px;
    }
  `,
};

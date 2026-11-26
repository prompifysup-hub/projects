/*
 * APP SETTINGS — the placeholders for this project tracker. Change the workflow, issue types,
 * priorities and defaults here; every screen, the board columns and the data layer read from this
 * file. Wording is in ./text.js; the look (colours, font, spacing) is in ../theme.css.
 *
 * The project's own name, description and category are DATA (the `project` table), edited in
 * Project settings. The team is the `users` table, managed in Project settings → Team.
 */

/**
 * Parts of the app that can be switched off. sprints: false = a plain Kanban board (no Backlog page,
 * no sprint fields; the board shows every issue). roadmap: false = no Roadmap page and no epic fields.
 * The tables stay; switching back on brings everything back.
 */
export const FEATURES = {
  sprints: true,
  roadmap: true,
};

/** Browser tab title (the project name is shown inside the app). */
export const APP = {
  name: 'Projects',
};

/**
 * The workflow: one board column per status, in this order. `value` is what is stored in
 * issues.status (keep existing values when renaming a label). `tone` picks the theme colour of
 * the status tag: neutral, primary, success, warning or danger.
 */
export const STATUSES = [
  { value: 'backlog', label: 'To do', tone: 'neutral' },
  { value: 'selected', label: 'Selected for development', tone: 'neutral' },
  { value: 'inprogress', label: 'In progress', tone: 'primary' },
  { value: 'done', label: 'Done', tone: 'success' },
];

/** Which status new issues get, and which one means finished (struck through, counts as done,
 * stays with a completed sprint). Both must be values from STATUSES. */
export const STATUS = {
  initial: 'backlog',
  done: 'done',
};

/**
 * Issue types. `icon` is one of the built-in icons: task, bug, story. `color` is the icon colour
 * (a label colour, not the theme).
 */
export const ISSUE_TYPES = [
  { value: 'task', label: 'Task', icon: 'task', color: '#4FADE6' },
  { value: 'bug', label: 'Bug', icon: 'bug', color: '#E44D42' },
  { value: 'story', label: 'Story', icon: 'story', color: '#65BA43' },
];
export const DEFAULT_TYPE = 'task';

/** Priorities, highest first. `value` is stored in issues.priority. `icon`: arrow-up or arrow-down. */
export const PRIORITIES = [
  { value: '5', label: 'Highest', icon: 'arrow-up', color: '#CD1317' },
  { value: '4', label: 'High', icon: 'arrow-up', color: '#E9494A' },
  { value: '3', label: 'Medium', icon: 'arrow-up', color: '#E97F33' },
  { value: '2', label: 'Low', icon: 'arrow-down', color: '#2D8738' },
  { value: '1', label: 'Lowest', icon: 'arrow-down', color: '#57A55A' },
];
export const DEFAULT_PRIORITY = '3';

/** Project categories (shown under the project name in the sidebar). */
export const CATEGORIES = [
  { value: 'software', label: 'Software' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Business' },
];

/** Colours an epic can have on the roadmap (label colours, not the theme). */
export const EPIC_COLORS = [
  { value: '#4FADE6', label: 'Blue' },
  { value: '#65BA43', label: 'Green' },
  { value: '#F89C1C', label: 'Orange' },
  { value: '#E44D42', label: 'Red' },
  { value: '#8777D9', label: 'Purple' },
  { value: '#00B8D9', label: 'Teal' },
  { value: '#6B778C', label: 'Grey' },
];

export const BOARD = {
  recentDays: 3, // "Recently updated" = changed in the last n days
};

export const SPRINT = {
  defaultLengthDays: 14, // used when a sprint is started without an end date
};

export const ROADMAP = {
  defaultZoom: 'months', // weeks, months or quarters
  newEpicDays: 14, // length of an epic scheduled by clicking its row
};

/** Estimates and time tracking are whole hours; this is the unit shown after numbers. */
export const TIME_UNIT = 'h';

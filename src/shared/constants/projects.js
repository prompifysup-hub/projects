// Derived from CATEGORIES in src/config/app.js.
import { CATEGORIES } from 'config/app';

export const ProjectCategory = Object.fromEntries(CATEGORIES.map(c => [c.value.toUpperCase(), c.value]));
export const ProjectCategoryCopy = Object.fromEntries(CATEGORIES.map(c => [c.value, c.label]));

/*
 * Lookups derived from src/config/app.js (edit the workflow there, not here).
 * IssueStatus etc. map an upper-case key to the stored value, e.g. IssueStatus.DONE === 'done';
 * Object.values() keeps the order of the config lists (board columns, option lists).
 */
import { ISSUE_TYPES, STATUSES, PRIORITIES } from 'config/app';

const keyed = list => Object.fromEntries(list.map(item => [item.value.toUpperCase(), item.value]));
const labels = list => Object.fromEntries(list.map(item => [item.value, item.label]));

export const IssueType = keyed(ISSUE_TYPES);
export const IssueStatus = keyed(STATUSES);
export const IssuePriority = keyed(PRIORITIES);

export const IssueTypeCopy = labels(ISSUE_TYPES);
export const IssueStatusCopy = labels(STATUSES);
export const IssuePriorityCopy = labels(PRIORITIES);

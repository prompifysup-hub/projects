import moment from 'moment';

import { FEATURES } from 'config/app';

/** The sprint currently running, if any. */
export const getActiveSprint = project =>
  (FEATURES.sprints && (project.sprints || []).find(s => s.status === 'active')) || null;

/** Sprints that are not completed: the active one first, then planned ones in order. */
export const getOpenSprints = project =>
  (project.sprints || [])
    .filter(s => s.status !== 'completed')
    .sort((a, b) => (a.status === 'active' ? -1 : b.status === 'active' ? 1 : (a.position || 0) - (b.position || 0)));

/**
 * Issues shown on the board: the active sprint's issues, or, when no sprint is running,
 * every issue that does not belong to a completed sprint.
 */
export const getBoardIssues = project => {
  if (!FEATURES.sprints) return project.issues;
  const active = getActiveSprint(project);
  if (active) return project.issues.filter(i => i.sprintId === active.id);
  const completed = new Set((project.sprints || []).filter(s => s.status === 'completed').map(s => s.id));
  return project.issues.filter(i => !completed.has(i.sprintId));
};

export const formatSprintDates = sprint => {
  if (!sprint.startDate || !sprint.endDate) return '';
  return `${moment(sprint.startDate).format('MMM D')} – ${moment(sprint.endDate).format('MMM D')}`;
};

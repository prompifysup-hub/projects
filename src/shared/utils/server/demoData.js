/*
 * Demo data used ONLY when the app runs outside Prompify (local preview).
 * Inside Prompify everything comes from the tables described in .bolt/prompt.
 */
import moment from 'moment';

const day = offset =>
  moment()
    .startOf('day')
    .add(offset, 'days')
    .toISOString();

const users = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex@example.com', avatarUrl: '' },
  { id: 'u2', name: 'Sam Lee', email: 'sam@example.com', avatarUrl: '' },
  { id: 'u3', name: 'Priya Shah', email: 'priya@example.com', avatarUrl: '' },
];

const project = {
  id: 'p1',
  name: 'Website relaunch',
  url: 'https://example.com',
  description: '<p>Plan, track and ship the new company website.</p>',
  category: 'software',
};

const sprints = [
  { id: 's1', name: 'Sprint 1', goal: 'Launch the new homepage', status: 'active', startDate: day(-5), endDate: day(9), position: 1 },
  { id: 's2', name: 'Sprint 2', goal: 'Blog and contact pages', status: 'planned', startDate: null, endDate: null, position: 2 },
];

const epics = [
  { id: 'e1', title: 'New homepage', color: '#4FADE6', description: '', startDate: day(-14), endDate: day(10) },
  { id: 'e2', title: 'Blog', color: '#65BA43', description: '', startDate: day(5), endDate: day(35) },
  { id: 'e3', title: 'Contact & booking', color: '#F89C1C', description: '', startDate: day(25), endDate: day(60) },
];

const issue = (id, fields) => ({
  id,
  type: 'task',
  priority: '3',
  description: '',
  estimate: null,
  timeSpent: null,
  timeRemaining: null,
  userIds: [],
  sprintId: null,
  epicId: null,
  createdAt: day(-10),
  updatedAt: day(-1),
  ...fields,
  listPosition: fields.listPosition,
  backlogPosition: fields.listPosition,
  descriptionText: (fields.description || '').replace(/<[^>]*>/g, ''),
});

const issues = [
  issue('i1', { title: 'Design the hero section', type: 'story', status: 'done', priority: '4', listPosition: 1, estimate: 5, timeSpent: 5, reporterId: 'u1', userIds: ['u2'], sprintId: 's1', epicId: 'e1', description: '<p>Headline, subheadline and main call to action.</p>' }),
  issue('i2', { title: 'Build the navigation bar', type: 'task', status: 'inprogress', priority: '3', listPosition: 2, estimate: 3, timeSpent: 1, reporterId: 'u1', userIds: ['u1'], sprintId: 's1', epicId: 'e1' }),
  issue('i3', { title: 'Hero image loads slowly on mobile', type: 'bug', status: 'selected', priority: '5', listPosition: 3, estimate: 2, reporterId: 'u3', userIds: ['u3'], sprintId: 's1', epicId: 'e1', description: '<p>The hero image is 4 MB. Compress it and serve a smaller version on phones.</p>' }),
  issue('i4', { title: 'Write homepage copy', type: 'task', status: 'selected', priority: '3', listPosition: 4, estimate: 3, reporterId: 'u2', userIds: ['u2'], sprintId: 's1', epicId: 'e1' }),
  issue('i5', { title: 'Customer testimonials block', type: 'story', status: 'backlog', priority: '2', listPosition: 5, estimate: 2, reporterId: 'u2', sprintId: 's1', epicId: 'e1' }),
  issue('i6', { title: 'Blog list page', type: 'story', status: 'backlog', priority: '3', listPosition: 6, estimate: 5, reporterId: 'u1', userIds: ['u1'], sprintId: 's2', epicId: 'e2' }),
  issue('i7', { title: 'Blog post template', type: 'task', status: 'backlog', priority: '3', listPosition: 7, estimate: 3, reporterId: 'u1', sprintId: 's2', epicId: 'e2' }),
  issue('i8', { title: 'Contact form with email notification', type: 'story', status: 'backlog', priority: '4', listPosition: 8, estimate: 5, reporterId: 'u3', epicId: 'e3' }),
  issue('i9', { title: 'Online booking calendar', type: 'story', status: 'backlog', priority: '3', listPosition: 9, estimate: 8, reporterId: 'u3', epicId: 'e3' }),
  issue('i10', { title: 'Cookie banner', type: 'task', status: 'backlog', priority: '1', listPosition: 10, estimate: 1, reporterId: 'u2' }),
];

const comments = [
  { id: 'c1', body: 'Looks great, approved by the client.', issueId: 'i1', userId: 'u3', createdAt: day(-3), updatedAt: day(-3) },
  { id: 'c2', body: 'I will try WebP first.', issueId: 'i3', userId: 'u3', createdAt: day(-1), updatedAt: day(-1) },
];

export default () => ({
  project: { ...project },
  users: users.map(u => ({ ...u })),
  issues: issues.map(i => ({ ...i })),
  comments: comments.map(c => ({ ...c })),
  sprints: sprints.map(s => ({ ...s })),
  epics: epics.map(e => ({ ...e })),
});

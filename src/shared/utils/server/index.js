/*
 * In-browser replacement for the Jira clone's Node API.
 *
 * The app calls api.get('/project'), api.put('/issues/12', …) etc. exactly as before; this module
 * answers those calls. Data lives in Prompify's tables (see .bolt/prompt): it is loaded once into
 * memory, and every change is written to Prompify first and then applied in memory.
 * Outside Prompify (local preview) it uses ./demoData.js and keeps changes in memory only.
 */
import { isConnected, db } from './prompify';
import createDemoData from './demoData';
import { TEXT } from 'config/text';
import { STATUS, DEFAULT_TYPE, DEFAULT_PRIORITY, CATEGORIES, EPIC_COLORS } from 'config/app';

/* ---------- table <-> app field mapping ---------- */

const NUMBER = 'number';
const LIST = 'list';

// app field: [column, kind]
const SCHEMA = {
  project: { name: ['name'], url: ['url'], description: ['description'], category: ['category'] },
  users: { name: ['name'], email: ['email'], avatarUrl: ['avatar_url'] },
  issues: {
    title: ['title'],
    type: ['type'],
    status: ['status'],
    priority: ['priority'],
    listPosition: ['list_position', NUMBER],
    backlogPosition: ['backlog_position', NUMBER],
    description: ['description'],
    descriptionText: ['description_text'],
    estimate: ['estimate', NUMBER],
    timeSpent: ['time_spent', NUMBER],
    timeRemaining: ['time_remaining', NUMBER],
    reporterId: ['reporter_id'],
    userIds: ['user_ids', LIST],
    sprintId: ['sprint_id'],
    epicId: ['epic_id'],
  },
  comments: { body: ['body'], issueId: ['issue_id'], userId: ['user_id'] },
  sprints: {
    name: ['name'],
    goal: ['goal'],
    status: ['status'],
    startDate: ['start_date'],
    endDate: ['end_date'],
    position: ['position', NUMBER],
  },
  epics: {
    title: ['title'],
    description: ['description'],
    color: ['color'],
    startDate: ['start_date'],
    endDate: ['end_date'],
  },
};

const fromRow = (table, row) => {
  const item = { id: row.id, createdAt: row.created_at, updatedAt: row.updated_at };
  Object.entries(SCHEMA[table]).forEach(([field, [column, kind]]) => {
    let value = row[column];
    if (value === undefined) value = null;
    if (kind === NUMBER && value !== null && value !== '') value = Number(value);
    if (kind === LIST) value = Array.isArray(value) ? value : [];
    item[field] = value;
  });
  return item;
};

const toRow = (table, fields) => {
  const row = {};
  Object.entries(fields).forEach(([field, value]) => {
    const column = SCHEMA[table][field];
    if (column && value !== undefined) row[column[0]] = value;
  });
  return row;
};

const pickKnown = (table, fields) =>
  Object.fromEntries(Object.entries(fields).filter(([field]) => SCHEMA[table][field]));

/* ---------- the in-memory store ---------- */

let store = null;
let loading = null;

const stripTags = html => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const byCreated = (a, b) => String(a.created_at || '').localeCompare(String(b.created_at || ''));

async function loadFromPrompify() {
  const [projectRows, userRows, issueRows, commentRows, sprintRows, epicRows] = await Promise.all(
    ['project', 'users', 'issues', 'comments', 'sprints', 'epics'].map(table => db.list(table)),
  );

  let projectRow = projectRows.sort(byCreated)[0];
  if (!projectRow) {
    projectRow = await db.create('project', { name: TEXT.data.defaultProject, category: CATEGORIES[0].value });
  }
  let sortedUsers = userRows.sort(byCreated);
  if (sortedUsers.length === 0) {
    sortedUsers = [await db.create('users', { name: TEXT.data.defaultUser, email: 'you@example.com' })];
  }

  const users = sortedUsers.map(row => fromRow('users', row));
  const sprints = sprintRows.sort(byCreated).map(row => fromRow('sprints', row));
  const epics = epicRows.sort(byCreated).map(row => fromRow('epics', row));

  // Sample rows may name their sprint, epic and assignees instead of using ids
  // (sprint_name, epic_name, user_ids with names or emails). Resolve those once and save the ids.
  const fixes = [];
  const issues = issueRows.sort(byCreated).map((row, index) => {
    const issue = fromRow('issues', row);
    const fix = {};
    if (!issue.sprintId && row.sprint_name) {
      const sprint = sprints.find(s => s.name === row.sprint_name);
      if (sprint) Object.assign(fix, { sprintId: sprint.id });
    }
    if (!issue.epicId && row.epic_name) {
      const epic = epics.find(e => e.title === row.epic_name);
      if (epic) Object.assign(fix, { epicId: epic.id });
    }
    const resolvedUserIds = issue.userIds
      .map(ref => (users.find(u => u.id === ref || u.name === ref || u.email === ref) || {}).id)
      .filter(Boolean);
    if (resolvedUserIds.join() !== issue.userIds.join()) fix.userIds = resolvedUserIds;
    if (Object.keys(fix).length) {
      fixes.push(
        db.update('issues', issue.id, { ...toRow('issues', fix), sprint_name: null, epic_name: null }).catch(() => null),
      );
    }
    const merged = { ...issue, ...fix };
    return {
      ...merged,
      type: merged.type || DEFAULT_TYPE,
      status: merged.status || STATUS.initial,
      priority: String(merged.priority || DEFAULT_PRIORITY),
      reporterId: merged.reporterId || users[0].id,
      listPosition: merged.listPosition ?? index + 1,
      backlogPosition: merged.backlogPosition ?? merged.listPosition ?? index + 1,
      descriptionText: merged.descriptionText || stripTags(merged.description),
    };
  });
  await Promise.all(fixes);

  return {
    project: fromRow('project', projectRow),
    users,
    issues,
    comments: commentRows.map(row => fromRow('comments', row)),
    sprints,
    epics,
  };
}

const getStore = async () => {
  if (store) return store;
  if (!loading) loading = (isConnected() ? loadFromPrompify() : Promise.resolve(createDemoData())).then(s => (store = s));
  return loading;
};

/* ---------- writes: Prompify first, then memory ---------- */

const localId = () => `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString();

async function insert(table, collection, fields) {
  const s = await getStore();
  const values = pickKnown(table, fields);
  let item;
  if (isConnected()) {
    item = fromRow(table, await db.create(table, toRow(table, values)));
    item = { ...item, ...values, id: item.id, createdAt: item.createdAt, updatedAt: item.updatedAt };
  } else {
    item = { ...values, id: localId(), createdAt: now(), updatedAt: now() };
  }
  s[collection].push(item);
  return item;
}

async function patch(table, collection, id, fields) {
  const s = await getStore();
  const values = pickKnown(table, fields);
  const list = table === 'project' ? [s.project] : s[collection];
  const item = list.find(i => i.id === id);
  if (!item) throw notFound(table);
  if (isConnected() && Object.keys(values).length) await db.update(table, id, toRow(table, values));
  Object.assign(item, values, { updatedAt: now() });
  return item;
}

async function destroy(table, collection, id) {
  const s = await getStore();
  const item = s[collection].find(i => i.id === id);
  if (!item) throw notFound(table);
  if (isConnected()) await db.remove(table, id);
  s[collection] = s[collection].filter(i => i.id !== id);
  return item;
}

const notFound = what => ({ code: 'NOT_FOUND', message: `${what} not found`, status: 404, data: {} });

/* ---------- responses ---------- */

const PARTIAL_ISSUE_FIELDS = [
  'id', 'title', 'type', 'status', 'priority', 'listPosition', 'backlogPosition',
  'createdAt', 'updatedAt', 'userIds', 'estimate', 'sprintId', 'epicId',
];
const partialIssue = issue => Object.fromEntries(PARTIAL_ISSUE_FIELDS.map(f => [f, issue[f]]));

const fullIssue = (s, issue) => ({
  ...issue,
  users: issue.userIds.map(id => s.users.find(u => u.id === id)).filter(Boolean),
  comments: s.comments
    .filter(c => c.issueId === issue.id)
    .map(c => ({ ...c, user: s.users.find(u => u.id === c.userId) || { name: TEXT.team.formerMember, avatarUrl: '' } })),
});

const issueValues = body => {
  const values = { ...body };
  if (body.users && !body.userIds) values.userIds = body.users.map(u => u.id);
  if (body.description !== undefined) values.descriptionText = stripTags(body.description);
  return values;
};

/* ---------- routes ---------- */

const routes = [
  ['get', '/currentUser', async () => ({ currentUser: (await getStore()).users[0] })],

  // Team members. The first user is the signed-in user and cannot be removed.
  ['post', '/users', async (_p, body) => ({ user: await insert('users', 'users', { avatarUrl: '', ...body }) })],
  ['put', '/users/:id', async ({ id }, body) => ({ user: await patch('users', 'users', id, body) })],
  ['delete', '/users/:id', async ({ id }) => {
    const s = await getStore();
    const me = s.users[0];
    if (me && me.id === id) {
      throw { code: 'BAD_REQUEST', message: TEXT.team.cannotRemoveYourself, status: 400, data: {} };
    }
    // Unassign them and hand their reported issues to the signed-in user; their comments stay.
    const touched = s.issues.filter(i => i.userIds.includes(id) || i.reporterId === id);
    await Promise.all(
      touched.map(i =>
        patch('issues', 'issues', i.id, {
          userIds: i.userIds.filter(u => u !== id),
          reporterId: i.reporterId === id ? me.id : i.reporterId,
        }),
      ),
    );
    return { user: await destroy('users', 'users', id) };
  }],

  ['get', '/project', async () => {
    const s = await getStore();
    return {
      project: {
        ...s.project,
        users: s.users,
        issues: s.issues.map(partialIssue),
        sprints: [...s.sprints].sort((a, b) => (a.position || 0) - (b.position || 0)),
        epics: s.epics,
      },
    };
  }],
  ['put', '/project', async (_p, body) => ({ project: await patch('project', 'project', (await getStore()).project.id, body) })],

  ['get', '/issues', async (_p, { searchTerm = '' } = {}) => {
    const s = await getStore();
    const term = searchTerm.toLowerCase();
    const issues = s.issues.filter(
      i => !term || i.title.toLowerCase().includes(term) || (i.descriptionText || '').toLowerCase().includes(term),
    );
    return { issues };
  }],
  ['get', '/issues/:id', async ({ id }) => {
    const s = await getStore();
    const issue = s.issues.find(i => i.id === id);
    if (!issue) throw notFound('Issue');
    return { issue: fullIssue(s, issue) };
  }],
  ['post', '/issues', async (_p, body) => {
    const s = await getStore();
    const values = issueValues(body);
    const sameStatus = s.issues.filter(i => i.status === values.status).map(i => i.listPosition);
    const sameGroup = s.issues.filter(i => (i.sprintId || null) === (values.sprintId || null)).map(i => i.backlogPosition || 0);
    const issue = await insert('issues', 'issues', {
      type: DEFAULT_TYPE,
      status: STATUS.initial,
      priority: DEFAULT_PRIORITY,
      userIds: [],
      sprintId: null,
      epicId: null,
      ...values,
      listPosition: sameStatus.length ? Math.min(...sameStatus) - 1 : 1,
      backlogPosition: sameGroup.length ? Math.max(...sameGroup) + 1 : 1,
    });
    return { issue };
  }],
  ['put', '/issues/:id', async ({ id }, body) => ({ issue: await patch('issues', 'issues', id, issueValues(body)) })],
  ['delete', '/issues/:id', async ({ id }) => {
    const s = await getStore();
    await Promise.all(s.comments.filter(c => c.issueId === id).map(c => destroy('comments', 'comments', c.id)));
    return { issue: await destroy('issues', 'issues', id) };
  }],

  ['post', '/comments', async (_p, body) => ({ comment: await insert('comments', 'comments', body) })],
  ['put', '/comments/:id', async ({ id }, body) => ({ comment: await patch('comments', 'comments', id, body) })],
  ['delete', '/comments/:id', async ({ id }) => ({ comment: await destroy('comments', 'comments', id) })],

  ['post', '/sprints', async (_p, body) => {
    const s = await getStore();
    const position = Math.max(0, ...s.sprints.map(sp => sp.position || 0)) + 1;
    const sprint = await insert('sprints', 'sprints', {
      name: TEXT.sprint.defaultName(position),
      goal: '',
      status: 'planned',
      startDate: null,
      endDate: null,
      position,
      ...body,
    });
    return { sprint };
  }],
  ['put', '/sprints/:id', async ({ id }, body) => ({ sprint: await patch('sprints', 'sprints', id, body) })],
  ['post', '/sprints/:id/complete', async ({ id }) => {
    const s = await getStore();
    // Unfinished issues go back to the backlog; done issues stay with the completed sprint.
    const unfinished = s.issues.filter(i => i.sprintId === id && i.status !== STATUS.done);
    await Promise.all(unfinished.map(i => patch('issues', 'issues', i.id, { sprintId: null })));
    return { sprint: await patch('sprints', 'sprints', id, { status: 'completed', endDate: now() }) };
  }],
  ['delete', '/sprints/:id', async ({ id }) => {
    const s = await getStore();
    await Promise.all(s.issues.filter(i => i.sprintId === id).map(i => patch('issues', 'issues', i.id, { sprintId: null })));
    return { sprint: await destroy('sprints', 'sprints', id) };
  }],

  ['post', '/epics', async (_p, body) => ({ epic: await insert('epics', 'epics', { color: EPIC_COLORS[0].value, description: '', ...body }) })],
  ['put', '/epics/:id', async ({ id }, body) => ({ epic: await patch('epics', 'epics', id, body) })],
  ['delete', '/epics/:id', async ({ id }) => {
    const s = await getStore();
    await Promise.all(s.issues.filter(i => i.epicId === id).map(i => patch('issues', 'issues', i.id, { epicId: null })));
    return { epic: await destroy('epics', 'epics', id) };
  }],
];

const match = (pattern, url) => {
  const a = pattern.split('/');
  const b = url.split('?')[0].split('/');
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
};

/** Answer an API call. Resolves with the response data or rejects with { code, message, status, data }. */
export default async function handle(method, url, variables) {
  for (const [routeMethod, pattern, handler] of routes) {
    const params = routeMethod === method ? match(pattern, url) : null;
    if (params) {
      try {
        return await handler(params, variables || {});
      } catch (error) {
        if (error && error.code) throw error;
        throw { code: 'INTERNAL_ERROR', message: error.message || String(error), status: 500, data: {} };
      }
    }
  }
  throw { code: 'ROUTE_NOT_FOUND', message: `No route for ${method.toUpperCase()} ${url}`, status: 404, data: {} };
}

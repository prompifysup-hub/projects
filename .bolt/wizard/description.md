## description

The user's description is the main spec. This project tracker already works end to end; adapt it in
the order below and change code only when a placeholder cannot express what the user asked for.

### 1. Read the description for these signals

| The user says… | Change |
|---|---|
| The team / company / project name, what they work on | The `project` row in the data action (name, description, category from `CATEGORIES`); `APP.name` (tab title) in src/config/app.js |
| Who is on the team (names, roles) | `users` rows — the first row is the user |
| What they call work items ("tasks", "tickets", "jobs", "cards", "deliverables") | `TERMS.issue / issues` in src/config/text.js |
| What they call sprints ("cycles", "iterations", "weeks") or epics ("initiatives", "goals", "campaigns", "clients") | `TERMS.sprint / sprints`, `TERMS.epic / epics` |
| Their stages ("Idea → Writing → Review → Published", "To do / Doing / Done") | `STATUSES` (+ `tone`) and `STATUS.initial / done` in src/config/app.js; sample rows use these values |
| Kinds of work ("bug / feature / design", "article / video") | `ISSUE_TYPES` (`icon` must be task, bug or story; pick the closest) |
| Priority names ("Urgent / Normal / Later") | `PRIORITIES` labels (keep the values "1"–"5" or update sample rows) |
| "No sprints, just a board" / "we don't need a roadmap" | `FEATURES.sprints = false` / `FEATURES.roadmap = false` — nothing else to change |
| Sprint length, how long a new roadmap item lasts | `SPRINT.defaultLengthDays`, `ROADMAP.newEpicDays`, `ROADMAP.defaultZoom` |
| Due dates, deadlines | Recipe A |
| Labels / tags | Recipe B |
| A client or customer per item | Recipe C |
| Story points instead of hours | Recipe D |
| Several separate projects | Recipe E |
| Clients should see progress | Recipe F |
| A feature this template has (board, drag and drop, sprints, backlog, roadmap, comments, assignees, estimates, time tracking, search, team management) | Nothing to build: adapt wording and data only |

Sample data (the data action) must match the team's work: 1 project; 3–5 users; 1 active sprint
(dates around today) and 1–2 planned (skip sprints when `FEATURES.sprints` is false); 3–4 epics with
dates over the next months (skip when `FEATURES.roadmap` is false); 15–25 issues spread over every
status with realistic titles, types, priorities, estimates and assignees; 5–10 comments. Link by
name, not uuid: `sprint_name`, `epic_name`, assignee names in `user_ids`; leave the id columns null.

### 2. Order of work
1. src/config/app.js — FEATURES, statuses, types, priorities, categories, defaults, APP.name.
2. src/config/text.js — TERMS first, then single lines that still read wrong.
3. The data action — tables (see the template instructions), sample rows.
4. Only then code, for missing features, following the recipes.

### 3. Never change (the stable core)
- `src/shared/utils/api.js` → `src/shared/utils/server/index.js` as the only data path (ADD fields
  to `SCHEMA` and routes there), `server/prompify.js`, `server/demoData.js`, the sample-data name →
  id linking in `loadFromPrompify`.
- The six tables and their existing columns (ADD columns / tables, never rename or remove).
- Drag and drop on the board and backlog, the position maths, the sprint rules (one active; complete
  moves unfinished issues to the backlog), optimistic saving in the issue panel.
- The shared components' behaviour (`src/shared/components`), `shared/hooks`, `shared/constants`
  (derived from config).
- `src/theme.css` values (Prompify set them); no raw colours (colours.md); no wording in components
  (src/config/text.js).
- No login, sign-up, payments, Tailwind or other UI / icon libraries.

### 4. Recipes for missing features

**A. Due dates**
1. Column `issues.due_date timestamptz`; `dueDate: ['due_date']` in `SCHEMA.issues` and `'dueDate'`
   in `PARTIAL_ISSUE_FIELDS` (server/index.js) so the board and backlog get it.
2. Issue panel: a "Due date" section in the right column (`src/Project/Board/IssueDetails`, new
   folder like `Priority/`) with `DatePicker withTime={false}` saving through `updateIssue({ dueDate })`.
3. Create form: `Form.Field.DatePicker name="dueDate"` in src/Project/IssueCreate.
4. Card (`Board/Lists/List/Issue`) and backlog row: a small date; overdue (before today and status
   not `STATUS.done`) in `color.danger`. Optional board filter "Overdue" next to "Recently Updated".
5. Wording in TEXT.issue / TEXT.create / TEXT.board.

**B. Labels**
1. `LABELS` list `{ value, label, color }` in src/config/app.js; column `issues.labels jsonb`;
   `labels: ['labels', LIST]` in SCHEMA.issues and in PARTIAL_ISSUE_FIELDS.
2. Issue panel and create form: `Select isMulti` with those options; show them as `mixin.tag` tags
   (label colour at `mixin.rgba(color, 0.18)`, like epic tags) on cards and backlog rows.
3. Optional: a label filter on the board (same pattern as the avatar filter).

**C. A client per issue (or per epic)**
- Few clients that group work: use epics (TERMS.epic = 'client'), nothing to build.
- Otherwise: column `client text` on issues (or epics), the SCHEMA entry, a text `Input` section in
  the issue panel (save on blur, like Title) and the create form; show it in the backlog row and in
  search results.

**D. Story points instead of hours** — relabel `TEXT.issue.estimate` ("Story points") and
`TEXT.backlog.totalEstimate`; sample estimates 1, 2, 3, 5, 8. Time tracking stays in hours (or hide its
section in IssueDetails/index.jsx if the user does not track time).

**E. Several projects** — this template is one project. Prefer epics as projects
(TERMS.epic = 'project'). Only if the user insists on separate boards: add `project_id` to sprints,
epics and issues, a project switcher in the sidebar, and filter every list in server/index.js by the
selected project — a large change; say so in your reply.

**F. Read-only progress page for clients** (`/progress`)
1. `src/Project/Progress/index.jsx` (+ `Styles.js`): loads `useApi.get('/project')`, shows the
   project name and description, the active sprint (name, goal, dates, its issues grouped by status
   with counts) and the epics with dates and a done / total bar. No editing, no left bar or sidebar.
2. A route `<Route path="/progress" component={Progress} />` in src/App/Routes.jsx (before the
   catch-all), and a sidebar link opening it in a new tab (`<a href="/progress" target="_blank">`
   styled like `LinkItem`).
3. Wording in a new `TEXT.progress` section. Mention that anyone with the link can open it.

**G. Renaming the product everywhere** — TERMS + STATUSES / ISSUE_TYPES labels + APP.name only;
never edit wording inside components.

### 5. Before finishing
- Every new button, form and page works end to end (create, edit, delete, validation, empty state).
- New columns are in the data action with valid sample values and in `SCHEMA` (and
  `PARTIAL_ISSUE_FIELDS` when the board or backlog shows them).
- Sample status / type / priority values exist in src/config/app.js.
- No raw colours, no wording in components, styles use `color.*` / `font.*`.
- Mention the limitations that apply: no login (anyone with the link can see and change everything),
  changes by others appear after a reload, desktop only.

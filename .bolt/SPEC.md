# Projects template — function spec

The reference for what this template does, screen by screen, button by button. Every change to the
template must keep this spec true, and the test checklist at the end must pass before a change is
pushed. Kept in `.bolt/`, which Prompify does not import into the user's project (no token cost).

How each wizard answer changes the template (what Prompify applies itself, and what the AI is told
to do) is in `.bolt/wizard/` — see its README.

Based on Jira Clone by Ivor Reic (MIT). React 16 + Vite + styled-components 4 + react-beautiful-dnd
(board and backlog drag) + formik (forms) + Quill (rich text) + moment. JavaScript, no TypeScript.
No other UI library.

---

## 1. Who uses it

| Role | Where | Signs in? |
|---|---|---|
| **Team member** | Everything | No login. Anyone with the link can use it, and every change is made as the **signed-in user** = the first row of `users` ("You"). |

There is no customer-facing part: the wizard's "Who uses it?" only changes wording and, for client work, suggests epics per client or a read-only progress page (`.bolt/wizard/audience.md`).

---

## 2. Screens

Layout: a narrow **left bar** (logo, Search issues, Create Issue; it widens to show labels on hover),
a **sidebar** (project tile + name + "<Category> project", links Kanban Board / Backlog / Roadmap /
Project settings), and the page. `/` and `/project` open the board; unknown addresses show the error
page (2.10). Every page has breadcrumbs "Projects / <project name> / <page>" (not links).

### 2.1 Kanban board — /project/board
- **Header:** the active sprint's name, its goal (or "Active sprint") and dates, and
  **Complete sprint** (asks "Complete <sprint>?"; done issues stay with the sprint, every other issue
  goes back to the backlog). With no active sprint: "Kanban board" and **Plan a sprint** → Backlog.
- **What it shows:** the active sprint's issues; with no active sprint, every issue not in a
  completed sprint.
- **Filters:** search box (title contains the text), one avatar per team member (toggle; shows issues
  assigned to any selected person), **Only My Issues** (assigned to the signed-in user),
  **Recently Updated** (changed in the last 3 days), **Clear all** (shown when any filter is on).
- **Columns:** To do, Selected for development, In progress, Done (the four statuses), each with a
  count ("3" or "1 of 3" when filtered).
- **Card:** title, type icon, priority arrow, assignee avatars. Click → issue panel (2.4).
- **Drag a card** to another column or position: sets its status and order, saves at once (jumps
  back with an error message if saving fails).

### 2.2 Backlog — /project/backlog
- **Create sprint** (header) → sprint dialog (2.6), name pre-filled "Sprint <n>".
- **One section per open sprint** (active first, then planned in order) **and a "Backlog" section**
  (issues with no sprint). Each section header: collapse arrow, name, dates, "<n> issues",
  "· Active", total estimate (sum of estimates).
  - Active sprint: **Complete sprint** (as on the board) and **Edit sprint** (cog).
  - Planned sprint: **Start sprint** (disabled with a hint while another sprint is active; opens the
    sprint dialog; empty dates become today and today + 14 days), **Edit sprint**, **Delete sprint**
    (asks; its issues move to the backlog).
  - Sprint goal under the header. Empty: "Plan this sprint by dragging issues here" / "Your backlog
    is empty".
- **Issue row:** type icon, priority arrow, title (struck through when done), epic tag in the epic's
  colour, status tag, estimate, assignee avatars. Click → issue panel.
- **Drag a row** within or between sections: changes its sprint (or no sprint) and order, saves at once.
- **+ Create issue** at the bottom of each section: type a title, Enter creates a Task (medium
  priority, To do, reported by the signed-in user) in that section and keeps the box open for the
  next one; Esc closes it.
- Completed sprints are not shown.

### 2.3 Roadmap — /project/roadmap
- **Zoom:** Weeks / Months (default) / Quarters. The timeline covers a few months around today,
  widened to include every epic; it scrolls to today. A "Today" line.
- **Create epic** (header and "+ Create epic" under the list) → epic dialog (2.7).
- **Epic list (left):** expand arrow (when it has issues), colour square, title (click → edit
  dialog), progress bar "<done>/<total>" issues.
- **Bars (right):** one per epic with dates, in its colour, filled to its progress.
  - **Drag the bar** to move both dates; **drag either end** to change one date. Saves on release.
  - An epic without dates shows "Click to schedule this epic" on its row (on hover); **click the row** to schedule it: starts on the
    clicked day, lasts 14 days.
- **Expanded epic:** its issues (type icon, title, status dot; click → issue panel), with the bar of
  the sprint each issue is in.
- No epics: "No epics yet. Create one to plan larger pieces of work on the timeline."

### 2.4 Issue panel (src/Project/Board/IssueDetails — opens over the board, backlog or roadmap at …/issues/<id>)
Every field saves on change (optimistic: shown at once, rolled back with an error message if saving fails).
- **Top:** type selector showing the issue key (e.g. "BUG-3F0EF0"; Task / Bug / Story), **Copy link**
  ("Link Copied" for 2 s), **Delete** (asks "Are you sure you want to delete this issue?"; deletes the
  issue and its comments, closes the panel), **Close** (also Esc).
- **Title:** edit in place; saves on blur or Enter; required, at most 200 characters.
- **Description:** "Add a description..." or the text; click → rich-text editor with **Save** / **Cancel**.
- **Comments:** newest first. "Add a comment..." (or press **M**) → text box with **Save** / **Cancel**;
  comments are posted as the signed-in user. Each comment: author, "<time> ago", **Edit**, **Delete**
  (asks). Authors who were removed from the team show as "Former member".
- **Right column:** Status (the four statuses), Assignees (any number; ✕ removes, "+ Add more"),
  Reporter (one person), Priority (Highest … Lowest), Sprint ("Backlog (no sprint)" or an open sprint),
  Epic ("No epic" or an epic), Original estimate (hours, whole number), Time tracking (bar "<n>h logged"
  / "<n>h remaining" or "<n>h estimated"; click → dialog with Time spent and Time remaining, **Done**),
  "Created at … / Updated at …" (relative times).

### 2.5 Create issue (left bar "Create Issue" → dialog)
- Fields: Issue Type (Task), Short Summary (required, ≤ 200), Description (rich text), Reporter (the
  signed-in user, required), Assignees, Priority (Medium, required), Sprint (the active sprint if any,
  else "Backlog (no sprint)"), Epic (No epic).
- **Create Issue** creates it with status To do, shows "Issue has been successfully created." and
  opens the board. **Cancel** closes.

### 2.6 Sprint dialog (create / edit / start — src/Project/SprintForm)
- Sprint name (required, ≤ 100), Sprint goal, Start date, End date (the end must not be before the
  start). **Create sprint** / **Save changes** / **Start sprint**, **Cancel**.

### 2.7 Epic dialog (create / edit — src/Project/Roadmap/EpicForm.jsx)
- Epic name (required, ≤ 200), Colour (Blue, Green, Orange, Red, Purple, Teal, Grey), Start date, Due
  date (not before the start), Description.
- **Create epic** / **Save changes**, **Cancel**; when editing, **Delete** (asks; its issues are kept
  without an epic).

### 2.8 Search issues (left bar → side panel)
- Empty box: "Recent Issues" (the 10 newest). Typing: "Matching Issues" whose title or description
  contains the text, each with title and key; none: "We couldn't find anything matching your search".
  Click → issue panel.

### 2.9 Project settings — /project/settings
- **Project Details:** Name (required, ≤ 100), URL (must be a URL when filled), Description (rich
  text), Project Category (Software, Marketing, Business — shown in the sidebar). **Save changes** →
  "Changes have been saved successfully."; the sidebar updates.
- **Team:** every member with avatar (initial letter when there is no picture), name, email. The
  signed-in user is tagged "You".
  - **Add member** / **Edit** → dialog: Name (required, ≤ 100), Email (required, valid). **Add member** /
    **Save changes**, **Cancel**.
  - **Remove** (bin; not for "You") asks "Remove <name>?"; they are unassigned from every issue, issues
    they reported are given to the signed-in user, their comments stay.

### 2.10 Error page
- "Something went wrong — The page could not be loaded. Please try again." and **Reload**.

---

## 3. Data

Created by the AI in one `<boltAction type="data">`; reached only through `src/shared/utils/api.js` →
`src/shared/utils/server/index.js` (an in-browser API: loads every table once, writes to Prompify first
and then to memory) → `server/prompify.js`. Every row also has `id` (uuid), `created_at`, `updated_at`.

| Table | Columns |
|---|---|
| **project** (first row used; created as "My project" if empty) | name text required, url text, description text (HTML), category text (software / marketing / business) |
| **users** (first row = the signed-in user; "You" is created if empty) | name text required, email text required, avatar_url text |
| **sprints** | name text required, goal text, status text required (planned / active / completed — at most one active), start_date, end_date timestamptz, position integer |
| **epics** | title text required, description text, color text (hex), start_date, end_date timestamptz |
| **issues** | title text required, type text required (task / bug / story), status text required (backlog = "To do" / selected / inprogress / done), priority text required ("1" lowest … "5" highest), list_position numeric (board order), backlog_position numeric (backlog order), description text (HTML), description_text text (plain, for search), estimate / time_spent / time_remaining integer (hours), reporter_id uuid → users, user_ids jsonb (assignee ids), sprint_id uuid, epic_id uuid, sprint_name text, epic_name text |
| **comments** | body text required, issue_id uuid → issues, user_id uuid → users |

**Sample-data links without uuids:** sample issues give `sprint_name`, `epic_name` and assignee
**names or emails** in `user_ids`; on first load the app turns them into ids, saves them and clears the
names. Missing reporter → the signed-in user; missing positions → creation order.

Routes answered by server/index.js: `GET /currentUser`, `GET|PUT /project`, `POST|PUT|DELETE /users`,
`GET /issues?searchTerm`, `GET|POST|PUT|DELETE /issues`, `POST|PUT|DELETE /comments`,
`POST|PUT|DELETE /sprints`, `POST /sprints/:id/complete`, `POST|PUT|DELETE /epics`. A new field = a
column in the data action + an entry in `SCHEMA` there.

---

## 4. Rules (all in one place)

1. At most one sprint is active; **Start sprint** is disabled while one is.
2. Completing a sprint: done issues stay with it (it disappears from the backlog), all others move to
   the backlog.
3. Deleting a sprint moves its issues to the backlog; deleting an epic keeps its issues without an
   epic; deleting an issue deletes its comments.
4. The board shows the active sprint (or, with none, every issue not in a completed sprint); the
   status is the column.
5. Board order (`list_position`) and backlog order (`backlog_position`) are separate; a drop takes the
   position halfway between its neighbours.
6. End dates are never before start dates (sprints and epics).
7. The first user is the signed-in user: default reporter, comment author, "Only My Issues", cannot be
   removed. Removing another member unassigns them and moves their reported issues to the signed-in user.

---

## 5. Files that make up the look and the wording

| File | Holds |
|---|---|
| src/theme.css | The look placeholders, rewritten by Prompify: colours as "R G B" for light (`:root, .light`) and dark (`.dark`), font, `--font-size-base`, `--heading-weight`, `--letter-spacing`, `--card-padding`, `--control-padding-x/y`, `--radius`, `--radius-button`, `--radius-badge`, shadows. Defaults = the original Jira-clone look. |
| src/shared/utils/styles.js | Turns the theme into `color.*` (with mixed in-between shades: textDark, backgroundMedium, the left bar…), `font.*` (sizes scale with `--font-size-base`; `font.heading` uses `--heading-weight`), status-tag colours from each status's `tone`, mixins. Used by every `Styles.js`; no raw colours anywhere else. |
| src/App/BaseStyles.js | Page-wide defaults (page background, text colour, letter spacing). |
| src/shared/components/* | Button, Modal, Form fields, Select, Input, Textarea, DatePicker, Avatar, Icon (icon font), ConfirmModal … the shared look (radius, control padding and height from the theme). |
| src/config/app.js | Placeholders: FEATURES (sprints, roadmap — false hides the Backlog / Roadmap pages and their fields; the board then shows every issue), APP (tab title), STATUSES (value, label, tone) and STATUS (initial, done), ISSUE_TYPES (value, label, icon, colour), DEFAULT_TYPE, PRIORITIES (value, label, icon, colour), DEFAULT_PRIORITY, CATEGORIES, EPIC_COLORS, BOARD.recentDays, SPRINT.defaultLengthDays, ROADMAP (defaultZoom, newEpicDays). `shared/constants/*` are derived from it. |
| src/config/text.js | Every on-screen word, built from TERMS (issue, sprint, epic, backlog, board, roadmap, project, member, team). |

Epic colours, issue type / priority icon colours and avatar colours are labels, not theme colours.
There is no light / dark switch: the app shows the `:root` mode Prompify picked from the style; the
`.dark` / `.light` block applies only if that class is put on `<html>`.

---

## 6. Known limitations

1. **No login.** Anyone with the link can see and change everything, and everyone acts as the first
   user ("You").
2. **No live updates.** Data loads once; changes made by someone else appear after a reload.
3. **Desktop only.** The layout needs at least ~1000px; the sidebar hides below that and there is no
   phone layout.
4. **Fixed lists, set in config.** Statuses, issue types and priorities come from src/config/app.js;
   changing them needs matching sample rows (issue types can only use the task / bug / story icons).
5. **Estimates are hours**, entered by hand; no story points, no time log history.
6. **Drag and drop needs a mouse** on the board and backlog (keyboard dragging is possible with
   react-beautiful-dnd: focus a card, Space, arrows, Space).
7. No notifications, due dates on issues, labels, attachments, sub-tasks, reports or burndown charts.
8. **Outside Prompify** (no /env-config.js) the demo data in `server/demoData.js` is used and changes
   are kept in memory only.

---

## 7. Test checklist

Automated in `.bolt/test/flow-full.cjs` (43 checks) against the demo data: start the app with
`npx vite --port 5195`, then with `puppeteer-core` available run
`node .bolt/test/flow-full.cjs http://localhost:5195 <screenshot-prefix>`; it ends with "all passed".

**Look**
- [ ] No Jira / Atlassian branding; text uses the theme font; first column reads "To do"; project tile
      shows the first letter.

**Board**
- [ ] Drag a card to In progress.
- [ ] Search leaves one card; Clear all restores; Only My Issues filters.

**Issue panel**
- [ ] Key reads TYPE-…; priority and status change; comment add / edit / delete; Esc closes.

**Create and search**
- [ ] Create Issue from the left bar; search finds it with the same key format.

**Backlog**
- [ ] Inline create; a sprint without a name is refused; create, edit goal, complete, start, delete
      sprints; a row opens the panel; the board then shows the new active sprint.

**Roadmap**
- [ ] Zoom buttons; create, rename, delete an epic.

**Settings**
- [ ] Rename the project (sidebar updates).
- [ ] Team: "You" has no remove button; a bad email is refused; add, edit, remove a member; a removed
      member disappears from the board filters.

**Other**
- [ ] Delete an issue; unknown address shows the error page with Reload.

**By hand (not automated)**
- [ ] Drag an issue between sprints in the backlog; drag a roadmap bar and its ends; click an
      unscheduled epic's row to schedule it.
- [ ] Sprint and epic dialogs refuse an end date before the start date.
- [ ] Time tracking dialog updates the bar.

**Build**
- [ ] `npx vite build` passes.

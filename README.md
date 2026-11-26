# Prompify projects template

The Jira clone by Ivor Reic (https://github.com/oldboyxx/jira_clone, MIT, see `LICENSE`), moved
from webpack to Vite, connected to Prompify's database and extended with sprints, a backlog and a
roadmap.

- **Inside Prompify**: data is loaded from and saved to the `project`, `users`, `sprints`, `epics`,
  `issues` and `comments` tables. The original Node API is replaced by
  `src/shared/utils/server`, which answers the same API calls in the browser.
- **Locally**: `npm install && npm run dev` runs it with demo data.

Added: Backlog page (sprints: create, edit, start, complete, delete; drag issues between sprints;
inline issue creation), Roadmap page (epics on a timeline, drag/resize bars, zoom), Sprint and
Epic fields in the issue panel and the create form, board shows the active sprint with a
"Complete sprint" button.

Removed: the "not implemented" sidebar links, the author's About / feedback panels, the
GitHub button, the guest sign-in screen, the Jira logo / artwork / favicon and the commercial
Circular fonts (text uses the theme font, default Figtree). Added later: a Team section in Project
settings (add / edit / remove members).

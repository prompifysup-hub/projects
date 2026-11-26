## team

The default. A tool for the user's own team; nothing to switch (this template has no audience
setting).
- Wording for colleagues: TERMS in src/config/text.js to match how the team talks (tasks, tickets,
  cards; sprints, cycles, weeks; epics, initiatives, goals).
- Seed `users` with the team from the description (the first row is the user).

## customers

The team does work FOR clients (an agency, freelancer, studio, contractor). It is still a team tool:
clients do not log in and there is no client area.
- If the description names clients or client projects, make each one an epic (TERMS.epic = 'client'
  or 'project', epics = their names, coloured) or add a client field (recipe C in description.md).
- If the user wants clients to follow progress, build recipe F (a read-only progress page).
- Mention in your reply: there is no login, so anyone with the app's link can see and change
  everything; a progress page shows the project to anyone who has its link.

## both

The team's own tool plus work they share with clients.
- Adapt the team wording as in `team`, and the client side as in `customers` (epics or a client field
  per client; recipe F if clients should see progress).
- Same limitation to mention: no login — anyone with the link can see and change everything.

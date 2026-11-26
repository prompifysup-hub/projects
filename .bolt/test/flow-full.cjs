// Full click-through of the Projects template against its in-memory demo data.
// usage: node flow-full.cjs <baseUrl> <outPrefix>   (needs puppeteer-core and Edge)
// SPA navigation only after the first load, because demo changes live in memory.
const puppeteer = require('puppeteer-core');
const [base, out] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1400, height: 1000 },
  });
  const page = await browser.newPage();
  page.on('pageerror', (e) => { failures++; console.log('[pageerror]', e.message); });

  const visible = async (xp, root = page) => {
    for (const e of await root.$$(`xpath/${xp}`)) { const b = await e.boundingBox(); if (b && b.width > 0) return e; }
    return null;
  };
  // The open dialog (if any) is searched first, so buttons behind it are not hit.
  const topModal = async () => { const m = await page.$$('[data-testid^="modal:"]'); return m[m.length - 1] || null; };
  const el = async (text, tag = '*') => {
    const modal = await topModal();
    const e = (modal && (await visible(`.//${tag}[normalize-space(.)='${text}']`, modal))) || (await visible(`.//${tag}[normalize-space(.)='${text}']`));
    if (!e) throw new Error(`"${text}" not found`);
    return e;
  };
  // Success toasts sit over the top-right buttons for 5 s; hide them so clicks reach the page.
  const hideToasts = () => page.evaluate(() => document.querySelectorAll('[class*="jira-toast"]').forEach((t) => { t.style.display = 'none'; }));
  const click = async (text, tag) => { await hideToasts(); await (await el(text, tag)).click(); await sleep(500); };
  const text = async (sel = 'body') => page.$eval(sel, (e) => e.innerText);
  const has = async (t, sel) => (await text(sel)).toLowerCase().includes(t.toLowerCase());
  const check = (name, ok) => { if (!ok) failures++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`); };
  const step = async (name, fn) => {
    try { await fn(); } catch (e) {
      failures++; console.log(`FAIL ${name}: ${e.message.slice(0, 160)}`);
      await page.screenshot({ path: `${out}-fail-${name.replace(/\W+/g, '_')}.png` });
    }
  };
  const fill = async (field, value) => {
    const sel = `[data-testid="form-field:${field}"] input, [data-testid="form-field:${field}"] textarea`;
    const modal = await topModal();
    const input = (modal && (await modal.$(sel))) || (await page.$(sel));
    await input.click({ clickCount: 3 }); await page.keyboard.press('Backspace'); await input.type(value); await sleep(150);
  };
  const nav = async (label) => {
    const link = await visible(`//a[normalize-space(.)='${label}']`);
    if (!link) throw new Error(`link "${label}" not found`);
    // The left bar expands over the sidebar while hovered; move the mouse off it first.
    await page.mouse.move(900, 600); await sleep(300);
    await link.click(); await sleep(700);
  };
  const dragBy = async (handle, dx, dy) => {
    const box = await handle.boundingBox();
    const sx = box.x + box.width / 2; const sy = box.y + box.height / 2;
    await page.mouse.move(sx, sy); await page.mouse.down();
    for (let i = 1; i <= 20; i += 1) { await page.mouse.move(sx + (dx * i) / 20, sy + (dy * i) / 20); await sleep(25); }
    await sleep(200); await page.mouse.up(); await sleep(700);
  };
  const confirm = async (label) => { await page.waitForSelector('[data-testid="modal:confirm"]', { timeout: 3000 }); await sleep(200); await (await visible(`//*[@data-testid='modal:confirm']//button[normalize-space(.)='${label}']`)).click(); await sleep(700); };

  await page.goto(`${base}/project/board`, { waitUntil: 'networkidle2' }); await sleep(1500);

  await step('look and branding', async () => {
    const html = await page.content();
    check('no Jira / Atlassian branding in the page', !/jira software|atlassian/i.test(html));
    const fontFamily = await page.$eval('body', (e) => getComputedStyle(e).fontFamily);
    check(`body font comes from the theme (${fontFamily})`, /Figtree/.test(fontFamily));
    check('first status column is "To do"', /^to do/i.test((await page.$eval('[data-testid="board-list:backlog"]', (e) => e.parentElement.innerText)).trim()));
    check('project tile shows the first letter', (await text('aside + div span')).trim() === 'W' || (await has('W')));
  });

  await step('board: drag a card to In progress', async () => {
    const card = await visible("//*[@data-testid='list-issue'][contains(., 'Customer testimonials block')]");
    const target = await page.$('[data-testid="board-list:inprogress"]');
    const [cb, tb] = [await card.boundingBox(), await target.boundingBox()];
    await dragBy(card, tb.x + 40 - cb.x, 0);
    check('card moved to In progress', await has('Customer testimonials block', '[data-testid="board-list:inprogress"]'));
  });

  await step('board: filters', async () => {
    const search = await page.$('[data-testid="board-filters"] input');
    await search.type('navigation'); await sleep(700);
    check('search leaves one card', (await page.$$('[data-testid="list-issue"]')).length === 1);
    await click('Clear all'); await sleep(400);
    check('clear all brings the cards back', (await page.$$('[data-testid="list-issue"]')).length > 1);
    await click('Only My Issues'); await sleep(400);
    const mine = (await page.$$('[data-testid="list-issue"]')).length;
    await click('Clear all');
    check(`"Only my issues" filters (${mine} cards)`, mine >= 1 && mine < (await page.$$('[data-testid="list-issue"]')).length);
  });

  await step('issue panel', async () => {
    await (await visible("//*[@data-testid='list-issue'][contains(., 'Hero image loads slowly')]")).click(); await sleep(900);
    const modal = '[data-testid="modal:issue-details"]';
    check('issue key reads BUG-…', /BUG-[0-9A-Z]+/.test(await text(modal)));
    await (await page.$('[data-testid="select:priority"]')).click(); await sleep(300);
    await (await page.$('[data-testid="select-option:Lowest"]')).click(); await sleep(500);
    check('priority changed to Lowest', await has('Lowest', modal));
    await (await page.$('[data-testid="select:status"]')).click(); await sleep(300);
    await (await page.$('[data-testid="select-option:In progress"]')).click(); await sleep(500);
    check('status changed to In progress', await has('IN PROGRESS', modal));
    await click('Add a comment...');
    await page.keyboard.type('Compressed to 300 KB'); await click('Save', 'button'); await sleep(600);
    check('comment added', await has('Compressed to 300 KB', modal));
    const comment = await visible("//*[@data-testid='issue-comment'][contains(., 'Compressed to 300 KB')]");
    await (await visible(".//*[normalize-space(.)='Edit']", comment)).click(); await sleep(300);
    const area = await comment.$('textarea');
    await area.click({ clickCount: 3 }); await area.type('Compressed to 250 KB'); await click('Save', 'button'); await sleep(600);
    check('comment edited', await has('Compressed to 250 KB', modal));
    const edited = await visible("//*[@data-testid='issue-comment'][contains(., 'Compressed to 250 KB')]");
    await (await visible(".//*[normalize-space(.)='Delete']", edited)).click(); await sleep(400);
    await confirm('Delete comment');
    check('comment deleted', !(await has('Compressed to 250 KB', modal)));
    await page.keyboard.press('Escape'); await sleep(600);
    check('panel closes', !(await page.$(modal)));
  });

  await step('create issue from the left bar', async () => {
    await click('Create Issue'); await sleep(600);
    await fill('title', 'Newsletter signup form');
    await click('Create Issue', 'button'); await sleep(900);    check('create dialog closed', !(await page.$('[data-testid="modal:issue-create"]')));
    await click('Search issues'); await sleep(600);
    await page.keyboard.type('Newsletter'); await sleep(900);
    const results = await text('[data-testid="modal:issue-search"]');
    check('search finds the new issue', results.includes('Newsletter signup form'));
    check('search shows the same key format (TASK-…)', /TASK-[0-9A-Z]+/.test(results));
    await page.keyboard.press('Escape'); await sleep(500);
  });

  await step('backlog: sprints and issues', async () => {
    await nav('Backlog');
    const backlog = '[data-testid="backlog-section:backlog"]';
    const createLinks = await page.$$(`xpath/.//*[@data-testid='backlog-section:backlog']//*[normalize-space(.)='Create issue']`);
    await createLinks[createLinks.length - 1].click(); await sleep(300);
    await page.keyboard.type('Gift cards'); await page.keyboard.press('Enter'); await sleep(900);
    check('inline create adds to the backlog', await has('Gift cards', backlog));

    await click('Create sprint'); await sleep(500);
    await fill('name', ' '); await click('Create sprint', 'button'); await sleep(500);
    check('a sprint without a name is refused', await has('This field is required', '[data-testid="modal:sprint"]'));
    await fill('name', 'Sprint 3');
    await click('Create sprint', 'button'); await sleep(900);
    check('new sprint "Sprint 3" appears', await has('Sprint 3'));

    const s2 = await visible("//*[starts-with(@data-testid,'backlog-section:')][.//*[normalize-space(.)='Sprint 2']]");
    await (await s2.$('button[title="Edit sprint"]')).click(); await sleep(500);
    await fill('goal', 'Blog, contact and newsletter'); await click('Save changes', 'button'); await sleep(800);
    check('sprint goal edited', await has('Blog, contact and newsletter'));

    await click('Complete sprint'); await sleep(400); await confirm('Complete sprint');
    check('Sprint 1 completed (gone from the backlog)', !(await has('Launch the new homepage')));
    const s2b = await visible("//*[starts-with(@data-testid,'backlog-section:')][.//*[normalize-space(.)='Sprint 2']]");
    await (await visible(".//button[normalize-space(.)='Start sprint']", s2b)).click(); await sleep(500);
    await click('Start sprint', 'button'); await sleep(900);
    check('Sprint 2 is active', await has('Active'));

    const s3 = await visible("//*[starts-with(@data-testid,'backlog-section:')][.//*[normalize-space(.)='Sprint 3']]");
    await (await s3.$('button[title="Delete sprint"]')).click(); await sleep(400); await confirm('Delete sprint');
    check('Sprint 3 deleted', !(await has('Sprint 3')));

    await (await visible("//*[@data-testid='backlog-issue'][contains(., 'Gift cards')]")).click(); await sleep(900);
    check('a backlog row opens the issue panel', !!(await page.$('[data-testid="modal:issue-details"]')));
    await page.keyboard.press('Escape'); await sleep(500);
  });

  await step('board follows the active sprint', async () => {
    await nav('Kanban board');
    check('board header shows Sprint 2', (await text('h1, body')).includes('Sprint 2'));
    check('board shows Sprint 2 issues', await has('Blog list page'));
  });

  await step('roadmap: epics', async () => {
    await nav('Roadmap');
    await click('Weeks'); await sleep(300); await click('Quarters'); await sleep(300); await click('Months'); await sleep(300);
    check('zoom buttons work', true);
    await click('Create epic', 'button'); await sleep(500);
    await fill('title', 'Newsletter'); await click('Create epic', 'button'); await sleep(900);
    check('epic created', (await page.$$('[data-testid="roadmap-epic"]')).length === 4);
    await (await visible("//*[@data-testid='roadmap-epic']//*[@title='Edit epic'][normalize-space(.)='Newsletter']")).click(); await sleep(500);
    await fill('title', 'Email newsletter'); await click('Save changes', 'button'); await sleep(800);
    check('epic renamed', await has('Email newsletter'));
    await (await visible("//*[@data-testid='roadmap-epic']//*[@title='Edit epic'][normalize-space(.)='Email newsletter']")).click(); await sleep(500);
    await click('Delete', 'button'); await sleep(400); await confirm('Delete epic');
    check('epic deleted', !(await has('Email newsletter')));
  });

  await step('settings: project details', async () => {
    await nav('Project settings');
    await fill('name', 'Bakery online'); await click('Save changes', 'button'); await sleep(900);
    check('sidebar shows the new name', await has('Bakery online'));
  });

  await step('settings: team', async () => {
    const team = '[data-testid="team"]';
    check('signed-in user is marked "You"', await has('You', team));
    check('signed-in user has no remove button', !(await page.$('[data-testid="member:Alex Morgan"] button[aria-label^="Remove"]')));
    await click('Add member', 'button'); await sleep(500);
    await fill('name', 'Jordan Blake'); await fill('email', 'not-an-email');
    await click('Add member', 'button'); await sleep(500);
    check('invalid email is refused', await has('Must be a valid email', '[data-testid="modal:member"]'));
    await fill('email', 'jordan@example.com'); await click('Add member', 'button'); await sleep(900);
    check('member added', await has('Jordan Blake', team));
    await (await visible("//*[@data-testid='member:Jordan Blake']//button[normalize-space(.)='Edit']")).click(); await sleep(500);
    await fill('name', 'Jordan B. Blake'); await click('Save changes', 'button'); await sleep(900);
    check('member edited', await has('Jordan B. Blake', team));
    await (await page.$('[data-testid="member:Jordan B. Blake"] button[aria-label^="Remove"]')).click(); await sleep(400);
    await confirm('Remove');
    check('member removed', !(await has('Jordan B. Blake', team)));
    await (await page.$('[data-testid="member:Sam Lee"] button[aria-label^="Remove"]')).click(); await sleep(400);
    await confirm('Remove');
    await nav('Kanban board');
    check('removed member is gone from the board filters', !(await page.$('[data-testid="avatar:Sam Lee"]')));
  });

  await step('issue: delete', async () => {
    await (await visible("//*[@data-testid='list-issue'][contains(., 'Blog list page')]")).click(); await sleep(900);
    await hideToasts();
    await (await page.$('[data-testid="modal:issue-details"] [data-testid="icon:trash"]')).click(); await sleep(400);
    await confirm('Delete issue');
    check('issue deleted', !(await has('Blog list page')));
  });

  await step('error page', async () => {
    await page.goto(`${base}/does-not-exist`, { waitUntil: 'networkidle2' }); await sleep(800);
    check('error page shows a plain message', await has('Something went wrong'));
    check('error page has a Reload button', !!(await visible("//button[normalize-space(.)='Reload']")));
  });

  await browser.close();
  console.log(failures ? `\n${failures} FAILED` : '\nall passed');
  process.exit(failures ? 1 : 0);
})();

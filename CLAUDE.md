# Patch Planner — how to add a patch

The owner sends a MapleStory (GMS) patch-notes link. The job is to turn the **whole** document into a new `patches/<id>.json`. Nothing in the notes may be silently dropped.

## Steps

1. **Fetch the notes.** The page is rendered by JavaScript. Load it with Playwright and read `#maplestory` innerText. Allowed hosts: www.nexon.com, g.nexonstatic.com, web.nxfs.nexon.com.
2. **Copy the table of contents into `sections`.** Collect every in-page link `a[href^="#"]` (anchor plus title, deduped, without `TableofContents`). Sections before the first event section are `kind: "system"`, the rest are `kind: "event"`.
3. **Read every section in full.** For each event section, create a card with `notes` (its anchor) or add it to another card's `covers`. For each system section, either cover it with a task (`coveredBy`) or `skip` it with a one-line reason.
4. **Look for these on purpose. Missing them is how things got lost before:**
   - **One-time or irreversible choices.** Search the text for "cannot be changed", "cannot be undone", "only once", "once per account", "at creation", "designate", "choose carefully", "cannot participate again". Each becomes a Day 0 `setup` item.
   - **Every date and time.** Search for `UTC`, "after maintenance", "until", "expires", "reset". Starts go in `openings`, ends and expiries go in `dates`, and claim deadlines go in `wrapup`.
   - **Weekly and daily limits.** Search "per week", "weekly", "daily", "every Wednesday", "every Thursday", "up to N times". These become `daily` and `weekly` items with the right `reset`.
   - **Double-dip windows.** Find which resets fall between maintenance end and the first full week.
   - **Heroic vs Interactive differences.** Search "(Heroic", "(Interactive". Use `{H|…}` and `{I|…}` or `world`.
   - **Where it's played.** Main world, Challenger World or Quanah/event world. Set `where` on everything.
   - **Things to claim or spend before they vanish.** Shops, coins, rewards and expiring items go in `wrapup`.
   - **Maintenance end time,** if the owner gives one, goes in `liveAt`.
5. **Link everything.** Tasks, wrap-up items, dates and openings get `card`. Cards get `notes`.
6. **Run the check.** Fix every PROBLEM before publishing:
   ```bash
   node tools/check.js patches/<id>.json
   ```
7. **Publish.** Add the patch to `patches/index.json`, commit, push, and republish the artifact at the same URL (https://claude.ai/artifact/9USrw4xJ9biTUUtLhtrVe6) with the new data file.

## Writing style
Plain English. Say what to do and where to click (`Event List → X`). Keep tips to one or two sentences. Use `{WED}`/`{THU}` instead of naming reset weekdays, because the page shows them in the viewer's clock.

See README.md for every field.

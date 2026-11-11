# Patch Planner

A one-page planner for MapleStory (GMS) patches: patch-day double-dips, daily and weekly checklists with history, an end-of-patch wrap-up of things to claim, a deadline countdown, and plain-English event notes.

## Layout

- `index.html` – the page. It reads the patch list and shows the newest patch by default, with a picker for older ones (`#v272` in the URL opens a specific patch).
- `patches/index.json` – the list of patches (`id`, `version`, `name`, `start`).
- `patches/<id>.json` – one data file per patch.

## Adding a patch

1. Read the official patch notes.
2. Copy `patches/v272.json` to `patches/<id>.json` and replace its contents.
3. Add an entry to `patches/index.json`.

All times are UTC, written as `YYYY-MM-DDTHH:MM:SS` with no `Z`.

### Patch file fields

| Field | Meaning |
| --- | --- |
| `start` | When the patch went live (use 00:00 on maintenance day). |
| `mainEnd`, `mainEndLabel` | End of the main event, used for the "weeks left" note. |
| `day0.beforeReset[]` | Things to do before the first reset after the patch. `reset` is `wed` or `thu`. |
| `day0.setup[]` | One-time setup tasks. |
| `daily[]` | Daily tasks. `until` hides the task after that time; `freq` is a short label. |
| `weekly[]` | Weekly tasks. `reset` is `wed` or `thu`; `total` is an optional cap note. |
| `openings[]` | Things that start after patch day (`starts`, `ends`, optional `m` for "after maintenance"). Shown in "Opening later" with a countdown, then "open now". |
| `wrapup[]` | End-of-patch claims: things to claim, spend or use up. `by` is the deadline; optional `opens` for claims that aren't available yet. Items due within 7 days also show a banner at the top. |
| `dates[]` | Deadline table rows. `t` is the time; `deadline` and `sunday` flags pick the badge. |
| `cards[]` | Event notes. Optional `starts` shows an "opens in" badge. `g` is the group: `all`, `main`, `alt`, `cw`, `quanah` (event world), `paid`. |

Checklist items need an `id` that is unique within the patch, because ticks are saved under it.

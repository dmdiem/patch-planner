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
| `start` | Patch day (use 00:00 UTC on maintenance day). |
| `liveAt`, `liveAtNote` | Optional expected end of maintenance (UTC) and a note such as "2:00 PM PST". Day 0 counts down to it. |
| `mainEnd`, `mainEndLabel` | End of the main event, used for the "weeks left" note. |
| `day0.beforeReset[]` | Things to do before the first reset after the patch. `reset` is `wed` or `thu`. |
| `day0.setup[]` | One-time setup tasks. |
| `daily[]` | Daily tasks. `until` hides the task after that time; `freq` is a short label. |
| `weekly[]` | Weekly tasks. `reset` is `wed` or `thu`; `total` is an optional cap note. |
| `openings[]` | Things that start after patch day (`starts`, `ends`, optional `m` for "after maintenance"). Shown in "Opening later" with a countdown, then "open now". |
| `wrapup[]` | End-of-patch claims: things to claim, spend or use up. `by` is the deadline; optional `opens` for claims that aren't available yet. Items due within 7 days also show a banner at the top. |
| `dates[]` | Deadline table rows. `t` is the time; `deadline` and `sunday` flags pick the badge. |
| `cards[]` | Event notes. Optional `starts` shows an "opens in" badge. `g` is the group: `all`, `main`, `alt`, `cw`, `quanah` (event world), `paid`. |

### Heroic vs Interactive

- Put `"world": "heroic"` or `"world": "interactive"` on any item, date or card that only applies to one server type. It's hidden for the other.
- Inside any text, write `{H|heroic-only text}` or `{I|interactive-only text}`. The page shows the matching part. Heroic is the default, and "Both" shows each part with a tag.

### Community sources

Official notes come first. Tips from community guides go in items or cards with `source: "<key>"`, where `sources.<key>` is `{title, url}`. The page shows them with a "Community tip" chip so they're never mistaken for patch-note facts. If a guide contradicts the notes, follow the notes.

### Other text features

- `{WED}` and `{THU}` in any text become the next event-weeklies or shops & passes reset, in the viewer's chosen clock (for example "Tue 4:00 PM").
- `card` on a task, wrap-up item, date or opening links it to the event card with that `name`.
- `where` is a list of `main`, `cw` and `quanah` and shows the Main world / Challenger World / Quanah chips.

Checklist items need an `id` that is unique within the patch, because ticks are saved under it.

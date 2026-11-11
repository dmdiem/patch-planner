#!/usr/bin/env node
// Coverage check for a patch file: node tools/check.js patches/v272.json
// Fails (exit 1) if any patch-notes event section isn't covered, or if links/chips are broken.
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('usage: node tools/check.js patches/<id>.json'); process.exit(2); }
const d = JSON.parse(fs.readFileSync(file, 'utf8'));
const problems = [], notes = [];
const cards = d.cards || [];
const names = new Set(cards.map(c => c.name));
const anchors = new Set((d.sections || []).map(s => s.anchor));

if (!d.sections || !d.sections.length) problems.push('No "sections" list. Copy the table of contents from the patch notes.');

// 1. Every section is covered by a card, an item, or skipped with a reason
const covered = new Map();
for (const c of cards) for (const a of [c.notes, ...(c.covers || [])]) if (a) covered.set(a, 'card: ' + c.name);
for (const s of d.sections || []) {
  if (covered.has(s.anchor) || s.coveredBy || s.skip) continue;
  problems.push(`Section not covered: "${s.title}" (#${s.anchor}) [${s.kind}]. Add a card (notes/covers), coveredBy, or skip with a reason.`);
}
// 2. Cards point at real sections
for (const c of cards) {
  if (!c.notes) problems.push(`Card "${c.name}" has no "notes" anchor.`);
  for (const a of [c.notes, ...(c.covers || [])]) if (a && !anchors.has(a)) problems.push(`Card "${c.name}" points at unknown section #${a}.`);
  if (!c.where) problems.push(`Card "${c.name}" has no "where".`);
  if (!c.ends && !/job/i.test(c.name)) notes.push(`Card "${c.name}" has no end date.`);
}
// 3. Items: ids, where, card links
const lists = { 'day0.beforeReset': d.day0?.beforeReset, 'day0.setup': d.day0?.setup, daily: d.daily, weekly: d.weekly, wrapup: d.wrapup };
const ids = new Set();
for (const [ln, arr] of Object.entries(lists)) for (const i of arr || []) {
  const key = ln.split('.')[0] + ':' + i.id;
  if (!i.id) problems.push(`${ln}: item "${i.title}" has no id.`);
  if (ids.has(key)) problems.push(`${ln}: duplicate id "${i.id}".`); ids.add(key);
  if (!i.where) problems.push(`${ln}: "${i.title}" has no "where".`);
  if (i.card && !names.has(i.card)) problems.push(`${ln}: "${i.title}" links to missing card "${i.card}".`);
  if (!i.card) notes.push(`${ln}: "${i.title}" has no event link (fine for system tasks).`);
  if ((ln === 'weekly') && !['wed','thu'].includes(i.reset)) problems.push(`weekly: "${i.title}" needs reset "wed" or "thu".`);
}
for (const x of [...(d.dates || []), ...(d.openings || [])]) if (x.card && !names.has(x.card)) problems.push(`Date "${x.title}" links to missing card "${x.card}".`);
// 4. Community sources exist
for (const x of [...cards, ...Object.values(lists).flat().filter(Boolean)]) if (x.source && !(d.sources || {})[x.source]) problems.push(`"${x.name || x.title}" uses unknown source "${x.source}".`);
// 5. Dates parse
const bad = (t) => t && isNaN(new Date(t + 'Z'));
for (const x of [d, ...cards, ...(d.dates||[]), ...(d.openings||[]), ...(d.wrapup||[]), ...(d.daily||[]), ...(d.weekly||[])])
  for (const k of ['start','liveAt','mainEnd','ends','starts','t','by','opens','until']) if (bad(x[k])) problems.push(`Bad date in ${k}: ${x[k]} (${x.title||x.name||x.id})`);

const ev = (d.sections || []).filter(s => s.kind === 'event');
console.log(`${file}: ${ev.length} event sections, ${(d.sections||[]).length - ev.length} system sections, ${cards.length} cards`);
notes.forEach(n => console.log('  note: ' + n));
if (problems.length) { problems.forEach(p => console.log('  PROBLEM: ' + p)); process.exit(1); }
console.log('  OK: every section is covered.');

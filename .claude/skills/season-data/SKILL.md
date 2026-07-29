---
name: season-data
description: Add a new season of match/player data to the Alphia zaalvoetbal dashboard, or correct existing season data (wrong scores, home/away, or player goals). Use this whenever the user wants to add season5.ts (or later), transcribe a new season from a screenshot/spreadsheet of match results, or fix a data error in src/data/season*.ts — this repo's git history shows the same categories of transcription mistakes (swapped home/away scores, wrong player goal counts, missing players) recurring across several past corrections, so always validate before committing.
---

# Zaalvoetbal season data

This dashboard's only data source is hand-transcribed screenshots of the team's
season spreadsheets (see `README.md` — "no brondata beschikbaar"). There is no
way to re-derive the data from a canonical source, which is exactly why past
transcriptions have gone wrong in quiet, hard-to-notice ways: a home/away score
pair swapped, a player's goal tally off by one, a player missing entirely. Several
past commits exist purely to fix these (`git log --oneline | grep -i corrigeer`).
Treat every new or edited season file as a transcription that needs the same
scrutiny that caught those bugs, not just a data-entry task.

## Where things live

- `src/data/types.ts` — `MatchTuple`, `buildMatches()`, `LineupsByRow`. Read this
  first; it defines the tuple shape and how `result`/`type` get derived.
- `src/data/season1.ts` … `season4.ts` — one file per season. File names do NOT
  match season years; chronological order is set by the `seasons` array in
  `src/data/index.ts`.
- `src/data/index.ts` — the only place a new season file needs to be registered.

Two data shapes exist across the season files:

1. **Season totals only** (season1, season2, season4): a `tuples` array of
   matches plus a `playerStats` array of season-end aanwezig/afwezig/goals
   totals. No per-match lineup.
2. **Per-match lineup** (season3, the 2024-2025 season): additionally has
   `ABSENT_ROWS`, `GOALS_BY_ROW`, and a `WALKOVER_ROW` constant, built into a
   `LineupsByRow` via `buildLineups()` and passed to `buildMatches()`. This is
   strictly more work to transcribe but enables per-match/per-player detail
   views (`PlayerDetail.tsx`, `computePlayerImpact`). Only do this if the
   source sheet actually has a per-match player grid to transcribe from —
   don't fabricate lineup detail that isn't in the source.

## Adding a new season

1. Get the source data from the user (screenshot(s) or description of the
   spreadsheet) if it isn't already provided. You need, per match: date, day,
   opponent, thuis/uit, time, venue, score, and any note (used to detect
   beker/oefenwedstrijd via `detectType()` — only text containing "beker" or
   "oefenwedstrijd" flips it from the "competitie" default). You also need
   season-end per-player aanwezig/afwezig/goals totals.

2. **Home/away score orientation is the single easiest thing to get backwards.**
   `scoreFor` is always *this team's* goals and `scoreAgainst` is always the
   opponent's, regardless of which order the source sheet lists them in for an
   away match — a past bug ("Draai doelpuntenscore om voor uitwedstrijden")
   was exactly a systematic swap on `Uit` rows. When transcribing an away
   match, explicitly check which number belongs to the team, not just copy the
   sheet's left-to-right order.

3. Create `src/data/season5.ts` (or the next free number — the number in the
   filename has no meaning, just pick one not already used) following the
   pattern of an existing file with the same shape (totals-only vs. per-match
   lineup). Use `buildMatches(seasonId, tuples[, lineups])`.

4. Register it in `src/data/index.ts`: import it and insert it into the
   `seasons` array **in the correct chronological position** — that array's
   order is what drives the UI, not the file name.

5. Validate before considering the season done (see below).

## Correcting existing data

Same care applies to fixes. Before changing a score, a player's goal count, or
a home/away flag, re-derive what the *correct* full set of values should be
from the source (don't patch just the one number the user pointed at — a wrong
score often means the W/D/L result and season goal totals are also off until
you fix the root value). Then validate.

## Validating

Run the bundled script against any season file you added or touched:

```
node .claude/skills/season-data/scripts/validate-season.mjs src/data/season5.ts
```

It catches the failure modes that have actually recurred in this repo:
malformed rows, a per-match lineup whose goals don't reconcile with the
match score or the season-end player totals, and (for totals-only seasons) an
attendance count that doesn't add up to the match count. Read `warning`s —
they usually flag a real edge case (like a guest player's goal) rather than a
bug, but confirm rather than assuming.

This script **cannot** check the one thing you're most likely to get wrong: whether
the transcription matches the source screenshot/spreadsheet. It only checks
internal consistency. After it passes, still do what the README describes —
compare the season's total W-D-L record and goal sum (which the script prints)
against the sheet's own totals by eye. A season file can be perfectly
self-consistent and still not match the source.

Finally, run `npm run lint` and, if you touched `src/data/index.ts` or
`types.ts`, `npx tsc --noEmit` to catch type errors — the tuple shape has no
runtime validation otherwise.

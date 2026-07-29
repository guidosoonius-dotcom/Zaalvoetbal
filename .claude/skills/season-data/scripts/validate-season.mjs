#!/usr/bin/env node
/**
 * Validates a src/data/seasonN.ts file for internal consistency.
 *
 * This does NOT check against the original spreadsheet/screenshot (this script
 * can't see it) — it only catches the failure modes that have repeatedly slipped
 * into this repo's transcribed data: player goals per match not summing to the
 * team's own score, attendance counts not matching the lineup grid, and other
 * shape problems. A clean run here is necessary, not sufficient — always also
 * cross-check the season's W-D-L record and total goals against the sheet's own
 * totals by eye.
 *
 * Usage: node validate-season.mjs src/data/season5.ts
 */
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node validate-season.mjs <path-to-seasonN.ts>");
  process.exit(1);
}

const src = readFileSync(file, "utf8");
const errors = [];
const warnings = [];

// Extracts a balanced `[...]` or `{...}` literal that follows `marker` in the
// source. Handles both array literals (tuples, playerStats) and object
// literals (ABSENT_ROWS, GOALS_BY_ROW), tracking both bracket kinds together
// since a `{ Alex: [6] }` object nests an array inside it.
function extractLiteral(source, marker) {
  const start = source.indexOf(marker);
  if (start === -1) return null;
  const open = start + marker.length;
  let i = open;
  while (i < source.length && /\s/.test(source[i])) i++;
  if (source[i] !== "[" && source[i] !== "{") return null;
  const openChar = source[i];
  const from = i;
  let depth = 0;
  for (; i < source.length; i++) {
    if (source[i] === "[" || source[i] === "{") depth++;
    else if (source[i] === "]" || source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(from, i + 1);
    }
  }
  throw new Error(`Unbalanced ${openChar} while extracting literal after ${JSON.stringify(marker)}.`);
}

function parseJsish(literal) {
  // The data files are plain JS/TS object+array literals (strings, numbers,
  // booleans) — safe to evaluate in isolation since this script never runs
  // against untrusted input, only this repo's own data files.
  return new Function(`return (${literal});`)();
}

const tuplesLiteral = extractLiteral(src, "const tuples: MatchTuple[] = ");
if (!tuplesLiteral) {
  errors.push("Could not find `const tuples: MatchTuple[] = [...]`.");
}
const tuples = tuplesLiteral ? parseJsish(tuplesLiteral) : [];

const playerStatsLiteral = extractLiteral(src, "const playerStats: PlayerSeasonStat[] = ");
if (!playerStatsLiteral) {
  errors.push("Could not find `const playerStats: PlayerSeasonStat[] = [...]`.");
}
const playerStats = playerStatsLiteral ? parseJsish(playerStatsLiteral) : [];

// --- Shape checks -----------------------------------------------------

tuples.forEach((t, i) => {
  const row = i + 1;
  // time/venue may legitimately be "" for older seasons where it wasn't recorded.
  const [date, day, opponent, homeAway, time, venue, scoreFor, scoreAgainst] = t;
  if (!date || !day || !opponent) {
    errors.push(`Row ${row}: missing a required field (date/day/opponent).`);
  }
  if (typeof time !== "string" || typeof venue !== "string") {
    errors.push(`Row ${row}: time/venue must be strings (possibly empty).`);
  }
  if (homeAway !== "Thuis" && homeAway !== "Uit") {
    errors.push(`Row ${row}: homeAway must be "Thuis" or "Uit", got ${JSON.stringify(homeAway)}.`);
  }
  if (!Number.isInteger(scoreFor) || !Number.isInteger(scoreAgainst)) {
    errors.push(`Row ${row}: scoreFor/scoreAgainst must be integers.`);
  }
});

// --- Lineup checks (only for the GOALS_BY_ROW/ABSENT_ROWS pattern) -----

const absentRowsLiteral = extractLiteral(src, "const ABSENT_ROWS: Record<string, number[]> = ");
const goalsByRowLiteral = extractLiteral(src, "const GOALS_BY_ROW: Record<string, Record<number, number>> = ");
const walkoverMatch = src.match(/const WALKOVER_ROW(?:S)?\s*=\s*(\[[^\]]*\]|\d+)/);

if (absentRowsLiteral && goalsByRowLiteral) {
  const absentRows = parseJsish(absentRowsLiteral);
  const goalsByRow = parseJsish(goalsByRowLiteral);
  const walkoverRows = walkoverMatch
    ? (walkoverMatch[1].startsWith("[") ? parseJsish(walkoverMatch[1]) : [Number(walkoverMatch[1])])
    : [];

  // 1. Per-match: sum of player goals should equal the team's own scoreFor,
  //    for every row that has lineup data (i.e. isn't a walkover). A sum
  //    that's too LOW can be legitimate (a guest/extra player not in the
  //    roster scored — this repo has real cases like "Luke en Stanley
  //    extra"), so that's only a warning. A sum that's too HIGH always
  //    means a transcription error (goals can't exceed the team's score).
  tuples.forEach((t, i) => {
    const row = i + 1;
    if (walkoverRows.includes(row)) return;
    const scoreFor = t[6];
    let sum = 0;
    for (const player of Object.keys(goalsByRow)) {
      sum += goalsByRow[player]?.[row] ?? 0;
    }
    if (sum > scoreFor) {
      errors.push(
        `Row ${row} (${t[2]}): lineup goals sum to ${sum}, more than scoreFor (${scoreFor}). ` +
          `A player's goal count or the match score is wrong.`,
      );
    } else if (sum < scoreFor) {
      warnings.push(
        `Row ${row} (${t[2]}): lineup goals sum to ${sum}, less than scoreFor (${scoreFor}). ` +
          `Fine if the note credits a guest/extra player for the gap — otherwise a goal is missing from the grid.`,
      );
    }
  });

  // 2. Per-player: aanwezig/afwezig/goals in playerStats should match what
  //    the ABSENT_ROWS/GOALS_BY_ROW grid implies.
  const totalRows = tuples.length;
  const relevantRows = totalRows - walkoverRows.length;
  for (const stat of playerStats) {
    const absent = (absentRows[stat.player] ?? []).length;
    const present = relevantRows - absent;
    const goalSum = Object.values(goalsByRow[stat.player] ?? {}).reduce((a, b) => a + b, 0);
    if (present !== stat.aanwezig) {
      errors.push(
        `${stat.player}: playerStats.aanwezig is ${stat.aanwezig} but the lineup grid implies ${present}.`,
      );
    }
    if (absent !== stat.afwezig) {
      errors.push(
        `${stat.player}: playerStats.afwezig is ${stat.afwezig} but the lineup grid implies ${absent}.`,
      );
    }
    if (goalSum !== stat.goals) {
      errors.push(
        `${stat.player}: playerStats.goals is ${stat.goals} but GOALS_BY_ROW sums to ${goalSum}.`,
      );
    }
  }
} else {
  // No per-match lineup for this season — only the coarse attendance check
  // is possible, and only as a warning: a walkover or forfeit legitimately
  // excludes a match from attendance without appearing anywhere in this file.
  const counts = new Set(playerStats.map((p) => p.aanwezig + p.afwezig));
  if (counts.size > 1) {
    warnings.push(
      `playerStats aanwezig+afwezig isn't the same for every player (${[...counts].join(", ")}) — ` +
        `expected under normal circumstances, but can be legitimate if some players joined/left mid-season.`,
    );
  } else if (counts.size === 1 && [...counts][0] !== tuples.length) {
    warnings.push(
      `playerStats aanwezig+afwezig is ${[...counts][0]} for every player, but there are ${tuples.length} matches. ` +
        `If a match was a walkover/forfeit not tracked for attendance this is fine — otherwise, double check.`,
    );
  }
}

// --- Report -------------------------------------------------------------

const record = tuples.reduce(
  (acc, t) => {
    const [, , , , , , scoreFor, scoreAgainst] = t;
    if (scoreFor > scoreAgainst) acc.w++;
    else if (scoreFor < scoreAgainst) acc.l++;
    else acc.d++;
    acc.goalsFor += scoreFor;
    acc.goalsAgainst += scoreAgainst;
    return acc;
  },
  { w: 0, d: 0, l: 0, goalsFor: 0, goalsAgainst: 0 },
);

console.log(`\n${file}`);
console.log(`  ${tuples.length} matches — record W${record.w} D${record.d} L${record.l}`);
console.log(`  Goals: ${record.goalsFor} for, ${record.goalsAgainst} against`);
console.log(`  >>> Compare the record and goal totals above against the source sheet's own totals by eye. <<<\n`);

if (warnings.length) {
  console.log(`${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  - ${w}`);
  console.log();
}

if (errors.length) {
  console.log(`${errors.length} error(s):`);
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}

console.log("No internal-consistency errors found.");

import { readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "public/data/leetcode.json");
const username = "Shivendra22";
const endpoint = "https://leetcode.com/graphql/";
const timeoutMs = 15_000;
const currentYear = new Date().getUTCFullYear();
const calendarYearsToFetch = [currentYear - 1, currentYear];

const statsQuery = `query PublicStats($username: String!) {
  matchedUser(username: $username) {
    username
    submitStats { acSubmissionNum { difficulty count } }
  }
}`;

const calendarQuery = `query PublicCalendar($username: String!, $year: Int) {
  matchedUser(username: $username) {
    username
    userCalendar(year: $year) { submissionCalendar }
  }
}`;

function isCount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function validateStats(payload) {
  const user = payload?.data?.matchedUser;
  if (user?.username !== username) throw new Error("Solved-count response did not match the requested profile.");
  const entries = user?.submitStats?.acSubmissionNum;
  if (!Array.isArray(entries)) throw new Error("Solved-count response is missing difficulty totals.");
  const counts = Object.fromEntries(entries.map(({ difficulty, count }) => [difficulty, count]));
  const stats = { total: counts.All, easy: counts.Easy, medium: counts.Medium, hard: counts.Hard };
  if (!Object.values(stats).every(isCount)) throw new Error("Solved-count response contains invalid numbers.");
  if (stats.easy + stats.medium + stats.hard !== stats.total) {
    throw new Error("Difficulty counts do not add up to the total.");
  }
  return stats;
}

function validateCalendar(value, allowedYears) {
  const raw = typeof value === "string" ? JSON.parse(value) : value;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Calendar must be an object keyed by Unix timestamps.");
  }
  const entries = Object.entries(raw);
  if (!entries.length) throw new Error("Calendar has no activity dates.");
  const now = Math.floor(Date.now() / 1000);
  const calendar = {};
  for (const [timestamp, count] of entries) {
    const seconds = Number(timestamp);
    if (!/^\d+$/.test(timestamp) || !Number.isSafeInteger(seconds) || seconds <= 0 || seconds > now + 86_400) {
      throw new Error(`Calendar has an invalid timestamp: ${timestamp}`);
    }
    if (!allowedYears.includes(new Date(seconds * 1000).getUTCFullYear())) {
      throw new Error(`Calendar timestamp ${timestamp} is outside its requested year.`);
    }
    if (!isCount(count)) throw new Error(`Calendar has an invalid count for ${timestamp}.`);
    calendar[String(seconds)] = count;
  }
  return Object.fromEntries(Object.entries(calendar).sort(([a], [b]) => Number(a) - Number(b)));
}

async function request(query, variables, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        referer: "https://leetcode.com/",
        "user-agent": "Portfolio public LeetCode statistics sync",
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${label} request returned HTTP ${response.status}.`);
    const payload = await response.json();
    if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join("; "));
    return payload;
  } catch (error) {
    if (error.name === "AbortError") throw new Error(`${label} request timed out after ${timeoutMs / 1000} seconds.`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function readPrevious() {
  try {
    const document = JSON.parse(await readFile(outputPath, "utf8"));
    let calendar = null;
    let calendarYears = null;
    let calendarFetchedAt = null;
    try {
      if (document.calendar != null) {
        if (!Array.isArray(document.calendarYears) || !document.calendarYears.length ||
            !document.calendarYears.every((year) => Number.isInteger(year) && year >= 2000 && year <= currentYear)) {
          throw new Error("Saved calendar has invalid year coverage.");
        }
        calendarYears = document.calendarYears;
        calendar = validateCalendar(document.calendar, calendarYears);
        if (typeof document.calendarFetchedAt !== "string" || Number.isNaN(Date.parse(document.calendarFetchedAt))) {
          throw new Error("Saved calendar is missing a valid sync date.");
        }
        calendarFetchedAt = document.calendarFetchedAt;
      }
    } catch (error) {
      console.warn(`Saved calendar will not be reused: ${error.message}`);
      calendar = null;
      calendarYears = null;
      calendarFetchedAt = null;
    }
    return { document, calendar, calendarYears, calendarFetchedAt };
  } catch (error) {
    if (error.code !== "ENOENT") throw new Error(`Existing JSON is invalid and was left untouched: ${error.message}`);
    return { document: {}, calendar: null, calendarYears: null, calendarFetchedAt: null };
  }
}

async function main() {
  console.log(`Fetching public solved counts for ${username}...`);
  const stats = validateStats(await request(statsQuery, { username }, "Solved-count"));
  console.log(`Validated: ${stats.total} total; Easy ${stats.easy}, Medium ${stats.medium}, Hard ${stats.hard}.`);

  const previous = await readPrevious();
  const now = new Date().toISOString();
  const unchangedStats = ["total", "easy", "medium", "hard"].every(
    (key) => previous.document.stats?.[key] === stats[key],
  );
  let calendar = previous.calendar;
  let calendarYears = previous.calendarYears;
  let calendarFetchedAt = previous.calendarFetchedAt;
  let calendarStatus = calendar ? "last-known-good real calendar" : "unavailable; site will use its labeled preview";

  try {
    const mergedCalendar = {};
    for (const year of calendarYearsToFetch) {
      console.log(`Fetching public calendar for ${year}...`);
      const payload = await request(calendarQuery, { username, year }, `Calendar ${year}`);
      const user = payload?.data?.matchedUser;
      if (user?.username !== username) throw new Error(`Calendar ${year} response did not match the requested profile.`);
      Object.assign(mergedCalendar, validateCalendar(user?.userCalendar?.submissionCalendar, [year]));
    }
    const freshCalendar = validateCalendar(mergedCalendar, calendarYearsToFetch);
    const sameCalendar = JSON.stringify(freshCalendar) === JSON.stringify(previous.calendar) &&
      JSON.stringify(calendarYearsToFetch) === JSON.stringify(previous.calendarYears);
    calendar = freshCalendar;
    calendarYears = calendarYearsToFetch;
    calendarFetchedAt = sameCalendar ? previous.calendarFetchedAt : now;
    calendarStatus = "real calendar fetched and validated";
    console.log(`Validated ${Object.keys(calendar).length} calendar dates.`);
  } catch (error) {
    console.warn(`Calendar sync unavailable: ${error.message}`);
    console.warn(calendar ? "Keeping the last-known-good real calendar." : "No real calendar is saved; the site will use its labeled preview.");
  }

  const next = {
    username,
    stats: unchangedStats ? previous.document.stats : stats,
    statsFetchedAt: unchangedStats ? previous.document.statsFetchedAt ?? now : now,
    calendar,
    calendarYears,
    calendarFetchedAt,
  };
  const previousText = JSON.stringify(previous.document, null, 2);
  const nextText = JSON.stringify(next, null, 2);
  if (previousText === nextText) {
    console.log(`No JSON changes. Calendar status: ${calendarStatus}.`);
    return;
  }

  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, `${nextText}\n`, "utf8");
  await rename(temporaryPath, outputPath);
  console.log(`Updated public/data/leetcode.json. Calendar status: ${calendarStatus}.`);
}

main().catch((error) => {
  console.error(`LeetCode sync failed; previous JSON was not changed: ${error.message}`);
  process.exitCode = 1;
});

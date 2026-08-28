import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import { dotaItemsConfig as config } from "./config.mjs";
import { assertDotaItemsSnapshot } from "./schema.mjs";
import { fetchJson, fetchJsonFromSources } from "./fetch-json.mjs";

const root = resolve(import.meta.dirname, "../..");
const outputPath = resolve(root, config.outputPath);

const roleCase = `CASE
  WHEN np.fantasy_role IN (1, 3, 4) THEN 'core'
  WHEN np.fantasy_role = 2 THEN 'support'
  ELSE 'unclassified'
END`;

const cohortWhere = `m.leagueid > 0
  AND m.version IS NOT NULL
  AND mp.patch = '${config.patchFamily}'
  AND m.start_time >= extract(epoch from timestamptz '${config.patchStartedAt}')`;

const cohortSql = `
WITH cohort AS (
  SELECT m.match_id, m.start_time
  FROM matches m
  JOIN match_patch mp ON mp.match_id = m.match_id
  WHERE ${cohortWhere}
), players AS (
  SELECT c.match_id, c.start_time, ${roleCase} AS role
  FROM cohort c
  JOIN player_matches pm ON pm.match_id = c.match_id
  LEFT JOIN notable_players np ON np.account_id = pm.account_id
)
SELECT role,
  count(*)::int AS players,
  count(DISTINCT match_id)::int AS role_matches,
  (SELECT count(*)::int FROM cohort) AS matches,
  (SELECT count(*)::int FROM players) AS total_players,
  (SELECT count(*)::int FROM players WHERE role <> 'unclassified') AS classified_players,
  (SELECT min(to_timestamp(start_time)) FROM cohort) AS first_match,
  (SELECT max(to_timestamp(start_time)) FROM cohort) AS last_match
FROM players
GROUP BY role
ORDER BY role`;

const timingSql = `
WITH cohort AS (
  SELECT m.match_id
  FROM matches m
  JOIN match_patch mp ON mp.match_id = m.match_id
  WHERE ${cohortWhere}
), players AS (
  SELECT pm.match_id, pm.player_slot, pm.purchase_log, ${roleCase} AS role
  FROM cohort c
  JOIN player_matches pm ON pm.match_id = c.match_id
  JOIN notable_players np ON np.account_id = pm.account_id
  WHERE np.fantasy_role IN (1, 2, 3, 4)
), role_totals AS (
  SELECT role, count(*)::int AS players, count(DISTINCT match_id)::int AS matches
  FROM players
  GROUP BY role
), first_purchases AS (
  SELECT p.role, p.match_id, p.player_slot, purchase.value->>'key' AS item_key,
    min((purchase.value->>'time')::int) AS first_purchase_seconds
  FROM players p
  CROSS JOIN LATERAL unnest(p.purchase_log) AS purchase(value)
  WHERE purchase.value->>'key' IS NOT NULL
    AND (purchase.value->>'time')::int >= 0
    AND purchase.value->>'key' NOT LIKE 'recipe_%'
  GROUP BY p.role, p.match_id, p.player_slot, purchase.value->>'key'
)
SELECT fp.role, fp.item_key,
  count(*)::int AS n,
  round((percentile_cont(0.25) WITHIN GROUP (ORDER BY fp.first_purchase_seconds) / 60.0)::numeric, 1)::float8 AS p25,
  round((percentile_cont(0.50) WITHIN GROUP (ORDER BY fp.first_purchase_seconds) / 60.0)::numeric, 1)::float8 AS median,
  round((percentile_cont(0.75) WITHIN GROUP (ORDER BY fp.first_purchase_seconds) / 60.0)::numeric, 1)::float8 AS p75,
  rt.players AS role_players,
  rt.matches AS role_matches,
  round((100.0 * count(*) / rt.players)::numeric, 1)::float8 AS purchase_rate_pct
FROM first_purchases fp
JOIN role_totals rt ON rt.role = fp.role
GROUP BY fp.role, fp.item_key, rt.players, rt.matches
ORDER BY fp.item_key, fp.role`;

const explorerUrl = (sql) => {
  const url = new URL(config.explorerUrl);
  url.searchParams.set("sql", sql.replace(/\s+/g, " ").trim());
  return url;
};

const asNumber = (value) => Number(value);
const safeText = (value) => typeof value === "string" ? value.trim() : "";

function cleanAttributes(attributes) {
  if (!Array.isArray(attributes)) return [];
  return attributes
    .filter((attribute) => attribute && safeText(attribute.key) && attribute.value !== undefined)
    .map((attribute) => ({
      key: safeText(attribute.key),
      label: safeText(attribute.display),
      value: Array.isArray(attribute.value) ? attribute.value.join(" / ") : String(attribute.value)
    }));
}

function cleanAbilities(abilities) {
  if (!Array.isArray(abilities)) return [];
  return abilities
    .filter((ability) => ability && safeText(ability.title) && safeText(ability.description))
    .map((ability) => ({ type: safeText(ability.type) || "ability", title: safeText(ability.title), description: safeText(ability.description) }));
}

function expandCatalogKeys(constants, observedKeys) {
  const keys = new Set(observedKeys);
  const visit = (key) => {
    const item = constants[key];
    if (!item || !Array.isArray(item.components)) return;
    for (const component of item.components) {
      if (!safeText(component) || component.startsWith("recipe_")) continue;
      if (!keys.has(component)) {
        keys.add(component);
        visit(component);
      }
    }
  };
  [...keys].forEach(visit);
  return keys;
}

function makeTiming(row) {
  return {
    n: asNumber(row.n),
    p25: asNumber(row.p25),
    median: asNumber(row.median),
    p75: asNumber(row.p75),
    purchaseRatePct: asNumber(row.purchase_rate_pct)
  };
}

async function previousSnapshot() {
  try { return JSON.parse(await readFile(outputPath, "utf8")); }
  catch { return null; }
}

async function main() {
  const constantsOptions = { attempts: 2, timeoutMs: 15_000 };
  const patchSource = await fetchJsonFromSources(
    [config.patchConstantsUrl, config.patchConstantsFallbackUrl], "OpenDota patch constants",
    { ...constantsOptions, validate: (data) => Array.isArray(data) && data.length > 0 && data.every((patch) => patch && typeof patch.name === "string" && Number.isFinite(Number(patch.id))) }
  );
  const patches = patchSource.data;
  const latestPatch = patches.toSorted((left, right) => Number(left.id) - Number(right.id)).at(-1);
  if (latestPatch?.name !== config.patchFamily) {
    throw new Error(`Configured patch family ${config.patchFamily} is no longer current in OpenDota (latest: ${latestPatch?.name ?? "unknown"}). Review the Valve patch boundary before refreshing.`);
  }

  const [itemSource, cohortResponse, timingResponse] = await Promise.all([
    fetchJsonFromSources([config.itemConstantsUrl, config.itemConstantsFallbackUrl], "OpenDota item constants", {
      ...constantsOptions,
      validate: (data) => Boolean(data && typeof data === "object" && !Array.isArray(data) && Number.isFinite(data.blink?.cost) && data.blink.cost > 0)
    }),
    fetchJson(explorerUrl(cohortSql), "OpenDota cohort query"),
    fetchJson(explorerUrl(timingSql), "OpenDota timing query")
  ]);
  const constants = itemSource.data;
  const cohortRows = cohortResponse?.rows;
  const timingRows = timingResponse?.rows;
  if (!Array.isArray(cohortRows) || !Array.isArray(timingRows)) throw new Error("OpenDota returned an unexpected match-statistics shape");
  console.log(`Constants retrieved from ${itemSource.url}; patch families from ${patchSource.url}.`);

  const firstCohortRow = cohortRows[0];
  if (!firstCohortRow) throw new Error("The current-patch cohort is empty");
  const roleRows = Object.fromEntries(cohortRows.map((row) => [row.role, row]));
  const core = roleRows.core;
  const support = roleRows.support;
  if (!core || !support) throw new Error("Both core and support cohorts are required");

  const timingByItem = new Map();
  for (const row of timingRows) {
    if (!safeText(row.item_key) || (row.role !== "core" && row.role !== "support")) continue;
    const current = timingByItem.get(row.item_key) ?? {};
    current[row.role] = makeTiming(row);
    timingByItem.set(row.item_key, current);
  }

  const catalogKeys = expandCatalogKeys(constants, timingByItem.keys());
  const items = [...catalogKeys]
    .map((key) => {
      const item = constants[key];
      if (!item || !Number.isInteger(item.id) || !safeText(item.dname) || asNumber(item.cost) <= 0 || key.startsWith("recipe_")) return null;
      return {
        id: item.id,
        key,
        name: safeText(item.dname),
        cost: asNumber(item.cost),
        quality: safeText(item.qual) || "standard",
        image: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${key}.png`,
        created: item.created === true,
        components: Array.isArray(item.components) ? item.components.filter((component) => safeText(component) && !component.startsWith("recipe_")) : [],
        attributes: cleanAttributes(item.attrib),
        abilities: cleanAbilities(item.abilities),
        timings: timingByItem.get(key) ?? {}
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.name.localeCompare(right.name, "en"));

  const players = asNumber(firstCohortRow.total_players);
  const classifiedPlayers = asNumber(firstCohortRow.classified_players);
  const stable = {
    schemaVersion: config.schemaVersion,
    provider: config.provider,
    patch: {
      label: config.patch,
      family: config.patchFamily,
      startedAt: config.patchStartedAt,
      sourceUrl: config.patchSourceUrl
    },
    cohort: {
      matches: asNumber(firstCohortRow.matches),
      players,
      classifiedPlayers,
      roleCoveragePct: Number((100 * classifiedPlayers / players).toFixed(1)),
      firstMatchAt: new Date(firstCohortRow.first_match).toISOString(),
      lastMatchAt: new Date(firstCohortRow.last_match).toISOString(),
      roles: {
        core: { players: asNumber(core.players), matches: asNumber(core.role_matches) },
        support: { players: asNumber(support.players), matches: asNumber(support.role_matches) }
      }
    },
    methodology: {
      minimumSample: config.minimumSample,
      cohortRule: `Parsed professional matches in OpenDota, patch family ${config.patchFamily}, starting at the official ${config.patch} release timestamp.`,
      roleRule: "OpenDota notable-player fantasy_role: 1, 3 and 4 are core; 2 is support; unclassified rows are excluded.",
      timingRule: "First non-recipe purchase per player and item after 0:00; quartiles are match minutes.",
      purchaseRateRule: "Players with a first purchase divided by all classified player appearances in that role.",
      catalogRule: "Items observed in the cohort plus their component tree; zero-cost and recipe records are excluded."
    },
    sources: [
      { label: `Valve · Patch ${config.patch}`, url: config.patchSourceUrl },
      { label: "OpenDota", url: config.openDotaUrl },
      { label: "OpenDota API documentation", url: config.openDotaDocsUrl },
      { label: "odota/dotaconstants", url: config.dotaConstantsUrl },
      { label: "Item constants retrieval source", url: itemSource.url },
      { label: "Patch-family retrieval source", url: patchSource.url }
    ],
    items
  };
  const dataHash = createHash("sha256").update(JSON.stringify(stable)).digest("hex");
  const previous = await previousSnapshot();
  const fetchedAt = new Date().toISOString();
  const dataUpdatedAt = previous?.dataHash === dataHash
    ? previous.dataUpdatedAt ?? previous.fetchedAt
    : fetchedAt;
  const snapshot = { ...stable, fetchedAt, dataUpdatedAt, dataHash };

  assertDotaItemsSnapshot(snapshot);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`Dota item snapshot: ${items.length} items, ${snapshot.cohort.matches} matches, ${snapshot.cohort.roleCoveragePct}% role coverage.`);
}

await main();

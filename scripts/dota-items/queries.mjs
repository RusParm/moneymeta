const compactSql = (sql) => sql.replace(/\s+/g, " ").trim();

export function createDotaItemQueries(config) {
  const minimumClassified = Number(config.minimumClassifiedPlayersPerMatch);
  if (!Number.isInteger(minimumClassified) || minimumClassified < 1 || minimumClassified > 10) {
    throw new Error("minimumClassifiedPlayersPerMatch must be an integer from 1 to 10");
  }

  const roleCase = `CASE
    WHEN np.fantasy_role IN (1, 3, 4) THEN 'core'
    WHEN np.fantasy_role = 2 THEN 'support'
    ELSE 'unclassified'
  END`;
  const cohortCtes = `raw_cohort AS (
    SELECT m.match_id, m.start_time
    FROM matches m
    JOIN match_patch mp ON mp.match_id = m.match_id
    WHERE m.leagueid > 0
      AND m.version IS NOT NULL
      AND mp.patch = '${config.patchFamily}'
      AND m.start_time >= extract(epoch from timestamptz '${config.patchStartedAt}')
  ), cohort AS (
    SELECT rc.match_id, rc.start_time
    FROM raw_cohort rc
    JOIN player_matches pm ON pm.match_id = rc.match_id
    LEFT JOIN notable_players np ON np.account_id = pm.account_id
    GROUP BY rc.match_id, rc.start_time
    HAVING count(*) FILTER (WHERE np.fantasy_role IN (1, 2, 3, 4)) >= ${minimumClassified}
  )`;

  const cohortSql = `WITH ${cohortCtes}, players AS (
    SELECT c.match_id, c.start_time, ${roleCase} AS role
    FROM cohort c
    JOIN player_matches pm ON pm.match_id = c.match_id
    LEFT JOIN notable_players np ON np.account_id = pm.account_id
  )
  SELECT role,
    count(*)::int AS players,
    count(DISTINCT match_id)::int AS role_matches,
    (SELECT count(*)::int FROM raw_cohort) AS raw_matches,
    (SELECT count(*)::int FROM cohort) AS matches,
    (SELECT count(*)::int FROM players) AS total_players,
    (SELECT count(*)::int FROM players WHERE role <> 'unclassified') AS classified_players,
    (SELECT min(to_timestamp(start_time)) FROM cohort) AS first_match,
    (SELECT max(to_timestamp(start_time)) FROM cohort) AS last_match
  FROM players
  GROUP BY role
  ORDER BY role`;

  const timingSql = `WITH ${cohortCtes}, players AS (
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

  return { cohortSql: compactSql(cohortSql), timingSql: compactSql(timingSql) };
}

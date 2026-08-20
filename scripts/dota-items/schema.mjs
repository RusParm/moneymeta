const finite = (value) => typeof value === "number" && Number.isFinite(value);
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;

export function validateDotaItemsSnapshot(snapshot) {
  const errors = [];
  const fail = (path, message) => errors.push(`${path}: ${message}`);

  if (!snapshot || typeof snapshot !== "object") return ["snapshot: expected an object"];
  if (snapshot.developmentFixture === true) fail("developmentFixture", "must be replaced by a live refresh before validation");
  if (snapshot.schemaVersion !== 1) fail("schemaVersion", "expected 1");
  if (snapshot.provider !== "opendota") fail("provider", "expected opendota");
  if (!nonEmpty(snapshot.fetchedAt) || Number.isNaN(Date.parse(snapshot.fetchedAt))) fail("fetchedAt", "expected an ISO date");
  if (!nonEmpty(snapshot.dataHash) || !/^[a-f0-9]{64}$/.test(snapshot.dataHash)) fail("dataHash", "expected a sha256 hash");

  if (!snapshot.patch || typeof snapshot.patch !== "object") fail("patch", "expected an object");
  else {
    if (!nonEmpty(snapshot.patch.label)) fail("patch.label", "required");
    if (!nonEmpty(snapshot.patch.family)) fail("patch.family", "required");
    if (!nonEmpty(snapshot.patch.startedAt) || Number.isNaN(Date.parse(snapshot.patch.startedAt))) fail("patch.startedAt", "expected an ISO date");
    if (!nonEmpty(snapshot.patch.sourceUrl)) fail("patch.sourceUrl", "required");
  }

  if (!snapshot.cohort || typeof snapshot.cohort !== "object") fail("cohort", "expected an object");
  else {
    for (const key of ["matches", "players", "classifiedPlayers", "roleCoveragePct"]) {
      if (!finite(snapshot.cohort[key]) || snapshot.cohort[key] < 0) fail(`cohort.${key}`, "expected a non-negative number");
    }
    if (snapshot.cohort.classifiedPlayers > snapshot.cohort.players) fail("cohort.classifiedPlayers", "cannot exceed players");
    if (snapshot.cohort.roleCoveragePct > 100) fail("cohort.roleCoveragePct", "cannot exceed 100");
    for (const role of ["core", "support"]) {
      const value = snapshot.cohort.roles?.[role];
      if (!value || !finite(value.players) || !finite(value.matches)) fail(`cohort.roles.${role}`, "expected player and match counts");
    }
  }

  if (!snapshot.methodology || snapshot.methodology.minimumSample !== 200) fail("methodology.minimumSample", "expected 200");
  if (!Array.isArray(snapshot.items) || snapshot.items.length === 0) fail("items", "expected at least one item");
  else {
    const ids = new Set();
    const keys = new Set();
    snapshot.items.forEach((item, index) => {
      const path = `items[${index}]`;
      if (!Number.isInteger(item.id) || item.id <= 0) fail(`${path}.id`, "expected a positive integer");
      if (ids.has(item.id)) fail(`${path}.id`, "duplicate id");
      ids.add(item.id);
      if (!nonEmpty(item.key) || !/^[a-z0-9_]+$/.test(item.key)) fail(`${path}.key`, "expected a safe item key");
      if (keys.has(item.key)) fail(`${path}.key`, "duplicate key");
      keys.add(item.key);
      if (!nonEmpty(item.name)) fail(`${path}.name`, "required");
      if (!finite(item.cost) || item.cost <= 0) fail(`${path}.cost`, "expected a positive cost");
      if (!nonEmpty(item.image)) fail(`${path}.image`, "required");
      if (!Array.isArray(item.components) || !Array.isArray(item.attributes) || !Array.isArray(item.abilities)) fail(path, "components, attributes and abilities must be arrays");

      for (const role of ["core", "support"]) {
        const timing = item.timings?.[role];
        if (!timing) continue;
        for (const key of ["n", "p25", "median", "p75", "purchaseRatePct"]) {
          if (!finite(timing[key]) || timing[key] < 0) fail(`${path}.timings.${role}.${key}`, "expected a non-negative number");
        }
        if (timing.p25 > timing.median || timing.median > timing.p75) fail(`${path}.timings.${role}`, "quartiles must be ordered");
        if (timing.purchaseRatePct > 100) fail(`${path}.timings.${role}.purchaseRatePct`, "cannot exceed 100");
      }
    });
  }

  return errors;
}

export function assertDotaItemsSnapshot(snapshot) {
  const errors = validateDotaItemsSnapshot(snapshot);
  if (errors.length) throw new Error(`Invalid Dota item snapshot:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  return snapshot;
}

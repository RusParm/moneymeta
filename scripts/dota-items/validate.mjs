import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { dotaItemsConfig as config } from "./config.mjs";
import { assertDotaItemsSnapshot } from "./schema.mjs";

const path = resolve(import.meta.dirname, "../..", config.outputPath);
const snapshot = JSON.parse(await readFile(path, "utf8"));
assertDotaItemsSnapshot(snapshot);
console.log(`Valid Dota item snapshot: ${snapshot.items.length} items, ${snapshot.cohort.matches} matches, fetched ${snapshot.fetchedAt}.`);

import { dotaItemsUserAgent } from "./config.mjs";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * @param {string | URL} url
 * @param {string} label
 * @param {{attempts?: number, timeoutMs?: number, retryDelayMs?: number, fetchImpl?: typeof fetch, validate?: (data: any) => boolean}} options
 */
export async function fetchJson(url, label, options = {}) {
  const { attempts = 3, timeoutMs = 50_000, retryDelayMs = 2_000, fetchImpl = fetch, validate = () => true } = options;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: { "User-Agent": dotaItemsUserAgent, Accept: "application/json" },
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
      const data = await response.json();
      if (!validate(data)) throw new Error("Unexpected JSON shape");
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < attempts && retryDelayMs > 0) await sleep(attempt * retryDelayMs);
    }
  }
  throw new Error(`${label} failed after ${attempts} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

/** Try only the explicitly approved sources; never substitute saved match statistics.
 * @param {string[]} sources
 * @param {string} label
 * @param {Parameters<typeof fetchJson>[2]} options
 */
export async function fetchJsonFromSources(sources, label, options = {}) {
  const failures = [];
  for (const url of sources) {
    try { return { data: await fetchJson(url, label, options), url }; }
    catch (error) { failures.push(`${url}: ${error instanceof Error ? error.message : String(error)}`); }
  }
  throw new Error(`${label}: all maintained sources failed. ${failures.join("; ")}`);
}

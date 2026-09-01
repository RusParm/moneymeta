import { describe, expect, it } from "vitest";

const source = Object.values(import.meta.glob("../src/components/ConnectPage.astro", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>)[0] ?? "";

describe("local connection trust boundary", () => {
  it("reads an explicitly selected JSON file without a network request", () => {
    expect(source).toContain('type="file"');
    expect(source).toContain("await file.text()");
    expect(source).toContain('file.size > 64 * 1024');
    expect(source).not.toMatch(/\bfetch\s*\(/u);
    expect(source).not.toMatch(/XMLHttpRequest|WebSocket|sendBeacon/u);
  });

  it("keeps persistence and deletion behind explicit controls", () => {
    expect(source).toContain("[data-save-local]");
    expect(source).toContain("[data-clear-local]");
    expect(source).toContain("localStorage.setItem(storageKey");
    expect(source).toContain("localStorage.removeItem(storageKey");
  });

  it("rejects arbitrary JSON before showing it as a scenario", () => {
    expect(source).toContain('item.format !== "money-meta-scenario"');
    expect(source).toContain("item.version !== 1");
    expect(source).toContain("item.entries.length > 100");
  });
});

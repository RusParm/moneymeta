import { describe, expect, it } from "vitest";

const sourceFiles = import.meta.glob("../src/**/*.{astro,ts}", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>;

describe("editorial style", () => {
  it("keeps long dash characters out of public source copy", () => {
    const offenders = Object.entries(sourceFiles).flatMap(([file, source]) =>
      source
        .split("\n")
        .map((line, index) => ({ file, line: index + 1, text: line.trim() }))
        .filter(({ text }) => /[—–]/u.test(text))
    );

    expect(offenders).toEqual([]);
  });
});

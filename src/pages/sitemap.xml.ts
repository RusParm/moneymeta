import type { APIRoute } from "astro";

const paths = [
  "/",
  "/en/",
  "/dota-2/",
  "/en/dota-2/",
  "/gta-online/",
  "/en/gta-online/",
  "/gta-online/calculators/business-roi/",
  "/en/gta-online/calculators/business-roi/"
];

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://themoneymeta.com");
  const urls = paths.map((path) => `<url><loc>${new URL(path, origin)}</loc></url>`).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};

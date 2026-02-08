/**
 * Site configuration loader — reads /content/site-config.json.
 *
 * Provides typed access to global site settings (title, URL, author, etc.)
 * used by the root layout, SEO metadata, and RSS generation.
 */

import fs from "fs";
import path from "path";
import { SiteConfigSchema, type SiteConfig } from "./schema";

const CONFIG_FILE = path.join(process.cwd(), "content", "site-config.json");

let _cachedConfig: SiteConfig | null = null;

/**
 * Get the site configuration, validated against the schema.
 * Cached after first read (within the same build process).
 */
export function getSiteConfig(): SiteConfig {
  if (_cachedConfig) return _cachedConfig;

  const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
  const data = JSON.parse(raw);

  _cachedConfig = SiteConfigSchema.parse(data);
  return _cachedConfig;
}

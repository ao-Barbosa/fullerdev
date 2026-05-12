import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { PluginConfigSchema, type PluginConfig } from "./schema";
import { buildDefaultConfig } from "./defaults";

/**
 * Known config file locations in priority order.
 * Project-level overrides user-level (global).
 */
const CONFIG_FILES = [
  ".opencode/fullerdev.jsonc",
  ".opencode/fullerdev.json",
  "fullerdev.jsonc",
  "fullerdev.json",
];

/**
 * Resolve `${ENV_VAR}` placeholders in string values recursively.
 */
function resolveEnvVars(obj: unknown): unknown {
  if (typeof obj === "string") {
    return obj.replace(/\$\{(\w+)\}/g, (_, name) => process.env[name] ?? "");
  }
  if (Array.isArray(obj)) {
    return obj.map(resolveEnvVars);
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = resolveEnvVars(value);
    }
    return result;
  }
  return obj;
}

/**
 * Parse a JSON/JSONC file (strips comments and trailing commas).
 */
function parseJSONC(raw: string): unknown {
  // Strip single-line comments (// ...)
  const noLineComments = raw.replace(/\/\/.*$/gm, "");
  // Strip block comments (/* ... */)
  const noBlockComments = noLineComments.replace(/\/\*[\s\S]*?\*\//g, "");
  // Strip trailing commas
  const clean = noBlockComments.replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(clean);
}

/**
 * Load and validate the plugin configuration.
 * Searches project directory first, then global config.
 */
export function loadConfig(directory: string): PluginConfig {
  const searchPaths = [
    ...CONFIG_FILES.map((f) => join(directory, f)),
    ...CONFIG_FILES.map((f) => join(homedir(), ".config", "opencode", f)),
  ];

  for (const path of searchPaths) {
    if (existsSync(path)) {
      try {
        const raw = readFileSync(path, "utf-8");
        const parsed = parseJSONC(raw);
        const resolved = resolveEnvVars(parsed) as Record<string, unknown>;
        return PluginConfigSchema.parse(resolved);
      } catch (err) {
        console.warn(`[fullerdev] Failed to parse config at ${path}:`, err);
      }
    }
  }

  // Fall back to defaults
  console.log("[fullerdev] No config found, using built-in defaults.");
  return buildDefaultConfig();
}

/**
 * Get the active preset from the config.
 */
export function getActivePreset(config: PluginConfig) {
  const preset = config.presets[config.preset];
  if (!preset) {
    console.warn(
      `[fullerdev] Preset '${config.preset}' not found. Falling back to 'opencode-go'.`
    );
    return (
      config.presets["opencode-go"] ??
      Object.values(config.presets)[0]
    );
  }
  return preset;
}

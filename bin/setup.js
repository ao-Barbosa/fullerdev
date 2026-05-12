#!/usr/bin/env node

/**
 * fullerdev setup script
 *
 * Installs the plugin by:
 * 1. Adding "fullerdev" to the `plugin` array in opencode.json
 * 2. (Future) Copying skill files to the OpenCode config directory
 * 3. (Future) Generating a starter config file
 *
 * Usage:
 *   bunx fullerdev setup
 *   bunx fullerdev setup --project   (project-local install)
 *   bunx fullerdev setup --help
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { homedir } from "node:os";

const PKG_NAME = "fullerdev";

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    project: args.includes("--project") || args.includes("-p"),
    help: args.includes("--help") || args.includes("-h"),
  };
}

async function setup(projectLocal = false) {
  const configPath = projectLocal
    ? resolve(process.cwd(), "opencode.json")
    : resolve(homedir(), ".config", "opencode", "opencode.json");

  console.log(`\n${PKG_NAME} setup`);
  console.log(`  target: ${projectLocal ? "project" : "global (~/.config/opencode/)"}\n`);

  // Step 1: Load or create opencode.json
  let config;
  try {
    config = existsSync(configPath)
      ? JSON.parse(readFileSync(configPath, "utf-8"))
      : {};
  } catch {
    config = {};
  }

  // Ensure basic structure
  if (!config.$schema) config.$schema = "https://opencode.ai/config.json";
  if (!Array.isArray(config.plugin)) config.plugin = [];

  // Step 2: Add plugin to the config
  if (config.plugin.includes(PKG_NAME)) {
    console.log(`  [skip] ${PKG_NAME} already in opencode.json plugin array`);
  } else {
    config.plugin.push(PKG_NAME);
    console.log(`  [add] ${PKG_NAME} to opencode.json plugin array`);
  }

  // Step 3: Save config
  const configDir = dirname(configPath);
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

  // Step 4: Generate starter plugin config if it doesn't exist
  const pluginConfigPath = projectLocal
    ? resolve(process.cwd(), ".opencode", "fullerdev.jsonc")
    : resolve(homedir(), ".config", "opencode", "fullerdev.jsonc");

  if (!existsSync(pluginConfigPath)) {
    const starterConfig = {
      $schema: `https://unpkg.com/${PKG_NAME}@latest/fullerdev.schema.json`,
      preset: "opencode-go",
      azureDevOps: {
        orgUrl: "https://dev.azure.com/your-org",
        project: "YourProject",
        pat: "${AZURE_DEVOPS_EXT_PAT}",
      },
    };

    const pluginConfigDir = dirname(pluginConfigPath);
    if (!existsSync(pluginConfigDir)) {
      mkdirSync(pluginConfigDir, { recursive: true });
    }
    writeFileSync(pluginConfigPath, JSON.stringify(starterConfig, null, 2) + "\n");
    console.log(`  [create] starter config at ${pluginConfigPath}`);
  }

  console.log("\nDone! Restart OpenCode to activate the plugin.");
  console.log("\nNext steps:");
  console.log("  1. Edit your Azure DevOps settings in the config file");
  console.log("  2. Set AZURE_DEVOPS_EXT_PAT environment variable");
  console.log("  3. Run `opencode` and type `ping all agents` to verify");
}

const opts = parseArgs();
if (opts.help) {
  console.log(`
${PKG_NAME} setup

Usage:
  bunx ${PKG_NAME} setup              Install globally (~/.config/opencode/)
  bunx ${PKG_NAME} setup --project    Install in current project
  bunx ${PKG_NAME} setup --help       Show this help

After setup:
  - Edit config at ~/.config/opencode/${PKG_NAME}.jsonc
  - Set AZURE_DEVOPS_EXT_PAT in your environment
  - Restart OpenCode
`);
} else {
  setup(opts.project).catch((err) => {
    console.error("Setup failed:", err);
    process.exit(1);
  });
}

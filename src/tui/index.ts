import type { TuiPluginModule } from "@opencode-ai/plugin/tui";
import type { JSX } from "@opentui/solid";
import { createElement, insert, setProp } from "@opentui/solid";
import { readTuiSnapshot, readTuiSnapshotAsync, type TuiSnapshot } from "./tui-state";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PLUGIN_NAME = "fullerdev";
const PLUGIN_VERSION = "0.1.0";
const SIDEBAR_AGENTS = [
  "orchestrator",
  "explorer",
  "oracle",
  "librarian",
  "designer",
  "fixer",
  "devops",
] as const;

const BORDER = { type: "single" as const };

// ---------------------------------------------------------------------------
// Lightweight JSX factory helpers
// ---------------------------------------------------------------------------

type Child = JSX.Element | string | number | null | undefined | false;

function element(
  tag: string,
  props: Record<string, unknown>,
  children: Child[] = [],
): JSX.Element {
  const node = createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) setProp(node, key, value);
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    insert(node, child);
  }
  return node as JSX.Element;
}

function text(props: Record<string, unknown>, children: Child[]): JSX.Element {
  return element("text", props, children);
}

function box(props: Record<string, unknown>, children: Child[] = []): JSX.Element {
  return element("box", props, children);
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

function truncate(value: string, max = 28): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function formatModelName(model: string): string {
  const lastSlash = model.lastIndexOf("/");
  return lastSlash === -1 ? model : model.slice(lastSlash + 1);
}

function getSidebarAgentNames(snapshot: TuiSnapshot): string[] {
  const configured = Object.keys(snapshot.agentModels);
  return configured.length > 0
    ? configured
    : (SIDEBAR_AGENTS as unknown as string[]);
}

// ---------------------------------------------------------------------------
// Sidebar component build
// ---------------------------------------------------------------------------

function row(
  label: string,
  value: string,
  theme: { textMuted: unknown; text: unknown },
  valueColor?: unknown,
): JSX.Element {
  return box(
    { width: "100%", flexDirection: "row", justifyContent: "space-between" },
    [
      text({ fg: theme.textMuted }, [label]),
      text({ fg: valueColor ?? theme.text }, [value]),
    ],
  );
}

function buildConfigStatusRow(
  configInvalid: boolean,
  theme: { textMuted: unknown },
): JSX.Element | null {
  if (!configInvalid) return null;

  return box(
    { width: "100%", flexDirection: "column", marginTop: 1, marginBottom: 1 },
    [
      text({ fg: "orange" }, ["Config invalid"]),
      text({ fg: theme.textMuted }, ["Run doctor for details"]),
    ],
  );
}

function buildVersionBadge(
  version: string,
  theme: { accent: unknown; background: unknown; textMuted: unknown },
): JSX.Element {
  return box(
    {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    [
      box({ paddingLeft: 1, paddingRight: 1, backgroundColor: theme.accent }, [
        text({ fg: theme.background }, [PLUGIN_NAME]),
      ]),
      text({ fg: theme.textMuted }, [`v${version}`]),
    ],
  );
}

function buildAgentSection(
  snapshot: TuiSnapshot,
  theme: { text: unknown; textMuted: unknown },
): JSX.Element[] {
  return getSidebarAgentNames(snapshot).map((agentName) => {
    const model = snapshot.agentModels[agentName] ?? "pending";
    return row(
      agentName,
      truncate(formatModelName(model), 26),
      theme,
      theme.textMuted,
    );
  });
}

// ---------------------------------------------------------------------------
// Full sidebar render
// ---------------------------------------------------------------------------

function renderSidebar(
  snapshot: TuiSnapshot,
  version: string,
  theme: {
    accent: unknown;
    background: unknown;
    borderActive: unknown;
    text: unknown;
    textMuted: unknown;
  },
  configInvalid: boolean,
): JSX.Element {
  return box(
    {
      width: "100%",
      flexDirection: "column",
      border: BORDER,
      borderColor: theme.borderActive,
      paddingTop: 1,
      paddingBottom: 1,
      paddingLeft: 1,
      paddingRight: 1,
    },
    [
      buildVersionBadge(version, theme),
      buildConfigStatusRow(configInvalid, theme),
      box({ width: "100%", marginTop: 1 }, [
        text({ fg: theme.text }, ["Agents"]),
      ]),
      ...buildAgentSection(snapshot, theme),
    ],
  );
}

// ---------------------------------------------------------------------------
// TUI Plugin — main entry
// ---------------------------------------------------------------------------

const plugin: TuiPluginModule & { id: string } = {
  id: `${PLUGIN_NAME}:tui`,

  tui: async (api, _options, meta) => {
    const version = meta.version ?? PLUGIN_VERSION;
    let snapshot = readTuiSnapshot();

    // Poll state file for live updates every 2 seconds
    const renderTimer = setInterval(async () => {
      try {
        snapshot = await readTuiSnapshotAsync();
        api.renderer.requestRender();
      } catch {
        // Best-effort; ignore render errors
      }
    }, 2000);

    api.lifecycle.onDispose(() => {
      clearInterval(renderTimer);
    });

    // Register the sidebar_content slot
    api.slots.register({
      order: 900,
      slots: {
        sidebar_content() {
          return renderSidebar(
            snapshot,
            version,
            api.theme.current,
            false, // configInvalid — always false for now; can be wired later
          );
        },
      },
    });
  },
};

export default plugin;

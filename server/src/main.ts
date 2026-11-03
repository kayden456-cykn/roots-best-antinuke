import {
  rootServer,
  CommunityRoleEvent,
} from "@rootsdk/server-app";

const APP_NAME = "Root's Best AntiNuke";
const BURST_WINDOW_MS = 60_000;
const BURST_THRESHOLD = 4;

const recentRoleChanges: number[] = [];

type Severity = "info" | "warning" | "critical";

function safeDetails(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function logSecurityEvent(
  type: string,
  detail: unknown,
  severity: Severity,
): void {
  console.log(
    "[ROOTS_BEST_ANTINUKE]",
    JSON.stringify({
      at: new Date().toISOString(),
      app: APP_NAME,
      type,
      severity,
      detail: safeDetails(detail),
    }),
  );
}

function onRoleChange(type: string, event: unknown): void {
  const now = Date.now();
  recentRoleChanges.push(now);

  while (
    recentRoleChanges.length > 0 &&
    now - recentRoleChanges[0] > BURST_WINDOW_MS
  ) {
    recentRoleChanges.shift();
  }

  const burstDetected = recentRoleChanges.length >= BURST_THRESHOLD;

  logSecurityEvent(
    type,
    {
      event,
      countInWindow: recentRoleChanges.length,
      windowMs: BURST_WINDOW_MS,
    },
    burstDetected ? "critical" : "warning",
  );

  if (burstDetected) {
    console.warn(
      "[ROOTS_BEST_ANTINUKE] Possible role-change burst detected. " +
      "Review the community activity before taking action.",
    );
  }
}

async function main(): Promise<void> {
  rootServer.community.communityRoles.on(
    CommunityRoleEvent.CommunityRoleCreated,
    (event) => onRoleChange("role.created", event),
  );

  rootServer.community.communityRoles.on(
    CommunityRoleEvent.CommunityRoleDeleted,
    (event) => onRoleChange("role.deleted", event),
  );

  rootServer.community.communityRoles.on(
    CommunityRoleEvent.CommunityRoleEdited,
    (event) => onRoleChange("role.edited", event),
  );

  rootServer.community.communityRoles.on(
    CommunityRoleEvent.CommunityRoleMoved,
    (event) => onRoleChange("role.moved", event),
  );

  logSecurityEvent(
    "monitor.started",
    {
      watchedEvents: [
        "role.created",
        "role.deleted",
        "role.edited",
        "role.moved",
      ],
      burstThreshold: BURST_THRESHOLD,
      burstWindowMs: BURST_WINDOW_MS,
      enforcement: "disabled",
    },
    "info",
  );

  await rootServer.lifecycle.start();
}

main().catch((error: unknown) => {
  console.error("[ROOTS_BEST_ANTINUKE] Startup failed", error);
  throw error;
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

test("RouteLoadingOverlay handles popstate and history navigation cleanup", () => {
  const code = readFileSync(join(root, "app/components/route-loading-overlay.tsx"), "utf8");
  
  // Verify listeners for popstate, pageshow, focus, error, and visibilitychange exist
  assert.ok(code.includes('window.addEventListener("popstate"'), "popstate event listener must be registered");
  assert.ok(code.includes('window.addEventListener("pageshow"'), "pageshow event listener must be registered");
  assert.ok(code.includes('window.addEventListener("focus"'), "focus event listener must be registered");
  assert.ok(code.includes('window.addEventListener("error"'), "error event listener must be registered");
  assert.ok(code.includes('document.addEventListener("visibilitychange"'), "visibilitychange listener must be registered");
  
  // Verify fail-safe timeout exists
  assert.ok(code.includes("setTimeout"), "Fail-safe timeout must be implemented");
  
  // Verify body style reset
  assert.ok(code.includes('document.body.style.overflow = ""'), "Body overflow lock must be reset on cleanup");
  assert.ok(code.includes('document.body.style.pointerEvents = ""'), "Body pointer-events lock must be reset on cleanup");
});

test("ProjectOverlay cleans up body overflow styling on unmount", () => {
  const code = readFileSync(join(root, "app/components/project-overlay.tsx"), "utf8");
  assert.ok(code.includes('document.body.style.overflow = ""'), "ProjectOverlay must reset body overflow to empty string");
});

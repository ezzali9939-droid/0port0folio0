import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const projects = JSON.parse(readFileSync(join(root, "content/projects.json"), "utf8"));

test("contains the approved project inventory", () => {
  assert.equal(projects.length, 13);
  assert.equal(projects.reduce((sum, project) => sum + project.gallery.length, 0), 121);
});

test("all project images exist", () => {
  for (const project of projects) {
    assert.ok(existsSync(join(root, "public", project.cover)), project.cover);
    assert.equal(project.gallery.length, project.galleryCount);
    for (const image of project.gallery) assert.ok(existsSync(join(root, "public", image)), image);
  }
});

// The transcript a layer's suite writes for B9 (deployment/SPEC.md §4):
// `.tmp/transcripts/<layer>.txt`, byte-compared across two runs.
//
// Deterministic BY CONSTRUCTION, which is the whole point — no durations, no
// timestamps, no absolute paths, no run order. Sorted `file::full name status`
// lines and nothing else. A transcript carrying a duration would fail B9 on
// every run and teach everyone that B9 is noise; one carrying `moduleId` raw
// would bake this checkout's location into it and diverge on any other machine.
//
// One copy, referenced by each layer's vitest config, because two copies of a
// determinism rule is one copy too many. Lives in deployment/ because
// deployment owns process tooling (INTERFACES.md §3).
//
// Vitest 4 calls `onTestRunEnd(testModules)`. `onFinished` is kept for older
// majors: a reporter that silently stops firing is exactly the rot B9 exists to
// catch, and it would catch it — a layer that stops writing its transcript
// while a sibling still writes one fails the gate.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const rel = (p) => String(p ?? "").replace(ROOT, "");

export default class TranscriptReporter {
  constructor(layer) {
    this.layer = layer;
  }

  write(lines) {
    lines.sort();
    mkdirSync(`${ROOT}.tmp/transcripts`, { recursive: true });
    writeFileSync(`${ROOT}.tmp/transcripts/${this.layer}.txt`, lines.join("\n") + "\n");
  }

  // Vitest 4+
  onTestRunEnd(testModules = []) {
    const lines = [];
    for (const mod of testModules) {
      for (const test of mod.children.allTests()) {
        lines.push(`${rel(mod.moduleId)}::${test.fullName} ${test.result().state}`);
      }
    }
    this.write(lines);
  }

  // Vitest 2–3
  onFinished(files = []) {
    if (this.done) return;
    const lines = [];
    const walk = (tasks, file) => {
      for (const t of tasks ?? []) {
        if (t.type === "suite") walk(t.tasks, file);
        else lines.push(`${rel(file)}::${t.name} ${t.result?.state ?? "unknown"}`);
      }
    };
    for (const f of files) walk(f.tasks, f.name);
    this.write(lines);
  }
}

// SPIKE — not the exam runner. `../BUILD.md` Step 0 specs the graded scaffold
// (all sets, both S modes, an LLM judge, thresholds). This is the smallest thing
// that produces ONE number: N-set intent accuracy for one model, exact-match only.
// Do not grow it into the scaffold and do not read its number as qualification —
// `../EVALS.md §3` says what qualification is, and this is not it.
//
// Usage: OPENROUTER_API_KEY=... MODEL=<slug> node model/spike/run-nset.mjs

const key = process.env.OPENROUTER_API_KEY;
if (!key) {
  console.error("FAIL: set OPENROUTER_API_KEY (no key is committed or defaulted here)");
  process.exit(2);
}
// Before the first paid run (DR-7 is waived-until-live): confirm this default
// slug is still served on OpenRouter — a 404 here would read as a supply
// failure and it would only be a stale name.
// Default refreshed 2026-08-22: the previous default (openai/gpt-4o-mini,
// mid-2024) was ~18 months stale — a spike run against it would have graded a
// model nobody would bind. Same tier (cheapest mainstream), current family.
const model = process.env.MODEL ?? "openai/gpt-5-mini";

// The eight N-set seeds, verbatim from ../EVALS.md §2. Only the expected INTENT is
// graded — fields and ambiguities are rubric work the real scaffold owns.
const ITEMS = [
  ["N-01", "leave 5 minutes between teaching sessions", "rule.author"],
  ["N-02", "no student can book more than 10 hours a month", "rule.author"],
  ["N-03", "put a dive lesson Thursday 3 to 4", "commitment.create"],
  ["N-04", "actually make it 3 to 5", "commitment.edit"],
  ["N-05", "the bike came back Saturday morning", "commitment.complete"],
  ["N-06", "raise my rate to 120", "rule.edit"],
  ["N-07", "cancel day 3 and let James know", "commitment.cancel"],
  ["N-08", "students can book my teaching hours", "shared.author"],
];

// N-04 reads as an edit only against the prior turn; N-07 is a compound whose FIRST
// intent is graded. Both are stated to the model rather than inferred by it.
const CONTEXT = {
  "N-04": "The previous turn created a dive lesson on Thursday 3–4pm.",
  "N-07": "A multi-day course exists; day 3 is one of its commitments. Grade the FIRST intent of a compound.",
};

const INTENTS = [
  "commitment.create", "commitment.edit", "commitment.complete", "commitment.cancel",
  "commitment.confirm", "commitment.mark", "board.query", "board.edit", "rule.author",
  "rule.edit", "rule.override", "proposal.respond", "answer.provide", "grant.give",
  "grant.revoke", "exception.record", "sop.author", "shared.author", "shared.publish",
  "party.reenable", "import.fetch", "display.settings",
  "notify.request", "session.control",
];
// 2026-08-22: three members restored to enum fidelity — SPEC §2 is the one
// source ("an edit there is an edit here"); this list had lagged party.reenable
// and predated the import.fetch/display.settings rows.

// The `complete(model_id, messages, output_schema)` shape of ../INTERFACES.md §2.1,
// as OpenRouter spells it.
async function complete(messages) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "normalize",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["intent"],
            properties: { intent: { enum: INTENTS } },
          },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return JSON.parse((await res.json()).choices[0].message.content);
}

let passed = 0;
for (const [id, utterance, expected] of ITEMS) {
  const context = CONTEXT[id] ? `\nStored context: ${CONTEXT[id]}` : "";
  let got, note = "";
  try {
    ({ intent: got } = await complete([
      { role: "system", content: "Classify the owner's utterance into exactly one intent." },
      { role: "user", content: utterance + context },
    ]));
  } catch (e) {
    note = ` (${e.message.slice(0, 60)})`;
  }
  const ok = got === expected;
  if (ok) passed++;
  console.log(`${ok ? "pass" : "FAIL"}  ${id}  expected ${expected}, got ${got ?? "—"}${note}`);
}

console.log(`\n{ model_id: "${model}", N-set: ${passed}/${ITEMS.length} = ${(100 * passed / ITEMS.length).toFixed(1)}% }`);
console.log("Not a qualification. EVALS §3 is qualification; this grades one set, one mode, no judge.");

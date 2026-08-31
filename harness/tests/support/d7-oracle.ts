// The D7 spy oracle: every fact in a narration traces to a handle's display
// facet (SCENARIOS.md D7 — narration is read from stored structure's facets,
// never from the model's memory or the handle's internals).
//
// The mechanical half a spy CAN check: every value-like token in the narrated
// text — numbers, times, anything with a digit — appears in one of the facets
// the turn held. Aboutness beyond tokens stays a reading duty, exactly as the
// corpus states everywhere; this oracle is the tripwire, not the whole law.

export function narrationTracesToFacets(narration: string, facets: readonly string[]): { ok: true } | { ok: false; stray: string } {
  const valueTokens = narration.match(/\d[\d:.\-→]*/g) ?? [];
  for (const token of valueTokens) {
    if (!facets.some((f) => f.includes(token))) return { ok: false, stray: token };
  }
  return { ok: true };
}

// The routing tables — PLATFORM-AUTHORED, and that fact is code (FD-95,
// FDR-02 selection (a); harness/SPEC.md §4a).
//
// The loop routes intent → tool sequence DETERMINISTICALLY from these tables;
// the model never chooses the next call and is never shown the tool surface.
// The tables are data the platform ships with the domain pack — an owner
// configures values inside a table's steps, never the table set itself, and
// no model output can add, remove, or reorder a step at runtime.
//
// Step 5 (the loop) populates the table set when the routed intents land; what
// is pinned NOW is the shape and the authorship facts, so nothing built on top
// can quietly turn routing into a model choice.

/** One routed step: which seam verb fires. Arguments are assembled by the
 *  harness from stored structure at fire time — a table never embeds values. */
export type RoutingStep = { readonly verb: string };

/** intent → the ordered tool sequence the loop walks. */
export type RoutingTable = Readonly<Record<string, ReadonlyArray<RoutingStep>>>;

/** Who authors routing tables. A constant, not a config: FD-95 rules the
 *  tables platform-authored, so there is deliberately no seam, setting, or
 *  model path that could hold another value. */
export const ROUTING_TABLE_AUTHOR = "platform" as const;

/** The table set. Frozen: mutation at runtime is the defect FD-28/FD-95 exist
 *  to prevent, so the object refuses it structurally. Populated at Step 5. */
export const ROUTING_TABLES: RoutingTable = Object.freeze({});

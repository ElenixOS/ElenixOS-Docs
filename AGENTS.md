# AGENTS.md — Documentation Guidelines

This file defines how AI agents review and modify ElenixOS documentation.

These rules describe the documentation process, not current subsystem behavior. Keep them durable. Temporary implementation details, current bugs, and subsystem-specific facts belong in the documentation or issue that owns them, not in this file.

## Source of Truth

Chinese documentation is canonical.

- Modify Chinese documentation only.
- Do not directly edit generated English documentation.
- If an issue appears in English, locate and fix the corresponding Chinese source.
- If the Chinese source is correct but generated English is wrong, treat it as a translation or generation problem.
- Do not maintain Chinese and English documentation independently.

## Establish the System Model Before Writing

Do not write from filenames, recent commits, prompts, or assumptions about how similar systems usually work.

Before changing documentation, inspect enough of the relevant evidence to understand the behavior being documented. Depending on the task, this may include:

- implementation;
- public interfaces;
- configuration;
- initialization and registration paths;
- lifecycle code;
- existing documentation;
- historical documentation and Git history;
- tests and examples;
- development tools or platform integrations.

Use those sources as evidence. Do not turn the investigation process itself into documentation content.

Build a coherent model first: identify the responsible components, dependency direction, lifecycle, ownership, data and control flow, externally visible behavior, failure semantics, and relevant configuration.

When evidence conflicts, investigate. Do not assume that newer documentation is correct merely because it is newer, and do not assume the implementation is intentional merely because it exists.

If the available evidence does not establish a behavior or contract, do not invent one. State only what can be supported.

## Write for the Reader, Not the Repository

Documentation structure follows reader goals and prerequisite knowledge, not source-tree layout, commit history, or whatever the current prompt happens to emphasize.

Before adding substantial content, determine:

1. Who is the intended reader?
2. What question or task brings that reader to this page?
3. What should the reader understand or be able to do after reading it?
4. Is this information required here, or does it belong in a more specialized page?
5. Would adding it distort the perceived purpose of the page?

ElenixOS has multiple valid reader paths, including application developers, watchface developers, platform or BSP developers, vendor engineers, Core contributors, and users of auxiliary development tools. Do not silently treat one role as the default for the whole project.

Top-level entry pages should orient readers before specializing. They should explain what ElenixOS is, expose the major development paths, help readers choose the path that matches their goal, and then route them to a dedicated guide.

A general entry page is not the place to teach every role-specific workflow.

## Keep Documentation Types Distinct

Classify a page by its primary purpose before editing it.

### Concept / Architecture

Explain how the system works, why boundaries exist, how components relate, and which stable contracts shape behavior.

### Tutorial / How-to

Help the reader complete a concrete task from a defined starting state to a verifiable result.

### Reference

Provide exact APIs, configuration keys, formats, constants, schemas, protocol details, and other lookup-oriented information.

### Troubleshooting

Help diagnose and recover from known failure conditions.

Do not use one document type as a substitute for another. In particular:

- a reference page is not a substitute for architecture;
- a tutorial is not a substitute for a system model;
- an architecture page should not become a command-by-command tutorial;
- a routing page should not absorb the full contents of every guide it links to.

If a page appears to need incompatible kinds of content, reconsider the information architecture before adding more material.

## Describe the Implemented System, Not an Imagined Design

For documentation about existing behavior, write from the perspective of a finished system.

The default mode is **objective, declarative description**:

> The component delegates parsing and extraction to the shared package service.

Do not write the same fact as a design instruction:

> The component should not maintain a second parsing or extraction implementation.

The first sentence documents the system. The second sounds like an architecture review comment or a task for another coding agent.

This distinction is mandatory for concept, architecture, overview, and reference documentation.

### Prefer facts over prescriptions

When behavior is already implemented, state what the system does:

- `X uses Y.`
- `X owns Y.`
- `X delegates Z to Y.`
- `X and Y share the same pipeline.`
- `The runtime invalidates callbacks when their owner is destroyed.`
- `Data reaches consumers through the public service boundary.`

Avoid rewriting implemented behavior as:

- `X should use Y.`
- `X should not maintain another implementation.`
- `X needs to ensure ...`
- `Developers should avoid ...`
- `Remember to ...`
- `Make sure ...`
- `Do not forget ...`

These forms are appropriate only when the page is actually defining a requirement or instructing the reader to perform an action.

### Normative language requires a real contract

Words such as **MUST**, **MUST NOT**, **required**, **prohibited**, **should**, and their Chinese equivalents such as “必须”“不得”“应当”“不应” must not be used merely because an implementation choice is desirable.

Use normative language only when the statement is one of the following:

- an externally observable API or protocol contract;
- a platform or extension implementation requirement;
- an architectural invariant that implementations are required to preserve;
- a safety, correctness, or data-integrity requirement;
- a necessary action in a tutorial or operational procedure.

Where a factual formulation is sufficient, prefer it.

For example:

Bad:

> Clients should not modify protected state directly.

Better when enforced by the system:

> Clients do not have direct write access to protected state.

Bad:

> Consumers must access data through the service layer.

Better when describing architecture:

> The service layer exposes the data to consumers.

Acceptable when documenting an actual API precondition:

> The caller must initialize the sensor service before calling `foo()`.

### Do not preserve review comments as documentation

A bug fix, review comment, or design discussion may reveal a stable invariant. Document the invariant, not the reminder that produced it.

Bad:

> Do not only remove the recent-apps card, otherwise the application keeps running.

Better:

> Evicting an entry terminates the associated application and releases its owned runtime state.

Bad:

> Component A should not implement a second decoder.

Better:

> Component A and Component B use the shared decoding service.

If a design comment has no externally useful stable meaning, omit it rather than laundering it into documentation prose.

### Do not expose implementation advice without reader value

Before documenting an internal design detail, ask whether it helps the target reader understand, use, extend, implement, debug, or reason about the subsystem.

If not, leave it out.

An implementation detail is not documentation-worthy merely because it is technically true.

## Architecture Documents Contracts and Semantics

Architecture documentation should explain the stable relationships that readers need to reason about the system. Depending on the subsystem, this includes:

- responsibilities;
- boundaries;
- dependency direction;
- upper- and lower-layer contracts;
- data flow;
- control flow;
- lifecycle;
- ownership and ownership transfer;
- state and state transitions;
- asynchronous behavior and execution context;
- error propagation;
- capability model;
- extension points;
- replaceable implementations;
- architectural invariants.

Do not stop at low-information statements such as:

> The audio service provides audio playback.

Explain the non-obvious behavior and boundary conditions that developers need in order to use, extend, or implement the subsystem correctly.

Architecture should be implementation-independent where possible, but behaviorally precise.

Avoid replacing explanation with:

- full structs;
- enums;
- long API inventories;
- parameter tables;
- source-file inventories;
- line-by-line implementation walkthroughs.

Concrete API syntax belongs in reference documentation unless naming an API is necessary to explain a boundary.

## Explain Both Sides of a Boundary

For a subsystem between an upper consumer and a lower implementation, document both sides when relevant.

The upper-layer reader should be able to determine:

- how the capability is consumed;
- how results or events arrive;
- lifecycle behavior;
- error behavior;
- ownership and cleanup.

The lower-layer implementer should be able to determine:

- what capability must be provided;
- what Core already provides;
- how the implementation connects to Core;
- how data or state is reported;
- lifecycle requirements;
- ownership rules;
- execution-context constraints;
- which boundaries must not be bypassed.

A subsystem contract is incomplete if a developer still needs substantial source archaeology to discover these basics.

## Make Stable Hidden Knowledge Explicit

If a normal user or implementer would otherwise need to grep configuration, trace initialization, inspect source, or rely on trial and error to discover a stable and externally relevant fact, consider documenting it.

Examples include:

- initialization order;
- registration flow;
- request/response flow;
- publish/subscribe behavior;
- callback lifetime;
- cleanup rules;
- ownership transfer;
- state transitions;
- defaults;
- paths;
- ports;
- baud rates;
- timeouts;
- limits;
- units and scale;
- coordinate systems;
- time bases;
- invalid-value representation;
- availability state;
- fallback behavior;
- execution context;
- configuration entry points.

Do not document every internal constant. Document details whose omission would impose meaningful discovery cost on the intended reader.

### Configurable behavior

When externally relevant behavior is configurable, documentation should normally state:

- the default;
- whether it can be changed;
- where it is configured.

Do not say only that something is configurable while forcing readers to search the source for the actual default or configuration entry.

### Data semantics

For externally visible data, document relevant:

- units;
- scale;
- valid range;
- coordinate system;
- time base;
- invalid representation;
- availability state.

A number without its semantics is incomplete documentation.

### Failure semantics

Where relevant, explain what happens when:

- a capability is unavailable;
- initialization fails;
- no implementation exists;
- a resource limit is reached;
- data is invalid;
- an operation times out;
- an owner is destroyed before asynchronous completion.

Do not require readers to discover basic failure behavior by debugging Core.

## Preserve Valid Architecture Knowledge

Do not aggressively simplify existing architecture documentation.

Before deleting or heavily rewriting content, determine whether it contains still-valid knowledge about:

- lifecycle;
- ownership;
- cleanup;
- data or control flow;
- asynchronous behavior;
- extension points;
- capability semantics;
- implementation contracts;
- architectural invariants.

If the information is still valid, preserve its meaning even if the prose is rewritten.

Delete content when it is demonstrably:

- obsolete;
- incorrect;
- duplicated;
- meaningless;
- implementation-only detail with no reader value;
- misplaced reference material;
- misplaced history or changelog content.

A shorter document is not automatically a better document.

## Tutorials and How-to Guides Must Be Executable

A task-oriented guide must take the reader from a stated starting point to a concrete, verifiable result without requiring undocumented guesses.

Every tutorial should have a clear outcome, such as:

- build ElenixOS for a supported target;
- create and run an Application;
- create and package a Watchface;
- build and inspect a package;
- run an Application in the Simulator;
- connect to a device and view logs;
- add a supported platform capability.

“Understand this feature” is not a tutorial outcome; it belongs in conceptual documentation.

### Provide the complete working path

Where applicable, include:

1. prerequisites;
2. required tools;
3. repository or project setup;
4. target selection;
5. configuration;
6. exact commands;
7. files to create or modify;
8. complete minimal code when code is required;
9. build;
10. packaging, flashing, deployment, or execution;
11. expected result;
12. cleanup, restart, or state-reset steps when required;
13. the next useful step.

Do not omit intermediate actions merely because maintainers already know them.

### Commands must be concrete and verified

When the reader needs to execute a command, show the actual command and state the working directory when it matters.

Verify commands against the current repository, such as:

- build scripts;
- README files;
- Makefile or CMake configuration;
- package scripts;
- VS Code tasks;
- CI workflows;
- project tooling;
- working examples.

Never invent a command because it resembles another project's workflow.

Commands, menu entries, configuration keys, project types, output files, and UI actions must use their exact current names when those identifiers matter. Do not preserve an obsolete name merely because older documentation already uses it.

If multiple workflows exist, identify the recommended path and distinguish alternatives.

### Code examples must be usable

When a task requires code, provide the smallest complete example that correctly demonstrates the task.

Make clear:

- which file is created or modified;
- where the code belongs;
- required includes or surrounding context;
- initialization and registration;
- relevant lifetime requirements;
- build integration when necessary;
- what the important lines do.

Do not dump unrelated boilerplate merely to make an example look complete.

Use pseudo-code for conceptual explanation, not as a substitute for real code in an executable tutorial unless it is explicitly labeled as non-executable.

### Show success conditions

After important steps, state what success looks like. This may be:

- an output artifact;
- a package path;
- a firmware image;
- a visible screen;
- a log message;
- a detected device;
- an analyzer result.

The reader should be able to distinguish success from a silent failure.

Add short troubleshooting notes only for likely blockers directly related to the workflow. Broader diagnosis belongs in dedicated troubleshooting documentation.

### State prerequisites before the workflow

Do not reveal required dependencies halfway through the tutorial.

List only prerequisites that are actually needed for that workflow, such as host environment, toolchain, VS Code extension, board, SDK, or environment variable.

Link to detailed installation instructions when appropriate, but do not hide information required to complete the current task behind another page.

### Keep one primary path

A tutorial should present one clear recommended workflow. Alternative or advanced workflows may follow, but they must not compete with the primary path for a first-time reader.

A tutorial may use one board, one application, or one environment as a concrete example. State that scope explicitly and do not imply that example-specific behavior is a system-wide contract.

### Quick Start has a special responsibility

A Quick Start should provide the shortest supported path from a fresh development environment to a meaningful working result:

```text
prepare
→ configure
→ build
→ run or deploy
→ verify success
```

It may link to deeper setup, architecture, and reference pages, but the core path should remain executable from the Quick Start itself.

Do not turn Quick Start into a directory of “Learn about X” links before the reader has accomplished anything.

At the same time, do not assume that one specialized workflow is universal. If ElenixOS serves multiple major reader roles, the entry experience should orient and route readers before sending them into a role-specific tutorial.

### Clean-room walkthrough

Before considering a tutorial complete, mentally execute it as a technically competent developer who knows the programming language and tools but knows nothing about ElenixOS.

At every step ask:

- What exact command do I run?
- Where do I run it?
- What file do I edit?
- Where does the shown code go?
- What should I see after this step?
- What do I do next?
- Did the document assume knowledge that was never introduced?

If a required action must be guessed, the tutorial is incomplete.

## Keep Information in the Right Place

Do not solve every documentation problem by expanding the page nearest to the changed code.

Place information according to purpose:

- overview;
- architecture;
- subsystem contract;
- application guide;
- watchface guide;
- platform or vendor guide;
- configuration;
- reference;
- tooling;
- troubleshooting.

Correct information in the wrong place still produces poor documentation.

Before inserting a new tutorial, command sequence, screenshot, or technical section, inspect the surrounding hierarchy and determine the correct destination.

The user's prompt describes the information need. It does not automatically determine where that information belongs.

Do not let recent task context redefine the documentation hierarchy.

## Use Progressive Disclosure

Organize information from general to specialized:

```text
What is the system?
        ↓
What are the major paths?
        ↓
Which path matches my goal?
        ↓
How do I complete the first task?
        ↓
How does the subsystem work?
        ↓
What are the exact APIs and configuration options?
```

Do not expose specialized implementation detail before the reader has enough context to know whether it is relevant.

The goal is not to make every page self-contained. The goal is to let every reader find the correct next page without already understanding the entire system.

## Use Explicit Subjects and Precise Semantics

Make ownership and action clear.

Prefer:

> The runtime invalidates callbacks owned by the destroyed context.

over:

> The callbacks are then invalidated.

Readers should be able to identify which component performs an action and which component owns the affected state.

Avoid vague or low-information prose such as:

> The storage service manages storage.

Every meaningful section should teach something non-obvious: a boundary, flow, lifecycle, ownership rule, constraint, configuration rule, failure mode, or design decision.

If there is not enough meaningful material, inspect the implementation instead of padding the page.

## Keep System and Tooling Concepts Separate

Do not confuse ElenixOS itself with development tools, simulators, debugging utilities, package tools, test environments, or other auxiliary workflows.

A tool may be important without becoming the conceptual center of the system.

Do not present an auxiliary environment as the default deployment model unless that is genuinely true.

## Navigation and Cross-Document Consistency

A page does not exist in isolation.

When changing a concept or workflow, check relevant:

- navigation;
- Quick Start links;
- page titles;
- cross-references;
- old instructions;
- duplicated explanations;
- conflicting contracts.

The wording of a link must match the actual responsibility of the destination page. A broad label must not lead to a narrow special-case page.

When a mismatch exists, fix the link wording, page title, page scope, or documentation structure rather than leaving a misleading route in place.

A locally correct page can still leave the documentation globally inconsistent.

## Use Diagrams Only When They Clarify Structure or Behavior

Use diagrams when they improve understanding of:

- system domains;
- data flow;
- control flow;
- lifecycle;
- state;
- ownership;
- interaction sequences.

Do not create diagrams merely to make a page look complete, and do not merge unrelated workflows into one diagram merely to reduce diagram count.

### Avoid ASCII relationship diagrams

Do not use ASCII-art flow diagrams, arrow chains, tree-shaped relationship diagrams, or pseudo-architecture diagrams in documentation unless a diagram is explicitly required.

For example, avoid forms such as:

```text
    Component A
        │
        ▼
    Component B
        ├── responsibility X
        └── responsibility Y
```

and:

```text
    A -> B -> C
```

when the same relationship can be stated clearly in normal prose.

Simple ownership, dependency, trust, lifecycle, and API-boundary relationships should be described in concise technical prose. Use lists or tables only when they convey genuinely structured information.

Diagrams are reserved for relationships whose topology, concurrency, state transitions, or data flow would be materially harder to understand in prose. Do not create a diagram merely to make a section appear more architectural.

## Make Minimal, Intentional Changes

Do not rewrite unrelated documentation merely to impose stylistic uniformity.

Respect existing terminology and structure unless they are part of the problem being fixed.

Broader restructuring is justified when it materially improves correctness, information architecture, discoverability, or usability.

When restructuring, preserve valid technical meaning and update affected navigation and cross-references.

## Mandatory Prose Audit

After drafting or revising documentation, perform a dedicated prose pass before considering the task complete.

### Search for review-style or advisory wording

In Chinese documentation, inspect occurrences of terms such as:

- 应该;
- 应当;
- 不应;
- 不应该;
- 必须;
- 不得;
- 需要;
- 建议;
- 最好;
- 避免;
- 不要;
- 务必;
- 确保;
- 记得.

In English documentation or examples, inspect terms such as:

- should;
- should not;
- must;
- must not;
- need to;
- make sure;
- remember to;
- do not forget;
- avoid.

Do not mechanically delete these words. Classify each occurrence.

Keep it only if it expresses:

1. a real API, protocol, platform, or architectural contract;
2. a necessary tutorial or operational step;
3. a safety, correctness, or data-integrity requirement;
4. an explicitly labeled recommendation where recommendation is genuinely the page's purpose.

Otherwise, rewrite it as a factual description of current behavior or remove it.

### Detect role drift

Reject prose that sounds like:

- a code review comment;
- an instruction to another AI agent;
- an implementation TODO;
- a future design proposal presented as current behavior;
- a maintainer reminder embedded in user documentation.

Typical warning signs include:

> X should reuse Y.

> X should not maintain another implementation.

> Make sure X is cleaned up.

> Do not only update A; remember B.

For implemented behavior, convert these to factual system statements only after verifying them against the current implementation.

### Distinguish facts, contracts, recommendations, and future work

Every normative-looking statement should clearly belong to one of these categories:

- **Current behavior:** what the system currently does.
- **Contract:** what callers or implementations are required to do.
- **Recommendation:** an explicitly non-mandatory best practice.
- **Future work:** planned or unimplemented behavior, clearly labeled as such.

Do not blur these categories.

## Reader Audits

Before finishing, perform the audits relevant to the changed pages.

### First-time reader audit

Assume a technically competent reader who:

- has never read the source;
- does not know project conventions;
- does not know hidden defaults;
- is trying to complete a concrete task.

Ask whether the reader can understand the page's purpose and complete the ordinary task without unnecessary source-code archaeology.

### Implementer audit

For extension, porting, or subsystem-contract documentation, verify that an implementer can determine:

- where their implementation belongs;
- what Core already provides;
- what they must provide;
- how data and control flow;
- who owns lifecycle and resources;
- how failures are reported;
- which boundaries are contractual.

### Reader-role audit

For entry pages and navigation, simulate several plausible first-time readers with different goals.

Check that each can recognize the path intended for them without being forced through unrelated tools or workflows.

### Prompt-bias audit

Ask whether a feature became prominent mainly because the current task or prompt emphasized it.

If so, reassess its placement and navigation weight.

Recent work should improve the relevant documentation, not redefine the whole documentation system.

## Final Verification

Before completing a documentation change, verify all applicable items below.

### Source and correctness

- Only canonical Chinese documentation was edited.
- Generated English documentation was not manually changed.
- Statements about current behavior were verified against sufficient evidence.
- No unsupported contract or behavior was invented.
- Conflicting evidence was investigated rather than silently resolved by assumption.

### Reader and structure

- The page has a clear audience and purpose.
- The content belongs at this location in the documentation hierarchy.
- Entry pages orient before specializing.
- Role-specific material is routed to role-specific guides where appropriate.
- Navigation and link wording match reader expectations.
- Tools and auxiliary environments are positioned correctly.

### Technical completeness

- Existing valid architecture knowledge was preserved.
- Stable contracts are explained instead of replaced by source-code dumps.
- Lifecycle, ownership, data flow, execution context, and error behavior are clear where relevant.
- Hidden defaults, configuration entry points, data semantics, and failure behavior are documented when readers need them.
- A normal developer does not need unnecessary source-code archaeology for ordinary use.

### Prose and narrative mode

- The documentation describes the system rather than the AI task, code review, or design conversation.
- Implemented behavior is written as factual behavior, not as advice about how it should be implemented.
- Normative language is reserved for actual contracts, requirements, and procedural steps.
- Recommendations and future work are explicitly identified instead of being presented as current behavior.
- Subjects, ownership, and actions are explicit.
- Low-information filler has been removed.

### Tutorials and procedures

- Commands are concrete and verified.
- Working directories are stated where necessary.
- Required files and code placement are explicit.
- Prerequisites appear before the first dependent step.
- Expected success conditions are visible.
- Required build, packaging, deployment, restart, cleanup, or reset steps are not omitted.
- The primary path is clear and executable.

The goal is not to maximize documentation volume or stylistic uniformity. The goal is to make ElenixOS understandable, usable, extensible, and debuggable while keeping its documentation architecture coherent and maintainable as the system evolves.

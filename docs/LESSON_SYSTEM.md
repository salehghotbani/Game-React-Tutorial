# Lesson system

## Curriculum

`packages/challenges` holds chapter concepts and skill/room metadata in curriculum.ts, foundation lessons in index.ts, incremental practice/Todo in content.ts and advanced lessons/projects in advanced.ts. The 54 exercises cover eight formats. Each defines canonical tests, prerequisites, skills, hints, solution, chapter and optional mastery/project metadata. Tests use behavior and explicit source evidence; no substring matching of answers.

`teaching.ts` supplies sequenced lessons for every exercise. Concepts are introduced through definitions, purpose, annotated code and distinct runnable examples. A novice starts with React, HTML tags, functions, return/export and JSX; prediction questions and the editor are hidden until that exercise's explanation is completed. `advanceLesson` accepts only the next step of an available exercise. The reducer also rejects premature quiz answers and completion awards. Reviewing teaching examples has no assistance penalty. The library exposes the same expanded content, but opening it alone does not mark a skill introduced.

## Workspace controls

Teaching uses syllabus and explanation/example panes. Practice uses learning path, instructions, editor/questions and preview/execution panes. Each can be resized by dragging its separator or using arrow keys, independently closed with its header button and reopened from the toolbar. Reset layout restores all panes. Below 1100 px, the separators adjust pane heights in a vertical scrolling workspace. Closing a pane hides it without unmounting its contents, so draft editing, live examples and preview state remain intact. Layout preferences are saved separately for teaching and practice and never change XP or lesson progress.

## Compiler and runtime

Babel compiles JSX/module syntax in a disposable worker with a deadline. Files are bounded to 64 KiB, loop iterations to 10,000, and repeated component invocations to 300 per preview generation. Reserved instrumentation names cannot be used in submitted source. AST evidence records functions, original line spans, component names, imported hooks and JSX edges/prop names. JSX edges are source relationships, not a complete runtime React fiber tree.

Local React is the default. An opaque-origin iframe has sandbox allow-scripts and a no-network CSP. It bundles actual React/DOM, Router, Redux Toolkit/React Redux, TanStack Query and Testing Library. Only supported imports are accepted. Instrumented React state/effect/createElement wrappers emit bounded live observations; Redux dispatch and Query cache subscriptions show their real library transitions. Component instrumentation counts invocations, not commits or production performance timings.

The bridge supplies project-scoped localStorage and deterministic fetch responses for weather, movies, users and failure. Requests have latency and support AbortSignal. This is clearly labeled as a lesson API. Preview data persists to the parent; judging starts each test with empty storage and a controlled clock, then restores preview data. All DSL interactions target the mounted React DOM. Fake ticks allow stale-closure and interval-cleanup tests without long delays. Testing exercises call actual Testing Library and run the learner's test against a healthy counter and a deliberately broken implementation.

Auto mode attempts WebContainers; explicit Vite mode reports failure. Generated projects specify pnpm and install/start with pnpm. Boot, install, server and iframe deadlines are bounded. Network/compatible browser/isolation headers are required for WebContainers. The local engine is independent of that service. postMessage receivers check the expected iframe/parent window and channel; storage and profile data are bounded. Isolation is for an educational preview, not a hardened arbitrary-code service.

## Judging and rewards

Runtime results combine with source constraints and current question answers. Every mandatory canonical test must pass, with unique test IDs. The progression reducer validates prerequisites and an exact source/answer snapshot before recording an attempt or reward; editing during evaluation cannot award stale work. Quiz evaluations use the same canonical test definitions without requiring an iframe run.

Text checks normalize Unicode/whitespace and ignore English capitalization and terminal sentence punctuation for prose. Numbers, signs, decimal amounts, addresses and meaningful input/output values remain checked. Tests can request exact comparison where punctuation is itself meaningful. The first exercise checks a nonempty heading and paragraph with the learner's own wording. JavaScript syntax must still compile; style, optional semicolons and quote choice are not grading criteria.

Completion receipts store the earned hint-adjusted XP, coins, assistance, time and mastery flag. The stable localStorage key migrates versions 1/2 to version 3, including partially completed teaching steps; old totals are re-derived and old completions never automatically become mastery. Assistance survives navigation/reset/reload. Dedicated mastery exercises disable hints and solutions and reducer rules enforce the same requirement. Project drafts are copied only into a new mission, never over an existing saved draft. API-preview storage uses a project namespace.

Quality cards report actual correctness and explicit structural constraints. Readability and performance remain unscored unless evidence supports a measurement. Daily XP is separate and capped once per date, review updates do not award lesson XP again, and arcade scores do not grant XP.

## Adding a lesson

Add a stable id, existing chapter, reachable prerequisites, declared skill IDs, meaningful instructions, a starter and reference solution, four graduated hints and canonical tests. For mastery use a fresh task and set mastery true. For project missions supply a contiguous step and reuse the previous task's starter contract. Provide appropriate teaching steps and a different executable example in teaching.ts. Expand the test DSL only in shared contracts and bridge, then verify both pure source/answer checks and actual browser behavior. The curriculum browser sweep executes every reference solution, including timers, API errors, routing, Redux/Query and learner-written tests.

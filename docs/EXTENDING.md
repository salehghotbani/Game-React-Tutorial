# Extension recipes

[Documentation index](README.md) · [Architecture](ARCHITECTURE.md) · [Contributing](../CONTRIBUTING.md)

These recipes map a contribution to its source files, contracts and validation. Read neighboring implementations before copying a pattern.

## Add or revise an exercise

Content is assembled in [the challenge registry](../packages/challenges/src/index.ts): foundation exercises in that file, incremental practice/Todo in [content.ts](../packages/challenges/src/content.ts), and advanced/project exercises in [advanced.ts](../packages/challenges/src/advanced.ts). Chapter/skill/room definitions live in [curriculum.ts](../packages/challenges/src/curriculum.ts). Shared types are in [packages/shared](../packages/shared/src/index.ts).

A small illustrative exercise looks like this; add canonical Persian wording and English catalog entries when integrating it into the real curriculum:

```ts
import type { Challenge } from '@react-quest/shared';

const exercise: Challenge = {
  id: 'greeting-practice',
  title: 'A personal greeting',
  topic: 'JSX',
  description: 'Build a heading using your own words.',
  instructions: ['Render a nonempty h1 in the default App component.'],
  starterFiles: { 'src/App.jsx': 'export default function App() { return <main />; }' },
  solution: 'export default function App() { return <main><h1>Welcome</h1></main>; }',
  tests: [{
    id: 'visible-greeting',
    name: 'The heading has content',
    mandatory: true,
    steps: [{ type: 'nonempty-text', selector: 'h1' }],
  }],
  hints: [
    'A heading describes a section of the page.',
    'Put an h1 inside the returned main element.',
    'Give the heading your own nonempty text.',
    'Check that the heading is rendered, then submit.',
  ],
  prerequisites: ['hello-react'],
  chapterId: 1,
  skills: ['jsx'],
  kind: 'write',
  xp: 100,
  coins: 10,
};
```

The example is a shape reference, not a complete new curriculum mission. To integrate a task:

1. Pick a stable, unique ID, an existing chapter and declared skills. Every prerequisite must be reachable; cycles or missing IDs make a lesson unavailable. Chapter IDs currently run from 0 through 14.
2. Provide a compiling `src/App.jsx` starter, a working reference solution, four graduated hints, and meaningful canonical tests with unique IDs. The solution must satisfy the behavior as well as source/question requirements.
3. Provide beginner explanations in [teaching.ts](../packages/challenges/src/teaching.ts). `getTeachingLesson` starts from the chapter and applies exercise-specific steps; add a branch when the chapter's generic explanation is insufficient. Teaching includes definitions, purpose and a distinct runnable example before assessment. Finish with the existing `ready` step; keep step IDs unique.
4. Use `questionId` tests for read/predict questions, and keep canonical answer indexes stable. Code tasks should test mounted React behavior. Avoid checking arbitrary prose or formatting when the goal is a concept.
5. A mastery task must be a fresh assessment with `mastery: true`; reducers disable hints and solution access. A project mission needs a declared project ID and contiguous step sequence starting at 1. Never overwrite an existing learner draft when carrying it forward.
6. Translate new authored text/snippets, then run curriculum, teaching, localization and real browser judge checks.

Useful commands:

```sh
pnpm test packages/challenges/src/curriculum.test.ts packages/challenges/src/teaching.test.ts packages/localization/src/messages.test.ts
pnpm test:e2e tests/e2e/education.spec.ts --grep "all curriculum reference solutions" --trace off
pnpm test:e2e tests/e2e/locale.spec.ts --grep "all English curriculum solutions" --trace off
```

The registry-driven sweeps include newly registered exercises automatically. Existing tests also enforce every chapter/format, four hints, prerequisite reachability, contiguous projects and a mastery opportunity for each declared skill. Update an assertion only when the underlying curriculum contract intentionally changes.

## Extend the behavioral test DSL or runtime

`TestStep`, `ChallengeTest`, compiler analysis and result contracts live in [shared types](../packages/shared/src/index.ts). Actual DOM actions/assertions are implemented in [preview/bridge.ts](../packages/learning-engine/src/preview/bridge.ts). Source/question checks are combined in [evaluation.ts](../packages/learning-engine/src/evaluation.ts), and compilation/instrumentation lives under [compiler](../packages/learning-engine/src/compiler/compile.ts).

Adding a step means updating the contract and bridge behavior, providing a real mounted-component regression, and verifying existing steps. Do not make a new step silently pass. Use controlled clocks for timer behavior and deterministic fixtures for request states instead of adding network-dependent exercises.

The local runtime accepts bundled React plus Router, Redux Toolkit/React Redux and React Query through [local-entry.ts](../packages/learning-engine/src/preview/local-entry.ts); Testing Library supports the student-test harness. Installing a library into `apps/web` does not automatically expose it to learner code. A new supported import needs deliberate runtime bundling, bridge/compiler compatibility and both local/optional engine consideration. See [Lesson system](LESSON_SYSTEM.md) for deadlines and isolation limits.

Preserve source-checked message channels, disposable worker generations, resource bounds and evaluation snapshots. Runtime observations must remain bounded. Progress/reward changes belong in reducers with migration and stale-result tests, not in an iframe message handler.

## Add translated UI or teaching content

Canonical authored text is Persian. Add the English equivalent to [en.json](../packages/localization/src/en.json) keyed by the exact authored Persian string. Use `tx`/`t` and the existing language subscription at presentation boundaries. Dynamic catalog templates use `{0}`, `{1}`, etc.; translations must keep their argument order and meaning.

Authored code examples/starters are translated by [authoredCode.ts](../packages/localization/src/authoredCode.ts) using catalog entries recognized by its snippet rules. Add mappings for new snippets and verify that translated examples still compile and preserve source analysis. Do not translate saved drafts, IDs, test selectors, answer indexes, API values or learner-entered text.

Check both `lang`/`dir` modes, RTL/LTR splitter motion, readable labels, keyboard focus and a narrow viewport. The locale tests deliberately use a Persian browser/time zone with a non-Iran country to detect accidental locale-based automatic selection.

## Change geometry, movement or vehicle rules

- [world/layout.ts](../packages/game/src/world/layout.ts) owns bounds, floor areas, ceilings, residents, trees and physical footprints.
- [config.ts](../packages/game/src/config.ts) and [PhysicsWorld.tsx](../packages/game/src/physics/PhysicsWorld.tsx) assemble the physical world.
- [navigation.ts](../packages/game/src/logic/navigation.ts) shares collider geometry for walking routes; a visible object and its collision/navigation footprint must agree.
- [PlayerController.tsx](../packages/game/src/player/PlayerController.tsx), [locomotion.ts](../packages/game/src/logic/locomotion.ts) and [WorldCamera.tsx](../packages/game/src/camera/WorldCamera.tsx) own movement and camera behavior.
- [vehicles](../packages/game/src/vehicles/driving.ts) separates pure driving rules from physical controllers, navigation/exit queries and rendering.

Rapier cuboid arguments are **half-extents**, not full dimensions. The shared simulation is fixed at 60 Hz. Ground height, avatar/capsule/eye height, ceiling clearance and walkable doors need to remain consistent. Collision groups must be explicit: ordinary static geometry belongs to group 0; outer bounds use group 3, traffic group 1, and the learner's car group 2. The current filters intentionally allow traffic to wrap outside the world while containing the learner.

Keep the enlarged ground's moderate tiles and shared edges unless a replacement has real contact-precision evidence. Use refs for simulation and sampled telemetry for the UI. Verify pause/focus-loss behavior, grounded movement, sprint/jump, navigation around furniture and safe vehicle exits with actual Rapier tests and rendered browser checks. Merely drawing a model does not make it a reachable interaction.

## Add a room activity or persisted reward

Read [useRoomActivities.ts](../apps/web/src/hooks/useRoomActivities.ts), [RoomActivities.tsx](../apps/web/src/components/RoomActivities.tsx), [gameSlice.ts](../apps/web/src/store/gameSlice.ts) and [roomLife.ts](../apps/web/src/store/roomLife.ts).

Define the interaction's position/radius, accessible approach, pause/input behavior, optional seat/camera pose and a clear exit path. Use an existing mode or add its contract in shared types and handle it across controllers, camera and UI. A locked action needs the same gate in its reducer/domain rule and presentation.

Rewards derive from validated exercise completions/receipts. Add persisted fields through restoration/migration, bound untrusted values, and test once-only awards, reload and malformed historic profiles. Rendering should display earned state, not mint it. Books and videos are learning resources but do not grant exercise completion just for opening them.

## Change tooling or dependencies

Declare dependencies in the owning workspace manifest and install from the root with pnpm. Internal dependencies use `workspace:*`; root build/type/test tools use root devDependencies. Update the lockfile and dependency explanation in [Architecture](ARCHITECTURE.md), then verify a frozen install. New scripts need both a discoverable README link and development/testing instructions. Keep caches, generated bundles and local test profiles out of Git.

# Challenges

Content for 15 chapters, 54 exercises in eight formats, 18 skills, seven incremental projects and nine knowledge rooms. This package owns teaching and canonical exercise definitions; rendering, execution and reward state live elsewhere.

| Source | Purpose |
|---|---|
| `src/index.ts` | Foundation exercises and the combined registry/public exports |
| `src/content.ts` | Additional practice, questions and Todo missions |
| `src/advanced.ts` | Advanced exercises, project definitions and fixture endpoints |
| `src/curriculum.ts` | Chapter concepts, skills, rooms and formats |
| `src/teaching.ts` | Beginner explanations and runnable examples before assessment |

Keep stable IDs, reachable prerequisites, four graduated hints, compiling starters/solutions and behavior-based tests. Add English catalog coverage alongside canonical Persian content. A new exercise also needs suitable teaching before questions or editing.

From the repository root, run `pnpm test packages/challenges/src/curriculum.test.ts packages/challenges/src/teaching.test.ts`, then the relevant real browser judge sweep. Pure compilation/source checks do not prove DOM behavior.

See [extension recipes](../../docs/EXTENDING.md), [lesson contracts](../../docs/LESSON_SYSTEM.md), [testing](../../docs/TESTING.md) and [contributing](../../CONTRIBUTING.md).

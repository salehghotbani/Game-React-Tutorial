# React Quest Development Rules

## Stack

- Frontend: React 19, strict TypeScript, Vite, Chakra UI, React Router, Redux Toolkit.
- Game: Three.js, React Three Fiber 9, Drei, Rapier.
- Future backend: FastAPI and PostgreSQL. Do not implement it before its stage is requested.

## Rules

- Read docs/PRODUCT.md and docs/ARCHITECTURE.md before changing the project.
- Keep game logic separate from rendering and learning logic separate from the game.
- Use TypeScript strict mode. Avoid `any`.
- Prefer focused, reusable components and pure logic that can be tested.
- Add meaningful tests for business logic and movement/collision behavior.
- Justify dependencies in docs/ARCHITECTURE.md; avoid unrelated changes.
- Run typecheck, lint, tests, and build before completing a task.
- Use pnpm for installation, workspace scripts and generated challenge projects.
- Current scope includes the education-focused curriculum: mastery, varied challenges, visual execution, incremental projects, knowledge rooms, reviews and recommendations.
- Do not implement additional systems unless explicitly requested.

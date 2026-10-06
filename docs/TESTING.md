# Testing guide

[Documentation index](README.md) · [Development](DEVELOPMENT.md)

Run from the repository root after `pnpm install --frozen-lockfile`.

## Baseline checks

```sh
pnpm check
```

This runs strict TypeScript, zero-warning ESLint, all Vitest tests and a production build. It does **not** run Playwright. Individual commands are `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm build`.

Focused unit checks accept file paths:

```sh
pnpm test packages/game/src/vehicles/vehiclePhysics.test.ts
pnpm test packages/challenges/src/curriculum.test.ts packages/challenges/src/teaching.test.ts
pnpm test packages/localization/src/messages.test.ts
```

Vitest covers reducers, migration, one-time rewards, prerequisite reachability, compiler/source evidence, localization, pane sizing, driving and actual Rapier movement/collision behavior. Compiling every reference solution does not prove its DOM behavior; use the curriculum browser sweep for that.

## Browser setup and focused checks

Install Chromium once:

```sh
pnpm browsers:install
```

Alternatively, Windows contributors with Edge already installed can select it without downloading Chromium:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
pnpm test:e2e tests/e2e/beginner.spec.ts --trace off
```

On POSIX shells, use `PLAYWRIGHT_CHANNEL=msedge pnpm test:e2e tests/e2e/beginner.spec.ts --trace off` only if that channel is installed. On supported Linux systems, `pnpm exec playwright install --with-deps chromium` installs Chromium and its OS libraries; system package installation can require administrator rights. See Playwright's [browser installation documentation](https://playwright.dev/docs/browsers).

Playwright starts Vite automatically if its target URL is unavailable, and reuses an existing server locally. CI intentionally does not reuse it. The default browser state seeds Persian and automatic appearance; first-visit/language scenarios use their own empty state. Tests run one worker with software WebGL.

| Change | Relevant scenarios |
|---|---|
| Teaching or first exercise | `beginner.spec.ts`, `learning.spec.ts` |
| Pane sizing / hidden preview | `workspace.spec.ts` |
| Rewards, projects or mastery | `education.spec.ts`, `roomLife.spec.ts` |
| Movement, input or colliders | `game.spec.ts`, `controls.spec.ts`, `neighborhood.spec.ts` |
| Advanced builds and saved creations | `builds.spec.ts` |
| Translation / country / RTL | `locale.spec.ts` |
| Static subpath, workers and grading | `pages.spec.ts` with the static-host setup below |

Run a selected file or scenario before the full suite:

```sh
pnpm test:e2e tests/e2e/builds.spec.ts --trace off
pnpm test:e2e tests/e2e/education.spec.ts --grep "all curriculum reference solutions" --trace off
pnpm test:e2e tests/e2e/locale.spec.ts --grep "all English curriculum solutions" --trace off
```

The curriculum sweeps run actual React, questions and source checks for every exercise, including Router, Redux, Query and learner-written tests. Each sweep has a ten-minute test deadline. `CURRICULUM_IDS=hello-react,state-counter` narrows the **Persian** sweep only; use a full sweep before claiming complete curriculum coverage.

Run `pnpm test:e2e` for the complete suite. It takes substantially longer than unit checks. The static Pages scenario is skipped unless `PLAYWRIGHT_STATIC_HOST=true`.

## Production preview

In terminal A, with static-build settings cleared:

```sh
pnpm build
pnpm preview
```

In terminal B on PowerShell:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:4173'
pnpm test:e2e tests/e2e/beginner.spec.ts --trace off
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

For bash/zsh:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173 pnpm test:e2e tests/e2e/beginner.spec.ts --trace off
```

Start the preview before pointing tests at it. Playwright's automatic server command always starts development Vite; it does not build or start a production/static server for you.

## Static-host check

Follow [Deployment](DEPLOYMENT.md) to build with `VITE_BASE_PATH=/Game-React-Tutorial/` and `VITE_STATIC_HOST=true`. In terminal A:

```sh
pnpm preview:static /Game-React-Tutorial/
```

This Node-only helper serves `apps/web/dist` on localhost:4180 beneath the supplied prefix. It provides ordinary HTTP dates but **no API middleware or cross-origin isolation headers**, matching the relevant Pages constraints. The default prefix is `/`; an optional second argument changes the port.

In terminal B on PowerShell:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:4180/Game-React-Tutorial/'
$env:PLAYWRIGHT_STATIC_HOST = 'true'
pnpm test:e2e tests/e2e/pages.spec.ts --trace off
Remove-Item Env:PLAYWRIGHT_BASE_URL, Env:PLAYWRIGHT_STATIC_HOST
```

For bash/zsh:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4180/Game-React-Tutorial/ PLAYWRIGHT_STATIC_HOST=true pnpm test:e2e tests/e2e/pages.spec.ts --trace off
```

Use `pages.spec.ts` for this mode: many ordinary scenarios navigate to `/` and expect development endpoints. The static scenario checks assets, server time with an incorrect browser clock, teaching examples, auto-to-local grading, saved XP and mobile layout without requesting a hosting API.

## Evidence and limits

Failure screenshots/traces live in `test-results/`; explicitly requested screenshots live in `artifacts/`. Both are ignored. Retain a trace for debugging, or use `--trace off` for focused software-WebGL runs. A trace can be viewed with `pnpm exec playwright show-trace PATH_TO_TRACE.zip`.

Some recorded Windows runs printed passing scenario bodies but lingered during runner cleanup. Report that distinction accurately; a stopped runner is not a clean exit. Use [Validation](VALIDATION.md) for existing evidence, external-service limitations and upstream warnings. The external cinema fixture proves UI behavior, not real YouTube streaming.

For a PR, record the commands, pass/fail results, selected browser/OS and relevant manual checks. Add regression tests for changed business rules or physics. Test both languages and a narrow viewport when changing user-facing layout; do not weaken checks just to make a new reference solution pass.

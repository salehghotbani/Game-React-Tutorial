# Learning engine

Worker JSX compilation, runtime orchestration, isolated React previews and declarative behavioral evaluation. This package does not own world rendering, curriculum content or persisted reward state.

| Source | Purpose |
|---|---|
| `src/compiler/` | Disposable worker, JSX transform, source evidence and instrumentation limits |
| `src/runtime/CodeRuntime.ts` | Frame lifecycle, statuses, bounded requests and local/WebContainers engines |
| `src/preview/local-entry.ts` | Bundled React and supported library setup |
| `src/preview/bridge.ts` | Mounted-component interactions, deterministic fixtures and test execution |
| `src/preview/observability.ts` | Bounded live state/render/effect/store/query observations |
| `src/evaluation.ts` | Combine runtime results with canonical source/question requirements |
| `src/textMatch.ts` | Tolerant prose comparisons while preserving meaningful values |

`apps/web/previewPlugin.ts` bundles the virtual preview/bridge modules consumed by Vite. Workspace sources are built with the web app; this package has no standalone publishing step. The default local engine works on static hosting. Optional WebContainers needs compatible browser, network and isolation headers; Automatic mode explains failures and falls back locally.

Use root `pnpm test` for compiler/evaluation checks and the [browser curriculum sweeps](../../docs/TESTING.md) for actual React behavior. Runtime or test-DSL extensions must preserve message source checks, deadlines, controlled evaluation state and current-draft snapshots.

See [lesson contracts and runtime limits](../../docs/LESSON_SYSTEM.md), [extension recipes](../../docs/EXTENDING.md), [architecture](../../docs/ARCHITECTURE.md) and [contributing](../../CONTRIBUTING.md).

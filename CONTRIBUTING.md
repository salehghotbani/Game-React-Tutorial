# Contributing to React Quest

**English** · [فارسی](CONTRIBUTING.fa.md) · [Documentation](docs/README.md)

Contributions can improve teaching, translations, accessibility, tests, documentation, world interactions or implementation. The project prioritizes teaching beginners before assessment. Read [product scope](docs/PRODUCT.md), [architecture](docs/ARCHITECTURE.md) and [development rules](AGENTS.md) before changing behavior.

## Choose a contribution

Check existing issues and pull requests to avoid duplicate work. For a substantial new system or curriculum redesign, open an issue describing the learner's problem and proposed scope before implementation. Small documentation corrections and focused bug fixes can go directly to a PR.

Good first tasks include clarifying an explanation, correcting an English translation, adding a regression for a reported behavior, improving keyboard access or reproducing a rendering defect. The [extension recipes](docs/EXTENDING.md) show which files and contracts each type of change touches.

## Fork and configure remotes

Create a fork using GitHub's Fork button. Replace `YOUR_GITHUB_USER` in the following command with your account or organization; replace the repository name too if you renamed the fork.

```sh
git clone https://github.com/YOUR_GITHUB_USER/Game-React-Tutorial.git
cd Game-React-Tutorial
git remote add upstream https://github.com/salehghotbani/Game-React-Tutorial.git
git remote -v
pnpm install --frozen-lockfile
```

`origin` is your fork, where you push branches. `upstream` is the original repository, where you propose a pull request. You do not need write access to upstream to contribute. See [GitHub's fork guide](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo) for the browser workflow and authentication setup.

Before starting a branch, make sure your working tree is clean:

```sh
git status
git fetch upstream
git switch main
git merge --ff-only upstream/main
git switch -c fix/describe-the-change
```

If your fork's `main` has diverged, `--ff-only` stops rather than discarding commits. Review that divergence and merge deliberately; do not use a hard reset to solve it. Keep feature work on separate branches. If you merge upstream while an existing feature branch is checked out, rerun affected checks after resolving conflicts.

## Develop and validate

Follow the [development guide](docs/DEVELOPMENT.md). Keep each PR focused on one problem. Use descriptive names, small components and pure functions for domain rules. Preserve the boundaries between world rendering, simulation, learning content, execution and progression.

- Use strict TypeScript and avoid `any`.
- Use pnpm for all installs and scripts; do not add another lockfile.
- Add dependencies to the package that imports them, using `workspace:*` for internal packages. Explain new dependencies in `docs/ARCHITECTURE.md` and commit the resulting `pnpm-lock.yaml`.
- Keep React/DOM/editor concerns out of pure game rules. Avoid Redux dispatches on every physics frame.
- Preserve beginner explanations before questions. Prefer behavior-based grading and tolerate harmless prose punctuation; JavaScript still has to compile.
- Keep stable challenge, skill, question and test IDs. Stored progress depends on them; include migration and regression coverage when a change affects storage contracts.
- Add or update Persian and English text together. Translation must not alter saved learner code or canonical answers.
- Check keyboard focus, both text directions and narrow screens for UI changes. Use existing components and patterns before adding another UI dependency.
- Use meaningful regression tests for business rules, compilation, migration and movement/collision. A test should exercise behavior, not repeat the implementation.
- Update the relevant documentation when behavior, setup, configuration or commands change.

Before submitting:

```sh
pnpm check
git diff --check
```

Run relevant [browser scenarios](docs/TESTING.md) and manual checks. For example, a collider change needs actual movement/physics coverage, and a new lesson needs real reference-solution judging, including its English presentation. Distinguish an external-service failure from local behavior and a passing scenario body from a clean runner exit.

The current Pages workflow validates and publishes pushes to `main`; it does not run automatically on pull requests. Include your local validation results in the PR. A green deployment run does not mean the browser suite ran: that workflow checks types, lint, units and build only.

## Commit and open a pull request

Review the diff, stage only intended files and use a clear commit message:

```sh
git status
git diff
git add docs/DEVELOPMENT.md
git commit -m "Clarify local development setup"
git push -u origin fix/describe-the-change
```

The staged path above is an example; replace it with your actual changed files. Generated `dist`, `node_modules`, pnpm stores/caches, screenshots, traces and `.env` files should remain untracked.

On GitHub, open a pull request with base **salehghotbani/Game-React-Tutorial:main** and compare **your fork:your branch**. Explain the problem, the resulting behavior, validation commands/results and relevant limits. Include before/after screenshots for visual changes and reproduction steps for bugs. The repository's PR template provides these fields.

Respond to review comments by pushing further commits to the same branch. After upstream changes or conflict resolution, run checks again. Keep unrelated formatting, dependency upgrades and generated files out of the patch.

## Report an issue

Use the repository's bug or feature template. For a bug, include the commit/version, browser/OS, reproduction steps, expected and actual behavior, language/theme, saved-progress prerequisites, and relevant console/network output. Mention whether it occurs on development, preview or Pages. A fresh-profile reproduction is especially helpful for migration issues. Remove personal drafts or credentials from diagnostic attachments.

For a feature, describe the learner's need, a concrete interaction and a way to verify success. Prefer scope that can be reviewed independently.

## Reuse and attribution

The project uses the [MIT License](LICENSE). Preserve its copyright and license notice when distributing copies or substantial portions. Contributions should be original or compatible with the project's license; identify the source and license of any added third-party asset. Linked courses and external learning resources retain their own terms. See [Deployment](docs/DEPLOYMENT.md) to host a separate fork.

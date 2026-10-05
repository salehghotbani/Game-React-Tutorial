# Deploying a copy or fork

[Documentation index](README.md) · [Development](DEVELOPMENT.md) · [Contributing](../CONTRIBUTING.md)

React Quest can be served as static files. Lessons, Monaco, workers, bundled React judging and browser persistence do not require the reserved backend.

## Publish your own GitHub Pages site

1. Fork or create a copy of the repository in your GitHub account. Clone it and verify it with `pnpm install --frozen-lockfile` and `pnpm check`.
2. In your fork's **Actions** tab, enable workflows if GitHub has disabled them for the new fork.
3. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
4. Keep `main` as your publishing branch, or edit `.github/workflows/deploy-pages.yml` to match your branch name.
5. Push to `main`, or manually run **Deploy React Quest to GitHub Pages** from Actions after Pages is configured.
6. Wait for both `build` and `deploy` to succeed. Open the URL shown in the deployment environment/Pages settings, not the original project's demo URL.

For a normal project repository, the URL is `https://YOUR_GITHUB_USER.github.io/YOUR_REPOSITORY/`. Root account sites and custom domains can have a different base path; use the URL reported by Pages. Update the demo/repository links in both READMEs to point to your own fork when publishing a separate project.

The existing workflow obtains `VITE_BASE_PATH` from `actions/configure-pages`, sets `VITE_STATIC_HOST=true` and uploads `apps/web/dist`. Renaming the repository does not require hardcoding its name in application source. It uses Node 24, the declared pnpm version and pinned action revisions. Build permissions are read-only except for reading Pages configuration; the deployment job alone receives `pages` and `id-token` write access. No personal GitHub token or application secret is required by this workflow.

If the Actions page reports that Pages is unconfigured or deployment is unauthorized, review the source setting and the workflow's permissions/environment in your own repository. A successful build without a successful deploy is not a live update. See [GitHub's Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for hosting setup.

## Build and test the matching subpath locally

Replace `/Game-React-Tutorial/` with your own repository prefix, or `/` for a root-domain site. Use one of these shell forms.

PowerShell:

```powershell
$env:VITE_BASE_PATH = '/Game-React-Tutorial/'
$env:VITE_STATIC_HOST = 'true'
pnpm build
Remove-Item Env:VITE_BASE_PATH, Env:VITE_STATIC_HOST
pnpm preview:static /Game-React-Tutorial/
```

Bash/zsh:

```sh
VITE_BASE_PATH=/Game-React-Tutorial/ VITE_STATIC_HOST=true pnpm build
pnpm preview:static /Game-React-Tutorial/
```

Open `http://127.0.0.1:4180/Game-React-Tutorial/`. The prefix passed to `preview:static` must match the prefix baked into the build. The helper defaults to `/` and port 4180; `pnpm preview:static /Game-React-Tutorial/ 4181` selects a different port. It binds to loopback and is a development check, not a production hosting service.

Run the [static-host browser scenario](TESTING.md#static-host-check) from another terminal. Unlike `pnpm preview`, this helper supplies no Vite API middleware or isolation headers. Stop it before replacing the build output. Clear build/test environment overrides before returning to normal development.

## Deploy to another static host

Build with the correct `VITE_BASE_PATH` and `VITE_STATIC_HOST=true`, then upload the contents of `apps/web/dist` to the corresponding URL prefix. Preserve the generated asset/worker paths. The application currently has one public root route with internal lesson tabs; if you add URL routes, configure your host's SPA fallback as part of that change.

`VITE_BASE_PATH` is build-time configuration. Moving an already-built copy to a different prefix requires rebuilding. The HTML icon, router basename, lazy chunks and Monaco/compiler workers all depend on it. Development source files or the repository root are not the publish directory.

## Static-host behavior and limits

| Concern | Behavior |
|---|---|
| Clock | Same-origin HEAD of `index.html`, reading HTTP `Date` and optional CDN `Age`; no substitution with the visitor's wall clock |
| Automatic language | Direct browser IP-country lookup, disclosed browser fallback and saved manual choice |
| Default grading | Bundled local React and behavioral bridge, without an API or external runtime service |
| Optional WebContainers | Needs compatible browser/network access and cross-origin isolation; ordinary Pages lacks those headers, so use local or automatic fallback |
| Progress | localStorage for the current origin; a newly hosted fork does not share the original site's profile |
| Video | External YouTube availability is still required |
| API exercises | Deterministic lesson fixtures, not host endpoints or live third-party APIs |

If static hosting does not expose valid clock headers, the UI reports unavailable synchronization. Vite dev/preview instead supplies `/api/time` and `/api/locale`; those plugins are not a deployed backend. For server-backed hosting, an equivalent clock/country service would have to be supplied deliberately.

## Verification after publishing

Check the actual deployment URL, with a fresh browser profile and after a hard refresh if needed:

- HTML, icon, scene, editor and worker assets load without 404s.
- Server time is synchronized; explicit and automatic appearance work.
- Select English and Persian and verify layout direction.
- Complete the first teaching sequence, run an example and submit a valid personal first exercise; confirm 200 XP survives reload.
- Open settings on a narrow viewport and check horizontal overflow.
- Confirm Local React works when WebContainers cannot boot.

Look at browser console/network errors as well as the workflow status. Record any third-party lookup/video limitations separately from missing application assets.

# Future API

Reserved for FastAPI and PostgreSQL. The current frontend is entirely local and does not require a backend, authentication or a database.

There is no running Python service or package manifest here. You do not need a Python environment, database, Docker or API keys to develop the current app. Vite's clock/country endpoints are implemented in `apps/web/serverTimePlugin.ts` and `apps/web/visitorLocalePlugin.ts`; simulated exercise APIs live inside the learning-engine preview bridge. These are separate from the future backend.

See [development setup](../../docs/DEVELOPMENT.md), [architecture](../../docs/ARCHITECTURE.md) and [product scope](../../docs/PRODUCT.md) before proposing a backend system.

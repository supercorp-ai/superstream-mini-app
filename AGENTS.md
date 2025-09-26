# Agent Instructions

## Test setup

- Ensure you have a local Postgres instance running with user `postgres` and password `postgres`.
- Run `npm install` if `node_modules` is missing.
- The command `npm run test` creates a temporary database, runs Prisma migrations and executes the test suite. The database is preserved afterwards for inspection.
- If `createdb` fails, install PostgreSQL using `sudo apt-get install -y postgresql` and start the service with `sudo service postgresql start`. Set the password with `sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"`.
- Run `npm run lint` and `npm run lint:ts` followed by `npm run test` before creating a PR.
- Do not create barrel files inside `tests/lib`. Always import helpers from their specific files.
- Do not reformat `prisma/schema.prisma`. Keep existing style when making changes.
- The Prisma client is generated to `src/generated/prisma/client`. Keep the `@prisma/client` path mapping in `tsconfig.json` so TypeScript can locate it.

## Code style

- Use two spaces for indentation.
- Do not end lines with semicolons.
- Prefer single quotes for strings.
- Export route handlers as `export const GET = async () => {}` arrow functions.
- Return early for errors to keep functions short.
- Validate API request bodies with Zod schemas.
- Use object spreads to build Prisma inputs cleanly.
- Serialize API responses with `serializeApiAssistant` for private endpoints.

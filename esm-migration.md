# ESM Migration Checklist

## Decisions

- [x] Scope locked: server-first
- [x] Strategy locked: big-bang full ESM
- [x] Dependency policy locked: modernize broadly
- [x] No bridge policy confirmed (no CJS<->ESM compatibility wrappers as migration strategy)

## Completed

- [x] Replace `mkdirp` usage in fetchdata scripts with `fs.mkdirSync(..., { recursive: true })`
- [x] Replace `request` in `server/scripts/fetchdata/KeyforgeImageSource.js` with built-in `fetch`
- [x] Replace `request` in `keyteki-json-data/src/KeyforgeApiToKeytekiConverter.js` with built-in `fetch`
- [x] Replace `request` in `keyteki-json-data/src/DecksOfKeyforgeApiToKeytekiConverter.js` with built-in `fetch`
- [x] Replace `request` in `keyteki-json-data/src/ArchonArcanaApiToKeytekiConverter.js` with built-in `fetch`
- [x] Rename ESLint config files to explicit CJS:
- [x] `.eslintrc.js` -> `.eslintrc.cjs`
- [x] `test/.eslintrc.js` -> `test/.eslintrc.cjs`
- [x] Remove temporary `.mjs` entrypoints added during earlier attempt:
- [x] `index.mjs`
- [x] `server/index.mjs`
- [x] Rewrite relative `require(...)` specifiers to explicit paths (`.js` / `/index.js`) across `server/**`, `test/**`, and `index.js`
- [x] Upgrade lint toolchain for ESM parser support (`eslint@8`, `eslint-config-prettier@8`, `eslint-plugin-prettier@4`)
- [x] Fix ESM export shape for test helper utility (`test/helpers/cardutil.js`)
- [x] Fix ESM export shape for test helper utility (`test/helpers/messagehelper.js`)
- [x] Skip helper modules without `id` in card loaders (`server/game/cards/index.js`, `server/game/loader.js`)

## In Progress

- [x] Remove remaining deprecated dependency declarations now unused by source (`request` in `keyteki-json-data/package.json`)

## Next

- [x] Set root `package.json` `"type": "module"`
- [x] Keep CJS-only config files on `.cjs` extensions (`postcss.config.cjs`, ESLint configs)
- [x] Convert runtime entrypoints to ESM syntax (`index.js`, `server/index.js`, `server/server.js`)
- [x] Convert server API layer to ESM (`server/api/**`)
- [x] Convert services/models/util modules to ESM (`server/services/**`, `server/models/**`, `server/*.js`)
- [x] Replace `__dirname` / `__filename` usage with `import.meta.url` patterns
- [x] Convert dynamic card loaders to async ESM import (`server/game/cards/index.js`, `server/game/loader.js`)
- [x] Convert game engine modules to ESM (`server/game/**`)
- [x] Convert all card modules to ESM (`server/game/cards/**`)
- [x] Convert test helpers and specs to ESM (`test/**`)
- [x] Convert remaining scripts to ESM (`server/scripts/**`)
- [x] Remove/replace Patreon deep import usage (`patreon/dist/schemas/pledge`)

## Validation

- [x] `npm run typecheck:client`
- [x] `npm run lint` (warnings only)
- [x] `npm run build -- --emptyOutDir=false`
- [x] `npm test`
- [x] Focused test smoke: `npx vitest run test/server/cards/01-Core/HonorableClaim.spec.js`
- [x] Focused test smoke: `npx vitest run test/server/messages/ward.spec.js`
- [x] Runtime smoke test: lobby startup (`node .`)
- [x] Runtime smoke test: gamenode startup (`node server/gamenode`)
- [ ] Card loader parity check (count + ID set unchanged)

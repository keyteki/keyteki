# Client Migration Plan

This plan is scoped to client-only. Update the checklist as work completes.

## Phase 1 - React Upgrade (no refactors)

Goal: Run on latest React with minimal code changes.
Checklist

-   [x] Bump core React packages (react, react-dom, react-test-renderer)
-   [x] Align React ecosystem deps:
    -   [x] react-redux
    -   [x] react-dnd + react-dnd-touch-backend
    -   [x] react-transition-group
-   [x] Align UI deps:
    -   [x] react-bootstrap
    -   [x] react-bootstrap-typeahead
    -   [x] react-select
    -   [x] react-toastify
    -   [x] bootstrap (bump to v5 to align with react-bootstrap v2)
-   [x] Test tooling: N/A (legacy client Jest/Enzyme removed)
-   [x] Ensure client entry points still render: client/index.dev.jsx, client/index.prod.jsx
-   [x] Fix build/runtime breakages only (no refactors)

Potential blockers and checks

-   react-bootstrap-select not found in client (no matches on scan)
-   react-bootstrap-typeahead is an old alpha; confirm compatibility or pin React to a supported range
-   react-bootstrap-table\* packages historically lag React majors; replace with a custom table
-   enzyme is React-16-era; may require moving tests to react-testing-library or disabling legacy tests
-   legacy React 16 UI deps replaced during Phase 1:
    -   react-redux-toastr -> react-toastify
    -   react-bootstrap-table\* -> custom table in DeckList
    -   react-select v3 -> v5
        Status: deps match Phase 1 targets (React 18.2, react-redux 8.1.x, react-dnd 16, react-select 5.10, react-bootstrap 2.10 + bootstrap 5.3); runtime fixes landed (corrupted imports, react-dnd drag type, DeckList table/style regressions). Pending: react-router is not yet introduced (custom router remains), entry-point smoke check still needed.

Phase 1 target versions (as of 2026-01-29)

-   React core:
    -   react: 18.2.0 (target for Phase 1 to reduce peer conflicts)
    -   react-dom: 18.2.0 (align with react)
-   React ecosystem:
    -   react-redux: 8.1.x
    -   react-dnd: 16.0.1
    -   react-dnd-touch-backend: 16.0.1
    -   react-transition-group: 4.4.5
-   UI stack:
    -   react-bootstrap: 2.10.10 (latest stable; 3.0.0 is beta)
    -   react-bootstrap-typeahead: 6.4.1
    -   react-select: 5.10.2
    -   react-toastify: 11.0.5
    -   bootstrap: 5.3.x
    -   @popperjs/core: 2.11.x
    -   @fortawesome/fontawesome-svg-core: 7.1.x
    -   @fortawesome/free-solid-svg-icons: 7.1.x
    -   @fortawesome/react-fontawesome: 3.1.x

## Phase 2 - TypeScript Foundation

Goal: Enable TS build without converting files yet.

-   [x] Add TypeScript + type-check tooling in client build
-   [x] Add base tsconfig aligned to Vite/build setup
-   [x] Configure module resolution and path aliases used by client
-   [x] Allow JS alongside TS during migration (noEmit, isolatedModules)
-   [x] Define core shared types (API responses, redux state, common props)

## Phase 3 - Router Migration (custom -> react-router)

Goal: Replace custom router with react-router without changing behavior.

-   [x] Add react-router-dom and integrate in client entry points
-   [x] Map existing routes (client/routes.\*) to react-router config
-   [x] Migrate navigation/link helpers to react-router components
-   [x] Replace any direct history handling with react-router equivalents
-   [x] Verify page transitions and auth-gated routes

## Phase 4 - Class -> Function Components

Target list (from scan):

-   Application + Pages
    -   [x] client/Application.jsx
    -   [x] client/pages/About.jsx
    -   [x] client/pages/BanlistAdmin.jsx
    -   [x] client/pages/HowToPlay.jsx
    -   [x] client/pages/Logout.jsx
    -   [x] client/pages/Matches.jsx
    -   [x] client/pages/NodesAdmin.jsx
    -   [x] client/pages/NotFound.jsx
    -   [x] client/pages/Patreon.jsx
    -   [x] client/pages/Privacy.jsx
    -   [x] client/pages/Register.jsx
    -   [x] client/pages/ResetPassword.jsx
    -   [x] client/pages/Security.jsx
    -   [x] client/pages/Unauthorised.jsx
-   Components (shared)
    -   [x] client/Components/Form/Form.jsx
    -   [x] client/Components/Form/Input.jsx
    -   [x] client/Components/Form/Typeahead.jsx
    -   [ ] client/Components/Site/ErrorBoundary.jsx
    -   [x] client/Components/Site/Modal.jsx
    -   [x] client/Components/Games/GameList.jsx
-   GameBoard
    -   [x] client/Components/GameBoard/AbilityTargeting.jsx
    -   [x] client/Components/GameBoard/CardMenu.jsx
    -   [x] client/Components/GameBoard/GameChat.jsx
    -   [x] client/Components/GameBoard/GameBoard.jsx
    -   [x] client/Components/GameBoard/OptionsSelect.jsx
    -   [x] client/Components/GameBoard/PlayerBoard.jsx
    -   [x] client/Components/GameBoard/SquishableCardPanel.jsx
    -   [x] client/Components/GameBoard/TimeLimitClock.jsx

## Phase 5 - Redux Toolkit Bridge

Goal: Introduce RTK without removing legacy reducers yet.

-   [x] Add @reduxjs/toolkit and @reduxjs/toolkit/query
-   [x] Create RTK store entrypoint alongside legacy store
-   [x] Migrate 1 small slice to RTK
-   [x] Add 1 RTK Query endpoint and integrate into a low-risk screen

## Phase 6 - Redux -> RTK/RTK Query

Goal: Remove legacy redux usage.

-   [ ] Replace remaining connect(...) containers
    -   [ ] client/Application.jsx
    -   [ ] client/pages/BanlistAdmin.jsx
    -   [ ] client/pages/Logout.jsx
    -   [ ] client/pages/Matches.jsx
    -   [ ] client/pages/Register.jsx
    -   [ ] client/pages/ResetPassword.jsx
    -   [ ] client/pages/Security.jsx
    -   [ ] client/pages/Patreon.jsx
    -   [ ] client/pages/NodesAdmin.jsx
    -   [ ] client/Components/Games/GameList.jsx
    -   [x] client/Components/GameBoard/GameBoard.jsx
-   [x] Add RTK socket middleware for lobby + game node
-   [x] Add RTK slices for lobby + games
-   [x] Replace socket action usage in lobby/game UI
-   [x] Remove legacy game/socket/misc actions and reducers
-   [ ] Convert remaining thunks to RTK slices or RTK Query endpoints
-   [ ] Remove legacy store wiring and unused deps

## Phase 7 - Tailwind + HeroUI (incremental)

Goal: Introduce new styling system without breaking everything at once.

-   [ ] Add Tailwind build pipeline and HeroUI
-   [ ] Convert one bounded area first (suggest: Lobby or Profile)
-   [ ] Replace react-bootstrap components for that area
-   [ ] Move SCSS away from bootstrap variables

## Phase 8 - Remove Bootstrap

-   [ ] Remove bootstrap JS/CSS imports in client/index.\*.jsx
-   [ ] Remove bootstrap SCSS imports across client styles
-   [ ] Remove react-bootstrap and table packages from deps

## Phase 9 - Font Awesome

-   [ ] Upgrade @fortawesome/\* to latest
-   [ ] Add client/Components/Icon.jsx wrapper
-   [ ] Replace icon usage incrementally

## Phase 10 - TypeScript Only (end goal)

Goal: Remove remaining JS and enforce TypeScript-only client.

-   [ ] Convert remaining .js/.jsx to .ts/.tsx
-   [ ] Enable strict type-checking for client (strict, noImplicitAny)
-   [ ] Remove allowJs and checkJs from client tsconfig
-   [ ] Remove legacy JS-only tooling/configs for client
-   [ ] Update linting to TS-first rules and types

## Notes

-   Prefer small PRs and avoid mixing styling changes with state changes.
-   Keep GameBoard changes isolated until React/RTK migration is stable.

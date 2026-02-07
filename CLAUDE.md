# Project Rules (must-follow)

## Language & Style
- Write code and comments in English (USA).
- Prefer clarity over cleverness. No "magic" abstractions without a reason.

## File Size / Complexity Limits
- Max file length: 200 LOC (excluding generated code). If it grows, split into smaller modules.
- Max React component: 150 LOC and 1 responsibility. Split if it has more than 1 responsibility.
- No function > 40 LOC. Extract helpers.

## Naming Conventions
- Variables/functions: camelCase, meaningful, no abbreviations unless common (id, url, ui).
- React components: PascalCase.
- Hooks: useXxx.
- Booleans: is/has/should/can prefix (isLoading, hasError).
- Constants: UPPER_SNAKE_CASE only for true constants.

## React / TypeScript Rules
- Always TypeScript. Avoid `any`; use `unknown` + narrowing if needed.
- Prefer composition over inheritance.
- Prefer pure components; side effects only in hooks.
- Keep props small; pass objects if they are cohesive.

## Imports & Structure
- One export per file (except types).
- Absolute imports if the repo supports it; otherwise keep relative imports short.
- No circular dependencies.

## Testing & Quality Gates
- All new logic must have tests (unit or component).
- Run `npm test` and `npm run lint` before proposing final changes.
- Do not disable lint rules without explaining why.

## Git & PR Hygiene
- Small commits, meaningful messages.
- When changing behavior: explain "what/why", not just "how".

## When Uncertain
- Ask before inventing a new pattern. Prefer existing conventions from the codebase.

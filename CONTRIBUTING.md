# Contributing

## Tech constraints
- Use npm (not yarn/pnpm)
- Keep the project buildable: `npm run build`
- Avoid adding dependencies unless requested

## Code style
- Prefer clear, boring code
- Keep components small and readable
- Avoid clever abstractions
- Keep UI minimal and modern

## PR requirements
- Follow PR template
- Include "How to verify"
- Keep changes scoped to the issue

## How Codex fills the PR template
- Write `Summary` as factual `what + why` only.
- List only verification steps actually performed.
- Check only checklist boxes that truly apply.
- If there are no risks or trade-offs, write `None`.

## Post-merge cleanup workflow
- Run `git cleanup`.
- If `git cleanup` is unavailable, run:
  - `git checkout main`
  - `git pull --ff-only`
  - `git fetch --prune`

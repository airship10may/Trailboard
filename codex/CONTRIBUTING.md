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

## Codex local workflow (implementation boundary)

Codex is responsible for implementation and ensuring the project builds successfully.

- Confirm the Issue number explicitly, then create a branch as `codex/<issue-number>-<short-slug>`.
- Make changes within the Issue scope.
- Run `npm run build` and confirm it succeeds.
- You may create/switch branches only after confirming the Issue number, but must NOT run git add, git commit, git push, or create/update PRs.
- After the build succeeds, output the work summary using the PR template sections(.github
/PULL_REQUEST_TEMPLATE.md):
  - Summary
  - What changed
  - How to verify
  - Scope / Out of scope
  - Risks / trade-offs
  - Follow-ups (if any)
  - Open Questions (if any)

A human will run `./scripts/publish_commit.sh` to commit and push, then open the PR in GitHub UI.




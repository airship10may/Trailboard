# AGENTS.md

## Non-negotiable
- Read `codex/TASKS.md` first, then read `codex/CONTRIBUTING.md`, and follow both strictly.
- Instruction priority: `codex/TASKS.md` > `codex/CONTRIBUTING.md` > repository docs (for example `README.md`).
- If any instructions conflict or are unclear, stop and ask before proceeding.
- Keep changes minimal and within the Issue scope.

## Responsibility boundary (Codex)
- You are responsible for implementation and confirming `npm run build` succeeds.
- You must NOT perform Git operations (`git add`, `git commit`, `git push`) and must NOT create or update PRs.
- After a successful build, output PR body text using this structure:
  - Summary
  - What changed
  - How to verify
  - Scope
  - Risks
  - Follow-ups
  - Open Questions

## Build
- Run `npm run build` before considering the task complete.

# AGENTS.md

## Non-negotiable
- Read `codex/TASKS.md` first, then read `codex/CONTRIBUTING.md`, and follow both strictly.
- Instruction priority: `codex/TASKS.md` > `codex/CONTRIBUTING.md` > repository docs (for example `README.md`).
- If any instructions conflict or are unclear, stop and ask before proceeding.
- Keep changes minimal and within the Issue scope.
- You MUST confirm the Issue number explicitly before creating/switching branches.
- If the Issue number is not provided, STOP and ask: "What is the Issue number?"
- Do NOT start implementation or run builds until the Issue number is confirmed.

## Responsibility boundary (Codex)
- You are responsible for implementation and confirming `npm run build` succeeds.
- You may create/switch branches only after confirming the Issue number, but must NOT run git add, git commit, git push, or create/update PRs.
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

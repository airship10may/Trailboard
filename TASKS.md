# TASKS (Source of Truth for Codex)

You are Codex working in this repo as an autonomous contributor.

## Non-negotiable Rules
1) One Issue = One PR (small and reviewable)
2) Do NOT add new dependencies unless the issue explicitly asks for it
3) Do NOT change build tooling/config unless explicitly asked
4) Always keep the app runnable (`npm run dev`) and buildable (`npm run build`)
5) Prefer the smallest change that satisfies acceptance criteria
6) Leave the repo in a better state than you found it

## Required workflow
- Read the Issue.
- Create a branch: `codex/<issue-number>-<short-slug>`
- Make changes.
- Run:
  - `npm run build`
  - (optional) `npm run lint` if present
- Open a PR with the PR template fully completed.

## PR description must include
- Summary (what & why)
- What changed (bullet list)
- How to verify (exact commands + manual steps)
- Scope / Out of scope
- Risks / trade-offs
- Follow-ups (if any)

## Issue format (must be followed)
Title:
  [Trailboard] <short task title>

Body:
- Goal:
- Acceptance Criteria:
- Out of scope:
- Notes:

## UI principles
- Minimal and modern
- Avoid heavy decoration or excessive motion
- Keep typography and spacing clean
- Prefer accessibility-friendly choices

## If you are stuck
- Stop and ask for clarification in the PR description as "Open Questions"
- Do not implement speculative features

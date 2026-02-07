#!/usr/bin/env bash
set -e

DEFAULT_COMMIT_MSG="chore: update"

echo "=== Current branch ==="
git branch --show-current
echo

echo "=== git status (before add) ==="
git status
echo

# ---- Abort if there is nothing to commit (before add) ----
# This checks both tracked changes and untracked files.
if git diff --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "No changes detected (working tree is clean). Nothing to commit."
  exit 0
fi

read -p "Proceed with git add -A ? (y/N): " yn
case "$yn" in
  [yY]* ) ;;
  * ) echo "Aborted."; exit 1 ;;
esac

git add -A
echo

echo "=== git status (after add) ==="
git status
echo

# ---- Abort if nothing is staged (after add) ----
if git diff --cached --quiet; then
  echo "No staged changes after git add -A. Nothing to commit."
  echo "Hint: files may be ignored by .gitignore or changes may be identical."
  exit 0
fi

echo "Commit message (press Enter to use default):"
echo "  Default: ${DEFAULT_COMMIT_MSG}"
read -p "> " commit_msg
commit_msg="${commit_msg:-$DEFAULT_COMMIT_MSG}"

git commit -m "$commit_msg"
echo

echo "=== Pushing to origin ==="
git push -u origin HEAD

echo
echo "Done."

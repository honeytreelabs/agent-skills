#!/usr/bin/env bash
# Validate that every skill has required frontmatter and matching directory name.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
errors=0

for skill_dir in "$root"/skills/*/; do
  name="$(basename "$skill_dir")"
  skill="$skill_dir/SKILL.md"

  if [[ ! -f "$skill" ]]; then
    echo "FAIL: skills/$name has no SKILL.md"
    errors=$((errors + 1))
    continue
  fi

  if ! head -1 "$skill" | grep -q '^---$'; then
    echo "FAIL: skills/$name/SKILL.md missing frontmatter"
    errors=$((errors + 1))
    continue
  fi

  fm_name=$(awk '/^---$/{c++; next} c==1 && /^name:/{print $2; exit}' "$skill")
  if [[ "$fm_name" != "$name" ]]; then
    echo "FAIL: skills/$name/SKILL.md name '$fm_name' does not match directory"
    errors=$((errors + 1))
  fi

  desc=$(awk '/^---$/{c++; next} c==1 && /^description:/{print; exit}' "$skill")
  if [[ -z "$desc" ]]; then
    echo "FAIL: skills/$name/SKILL.md missing description"
    errors=$((errors + 1))
  elif [[ ${#desc} -gt 1024 ]]; then
    echo "FAIL: skills/$name/SKILL.md description exceeds 1024 chars"
    errors=$((errors + 1))
  fi

  for d in scripts references; do
    if [[ -d "$skill_dir/$d" ]] && [[ -z "$(ls -A "$skill_dir/$d")" ]]; then
      echo "FAIL: skills/$name/$d is empty"
      errors=$((errors + 1))
    fi
  done

  echo "OK: skills/$name"
done

exit "$errors"

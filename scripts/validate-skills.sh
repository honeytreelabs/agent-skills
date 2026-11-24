#!/usr/bin/env bash
# Validate that every skill has required frontmatter, matching directory name,
# and appears in the README catalog. Also verifies JSON manifests parse.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
errors=0
fail() {
  echo "FAIL: $1"
  errors=$((errors + 1))
}

for skill_dir in "$root"/skills/*/; do
  name="$(basename "$skill_dir")"
  skill="$skill_dir/SKILL.md"

  if [[ ! -f "$skill" ]]; then
    fail "skills/$name has no SKILL.md"
    continue
  fi

  if ! head -1 "$skill" | grep -q '^---$'; then
    fail "skills/$name/SKILL.md missing frontmatter"
    continue
  fi

  fm_name=$(awk '/^---$/{c++; next} c==1 && /^name:/{print $2; exit}' "$skill")
  if [[ "$fm_name" != "$name" ]]; then
    fail "skills/$name/SKILL.md name '$fm_name' does not match directory"
  fi

  desc=$(awk '/^---$/{c++; next} c==1 && /^description:/{sub(/^description:[ ]*/, ""); print; exit}' "$skill")
  if [[ -z "$desc" ]]; then
    fail "skills/$name/SKILL.md missing description"
  elif [[ ${#desc} -gt 1024 ]]; then
    fail "skills/$name/SKILL.md description exceeds 1024 chars (${#desc})"
  fi

  # The skill must be listed in the README catalog.
  if ! grep -q -- "$name" "$root/README.md"; then
    fail "skills/$name is not mentioned in README.md"
  fi

  for d in scripts references; do
    if [[ -d "$skill_dir/$d" ]] && [[ -z "$(ls -A "$skill_dir/$d")" ]]; then
      fail "skills/$name/$d is empty"
    fi
  done

  echo "OK: skills/$name"
done

# JSON manifests must parse.
for json in "$root"/.claude-plugin/*.json; do
  [[ -e "$json" ]] || continue
  if python3 -m json.tool "$json" > /dev/null 2>&1; then
    echo "OK: ${json#"$root"/}"
  else
    fail "${json#"$root"/} is not valid JSON"
  fi
done

if [[ "$errors" -gt 0 ]]; then
  echo "$errors error(s)"
fi
exit "$errors"

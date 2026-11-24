# Contributing

## Adding a skill

1. Create a directory under `skills/` named after the skill
   (lowercase, hyphen-separated).
2. Add a `SKILL.md` with the required frontmatter:

   ```yaml
   ---
   name: skill-name-with-hyphens
   description: Guides agents through [task]. Use when [trigger conditions].
   ---
   ```

3. Follow the recommended sections in
   [`docs/skill-anatomy.md`](docs/skill-anatomy.md): Overview, When to Use,
   Core Workflow, Common Rationalizations, Red Flags, Verification.
4. If the skill is derived from a book or paper, credit the source in the
   Overview and add it to the README table (the validator enforces the README
   entry).

## Validation

Check that every skill has valid frontmatter, that `name` matches the
directory name, and that every skill is listed in the README:

```bash
./scripts/validate-skills.sh
```

CI runs the same check on every pull request and push to `main`
(`.github/workflows/validate.yml`), along with a JSON sanity check of the
plugin manifests.

## Guidelines

- Keep `SKILL.md` focused; move material longer than ~100 lines into
  `references/`.
- Descriptions must be under 1024 characters and include "Use when" triggers.
- Every verification item should be checkable with evidence (test output,
  diff, file contents).
- Never add empty `scripts/` or `references/` directories.

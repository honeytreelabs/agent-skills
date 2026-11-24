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
   Overview and add it to the README table.

## Validation

Check that every skill has valid frontmatter and that `name` matches the
directory name:

```bash
./scripts/validate-skills.sh
```

## Guidelines

- Keep `SKILL.md` focused; move material longer than ~100 lines into
  `references/`.
- Descriptions must be under 1024 characters and include "Use when" triggers.
- Every verification item should be checkable with evidence (test output,
  diff, file contents).
- Never add empty `scripts/` or `references/` directories.

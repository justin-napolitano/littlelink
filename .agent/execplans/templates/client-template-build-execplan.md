# Client Template Build ExecPlan Template

## Goal

Build an inactive preview template from an approved design pitch and template build plan.

## Inputs

- Design pitch: `<DESIGN_PITCH_JSON>`
- Template build plan: `<TEMPLATE_BUILD_PLAN_JSON>`
- Design bibliography, user stories, and requirements: read from the pitch `research_basis` and validated by `npm run design:validate`
- Design object refs: read from `design_object_refs` inside the build plan
- Token refs: read from `token_refs` inside the build plan
- Branch: `<BRANCH>`
- Preview route: `<PREVIEW_ROUTE>`

## Hard Requirements

- You are not alone in this codebase; do not revert unrelated edits.
- Build only the inactive preview template unless activation is explicitly requested.
- Do not change canonical route URLs, direct-link behavior, privacy behavior, analytics consent behavior, or provider-backed data.
- Render shared `src/data/site.json` content unless the pitch explicitly references an approved content-contract change.
- Preserve the approved bibliography, user-story, and requirement basis unless a separate planning slice updates it.
- Implement classes, tokens, layout rules, and content bindings from the referenced design-object JSON and token files.
- Stop and report blockers instead of guessing when any stop condition is hit.

## Steps

1. Inspect `git status --short --branch`. Stop if the worktree is dirty.
2. Create or switch to `<BRANCH>` from current `main`.
3. Read the design pitch, template build plan, every referenced design-object JSON file, and every referenced token file.
4. Run `npm run design:validate` before editing. Stop if it fails.
5. Implement only the slices listed in `implementation_slices`.
6. Register the inactive template for `/preview/[templateId]`.
7. Run validation commands listed in the build plan.
8. Capture mobile and desktop screenshots for `<PREVIEW_ROUTE>`.
9. Commit the implementation and open a PR to `main`.
10. Finish with contract refs, design-object refs, changed files, validation results, screenshot paths, and activation status.

## Validation

- `npm run build`
- `npm run design:validate`
- `git diff --check`
- design-object and token validation
- preview route health check
- mobile screenshot
- desktop screenshot
- keyboard focus remains visible
- no text overlap
- production active-template config unchanged

## Stop Conditions

- Dirty worktree before implementation.
- Missing pitch or build plan.
- Missing design-object refs.
- Missing token refs.
- Build plan status is not `ready_for_build`.
- Production active-template config changes.
- Route URLs, privacy behavior, analytics behavior, or direct-link behavior changes.
- Preview route cannot render without activation.

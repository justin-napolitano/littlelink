# Client Template Build ExecPlan Template

## Goal

Build an inactive preview template from an approved design pitch and template build plan.

## Inputs

- Design pitch: `<DESIGN_PITCH_JSON>`
- Template build plan: `<TEMPLATE_BUILD_PLAN_JSON>`
- Branch: `<BRANCH>`
- Preview route: `<PREVIEW_ROUTE>`

## Hard Requirements

- You are not alone in this codebase; do not revert unrelated edits.
- Build only the inactive preview template unless activation is explicitly requested.
- Do not change canonical route URLs, direct-link behavior, privacy behavior, analytics consent behavior, or provider-backed data.
- Render shared `src/data/site.json` content unless the pitch explicitly references an approved content-contract change.
- Stop and report blockers instead of guessing when any stop condition is hit.

## Steps

1. Inspect `git status --short --branch`. Stop if the worktree is dirty.
2. Create or switch to `<BRANCH>` from current `main`.
3. Read the design pitch and template build plan.
4. Implement only the slices listed in `implementation_slices`.
5. Register the inactive template for `/preview/[templateId]`.
6. Run validation commands listed in the build plan.
7. Capture mobile and desktop screenshots for `<PREVIEW_ROUTE>`.
8. Commit the implementation and open a PR to `main`.
9. Finish with contract refs, changed files, validation results, screenshot paths, and activation status.

## Validation

- `npm run build`
- `git diff --check`
- preview route health check
- mobile screenshot
- desktop screenshot
- keyboard focus remains visible
- no text overlap
- production active-template config unchanged

## Stop Conditions

- Dirty worktree before implementation.
- Missing pitch or build plan.
- Build plan status is not `ready_for_build`.
- Production active-template config changes.
- Route URLs, privacy behavior, analytics behavior, or direct-link behavior changes.
- Preview route cannot render without activation.

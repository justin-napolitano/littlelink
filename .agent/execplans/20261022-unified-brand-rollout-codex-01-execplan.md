---
id: "20261022-unified-brand-rollout-codex-01-execplan"
title: "Plan the approved unified brand rollout and link-site update"
owner: "agent/codex-01"
created: "2026-10-22T14:41:58Z"
status: draft
base_branch: main
draft_by: "agent/codex-01"
draft_branch: "draft-execplan/unified-brand-rollout-codex-20261022"
draft_created: "2026-10-22T14:41:58Z"
changes:
  - ".agent/execplans/20261022-unified-brand-rollout-codex-01-execplan.md"
  - "docs/branding/2026-10-22/brand-contract.md"
  - "docs/branding/2026-10-22/approved-reference.png"
  - "docs/branding/2026-10-22/reference-prompt.txt"
approve_policy: codeowners
reviewers:
  - "github:justin-napolitano"
---

## Outcomes & Retrospective

Planning only: retain the user-approved visual reference and a self-contained contract, and prepare the link-site implementation scope. No product code, deployment, or content records change in this PR. The final visual direction is approved; this ExecPlan remains draft and carries no human finalization metadata.

## Context and Orientation

`littlelink` owns the JNAP front door and contact/social routing. GitHub Issues is disabled for this repository, so this draft planning PR is the local work item; no repository settings are changed. The shared contract lives in `docs/branding/2026-10-22/brand-contract.md` with its reference PNG and exact generation prompt. The accepted design has modest sans UI, a serif resume name/reading type, warm paper, very limited slate accents, and no marks beside titles.

The existing personal-suite brand contract predates this approval. A later implementation should reconcile its presentation guidance with this approved direction while preserving route ownership and public/private boundaries. Do not rewrite platform governance from this site repo.

## Plan of Work

1. [ ] Register the approved direction in the repo-local initiative/queue according to existing workflow before implementation. Branch from the appropriate authority and keep unrelated work isolated.
2. [ ] Inspect `src/pages/index.astro`, `src/data/site.json`, `src/styles/global.css`, components, and the active design template. Use the actual selected template rather than redesigning all template variants.
3. [ ] Apply shared color, font, spacing and heading rules. Use text-only `Justin Napolitano` identity and modest horizontal links. Remove decorative title marks and oversized hero styling.
4. [ ] Present a useful personal directory for Resume, Docs, Select Projects, Journal where already intentionally public, plus existing contact/social paths. Confirm real destination URLs. Do not publish a new Journal route or private contact destination just because it appears in the mock.
5. [ ] Preserve `/api/direct/*` redirects, privacy page, provider links, SEO metadata and mobile behavior. Keep real source content and accessibility.
6. [ ] Run `npm run design:validate` and `npm run build`; inspect responsive previews at 390/768/1440px and 320px overflow, keyboard navigation, contrast, 200% zoom and reduced motion.
7. [ ] Capture before/after views and compare the preview with the approved reference and sibling surfaces. Submit an implementation PR with commands, results and rollback details. Merge/deployment are separate actions.

## Validation and Acceptance

Planning: verify image checksum, reference/prompt presence, internal Markdown references, and absence of product-code changes. Implementation: the approved visual rules, actual destination links, preserved private redirect handling, and accessible responsive layouts must be demonstrated; existing design validation/build must pass or pre-existing failures be documented. No need to run a product build for this documentation-only draft.

## Artifacts and Notes

- Reference: `docs/branding/2026-10-22/approved-reference.png` (SHA-256 `aa73b7441e83d5a5930d776c604209a09f54206a676314923037201bd695eef1`).
- Contract: `docs/branding/2026-10-22/brand-contract.md`.
- Exact image-generation prompt: `docs/branding/2026-10-22/reference-prompt.txt` (built-in image tool).
- Shared rollout proceeds from link-site preview to web/PDF resume, Select Projects and Docs, then project/product surfaces and retained legacy sites.
- Recovery: revert only the later presentation commit; no data migration, new integration, credential change or publication-policy change is part of this work.

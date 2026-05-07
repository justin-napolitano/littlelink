---
id: "20260507-jnap-link-design-pilot-codex-01-execplan"
title: "Redesign jnap.me as the career-suite design-system pilot"
owner: "agent/codex-01"
created: "2026-05-07T00:00:00Z"
status: executing
base_branch: "initiative/link-suite-maintenance"
changes:
  - .agent/execplans/20260507-jnap-link-design-pilot-codex-01-execplan.md
  - artifacts/design/jnap-link-design-pilot.md
  - src/styles/global.css
approve_policy: codeowners
reviewers:
  - "github:justin-napolitano"
validation:
  tests:
    - name: "build-smoke"
      command: "npm run build"
      expected_exit: 0
---

## Outcomes & Retrospective

This slice applies the career-suite design contract to `jnap.me` as the smallest public pilot.

The desired result is a quiet personal index: fewer decorative surfaces, less pitch-deck styling, shorter scan paths, and rows that feel like useful routes rather than marketing cards.

## Context and Orientation

The platform design contract lives in `/Users/justin/repos/codex_platform/plugins/jnap-career-suite/contracts/design-system.yaml`.

The pilot should preserve the copy cleanup already merged into `initiative/link-suite-maintenance`. It should not add `hire.jnap.me` back to the root link list.

## Plan of Work

1. Keep the existing content model and direct-link behavior.
2. Replace the hero-card visual treatment with a simple page identity block.
3. Flatten the section cards into index sections.
4. Reduce pill dominance by using quieter rows and smaller radii.
5. Record design evidence in `artifacts/design`.
6. Run the Astro production build.

## Validation and Acceptance

The slice is acceptable when:

- `npm run build` passes
- the root page uses the career-suite contract colors
- section headings align with the route row edge
- there are no decorative radial/orb backgrounds
- `hire.jnap.me` is not present in the root link list

## Artifacts and Notes

This is a target-repo implementation slice. The platform remains the design-contract authority; this repo remains canonical for the actual CSS and build result.

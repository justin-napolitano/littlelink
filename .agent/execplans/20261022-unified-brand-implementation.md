---
id: 20261022-unified-brand-implementation
title: Apply approved simplified identity to the active link template
owner: agent/link-site
created: 2026-10-22T15:00:00Z
status: draft
approve_policy: codeowners
reviewers: ["github:justin-napolitano"]
finalized_by: ""
finalized_at: ""
finalized_in_pr: ""
validation:
  tests:
    - name: policy-compliance-check
      command: "bin/policy-compliance-check --execplan-path /Users/justin/repos/brand-review/swarm/littlelink/.agent/execplans/20261022-unified-brand-implementation.md"
      expected_exit: 0
base_branch: main
initiative_branch: initiative/unified-brand-20261022
initiative_node_id: initiative-unified-brand-20261022
implementation_branch: impl-execplan/unified-brand-20261022
graph_registration:
  node_id: rwg-brand-20261022
  queue_position: 4
  goal_area: product
  conflict_domains: [littlelink-presentation]
  expected_artifacts: [design-qa.md]
  implementation_branch: impl-execplan/unified-brand-20261022
  integration_mode: via_initiative
changes:
  - src/design-templates/link-index-mobile-first/
  - src/data/design-control.json
  - src/components/RootDocument.astro
  - src/pages/site.webmanifest.ts
  - docs/branding/2026-10-22/
  - public/fonts/
  - design-qa.md
---

## Context and Orientation

Justin approved the exact reference and explicitly requested a swarm to build and deploy the rollout. This bounded initiative draft records agent execution scope, not human finalization. Planning PR: https://github.com/justin-napolitano/littlelink/pull/30. The pinned brand contract and image in docs/branding/2026-10-22 govern presentation. Update only the selected active template; preserve candidate presentations, shared content, all routes, metadata URLs, contact redirect implementation, and analytics consent behavior. No dependencies or new external services.

## Plan of Work

1. Register scope, commit initiative plan, implement on the child branch.
2. Replace active template's oversized hero and icon pills with a modest text identity and useful grouped link directory. Use paper, ink, stone, restrained slate, sans system fallbacks, 44px minimum links, wrapping layout and visible focus. Keep existing content verbatim.
3. Align active control metadata and theme-color metadata without changing route or content authority.
4. Run existing design validation and build, route/HTML checks, contrast calculation, and diff review. Obtain rendered desktop/mobile captures, keyboard/reflow/zoom checks and visual QA when permitted browser tooling is available.
5. Open implementation PR to the initiative; hold merge/deploy for coordinated integration and required visual review.

## Validation and Acceptance

Baseline npm run design:validate and npm run build passed. Vercel adapter warns that local Node 24 is mapped to production Node 22. Browser tools are unavailable in this agent; report visual verification as blocked until permitted tooling is provided. Preserve API and consent source byte for byte. Revert this presentation commit to recover; no data or infrastructure migration.

## Outcomes & Retrospective

The approved brand implementation remains unchanged by this prerequisite. Canonical graph/schema/event contracts must validate before integration; missing plan fields describe requested review policy, not completed approval.

## Artifacts and Notes

Reviewable governance prerequisite: docs/governance/brand-governance-prerequisites.md. Finalization fields remain explicitly blank. Legacy graph snapshot retained; actual public reconciler agent events record branch/plan evidence without a human signature. Browser QA remains a separate release gate.

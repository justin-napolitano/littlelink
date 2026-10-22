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
  - src/pages/index.astro
  - src/pages/site.webmanifest.ts
  - src/pages/privacy.astro
  - src/styles/privacy.css
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

## Browser QA follow-up

Explicit user Chromium permission obtained. Comparison found the unchanged privacy route still loaded the superseded oversized serif/green theme. Extend bounded presentation scope to privacy.astro import/class/theme-color and a small local stylesheet; preserve every privacy text node and link. Capture the same route before/after and re-check primary page, reflow and focus. No privacy-policy assertions or consent logic rewritten.

## User-directed forest-green accent revision

The user approved a subsequent accent-only revision for littlelink, the two resume surfaces and Select Projects. For this repository only, the latest user direction supersedes the original board's slate/grey accent tokens: forest #356349, darker hover #244B36, soft sage text selection #E2ECDF. Keep warm paper, body ink, typography, layout and all source facts/links unchanged. Muted labels become soft dark green; thin rules become light green-tinted paper. Apply only to the actual active link-index-mobile-first shared tokens and interaction rules, with privacy inheriting coherent colors. No logo, decorative image, new content, background slab, dependency, API or consent-behavior change.

Capture desktop/mobile and hover/focus/selection states; compare the base08 board with this explicit palette override. Check text contrast, reflow and content invariants, then run existing design/build and actual policy gates. Commit/push for coordinator visual review; do not deploy until that review.

## User-directed readability and native canvas follow-up

Use latest approved warm white #FCFBF8, deeper body ink #202820, 17px/1.6 descriptions in ink, selective short green labels and firmer thin green rules. Set actual html/body canvas forest #356349 for the active page and privacy, with a full-width min-height:100svh warm-white surface; align active theme-color and manifest. RootDocument opt-in preserves inactive candidate canvases. Preserve content, consent, redirects and natural scrolling; no bounce handlers or scroll trapping. Existing production baseline captures supplied by coordinator. Run design validation, build and actual policy; render desktop/mobile after captures and report native Safari elastic-bounce behavior as unverified in Chromium. No deployment before coordinator review.

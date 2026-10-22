# Jaysearch release handoff — actual gates, no authority substitution

## Current decision

[Implementation PR #14](https://github.com/justin-napolitano/jaysearch/pull/14) remains draft and unmerged. Browser/source QA passed, but actual policy-compliance and governed pre-push checks remain blocked. Do not make this PR ready or merge it on the strength of visual QA alone. No initiative→main release PR is represented as ready because its required child integration has not passed.

- Implementation branch: `impl-execplan/unified-brand-20261022`, current head `938a4e0` (full revision in link-wave.json / jaysearch-release-pr.json).
- Parent: `initiative/unified-brand-20261022`, current head `d5f0a7f`.
- Current production main, preserved in both histories: `35249aa02534de254ce87379e23a653eef49280b`.
- Browser evidence: `browser-qa/2026-10-22T18-53-42-262Z`; all five brand reviews summarized in `link-visual-qa.json`.

## Routine corrections completed within authorized scope

1. Refreshed actual GitHub origin refs, eliminating the misleading unpublished-branch finding from explicit-HTTPS pushes.
2. Declared exact font/license, QA, worker-audit and official graph/queue artifacts in the initiative ExecPlan. Added required **blank** finalization fields, never an asserted person/signature/date. Added the canonical policy-validation command signature. ExecPlan lint now has zero errors.
3. Repo-owned `reconcile-remaining-work-transition` accepted the actual initiative-authority and published-origin evidence and generated agent events for decision_gated→review_gated→ready. Graph and queue changes are committed on the initiative and inherited by the implementation branch. No human finalization event was fabricated.
4. Metadata/official reconciliation commits are published. No enforcement rules, state-transition schema, historical commits, branch protection, exception registry or Pages environment policy changed.

## Remaining exact gates

Read the saved machine outputs:

- `jaysearch-release-plan-lint.json`: zero errors.
- `jaysearch-release-policy.json`: `ok:false`, `status:blocked`.
- `jaysearch-release-prepush.json`: `ok:false`, `status:blocked`.
- `jaysearch-release-pr.json`: actual GitHub PR/check projection: PR14 OPEN/draft, mergeStateStatus UNSTABLE, Jaysearch CI FAILURE (two recorded runs), GitGuardian SUCCESS. These CI failures are an additional unresolved release gate; no bypass or readiness claim.

Policy blockers:

- `state_transition:unknown_surface_class` for `docs/site.css`, `docs/fonts/Inter-OFL.txt`, `docs/fonts/Inter-Variable.ttf`, and `design-qa.md`. Declaring paths removes undeclared-file errors but cannot invent missing platform surface classes.
- Procedural order flags published documentation/audit commits `298c197`, `1b485f4`, `859927b`. Existing `_classify_commit` recognizes feat/fix/refactor, but the real `style:` presentation commit is classified `unknown` with order99; later `docs:` commits then violate class order. Published history has not been rewritten to conceal this.
- `graph_action_required` and `queued_execplans_update_required`: policy requires these files differ in child-vs-initiative diff, even though the repo-owned reconciler has already updated the authoritative initiative and those exact records are inherited by the child. Current node is ready; this is no longer a missing actual graph event.
- Pre-push additionally reports pre-existing `governance:required_check_name_command_drift:design_review`: historical plans use the same normalized check ID for both `bin/design-iteration` and prose commands beginning `run`. Examples: `.agent/execplans/20260521-attempt-evaluation-runner-v1-codex-01-execplan.md` versus `20260520-plan-quality-score-v1-codex-01-execplan.md`.

## Concrete prerequisite proposal, not executed

A separately reviewed governance prerequisite must resolve the contract mismatch before this release can advance. The maintainer should review (a) classification for real static web documentation/CSS/font/QA artifacts, (b) lawful treatment of a published style-only commit followed by required audit/QA documentation, (c) authoritative inherited graph-event evidence versus mandatory child-diff bits, and (d) consistent executable design-review check signatures in historical plans. Add focused regression coverage before adopting any platform correction. A time-bound owner-approved exception, if the governing process permits one, must be explicit and reviewed; none exists or is claimed here. Do not weaken checks, edit schemas simply to force this patch through, rewrite published history, or manufacture extra graph changes.

## Release sequence after real gates pass

1. Re-run plan lint, policy-compliance and governed pre-push against the actual parent initiative; preserve passing outputs and published head.
2. Only then make PR14 ready, complete the required review, and integrate implementation→initiative through its lawful PR path. Reconcile the real merge evidence using repo-owned commands.
3. Open the resulting concrete initiative→main release PR for human review, containing the final CSS/fonts, prerequisite fixes, QA and preserved production bibliography. That PR is currently pending, not ready-by-assertion.
4. A human must perform the required signed main finalization according to `.agent/AGENTS.md`, `.agent/PLANS.md` and `spec/workflow.yaml`. Do not fill finalized_by/finalized_at/signature fields as an agent. User authorization to deploy does not itself manufacture a cryptographic human signature.
5. After lawful main integration, let `.github/workflows/pages.yml` run (or explicitly dispatch its existing workflow on main) and verify the real deployment and public site.

## Actual Pages route and gate

- URL: https://justin-napolitano.github.io/jaysearch/ ; no custom CNAME.
- Workflow: `.github/workflows/pages.yml`, ID `283556159`, supports `workflow_dispatch` and uploads `docs` directly.
- `github-pages` environment has a custom branch policy allowing **main only**. No policy changed; worker-branch dispatch is not a substitute.
- Previous successful deployment ID `4858049501`, run `26618958895`, commit `35249aa02534de254ce87379e23a653eef49280b`.

No workflow dispatch, protected merge, domain promotion, false human finalization or wider platform repair was performed by this agent.

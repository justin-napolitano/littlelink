# Unified brand rollout

Updated 2026-10-22T19:59:09.665896+00:00.

Approved Index / Simplified identity without title marks implemented across 17 repositories. Browser QA is complete. 13/13 Vercel projects promoted to their existing domains; two archived writing-site Pages workflows succeeded; standalone PDF published. Jaysearch release remains blocked by its repository integration checks.

## Verified behavior

- Chromium responsive captures at 390 / 768 / 1440 px plus 320 px and effective 200% reflow, combined approved-reference comparisons, keyboard focus and core interactions. Effective reflow is recorded accurately; native browser toolbar zoom was not claimed.
- Repaired narrow-screen overflow, title inconsistencies, secondary privacy styling, input labels and photo descriptions. Source facts, authentication boundaries and data behavior preserved.
- Canonical and legacy web PDFs now use their own public DOM/privacy rules. All 19 experience bullets match each source; private phone absent. Full PDFs are 6 / 5 pages; separate standalone legacy PDF is 1 page. No one-page or ATS claim for full web exports.
- Supported framework/MDX prerequisites and SELECT-only schema readiness fixes included. Existing unrelated dependency advisory findings remain documented; no migration was run.
- No DNS, redirect, Vercel protection or credential settings changed. Rollback deployment IDs recorded before promotion. Zola retains its existing CNAME/DNS split: Pages published, existing custom domain still serves Vercel link site.

## Repositories

| Repository | Implementation PR | Reviewed source | Release |
|---|---|---|---|
| littlelink | [PR](https://github.com/justin-napolitano/littlelink/pull/31) | `afe3f0f8` | Live on existing Vercel domains; exact reviewed build promoted |
| creative-resume | [PR](https://github.com/justin-napolitano/creative-resume/pull/33) | `662c871a` | Live on existing Vercel domains; exact reviewed build promoted |
| selected-projects | [PR](https://github.com/justin-napolitano/selected-projects/pull/39) / [green refinement](https://github.com/justin-napolitano/selected-projects/pull/40) | `23a877b1` | Live on existing Vercel domains; exact reviewed build promoted |
| justin-portfolio-poc-with-docs | [PR](https://github.com/justin-napolitano/justin-portfolio-poc-with-docs/pull/34) | `23f47da4` | Live on existing Vercel domains; exact reviewed build promoted |
| burdlytics_boilerplate | [PR](https://github.com/justin-napolitano/burdlytics_boilerplate/pull/10) | `07b71386` | Live on existing Vercel domains; exact reviewed build promoted |
| jaysearch | [PR](https://github.com/justin-napolitano/jaysearch/pull/14) | `938a4e05` | Built and browser verified; repository integration policy blocks release |
| clinical-registry-data-platform-site | [PR](https://github.com/justin-napolitano/clinical-registry-data-platform-site/pull/2) | `c7eaa638` | Live on existing Vercel domains; exact reviewed build promoted |
| journal-zine | [PR](https://github.com/justin-napolitano/journal-zine/pull/16) | `c6f9993d` | Live on existing Vercel domains; exact reviewed build promoted |
| hire-me | [PR](https://github.com/justin-napolitano/hire-me/pull/6) | `3b2a0e8e` | Live on existing Vercel domains; exact reviewed build promoted |
| news-reader | [PR](https://github.com/justin-napolitano/news-reader/pull/18) | `1cdd5e1e` | Live on existing Vercel domains; exact reviewed build promoted |
| data-strategist-resume | [PR](https://github.com/justin-napolitano/data-strategist-resume/pull/4) | `c09ae8de` | Standalone PDF published to existing pit branch |
| resume-site-2 | [PR](https://github.com/justin-napolitano/resume-site-2/pull/4) / [green refinement](https://github.com/justin-napolitano/resume-site-2/pull/5) | `4d9effcc` | Live on existing Vercel domains; exact reviewed build promoted |
| portfolio-for-real | [PR](https://github.com/justin-napolitano/portfolio-for-real/pull/4) | `f8e3a567` | Live on existing Vercel domains; exact reviewed build promoted |
| jnapolitano.com | [PR](https://github.com/justin-napolitano/jnapolitano.com/pull/86) | `79b6c8d1` | Merged; existing Pages workflow succeeded |
| jnapolitano-site | [PR](https://github.com/justin-napolitano/jnapolitano-site/pull/19) | `aa8e78d5` | Merged; existing Pages workflow succeeded |
| personal-suite-client-site | [PR](https://github.com/justin-napolitano/personal-suite-client-site/pull/3) | `5726f5eb` | Live on existing Vercel domains; exact reviewed build promoted |
| personal-suite-product-launch-site | [PR](https://github.com/justin-napolitano/personal-suite-product-launch-site/pull/3) | `9dc3fb34` | Live on existing Vercel domains; exact reviewed build promoted |

## Current four-site green refinement

The user requested green interaction accents and useful text highlights on the two resume sites, personal links and Select Projects only. Those four refinements are live. Forest `#356349`, deeper hover `#244b36`, sage `#e2ecdf`, green secondary `#4e6550` and pale green rules `#cfd9c8` replace their grey/slate accents. Body ink, paper, type scale, content and layout are retained.

Review: [four-site PNG](green-review.png). Desktop/mobile, hover/focus/selection and dark-theme evidence is retained. Final public browser checks: 4/4 HTTP200, no page JavaScript errors or page overflow. Both public web PDFs match the newly verified green artifacts. No other site received the accent revision.

A separate post-release Journal hydration correction is tested in [PR18](https://github.com/justin-napolitano/journal-zine/pull/18), with explicit UTC timestamps and cross-timezone browser proof. It is intentionally held after the user narrowed current work to the four accent sites; it is not represented as deployed.

## Evidence and remaining work

- Per-repo `design-qa.md`, committed screenshot evidence where supported, and coordinator-held browser/PDF/public-verification reports record actual checks.
- `production-releases.json`, `staging-deployments.json` and `deployment-inventory.json` retain exact build IDs, source commits and rollback pointers.
- Jaysearch: visual implementation is verified, but existing commit-order/source-surface/design-review/graph policy checks block integration. Human-signed finalization and the existing main-only Pages environment remain intact; no bypass or signature was fabricated. See its implementation PR for the concrete handoff.
- Initiative-based source PRs remain reviewable in their governed branch flow. Production artifact promotion does not claim main finalization.
- Original working-tree change categories remain present; no initial byte-level snapshot exists, so byte-for-byte preservation is not asserted.

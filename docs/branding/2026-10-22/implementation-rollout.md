# Unified brand rollout

Updated 2026-10-22T19:33:10.131179+00:00.

Approved Index / Simplified identity without title marks implemented across17 repositories. Browser QA is complete. 13/13 Vercel projects promoted to their existing domains; two archived writing-site Pages workflows succeeded; standalone PDF published. Jaysearch release remains blocked by its repository integration checks.

## Verified behavior

- Chromium responsive captures at390/768/1440px plus320px and effective200% reflow, combined approved-reference comparisons, keyboard focus and core interactions. Effective reflow is recorded accurately; native browser toolbar zoom was not claimed.
- Repaired narrow-screen overflow, title inconsistencies, secondary privacy styling, input labels and photo descriptions. Source facts, authentication boundaries and data behavior preserved.
- Canonical and legacy web PDFs now use their own public DOM/privacy rules. All19 experience bullets match each source; private phone absent. Full PDFs are6/5pages; separate standalone legacy PDF is1page. No one-page or ATS claim for full web exports.
- Supported framework/MDX prerequisites and SELECT-only schema readiness fixes included. Existing unrelated dependency advisory findings remain documented; no migration was run.
- No DNS, redirect, Vercel protection or credential settings changed. Rollback deployment IDs recorded before promotion. Zola retains its existing CNAME/DNS split: Pages published, existing custom domain still serves Vercel link site.

## Repositories

| Repository | Implementation PR | Reviewed source | Release |
|---|---|---|---|
| littlelink | [PR](https://github.com/justin-napolitano/littlelink/pull/31) | `78966d39` | Live on existing Vercel domains; exact reviewed build promoted |
| creative-resume | [PR](https://github.com/justin-napolitano/creative-resume/pull/33) | `43c6f29a` | Live on existing Vercel domains; exact reviewed build promoted |
| selected-projects | [PR](https://github.com/justin-napolitano/selected-projects/pull/39) | `592f52be` | Live on existing Vercel domains; exact reviewed build promoted |
| justin-portfolio-poc-with-docs | [PR](https://github.com/justin-napolitano/justin-portfolio-poc-with-docs/pull/34) | `23f47da4` | Live on existing Vercel domains; exact reviewed build promoted |
| burdlytics_boilerplate | [PR](https://github.com/justin-napolitano/burdlytics_boilerplate/pull/10) | `07b71386` | Live on existing Vercel domains; exact reviewed build promoted |
| jaysearch | [PR](https://github.com/justin-napolitano/jaysearch/pull/14) | `938a4e05` | Built and browser verified; repository integration policy blocks release |
| clinical-registry-data-platform-site | [PR](https://github.com/justin-napolitano/clinical-registry-data-platform-site/pull/2) | `c7eaa638` | Live on existing Vercel domains; exact reviewed build promoted |
| journal-zine | [PR](https://github.com/justin-napolitano/journal-zine/pull/16) | `c6f9993d` | Live on existing Vercel domains; exact reviewed build promoted |
| hire-me | [PR](https://github.com/justin-napolitano/hire-me/pull/6) | `3b2a0e8e` | Live on existing Vercel domains; exact reviewed build promoted |
| news-reader | [PR](https://github.com/justin-napolitano/news-reader/pull/18) | `1cdd5e1e` | Live on existing Vercel domains; exact reviewed build promoted |
| data-strategist-resume | [PR](https://github.com/justin-napolitano/data-strategist-resume/pull/4) | `c09ae8de` | Standalone PDF published to existing pit branch |
| resume-site-2 | [PR](https://github.com/justin-napolitano/resume-site-2/pull/4) | `bb1ba380` | Live on existing Vercel domains; exact reviewed build promoted |
| portfolio-for-real | [PR](https://github.com/justin-napolitano/portfolio-for-real/pull/4) | `f8e3a567` | Live on existing Vercel domains; exact reviewed build promoted |
| jnapolitano.com | [PR](https://github.com/justin-napolitano/jnapolitano.com/pull/86) | `79b6c8d1` | Merged; existing Pages workflow succeeded |
| jnapolitano-site | [PR](https://github.com/justin-napolitano/jnapolitano-site/pull/19) | `aa8e78d5` | Merged; existing Pages workflow succeeded |
| personal-suite-client-site | [PR](https://github.com/justin-napolitano/personal-suite-client-site/pull/3) | `5726f5eb` | Live on existing Vercel domains; exact reviewed build promoted |
| personal-suite-product-launch-site | [PR](https://github.com/justin-napolitano/personal-suite-product-launch-site/pull/3) | `9dc3fb34` | Live on existing Vercel domains; exact reviewed build promoted |

## Evidence and remaining work

- Per-repo `design-qa.md`, committed screenshot evidence where supported, and coordinator-held browser/PDF/public-verification reports record actual checks.
- `production-releases.json`, `staging-deployments.json` and `deployment-inventory.json` retain exact build IDs, source commits and rollback pointers.
- Jaysearch: visual implementation is verified, but existing commit-order/source-surface/design-review/graph policy checks block integration. Human-signed finalization and the existing main-only Pages environment remain intact; no bypass or signature was fabricated. See its implementation PR for the concrete handoff.
- Initiative-based source PRs remain reviewable in their governed branch flow. Production artifact promotion does not claim main finalization.
- Original working-tree change categories remain present; no initial byte-level snapshot exists, so byte-for-byte preservation is not asserted.

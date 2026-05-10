# Candidate Templates

## Purpose

Plan real template candidates before implementation.

The current live template is `link-index-mobile-first`. It remains one template. Future visual directions should be built as separate inactive templates so they can be previewed, compared, and selected cleanly.

## Rules

- A candidate is a complete template, not a small variant of the active template.
- Candidates render shared `src/data/site.json` content.
- Candidates must not change route labels, route URLs, privacy behavior, analytics behavior, or direct link behavior.
- Candidates must be previewable without changing the production active-template config.
- Candidate PRs must include mobile and desktop screenshots.
- New candidate directions need a JSON design contract before implementation.

## Design Contracts

Contracts live in `src/design-templates/contracts/`.

- `personal-site-template-contract.schema.json`: reusable schema for personal-site template briefs.
- `internet-foyer.contract.json`: next planned direction for a more curious personal root.

A contract captures audience modes, references, content rules, visual rules, motion rules, privacy invariants, implementation scope, QA gates, and selection criteria. Build work should start only after the contract is reviewed and marked `approved_for_build`.

## First Build Batch

Status: implemented as inactive preview templates.

### `quiet-index`

Status: `implemented_first_batch`

Most normal, trustworthy, and personal version of the root.

- Primary question: Does this feel like an organized person instead of a tech presentation?
- References: `derek-sivers`, `rauno-freiberg`, `thinkhouse-2026-web-design`
- Changes: quieter surfaces, less card emphasis, plain system typography, minimal motion.
- Activation test: feels more trustworthy than `link-index-mobile-first` without becoming generic.

### `garden-index`

Status: `implemented_first_batch`

Root template that creates a stronger bridge into `docs.jnap.me` as the public garden/wiki.

- Primary question: Does the root make the docs/wiki feel like the deeper public knowledge surface without overexplaining?
- References: `maggie-appleton`, `maggie-appleton-digital-garden`, `tania-rascia`
- Changes: stronger docs route emphasis, subtle garden/navigation metaphor, more editorial spacing.
- Activation test: makes `docs.jnap.me` feel important without turning the root into a blog.

### `proof-index`

Status: `implemented_first_batch`

Hiring/professional proof-forward root focused on resume, docs, GitHub, and projects.

- Primary question: Does this help a reviewer trust the work faster?
- References: `paco-coursey`, `brian-lovin`, `one-page-love-minimal`
- Changes: stronger work/proof grouping, scan-oriented hierarchy, project-ready module space.
- Activation test: improves professional scan speed without making the page feel like a deck.

## Later Candidates

- `internet-foyer-index`: curious personal front-room template that invites interaction instead of explaining everything.
- `card-index`: warmer personal card style with stronger tactile identity.
- `ledger-index`: text-forward durable personal directory.
- `social-card-index`: more personal/social while avoiding embedded feeds.
- `business-card-index`: reusable small-business/person template for future tenants.

## QA

Every candidate needs:

- `npm run build`
- route health check
- mobile screenshot
- desktop screenshot
- no text overflow
- keyboard focus visible
- readable contrast
- unchanged privacy behavior
- unchanged shared content
- preview without production activation

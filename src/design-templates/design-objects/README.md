# Design Objects

Design objects are build-grade JSON specifications.

They sit between a client-facing pitch and the template implementation. A pitch says what a direction should feel like. Design objects say exactly what must be built: tokens, classes, layout rules, content bindings, accessibility expectations, and implementation maps.

## Object Sets

Each object-set JSON file validates against `design-object-set.schema.json`.
Kind-specific guardrail schemas live in `schemas/`. `npm run design:validate` loads these schemas for palette, component, accessibility, implementation-map, and DTCG token files.

Common object kinds:

- `palette`: named colors, values, usages, CSS variables, and pairing expectations.
- `typography`: font roles, type scales, label rules, and CSS variables.
- `spacing`: spacing scale and responsive rhythm.
- `shape`: radii, borders, shadows, and surface rules.
- `motion`: durations, easing, interaction states, and reduced-motion behavior.
- `layout`: mobile-first flow, desktop transformations, and first-screen rules.
- `component`: named UI objects with class names, states, token bindings, and accessibility rules.
- `content_map`: shared content paths mapped into design objects.
- `accessibility`: contrast, focus, tap-target, semantic, and reduced-motion requirements.
- `implementation_map`: file, selector, and QA ownership for implementation.

## Tokens

Template token exports live next to the design objects:

- `[template-id]/tokens/color.tokens.json`
- `[template-id]/tokens/typography.tokens.json`
- `[template-id]/tokens/spacing.tokens.json`

These files use DTCG `$type`, `$value`, `$description`, and `$extensions` fields so the same contracts can feed CSS, previews, docs, and future API workflows. Repo-specific CSS variables, CSS fallback values, source object IDs, and provenance live under the `$extensions.me.jnap` namespace.

## Workflow

1. Approve a design pitch and one-pager.
2. Create design-object JSON files for the selected template.
3. Export DTCG token files for build-critical color, typography, and spacing decisions.
4. Run `npm run design:validate`.
5. Build an inactive preview template from the design objects and tokens.
6. Compare screenshots before activation.

Design objects are required for every implemented template. New builds use `ready_for_build`; backfilled or completed template work may use `complete` on the build plan, but still has to pass `npm run design:validate`.

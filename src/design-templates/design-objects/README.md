# Design Objects

Design objects are build-grade JSON specifications.

They sit between a client-facing pitch and the template implementation. A pitch says what a direction should feel like. Design objects say exactly what must be built: tokens, classes, layout rules, content bindings, accessibility expectations, and implementation maps.

## Object Sets

Each object-set JSON file validates against `design-object-set.schema.json`.

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

## Workflow

1. Approve a design pitch and one-pager.
2. Create design-object JSON files for the selected template.
3. Validate every object set against `design-object-set.schema.json`.
4. Build an inactive preview template from the design objects.
5. Compare screenshots before activation.

Design objects are still planning artifacts until the build plan status is `ready_for_build`.

# Design Templates

Design templates render the shared `src/data/site.json` content through a selectable presentation layer.

The active template is selected by `src/data/active-template.json`. Template switches must not change route labels, URLs, privacy choices, or provider-backed data.

The current production design is preserved as `link-index-mobile-first`.

## Controls

Template controls are declarative for now:

- `src/data/design-control.json` defines tenant-level content, brand, theme, module, QA, and reference controls.
- `src/design-templates/link-index-mobile-first/control-map.json` maps the active template to content paths, CSS tokens, selectors, accessibility expectations, and activation gates.

These files do not change the rendered page. They exist so future visual slices can tune the design through explicit controls instead of ad hoc CSS edits.

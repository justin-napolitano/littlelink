# Design Templates

Design templates render the shared `src/data/site.json` content through a selectable presentation layer.

The active template is selected by `src/data/active-template.json`. Template switches must not change route labels, URLs, privacy choices, or provider-backed data.

The current production design is preserved as `link-index-mobile-first`.

## Language

- A template is a complete presentation implementation: layout, spacing, type, color, motion, module emphasis, and interaction behavior.
- A candidate template is a real inactive template built for comparison. It is not a minor iteration of the active template.
- The active template is the one selected for the live root route.
- Shared content is not a template. `src/data/site.json` should remain good enough to serve every candidate template.
- Template-specific spacing, typography, background treatment, component density, and interaction choices belong to the template folder and its control map.

The current `link-index-mobile-first` template may keep evolving, but it should be treated as one template. Future visual directions should be added as separate templates so they can be compared and selected cleanly.

## Candidate Planning

Candidate plans live in:

- `src/design-templates/candidate-templates.md`
- `src/design-templates/candidate-templates.json`
- `src/design-templates/contracts/*.contract.json`

Build the first batch before expanding the set:

- `quiet-index`
- `garden-index`
- `proof-index`

Production should remain on `link-index-mobile-first` until a candidate passes preview, screenshot QA, and selection review.

## Required Lifecycle

Every implemented template, including the active template, must carry the same governed lifecycle artifacts:

- `src/design-templates/[template-id]/manifest.yaml`
- `src/design-templates/[template-id]/control-map.json`
- `src/design-templates/contracts/[template-id].contract.json`
- `src/design-templates/pitches/examples/jnap-[template-id].pitch.json`
- `src/design-templates/pitches/examples/jnap-[template-id].one-pager.json`
- `src/design-templates/pitches/examples/jnap-[template-id].build-plan.json`
- `src/design-templates/design-objects/[template-id]/*.json`
- `src/design-templates/design-objects/[template-id]/tokens/*.tokens.json`

`npm run design:validate` validates this lifecycle for every ID in `src/lib/design-template-ids.ts`. A template-specific check can still be run with `-- --template-id [template-id]`.

The lifecycle does not activate templates. It defines the contract, design objects, token refs, implementation map, and QA gates that make each template maintainable and comparable.

## Pitch Workflow

Client design work uses a contract stack:

1. `src/design-templates/pitches/client-intake.schema.json`
2. `src/design-templates/contracts/personal-site-template-contract.schema.json`
3. `src/design-templates/pitches/design-pitch.schema.json`
4. `src/design-templates/pitches/design-one-pager.schema.json`
5. `src/design-templates/design-objects/design-object-set.schema.json`
6. `src/design-templates/design-objects/*/tokens/*.tokens.json`
7. `src/design-templates/pitches/template-build-plan.schema.json`
8. `.agent/execplans/templates/client-design-pitch-execplan.md`
9. `.agent/execplans/templates/client-template-build-execplan.md`

The pitch step can compare several design directions, but it should recommend one direction for the first build. The one-pager turns that recommendation into a client-facing summary of fonts, palette, layout, motion, modules, references, deliverables, and approvals. Design objects turn the recommendation into build-grade classes, layout rules, content maps, accessibility requirements, and implementation maps. DTCG token files turn the build-critical palette, type, and spacing choices into machine-readable values while repo-specific CSS output details live under `$extensions.me.jnap`. The build-plan step turns the approved pitch into implementation slices and validation commands. The execplan step executes those slices as an inactive preview template.

JNAP planning artifacts live in `src/design-templates/pitches/examples/`.
JNAP design objects live in `src/design-templates/design-objects/[template-id]/`.
Run `npm run design:validate` before a build agent edits template code.

## Preview Harness

Implemented templates are registered in `src/lib/design-template-registry.ts`.
Implemented template IDs live in `src/lib/design-template-ids.ts` so metadata-only
preview pages can avoid importing template presentation CSS.

Implemented preview templates:

- `link-index-mobile-first`
- `quiet-index`
- `garden-index`
- `proof-index`
- `internet-foyer-index`

Preview routes use `/preview/[templateId]`. The preview route:

- renders the requested implemented template against shared `src/data/site.json`
- does not read or modify `src/data/active-template.json`
- uses `noindex` metadata
- returns `404` for planned templates that are not implemented yet

The preview index lives at `/preview` and shows cards for implemented and planned templates. Only implemented template cards are clickable.

## Controls

Template controls are declarative for now:

- `src/data/design-control.json` defines tenant-level content, brand, theme, module, QA, and reference controls.
- `src/design-templates/[template-id]/control-map.json` maps each template to content paths, source contracts, tokens, selectors, accessibility expectations, and activation gates.
- `src/design-templates/contracts/*.contract.json` defines candidate scope before any template code is created.

These files do not change the rendered page. They exist so future visual slices can tune the design through explicit controls instead of ad hoc CSS edits.

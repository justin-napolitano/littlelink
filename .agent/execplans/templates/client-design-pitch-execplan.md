# Client Design Pitch ExecPlan Template

## Goal

Generate a governed personal-site design pitch from client intake and reusable template contracts.

## Inputs

- Client intake: `<CLIENT_INTAKE_JSON>`
- Candidate template contracts: `<TEMPLATE_CONTRACT_JSON_LIST>`
- Output pitch path: `<OUTPUT_PITCH_JSON>`
- Output one-pager path: `<OUTPUT_ONE_PAGER_JSON>`
- Optional review notes: `<REVIEW_NOTES>`

## Hard Requirements

- Do not write template implementation code.
- Do not expose private contact URLs, environment variables, private photos, or unreviewed client assets.
- Keep client-facing language separate from internal implementation details.
- Treat the pitch as a planning artifact until approved.
- Preserve route, privacy, analytics, and provider-backed behavior unless a separate content contract approves changes.

## Steps

1. Read the client intake and referenced template contracts.
2. Identify audience priority, content inventory gaps, privacy constraints, and visual risks.
3. Produce two to four pitch directions.
4. Recommend exactly one direction for the first build.
5. Define the generated template id, preview route, files to create, files to update, and execplan template.
6. Write the pitch JSON at `<OUTPUT_PITCH_JSON>` using `src/design-templates/pitches/design-pitch.schema.json`.
7. Write the client-facing one-pager JSON at `<OUTPUT_ONE_PAGER_JSON>` using `src/design-templates/pitches/design-one-pager.schema.json`.
8. Validate the pitch JSON and one-pager JSON against their schemas.
9. Finish with a summary of recommendation, fonts, palette, risks, approval gates, and next build-plan command.

## Validation

- JSON parses.
- Pitch validates against `src/design-templates/pitches/design-pitch.schema.json`.
- One-pager validates against `src/design-templates/pitches/design-one-pager.schema.json`.
- No implementation files are created.
- No private data is included.

## Stop Conditions

- Intake is missing audience, site goal, or privacy constraints.
- Referenced template contracts do not exist.
- The pitch would require private assets that are not approved.
- The requested output would activate a template instead of planning one.

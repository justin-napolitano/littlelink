# Design Pitches

Design pitches turn reusable template contracts into client-specific build plans.

This layer exists so the platform can support real design work for Justin's root and later client sites without making each template a one-off.

## Contract Stack

1. **Client intake**
   `client-intake.schema.json` captures the person or business, audience, content inventory, constraints, and approval gates.

2. **Template contract**
   `../contracts/personal-site-template-contract.schema.json` defines the reusable template direction.

3. **Design pitch**
   `design-pitch.schema.json` turns intake plus template contracts into pitch directions, a recommendation, and the files a build would create.

4. **Design one-pager**
   `design-one-pager.schema.json` summarizes the selected direction for client review: thesis, fonts, palette, layout, motion, modules, references, deliverables, and approvals.

5. **Design objects**
   `../design-objects/design-object-set.schema.json` defines build-grade JSON for palette, typography, spacing, shape, motion, layout, components, content map, accessibility, and implementation map.

6. **Design tokens**
   `../design-objects/*/tokens/*.tokens.json` exports DTCG color, typography, and spacing decisions for build tooling.

7. **Template build plan**
   `template-build-plan.schema.json` turns an approved pitch into implementation slices, validation commands, PR policy, and stop conditions.

8. **ExecPlan**
   `.agent/execplans/templates/client-template-build-execplan.md` is the human/agent execution wrapper for the build plan.

## Rules

- A pitch can compare several directions, but only one direction should be recommended for the first build.
- Pitches must separate client-facing language from internal build details.
- Template code should not be written until the pitch is approved for an execplan.
- Client-specific private material must stay out of public template contracts.
- The generated implementation must be an inactive preview template until screenshots and review pass.

## Example

`examples/jnap-internet-foyer.pitch.json` shows how the current JNAP direction becomes a pitch package. It is still planning metadata; it does not activate or build a template.

`examples/jnap-internet-foyer.one-pager.json` is the client-facing version of the same recommendation.

Generate a readable Markdown brief from a one-pager JSON contract:

```bash
npm run design:one-pager -- --input src/design-templates/pitches/examples/jnap-internet-foyer.one-pager.json --output src/design-templates/pitches/generated/jnap-internet-foyer.one-pager.md --design-objects-dir src/design-templates/design-objects/internet-foyer-index
```

Generate a visual HTML review sheet from the same contracts:

```bash
npm run design:one-pager -- --input src/design-templates/pitches/examples/jnap-internet-foyer.one-pager.json --output src/design-templates/pitches/generated/jnap-internet-foyer.one-pager.html --design-objects-dir src/design-templates/design-objects/internet-foyer-index
```

Validate the design contract layer before implementation:

```bash
npm run design:validate
```

Generated Markdown and HTML are for review and handoff. The JSON contracts and token files remain the source of truth.

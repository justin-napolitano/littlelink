# Design Contracts

Design contracts are build prerequisites for new templates.

The goal is to make personal-site design work explicit before implementation:

- what the template should make someone feel
- which audiences it serves
- which references matter and what is being borrowed
- which content modules are required or optional
- which motion, privacy, and accessibility rules constrain the build
- which files a future implementation is allowed to touch

## Files

- `personal-site-template-contract.schema.json`: reusable schema for personal-site template briefs.
- `internet-foyer.contract.json`: next candidate direction for a more curious, personal, interactive root.

## Workflow

1. Write or update a contract.
2. Review references and design constraints.
3. Approve the contract for build.
4. Create the inactive template folder.
5. Register the template for `/preview/[templateId]`.
6. Compare mobile and desktop screenshots before activation.

Contracts do not activate templates. They define the scope and design standard for future implementation slices.

For client work, contracts are consumed by the pitch workflow in `src/design-templates/pitches/`. That workflow turns intake into a design pitch, then into a template build plan and execplan.

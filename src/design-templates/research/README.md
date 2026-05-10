# Design Research

This folder holds the research layer for template design decisions.

- `jnap-design-bibliography.json` is the machine-readable source list.
- `jnap-design-bibliography.md` is the readable review copy.
- `jnap-root-design-requirements.json` maps user stories and bibliography IDs into build-facing requirements.
- `jnap-root-design-requirements.md` is the readable review copy.

Pitches should cite bibliography, user-story, and requirement IDs through `research_basis`. `npm run design:validate` checks that those IDs exist before a build agent starts implementation.

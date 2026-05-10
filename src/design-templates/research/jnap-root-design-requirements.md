# JNAP Root Design Requirements

Status: active

These requirements convert the bibliography and user stories into build-facing constraints. JSON remains the source of truth at `src/design-templates/research/jnap-root-design-requirements.json`; this Markdown file is the readable review copy.

## Must

- **Mobile and experience first**: Start from the mobile path, then scale to desktop.
- **Curiosity with clear exits**: Make visitors want to interact further while keeping the useful exits obvious.
- **Show, do not claim**: Use routes, objects, proof, and specificity instead of generic claims.
- **Privacy-reviewed personal texture**: Lifestyle, photo, social-media, and location-adjacent modules need explicit review before activation.
- **Template-owned presentation**: Spacing, typography, layout, density, and motion stay template-owned unless promoted into shared controls.
- **Scalable client template system**: The workflow must support future people and small businesses.
- **Contract-first handoff**: Agentic work must start from auditable JSON contracts and source IDs.

## Should

- **Personal and professional overlap**: One public identity can contain professional proof and personal texture under privacy controls.
- **Garden-ready docs and wiki**: Docs should support exploratory, evolving, linked knowledge.
- **Motion as craft, not dependency**: Motion can create delight, but static structure carries all meaning.

## Core Checks

- First mobile viewport exposes identity plus clear exits.
- `npm run design:validate` verifies bibliography, user stories, requirements, pitch, one-pager, build plan, design objects, and tokens.
- Pitch artifacts cite valid bibliography, user-story, and requirement IDs.
- Preview templates stay inactive until screenshot review and activation decision.

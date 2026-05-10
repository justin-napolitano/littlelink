# Justin Napolitano Design One-Pager

## Direction

**Front Room**

This direction makes the root feel curious, human, and worth exploring without turning it into a pitch deck.

## Design Thesis

A mobile-first front room on the internet: a few high-signal objects, enough personality to keep clicking, and no overexplaining.

**First impression:** Justin has taste, range, and a real life beyond a resume.

**This should not feel like:**

- generic tech portfolio
- SaaS landing page
- resume wall
- over-polished pitch deck

## Typography

- **Identity Display:** 'Fraunces', 'Georgia', serif
- **Readable Body:** -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', system-ui, sans-serif
- **Name:** font family: font.display.identity, font size: clamp(2.8rem, 12vw, 4.75rem), font weight: 560, line height: 1.0, letter spacing: 0
- **Route Label:** font family: font.body.default, font size: 1rem, font weight: 650, line height: 1.2, letter spacing: 0

**Type rules:**

- No viewport-scaled body text.
- No large marketing headline under the name.
- Labels must fit on 390px mobile without wrapping awkwardly.

## Color Palette

- **Warm Paper** `#F5F2EC` --foyer-color-surface-page: body background, outer page field
- **Soft Surface** `#FDFBF7` --foyer-color-surface-object: route object background, identity object background
- **Ink** `#0F100F` --foyer-color-text-primary: name, route labels, icons when monochrome
- **Muted Ink** `rgba(15, 16, 15, 0.65)` --foyer-color-text-secondary: short notes, secondary labels
- **Living Green** `#0F7C66` --foyer-color-accent-living: focus ring, selected accents, route icon tint
- **Electric Blue** `#2563EB` --foyer-color-accent-electric: secondary accent, interactive wake state
- **Soft Line** `rgba(15, 16, 15, 0.12)` --foyer-color-line-soft: object border, surface divider

## Shape, Texture, and Imagery

**Shape**

- Soft object surfaces, but less uniformly card-like than the current template.
- Touchable items remain comfortable and thumb-friendly.
- Desktop can use shelf, table, or loose object placement.

**Texture**

- Subtle paper/object tactility is allowed if performance-safe.
- No decorative blobs, orbs, or generic gradients.

**Imagery**

- No stock imagery.
- Future photos or lifestyle objects require privacy review.
- Objects should represent real routes or real public artifacts.

**Iconography**

- Small route icons can stay.
- Icons should feel like objects, not app-store badges.
- Do not rely on icons without readable labels.

## Experience

**Mobile-first rule:** The first phone screen should show the name and immediate route objects, with a hint that more exists below.

**Layout**

- Group by proximity and spacing instead of visible category headings.
- Keep the first three exits obvious.
- Let desktop become more asymmetric without changing content.

**Interaction**

- Tap feedback should feel immediate.
- Hover/focus can slightly move or wake objects.
- No hidden navigation or hover-only meaning.

**Motion**

- Reduced-motion-safe by default.
- Small Anime.js-style interaction may be prototyped only after static layout works.
- No scroll spectacle or delayed route access.

**Accessibility**

- Readable contrast.
- Visible keyboard focus.
- Touch targets remain comfortable.
- All routes work without animation.

## Content Modules

- **Identity** (required): Name and first impression.
- **Proof routes** (required): Resume, docs, and GitHub for professional trust.
- **Direct contact** (required): Schedule, Signal, and email without exposing private URLs.
- **Social** (required): Human texture through public profiles.
- **Selected objects** (future_optional): Projects, photos, listening, or lifestyle artifacts after privacy review.

## Build Objects

- **Foyer Root** (approved): Template root and token scope.
- **Identity Object** (approved): Name-bearing first impression surface.
- **Route Cluster** (approved): Visual group of related route objects without visible section headings.
- **Route Object** (approved): Touchable route into an external or internal destination.
- **Foyer Footer** (approved): Privacy link and minimal footer surface.


## References

- **Paco Coursey**: Plain personal signal density and route clarity. (https://paco.me/)
- **Joe Coleman Agencies**: Confidence through direct proof listing. (https://getcoleman.com/agencies/)
- **Anime.js**: Playful interaction as proof of craft, not decoration. (https://animejs.com/)
- **Brian Lovin**: Personal operating-system feel. (https://brianlovin.com/)
- **Rauno Freiberg**: Sparse personal signature and restraint. (https://rauno.me/)

## Deliverables

- inactive preview template
- design object JSON files
- mobile screenshot
- desktop screenshot
- design-control updates
- template control map
- activation recommendation

## Approval Checklist

- Design thesis approved.
- Font direction approved.
- Palette approved.
- Motion policy approved.
- Content modules approved.
- Privacy-sensitive future modules explicitly deferred.
- Approved to generate an inactive preview template.

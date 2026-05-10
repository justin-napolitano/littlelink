import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);

const getArg = (name, fallback = undefined) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const inputPath = getArg('--input');
const outputPath = getArg('--output');

if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/generate-design-one-pager.mjs --input <one-pager.json> --output <brief.md>');
  process.exit(1);
}

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const list = (items = []) => items.map((item) => `- ${item}`).join('\n');

const palette = (items = []) =>
  items.map((item) => `- **${item.name}** \`${item.value}\`: ${item.usage}`).join('\n');

const modules = (items = []) =>
  items.map((item) => `- **${item.name}** (${item.status}): ${item.purpose}`).join('\n');

const references = (items = []) =>
  items.map((item) => `- **${item.name}**: ${item.borrow} (${item.url})`).join('\n');

const renderBrief = (onePager) => {
  const typography = onePager.visual_system.typography;
  const client = onePager.client;
  const selected = onePager.selected_direction;
  const thesis = onePager.design_thesis;
  const visual = onePager.visual_system;
  const experience = onePager.experience_system;

  return `# ${client.name} Design One-Pager

## Direction

**${selected.name}**

${selected.why}

## Design Thesis

${thesis.one_liner}

**First impression:** ${thesis.first_impression}

**This should not feel like:**

${list(thesis.not_this)}

## Typography

- **Display:** ${typography.display}
- **Body:** ${typography.body}
- **Labels:** ${typography.labels}

**Type rules:**

${list(typography.rules)}

## Color Palette

${palette(visual.color_palette)}

## Shape, Texture, and Imagery

**Shape**

${list(visual.shape)}

**Texture**

${list(visual.texture)}

**Imagery**

${list(visual.imagery)}

**Iconography**

${list(visual.iconography)}

## Experience

**Mobile-first rule:** ${experience.mobile_first}

**Layout**

${list(experience.layout)}

**Interaction**

${list(experience.interaction)}

**Motion**

${list(experience.motion)}

**Accessibility**

${list(experience.accessibility)}

## Content Modules

${modules(onePager.content_modules)}

## References

${references(onePager.references)}

## Deliverables

${list(onePager.deliverables)}

## Approval Checklist

${list(onePager.approval_checklist)}
`;
};

const onePager = await readJson(inputPath);
const rendered = renderBrief(onePager);
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, rendered);
console.log(`Wrote ${outputPath}`);

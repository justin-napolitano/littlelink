import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);

const getArg = (name, fallback = undefined) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const inputPath = getArg('--input');
const outputPath = getArg('--output');
const designObjectsDir = getArg('--design-objects-dir');

if (!inputPath || !outputPath) {
  console.error(
    'Usage: node scripts/generate-design-one-pager.mjs --input <one-pager.json> --output <brief.md|brief.html> [--design-objects-dir <dir>]'
  );
  process.exit(1);
}

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const list = (items = []) => items.map((item) => `- ${item}`).join('\n');

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const cssVariableName = (object) => object.css_variable ?? object.$extensions?.['me.jnap']?.css_variable ?? '';

const loadDesignObjects = async (dir) => {
  if (!dir) {
    return null;
  }

  const entries = await readdir(dir, { withFileTypes: true });
  const objectSets = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      objectSets.push(await readJson(path.join(dir, entry.name)));
    }
  }

  return objectSets;
};

const objectsForKind = (designObjects, kind) =>
  designObjects?.find((objectSet) => objectSet.kind === kind)?.objects ?? [];

const paletteItems = (onePager, designObjects) => {
  const paletteObjects = objectsForKind(designObjects, 'palette');

  if (paletteObjects.length > 0) {
    return paletteObjects.map((item) => ({
      name: item.name,
      value: item.value,
      usage: (item.usage ?? []).join(', '),
      css_variable: cssVariableName(item)
    }));
  }

  return onePager.visual_system.color_palette;
};

const typographyItems = (onePager, designObjects) => {
  const typographyObjects = objectsForKind(designObjects, 'typography');

  if (typographyObjects.length === 0) {
    return [
      ['Display', onePager.visual_system.typography.display],
      ['Body', onePager.visual_system.typography.body],
      ['Labels', onePager.visual_system.typography.labels]
    ];
  }

  return typographyObjects.map((item) => {
    const value =
      item.value ??
      Object.entries(item.values ?? {})
        .map(([key, entry]) => `${key.replaceAll('_', ' ')}: ${entry}`)
        .join(', ');
    return [item.name, value];
  });
};

const componentObjects = (designObjects) => {
  const components = objectsForKind(designObjects, 'component');

  return components.map((item) => ({
    name: item.name,
    status: item.status,
    purpose: item.purpose
  }));
};

const paletteMarkdown = (items = []) =>
  items
    .map((item) => {
      const variable = item.css_variable ? ` ${item.css_variable}` : '';
      return `- **${item.name}** \`${item.value}\`${variable}: ${item.usage}`;
    })
    .join('\n');

const modulesMarkdown = (items = []) =>
  items.map((item) => `- **${item.name}** (${item.status}): ${item.purpose}`).join('\n');

const referencesMarkdown = (items = []) =>
  items.map((item) => `- **${item.name}**: ${item.borrow} (${item.url})`).join('\n');

const renderBrief = (onePager, designObjects) => {
  const selected = onePager.selected_direction;
  const thesis = onePager.design_thesis;
  const visual = onePager.visual_system;
  const experience = onePager.experience_system;
  const typography = typographyItems(onePager, designObjects);

  return `# ${onePager.client.name} Design One-Pager

## Direction

**${selected.name}**

${selected.why}

## Design Thesis

${thesis.one_liner}

**First impression:** ${thesis.first_impression}

**This should not feel like:**

${list(thesis.not_this)}

## Typography

${typography.map(([name, value]) => `- **${name}:** ${value}`).join('\n')}

**Type rules:**

${list(visual.typography.rules)}

## Color Palette

${paletteMarkdown(paletteItems(onePager, designObjects))}

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

${modulesMarkdown(onePager.content_modules)}

${componentObjects(designObjects).length > 0 ? `## Build Objects

${modulesMarkdown(componentObjects(designObjects))}
` : ''}

## References

${referencesMarkdown(onePager.references)}

## Deliverables

${list(onePager.deliverables)}

## Approval Checklist

${list(onePager.approval_checklist)}
`;
};

const swatchesHtml = (items) =>
  items
    .map(
      (item) => `<article class="swatch">
  <span class="swatch-chip" style="background:${escapeHtml(item.value)}"></span>
  <strong>${escapeHtml(item.name)}</strong>
  <code>${escapeHtml(item.value)}</code>
  <small>${escapeHtml(item.usage)}</small>
</article>`
    )
    .join('\n');

const typographyHtml = (items) =>
  items
    .map(
      ([name, value]) => `<article class="specimen">
  <span>${escapeHtml(name)}</span>
  <p>${escapeHtml(value)}</p>
</article>`
    )
    .join('\n');

const pillsHtml = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n');

const modulesHtml = (items) =>
  items
    .map(
      (item) => `<article class="module">
  <span>${escapeHtml(item.status)}</span>
  <strong>${escapeHtml(item.name)}</strong>
  <p>${escapeHtml(item.purpose)}</p>
</article>`
    )
    .join('\n');

const renderHtml = (onePager, designObjects) => {
  const selected = onePager.selected_direction;
  const thesis = onePager.design_thesis;
  const visual = onePager.visual_system;
  const experience = onePager.experience_system;
  const colors = paletteItems(onePager, designObjects);
  const typography = typographyItems(onePager, designObjects);
  const modules = onePager.content_modules;
  const objects = componentObjects(designObjects);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(onePager.client.name)} Design One-Pager</title>
  <style>
    :root {
      color: #0f100f;
      background: #f5f2ec;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      line-height: 1.5;
    }

    body {
      margin: 0;
      padding: clamp(24px, 5vw, 72px);
    }

    main {
      max-width: 1120px;
      margin: 0 auto;
      display: grid;
      gap: 28px;
    }

    header,
    section {
      background: #fdfbf7;
      border: 1px solid rgba(15, 16, 15, 0.12);
      border-radius: 24px;
      padding: clamp(22px, 4vw, 42px);
    }

    h1,
    h2,
    p {
      margin: 0;
    }

    h1 {
      max-width: 760px;
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(42px, 9vw, 86px);
      line-height: 1;
      letter-spacing: 0;
    }

    h2 {
      margin-bottom: 18px;
      font-size: 20px;
    }

    .kicker,
    .meta {
      color: rgba(15, 16, 15, 0.66);
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .direction {
      display: grid;
      gap: 14px;
      margin-top: 24px;
      max-width: 740px;
      font-size: 19px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 14px;
    }

    .swatch,
    .specimen,
    .module {
      min-height: 120px;
      display: grid;
      align-content: start;
      gap: 10px;
      border: 1px solid rgba(15, 16, 15, 0.12);
      border-radius: 18px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.42);
    }

    .swatch-chip {
      width: 100%;
      height: 54px;
      border: 1px solid rgba(15, 16, 15, 0.14);
      border-radius: 14px;
    }

    code {
      font-size: 13px;
    }

    small,
    .module p,
    .specimen p {
      color: rgba(15, 16, 15, 0.68);
    }

    ul {
      margin: 0;
      padding-left: 18px;
    }

    li + li {
      margin-top: 8px;
    }

    @media (max-width: 640px) {
      body {
        padding: 18px;
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="kicker">${escapeHtml(onePager.client.project_type)}</p>
      <h1>${escapeHtml(onePager.client.name)}</h1>
      <div class="direction">
        <p><strong>${escapeHtml(selected.name)}.</strong> ${escapeHtml(selected.why)}</p>
        <p>${escapeHtml(thesis.one_liner)}</p>
        <p class="meta">First impression: ${escapeHtml(thesis.first_impression)}</p>
      </div>
    </header>

    <section>
      <h2>Color Palette</h2>
      <div class="grid">
        ${swatchesHtml(colors)}
      </div>
    </section>

    <section>
      <h2>Typography</h2>
      <div class="grid">
        ${typographyHtml(typography)}
      </div>
    </section>

    <section>
      <h2>Experience Rules</h2>
      <ul>
        <li>${escapeHtml(experience.mobile_first)}</li>
        ${pillsHtml([...experience.layout, ...experience.interaction, ...experience.motion, ...experience.accessibility])}
      </ul>
    </section>

    <section>
      <h2>Content Modules</h2>
      <div class="grid">
        ${modulesHtml(modules)}
      </div>
    </section>

    ${
      objects.length > 0
        ? `<section>
      <h2>Build Objects</h2>
      <div class="grid">
        ${modulesHtml(objects)}
      </div>
    </section>`
        : ''
    }

    <section>
      <h2>Approval Checklist</h2>
      <ul>
        ${pillsHtml(onePager.approval_checklist)}
      </ul>
    </section>
  </main>
</body>
</html>
`;
};

const onePager = await readJson(inputPath);
const designObjects = await loadDesignObjects(designObjectsDir);
const rendered = outputPath.endsWith('.html') ? renderHtml(onePager, designObjects) : renderBrief(onePager, designObjects);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, rendered);
console.log(`Wrote ${outputPath}`);

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const designObjectRoot = path.join(root, 'src/design-templates/design-objects');
const activeObjectDir = path.join(designObjectRoot, 'internet-foyer-index');
const buildPlanPath = path.join(root, 'src/design-templates/pitches/examples/jnap-internet-foyer.build-plan.json');

const failures = [];

const relative = (filePath) => path.relative(root, filePath);

const fail = (filePath, message) => {
  failures.push(`${relative(filePath)}: ${message}`);
};

const assert = (condition, filePath, message) => {
  if (!condition) {
    fail(filePath, message);
  }
};

const readJson = async (filePath) => {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    fail(filePath, `invalid JSON: ${error.message}`);
    return null;
  }
};

const fileExists = async (filePath) => {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
};

const listFiles = async (dir, predicate) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath, predicate)));
    } else if (predicate(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
};

const objectSetFiles = async () => {
  const entries = await readdir(activeObjectDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(activeObjectDir, entry.name))
    .sort();
};

const hexToRgb = (value) => {
  const normalized = value.trim();
  const short = normalized.match(/^#([0-9a-f]{3})$/i);
  const long = normalized.match(/^#([0-9a-f]{6})$/i);

  if (short) {
    return short[1].split('').map((digit) => parseInt(`${digit}${digit}`, 16));
  }

  if (long) {
    const hex = long[1];
    return [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16));
  }

  return null;
};

const luminanceChannel = (channel) => {
  const scaled = channel / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
};

const contrastRatio = (foreground, background) => {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) {
    return null;
  }

  const fgLum = 0.2126 * luminanceChannel(fg[0]) + 0.7152 * luminanceChannel(fg[1]) + 0.0722 * luminanceChannel(fg[2]);
  const bgLum = 0.2126 * luminanceChannel(bg[0]) + 0.7152 * luminanceChannel(bg[1]) + 0.0722 * luminanceChannel(bg[2]);
  const light = Math.max(fgLum, bgLum);
  const dark = Math.min(fgLum, bgLum);

  return (light + 0.05) / (dark + 0.05);
};

const tokenLike = (value) =>
  typeof value === 'string' &&
  /^[a-z]+(\.[a-z0-9_-]+)+$/.test(value) &&
  !value.includes('var(');

const validateObjectSetShape = (filePath, objectSet, objectIds) => {
  assert(typeof objectSet.object_set_id === 'string', filePath, 'missing object_set_id');
  assert(Number.isInteger(objectSet.version), filePath, 'missing integer version');
  assert(typeof objectSet.status === 'string', filePath, 'missing status');
  assert(typeof objectSet.template_id === 'string', filePath, 'missing template_id');
  assert(typeof objectSet.kind === 'string', filePath, 'missing kind');
  assert(Array.isArray(objectSet.source_refs) && objectSet.source_refs.length > 0, filePath, 'source_refs must be non-empty');
  assert(Array.isArray(objectSet.objects) && objectSet.objects.length > 0, filePath, 'objects must be non-empty');

  for (const object of objectSet.objects ?? []) {
    assert(typeof object.id === 'string', filePath, 'object missing id');
    assert(typeof object.type === 'string', filePath, `${object.id ?? 'object'} missing type`);
    assert(typeof object.name === 'string', filePath, `${object.id ?? 'object'} missing name`);
    assert(typeof object.purpose === 'string', filePath, `${object.id ?? 'object'} missing purpose`);
    assert(typeof object.status === 'string', filePath, `${object.id ?? 'object'} missing status`);

    if (object.id) {
      if (objectIds.has(object.id)) {
        fail(filePath, `duplicate object id ${object.id}; first seen in ${relative(objectIds.get(object.id))}`);
      }
      objectIds.set(object.id, filePath);
    }
  }
};

const validatePalette = (filePath, objectSet) => {
  const colors = new Map();

  for (const object of objectSet.objects) {
    assert(object.type === 'color', filePath, `${object.id} must use type=color`);
    assert(typeof object.value === 'string', filePath, `${object.id} missing color value`);
    assert(/^--[a-z0-9-]+$/.test(object.css_variable ?? ''), filePath, `${object.id} missing valid css_variable`);
    colors.set(object.id, object.value);
  }

  for (const pair of objectSet.metadata?.contrast_pairs ?? []) {
    const foreground = colors.get(pair.foreground);
    const background = colors.get(pair.background);
    assert(Boolean(foreground), filePath, `contrast foreground ${pair.foreground} not found`);
    assert(Boolean(background), filePath, `contrast background ${pair.background} not found`);

    const ratio = foreground && background ? contrastRatio(foreground, background) : null;
    assert(ratio !== null, filePath, `contrast pair ${pair.foreground} on ${pair.background} must use parseable hex colors`);

    if (ratio !== null) {
      assert(ratio >= pair.minimum_ratio, filePath, `contrast ${pair.foreground} on ${pair.background} is ${ratio.toFixed(2)}, below ${pair.minimum_ratio}`);
    }
  }
};

const validateComponents = (filePath, objectSet) => {
  for (const object of objectSet.objects) {
    assert(object.type === 'component', filePath, `${object.id} must use type=component`);
    assert(/^[a-z][a-z0-9-]*$/.test(object.class_name ?? ''), filePath, `${object.id} missing valid class_name`);
    assert(typeof object.selector === 'string' && object.selector.length > 0, filePath, `${object.id} missing selector`);

    if (object.id === 'component.route_object') {
      assert((object.metadata?.min_target_px ?? 0) >= 44, filePath, 'component.route_object must declare metadata.min_target_px >= 44');
    }
  }
};

const validateAccessibility = (filePath, objectSet) => {
  for (const object of objectSet.objects) {
    assert(object.type === 'accessibility_rule', filePath, `${object.id} must use type=accessibility_rule`);
    assert(Array.isArray(object.requirements) && object.requirements.length > 0, filePath, `${object.id} missing requirements`);
    assert(Array.isArray(object.metadata?.machine_checks) && object.metadata.machine_checks.length > 0, filePath, `${object.id} missing metadata.machine_checks`);

    for (const check of object.metadata?.machine_checks ?? []) {
      assert(typeof check.id === 'string', filePath, `${object.id} has machine check without id`);
      assert(typeof check.type === 'string', filePath, `${object.id} has machine check without type`);

      if (check.type === 'tap_target_minimum') {
        assert((check.minimum_px ?? 0) >= 44, filePath, `${object.id} tap target minimum must be at least 44px`);
      }

      if (check.type === 'selector_required' || check.type === 'attribute_required') {
        assert(typeof check.selector === 'string' && check.selector.length > 0, filePath, `${object.id} ${check.type} missing selector`);
      }
    }
  }
};

const validateImplementationMap = (filePath, objectSet) => {
  for (const object of objectSet.objects) {
    assert(object.type === 'implementation_rule', filePath, `${object.id} must use type=implementation_rule`);
    assert(Array.isArray(object.requirements) && object.requirements.length > 0, filePath, `${object.id} missing requirements`);

    if (object.implementation) {
      for (const file of object.implementation.files ?? []) {
        assert(typeof file === 'string' && file.length > 0, filePath, `${object.id} has invalid implementation file`);
      }

      for (const selector of object.implementation.selectors ?? []) {
        assert(typeof selector === 'string' && selector.length > 0, filePath, `${object.id} has invalid selector`);
      }
    }
  }
};

const validateTokenReferences = (filePath, objectSet, objectIds) => {
  const visitTokens = (tokens, owner) => {
    for (const value of Object.values(tokens ?? {})) {
      if (tokenLike(value)) {
        assert(objectIds.has(value), filePath, `${owner} references missing design object token ${value}`);
      }
    }
  };

  for (const object of objectSet.objects ?? []) {
    visitTokens(object.tokens, object.id);

    for (const state of object.states ?? []) {
      visitTokens(state.tokens, `${object.id}.${state.id}`);
    }

    for (const responsive of object.responsive ?? []) {
      visitTokens(responsive.tokens, `${object.id}.${responsive.breakpoint}`);
    }
  }
};

const walkTokenFile = (filePath, node, tokenPath, objectIds) => {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return;
  }

  if (Object.hasOwn(node, '$value')) {
    assert(typeof node.$type === 'string' && node.$type.length > 0, filePath, `${tokenPath} missing $type`);

    const jnap = node.$extensions?.jnap;
    assert(Boolean(jnap), filePath, `${tokenPath} missing $extensions.jnap`);
    assert(typeof jnap?.source_object_id === 'string', filePath, `${tokenPath} missing source_object_id`);

    if (jnap?.source_object_id) {
      assert(objectIds.has(jnap.source_object_id), filePath, `${tokenPath} source_object_id ${jnap.source_object_id} not found in design objects`);
    }

    if (jnap?.css_variable) {
      assert(/^--[a-z0-9-]+$/.test(jnap.css_variable), filePath, `${tokenPath} has invalid css_variable`);
    }

    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith('$')) {
      walkTokenFile(filePath, value, tokenPath ? `${tokenPath}.${key}` : key, objectIds);
    }
  }
};

const validateTokenFile = async (filePath, objectIds) => {
  const tokenFile = await readJson(filePath);

  if (!tokenFile) {
    return;
  }

  assert(typeof tokenFile.$metadata?.token_set_id === 'string', filePath, 'missing $metadata.token_set_id');
  assert(tokenFile.$metadata?.format === 'DTCG-compatible', filePath, 'format must be DTCG-compatible');
  assert(tokenFile.$metadata?.template_id === 'internet-foyer-index', filePath, 'template_id must be internet-foyer-index');
  assert(Array.isArray(tokenFile.$metadata?.source_object_refs) && tokenFile.$metadata.source_object_refs.length > 0, filePath, 'source_object_refs must be non-empty');

  for (const sourceRef of tokenFile.$metadata?.source_object_refs ?? []) {
    assert(await fileExists(path.join(root, sourceRef)), filePath, `source object ref missing: ${sourceRef}`);
  }

  walkTokenFile(filePath, tokenFile, '', objectIds);
};

const validateBuildPlanRefs = async () => {
  const buildPlan = await readJson(buildPlanPath);

  if (!buildPlan) {
    return;
  }

  assert(buildPlan.status === 'ready_for_build', buildPlanPath, 'status must be ready_for_build before a template build execplan can run');

  for (const ref of buildPlan.design_object_refs ?? []) {
    assert(await fileExists(path.join(root, ref)), buildPlanPath, `missing design_object_ref ${ref}`);
  }

  for (const ref of buildPlan.token_refs ?? []) {
    assert(await fileExists(path.join(root, ref)), buildPlanPath, `missing token_ref ${ref}`);
  }

  assert(
    (buildPlan.validation_commands ?? []).includes('npm run design:validate'),
    buildPlanPath,
    'validation_commands must include npm run design:validate'
  );
};

const main = async () => {
  const files = await objectSetFiles();
  const requiredKinds = new Set([
    'palette',
    'typography',
    'spacing',
    'shape',
    'motion',
    'layout',
    'component',
    'content_map',
    'accessibility',
    'implementation_map'
  ]);
  const seenKinds = new Set();
  const objectIds = new Map();
  const objectSets = [];

  for (const filePath of files) {
    const objectSet = await readJson(filePath);

    if (!objectSet) {
      continue;
    }

    validateObjectSetShape(filePath, objectSet, objectIds);
    seenKinds.add(objectSet.kind);
    objectSets.push([filePath, objectSet]);
  }

  for (const requiredKind of requiredKinds) {
    assert(seenKinds.has(requiredKind), activeObjectDir, `missing ${requiredKind} design object set`);
  }

  for (const [filePath, objectSet] of objectSets) {
    if (objectSet.kind === 'palette') {
      validatePalette(filePath, objectSet);
    }

    if (objectSet.kind === 'component') {
      validateComponents(filePath, objectSet);
    }

    if (objectSet.kind === 'accessibility') {
      validateAccessibility(filePath, objectSet);
    }

    if (objectSet.kind === 'implementation_map') {
      validateImplementationMap(filePath, objectSet);
    }

    validateTokenReferences(filePath, objectSet, objectIds);
  }

  const tokenFiles = await listFiles(activeObjectDir, (filePath) => filePath.endsWith('.tokens.json'));
  assert(tokenFiles.length > 0, activeObjectDir, 'missing DTCG-compatible token files');

  for (const filePath of tokenFiles.sort()) {
    await validateTokenFile(filePath, objectIds);
  }

  await validateBuildPlanRefs();

  if (failures.length > 0) {
    console.error('Design contract validation failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${objectSets.length} design object sets and ${tokenFiles.length} token files.`);
};

await main();

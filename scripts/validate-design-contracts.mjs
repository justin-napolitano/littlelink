import { readdir, readFile, stat } from 'node:fs/promises';
import Ajv from 'ajv';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const root = process.cwd();
const designObjectRoot = path.join(root, 'src/design-templates/design-objects');
const researchRoot = path.join(root, 'src/design-templates/research');
const userStoriesRoot = path.join(root, 'src/design-templates/user-stories');

const getArg = (name, fallback = undefined) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const resolveFromRoot = (filePath) => path.resolve(root, filePath);
const templateId = getArg('--template-id', 'internet-foyer-index');
const activeObjectDir = path.join(designObjectRoot, templateId);
const buildPlanPath = resolveFromRoot(
  getArg('--build-plan', 'src/design-templates/pitches/examples/jnap-internet-foyer.build-plan.json')
);
const pitchPath = resolveFromRoot(getArg('--pitch', 'src/design-templates/pitches/examples/jnap-internet-foyer.pitch.json'));
const onePagerPath = resolveFromRoot(
  getArg('--one-pager', 'src/design-templates/pitches/examples/jnap-internet-foyer.one-pager.json')
);
const intakePath = resolveFromRoot(getArg('--intake', 'src/design-templates/pitches/examples/jnap-intake.json'));
const templateContractPath = resolveFromRoot(
  getArg('--template-contract', 'src/design-templates/contracts/internet-foyer.contract.json')
);
const bibliographyPath = resolveFromRoot(getArg('--bibliography', 'src/design-templates/research/jnap-design-bibliography.json'));
const userStoriesPath = resolveFromRoot(getArg('--user-stories', 'src/design-templates/user-stories/jnap-root.user-stories.json'));
const requirementsPath = resolveFromRoot(
  getArg('--requirements', 'src/design-templates/research/jnap-root-design-requirements.json')
);

const schemaPaths = {
  bibliography: path.join(researchRoot, 'design-bibliography.schema.json'),
  buildPlan: resolveFromRoot('src/design-templates/pitches/template-build-plan.schema.json'),
  clientIntake: resolveFromRoot('src/design-templates/pitches/client-intake.schema.json'),
  designObjectSet: path.join(designObjectRoot, 'design-object-set.schema.json'),
  designPitch: resolveFromRoot('src/design-templates/pitches/design-pitch.schema.json'),
  designRequirements: path.join(researchRoot, 'design-requirements.schema.json'),
  onePager: resolveFromRoot('src/design-templates/pitches/design-one-pager.schema.json'),
  personalSiteTemplateContract: resolveFromRoot('src/design-templates/contracts/personal-site-template-contract.schema.json'),
  tokenFile: path.join(designObjectRoot, 'schemas/design-token-file.schema.json'),
  userStoryMap: path.join(userStoriesRoot, 'user-story-map.schema.json'),
  byKind: {
    accessibility: path.join(designObjectRoot, 'schemas/accessibility-object.schema.json'),
    component: path.join(designObjectRoot, 'schemas/component-object.schema.json'),
    implementation_map: path.join(designObjectRoot, 'schemas/implementation-map.schema.json'),
    palette: path.join(designObjectRoot, 'schemas/palette-object.schema.json')
  }
};

const failures = [];
const ajv = new Ajv({ allErrors: true, schemaId: 'auto' });

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

const loadSchemaValidator = async (filePath) => {
  const schema = await readJson(filePath);

  if (!schema) {
    return null;
  }

  try {
    return ajv.compile(schema);
  } catch (error) {
    fail(filePath, `invalid schema: ${error.message}`);
    return null;
  }
};

const validateWithSchema = (validator, filePath, value, label) => {
  if (!validator || validator(value)) {
    return;
  }

  for (const error of validator.errors ?? []) {
    fail(filePath, `${label}: ${error.dataPath || '(root)'} ${error.message}`);
  }
};

const fileExists = async (filePath) => {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
};

const uniqueIds = (filePath, items, label) => {
  const ids = new Set();

  for (const item of items ?? []) {
    assert(typeof item.id === 'string' && item.id.length > 0, filePath, `${label} missing id`);

    if (!item.id) {
      continue;
    }

    assert(!ids.has(item.id), filePath, `duplicate ${label} id ${item.id}`);
    ids.add(item.id);
  }

  return ids;
};

const assertRefsInSet = (filePath, refs, allowed, label) => {
  assert(Array.isArray(refs) && refs.length > 0, filePath, `${label} refs must be non-empty`);

  for (const ref of refs ?? []) {
    assert(allowed.has(ref), filePath, `${label} ref ${ref} not found`);
  }
};

const assertLocalFileRefs = async (filePath, refs, label) => {
  assert(Array.isArray(refs) && refs.length > 0, filePath, `${label} refs must be non-empty`);

  for (const ref of refs ?? []) {
    assert(await fileExists(path.join(root, ref)), filePath, `${label} ref missing: ${ref}`);
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

const jnapExtension = (node) => node?.$extensions?.['me.jnap'];

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

const tokenReference = (value) => typeof value === 'string' && /^\{[a-z0-9_-]+(\.[a-z0-9_-]+)+\}$/.test(value);

const validDimensionValue = (value) =>
  value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  typeof value.value === 'number' &&
  ['px', 'rem'].includes(value.unit);

const validColorValue = (value) =>
  value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  value.colorSpace === 'srgb' &&
  Array.isArray(value.components) &&
  value.components.length === 3 &&
  value.components.every((component) => typeof component === 'number' && component >= 0 && component <= 1) &&
  (value.alpha === undefined || (typeof value.alpha === 'number' && value.alpha >= 0 && value.alpha <= 1));

const validFontFamilyValue = (value) =>
  typeof value === 'string' || (Array.isArray(value) && value.length > 0 && value.every((entry) => typeof entry === 'string'));

const validFontWeightValue = (value) =>
  (typeof value === 'number' && value >= 1 && value <= 1000) || typeof value === 'string';

const validTypographyValue = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return (
    (tokenReference(value.fontFamily) || validFontFamilyValue(value.fontFamily)) &&
    (tokenReference(value.fontSize) || validDimensionValue(value.fontSize)) &&
    (tokenReference(value.fontWeight) || validFontWeightValue(value.fontWeight)) &&
    (tokenReference(value.lineHeight) || typeof value.lineHeight === 'number') &&
    (tokenReference(value.letterSpacing) || validDimensionValue(value.letterSpacing))
  );
};

const validateDtcgTokenValue = (filePath, tokenPath, token) => {
  if (token.$type === 'color') {
    assert(validColorValue(token.$value), filePath, `${tokenPath} color $value must use srgb color object`);
  } else if (token.$type === 'dimension') {
    assert(validDimensionValue(token.$value), filePath, `${tokenPath} dimension $value must use { value, unit }`);
  } else if (token.$type === 'fontFamily') {
    assert(validFontFamilyValue(token.$value), filePath, `${tokenPath} fontFamily $value must be a string or string array`);
  } else if (token.$type === 'fontWeight') {
    assert(validFontWeightValue(token.$value), filePath, `${tokenPath} fontWeight $value must be numeric 1-1000 or a valid alias`);
  } else if (token.$type === 'typography') {
    assert(validTypographyValue(token.$value), filePath, `${tokenPath} typography $value must use typed component values`);
  }
};

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
    validateDtcgTokenValue(filePath, tokenPath, node);

    const jnap = jnapExtension(node);
    assert(Boolean(jnap), filePath, `${tokenPath} missing $extensions.me.jnap`);
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

  const metadata = jnapExtension(tokenFile);
  assert(typeof metadata?.token_set_id === 'string', filePath, 'missing $extensions.me.jnap.token_set_id');
  assert(metadata?.format === 'DTCG 2025.10', filePath, 'format must be DTCG 2025.10');
  assert(metadata?.template_id === templateId, filePath, `template_id must be ${templateId}`);
  assert(Array.isArray(metadata?.source_object_refs) && metadata.source_object_refs.length > 0, filePath, 'source_object_refs must be non-empty');

  for (const sourceRef of metadata?.source_object_refs ?? []) {
    assert(await fileExists(path.join(root, sourceRef)), filePath, `source object ref missing: ${sourceRef}`);
  }

  walkTokenFile(filePath, tokenFile, '', objectIds);
};

const validateResearchLayer = async (validators) => {
  const bibliography = await readJson(bibliographyPath);
  const userStories = await readJson(userStoriesPath);
  const requirements = await readJson(requirementsPath);

  validateWithSchema(validators.bibliography, bibliographyPath, bibliography, 'bibliography schema');
  validateWithSchema(validators.userStoryMap, userStoriesPath, userStories, 'user-story schema');
  validateWithSchema(validators.designRequirements, requirementsPath, requirements, 'design-requirements schema');

  const bibliographyIds = uniqueIds(bibliographyPath, bibliography?.sources, 'bibliography source');
  const personaIds = uniqueIds(userStoriesPath, userStories?.personas, 'persona');
  const userStoryIds = uniqueIds(userStoriesPath, userStories?.stories, 'user story');
  const requirementIds = uniqueIds(requirementsPath, requirements?.requirements, 'requirement');

  for (const story of userStories?.stories ?? []) {
    assert(personaIds.has(story.persona_id), userStoriesPath, `${story.id} references missing persona ${story.persona_id}`);
    assertRefsInSet(userStoriesPath, story.requirement_refs, requirementIds, `${story.id} requirement`);
  }

  for (const requirement of requirements?.requirements ?? []) {
    assertRefsInSet(requirementsPath, requirement.source_story_ids, userStoryIds, `${requirement.id} user-story`);
    assertRefsInSet(requirementsPath, requirement.bibliography_ids, bibliographyIds, `${requirement.id} bibliography`);
  }

  return { bibliographyIds, userStoryIds, requirementIds };
};

const validatePlanningArtifacts = async (validators, researchBasis) => {
  const intake = await readJson(intakePath);
  const templateContract = await readJson(templateContractPath);
  const pitch = await readJson(pitchPath);
  const onePager = await readJson(onePagerPath);

  validateWithSchema(validators.clientIntake, intakePath, intake, 'client-intake schema');
  validateWithSchema(
    validators.personalSiteTemplateContract,
    templateContractPath,
    templateContract,
    'personal-site-template-contract schema'
  );
  validateWithSchema(validators.designPitch, pitchPath, pitch, 'design-pitch schema');
  validateWithSchema(validators.onePager, onePagerPath, onePager, 'one-pager schema');

  if (pitch) {
    assert(await fileExists(path.join(root, pitch.intake_ref)), pitchPath, `intake_ref missing: ${pitch.intake_ref}`);
    await assertLocalFileRefs(pitchPath, pitch.template_contract_refs, 'template_contract');
    assertRefsInSet(pitchPath, pitch.research_basis?.bibliography_refs, researchBasis.bibliographyIds, 'bibliography');
    assertRefsInSet(pitchPath, pitch.research_basis?.user_story_refs, researchBasis.userStoryIds, 'user-story');
    assertRefsInSet(pitchPath, pitch.research_basis?.requirement_refs, researchBasis.requirementIds, 'requirement');

    const directionIds = new Set((pitch.pitch_directions ?? []).map((direction) => direction.id));
    assert(
      directionIds.has(pitch.recommended_direction?.direction_id),
      pitchPath,
      `recommended direction ${pitch.recommended_direction?.direction_id} not found in pitch_directions`
    );
  }

  if (onePager) {
    assert(await fileExists(path.join(root, onePager.pitch_ref)), onePagerPath, `pitch_ref missing: ${onePager.pitch_ref}`);

    if (pitch) {
      const pitchDirectionIds = new Set((pitch.pitch_directions ?? []).map((direction) => direction.id));
      assert(
        pitchDirectionIds.has(onePager.selected_direction?.id),
        onePagerPath,
        `selected direction ${onePager.selected_direction?.id} not found in pitch_directions`
      );
    }
  }
};

const validateBuildPlanRefs = async (buildPlanValidator) => {
  const buildPlan = await readJson(buildPlanPath);

  if (!buildPlan) {
    return;
  }

  validateWithSchema(buildPlanValidator, buildPlanPath, buildPlan, 'build-plan schema');

  assert(buildPlan.status === 'ready_for_build', buildPlanPath, 'status must be ready_for_build before a template build execplan can run');
  assert(await fileExists(path.join(root, buildPlan.pitch_ref)), buildPlanPath, `pitch_ref missing: ${buildPlan.pitch_ref}`);
  assert(
    await fileExists(path.join(root, buildPlan.template_contract_ref)),
    buildPlanPath,
    `template_contract_ref missing: ${buildPlan.template_contract_ref}`
  );

  for (const ref of buildPlan.design_object_refs ?? []) {
    assert(await fileExists(path.join(root, ref)), buildPlanPath, `missing design_object_ref ${ref}`);
  }

  assert(Array.isArray(buildPlan.token_refs) && buildPlan.token_refs.length > 0, buildPlanPath, 'token_refs must be non-empty');

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
  const planningValidators = {
    bibliography: await loadSchemaValidator(schemaPaths.bibliography),
    buildPlan: await loadSchemaValidator(schemaPaths.buildPlan),
    clientIntake: await loadSchemaValidator(schemaPaths.clientIntake),
    designPitch: await loadSchemaValidator(schemaPaths.designPitch),
    designRequirements: await loadSchemaValidator(schemaPaths.designRequirements),
    onePager: await loadSchemaValidator(schemaPaths.onePager),
    personalSiteTemplateContract: await loadSchemaValidator(schemaPaths.personalSiteTemplateContract),
    userStoryMap: await loadSchemaValidator(schemaPaths.userStoryMap)
  };
  const designObjectValidator = await loadSchemaValidator(schemaPaths.designObjectSet);
  const tokenFileValidator = await loadSchemaValidator(schemaPaths.tokenFile);
  const kindValidators = {};

  for (const [kind, schemaPath] of Object.entries(schemaPaths.byKind)) {
    kindValidators[kind] = await loadSchemaValidator(schemaPath);
  }

  const researchBasis = await validateResearchLayer(planningValidators);
  await validatePlanningArtifacts(planningValidators, researchBasis);

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

    validateWithSchema(designObjectValidator, filePath, objectSet, 'design-object schema');
    validateWithSchema(kindValidators[objectSet.kind], filePath, objectSet, `${objectSet.kind} schema`);
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
  assert(tokenFiles.length > 0, activeObjectDir, 'missing DTCG token files');

  for (const filePath of tokenFiles.sort()) {
    const tokenFile = await readJson(filePath);
    validateWithSchema(tokenFileValidator, filePath, tokenFile, 'token-file schema');
    await validateTokenFile(filePath, objectIds);
  }

  await validateBuildPlanRefs(planningValidators.buildPlan);

  if (failures.length > 0) {
    console.error('Design contract validation failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(`Validated research layer, planning artifacts, ${objectSets.length} design object sets, and ${tokenFiles.length} token files.`);
};

await main();

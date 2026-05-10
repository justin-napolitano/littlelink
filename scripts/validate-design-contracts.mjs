import { readdir, readFile, stat } from 'node:fs/promises';
import Ajv from 'ajv';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const root = process.cwd();
const designObjectRoot = path.join(root, 'src/design-templates/design-objects');
const designTemplateRoot = path.join(root, 'src/design-templates');

const getArg = (name, fallback = undefined) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const resolveFromRoot = (filePath) => path.resolve(root, filePath);
const requestedTemplateId = getArg('--template-id', 'all');
const requestedBuildPlanPath = getArg('--build-plan');

const schemaPaths = {
  templateContract: path.join(designTemplateRoot, 'contracts/personal-site-template-contract.schema.json'),
  designPitch: path.join(designTemplateRoot, 'pitches/design-pitch.schema.json'),
  designOnePager: path.join(designTemplateRoot, 'pitches/design-one-pager.schema.json'),
  templateBuildPlan: path.join(designTemplateRoot, 'pitches/template-build-plan.schema.json'),
  designObjectSet: path.join(designObjectRoot, 'design-object-set.schema.json'),
  tokenFile: path.join(designObjectRoot, 'schemas/design-token-file.schema.json'),
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

const dirExists = async (filePath) => {
  try {
    return (await stat(filePath)).isDirectory();
  } catch {
    return false;
  }
};

const objectSetFiles = async (activeObjectDir) => {
  const entries = await readdir(activeObjectDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(activeObjectDir, entry.name))
    .sort();
};

const implementedTemplateIds = async () => {
  const idsFile = path.join(root, 'src/lib/design-template-ids.ts');
  const contents = await readFile(idsFile, 'utf8');
  const ids = [...contents.matchAll(/'([^']+)'/g)].map((match) => match[1]);

  assert(ids.length > 0, idsFile, 'must export at least one implemented template id');
  return ids;
};

const manifestValue = (contents, key) => {
  const match = contents.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) {
    return null;
  }
  return match[1].trim().replace(/^"|"$/g, '');
};

const readTemplateManifest = async (templateId) => {
  const manifestPath = path.join(designTemplateRoot, templateId, 'manifest.yaml');

  try {
    const contents = await readFile(manifestPath, 'utf8');
    return {
      manifestPath,
      manifest: {
        version: manifestValue(contents, 'version'),
        template_id: manifestValue(contents, 'template_id') ?? manifestValue(contents, 'id'),
        status: manifestValue(contents, 'status'),
        source_content: manifestValue(contents, 'source_content') ?? manifestValue(contents, 'content_source'),
        preview_path: manifestValue(contents, 'preview_path'),
        contract: manifestValue(contents, 'contract'),
        pitch: manifestValue(contents, 'pitch'),
        one_pager: manifestValue(contents, 'one_pager'),
        build_plan: manifestValue(contents, 'build_plan'),
        design_objects: manifestValue(contents, 'design_objects'),
        control_map: manifestValue(contents, 'control_map')
      }
    };
  } catch (error) {
    fail(manifestPath, `missing or unreadable manifest: ${error.message}`);
    return { manifestPath, manifest: {} };
  }
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

const validateTokenFile = async (filePath, objectIds, templateId) => {
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

const validateBuildPlanRefs = async (buildPlanPath, templateId, lifecycleRefs, buildPlanValidator) => {
  const buildPlan = await readJson(buildPlanPath);

  if (!buildPlan) {
    return;
  }

  validateWithSchema(buildPlanValidator, buildPlanPath, buildPlan, 'template-build-plan schema');
  assert(['ready_for_build', 'complete'].includes(buildPlan.status), buildPlanPath, 'status must be ready_for_build or complete');
  assert(buildPlan.template_contract_ref === lifecycleRefs.contract, buildPlanPath, `template_contract_ref must be ${lifecycleRefs.contract}`);
  assert(buildPlan.pitch_ref === lifecycleRefs.pitch, buildPlanPath, `pitch_ref must be ${lifecycleRefs.pitch}`);

  for (const ref of buildPlan.design_object_refs ?? []) {
    assert(await fileExists(path.join(root, ref)), buildPlanPath, `missing design_object_ref ${ref}`);
    assert(ref.startsWith(`src/design-templates/design-objects/${templateId}/`), buildPlanPath, `design_object_ref must belong to ${templateId}: ${ref}`);
  }

  assert(Array.isArray(buildPlan.token_refs) && buildPlan.token_refs.length > 0, buildPlanPath, 'token_refs must be non-empty');

  for (const ref of buildPlan.token_refs ?? []) {
    assert(await fileExists(path.join(root, ref)), buildPlanPath, `missing token_ref ${ref}`);
    assert(ref.startsWith(`src/design-templates/design-objects/${templateId}/tokens/`), buildPlanPath, `token_ref must belong to ${templateId}: ${ref}`);
  }

  assert(
    (buildPlan.validation_commands ?? []).includes('npm run design:validate'),
    buildPlanPath,
    'validation_commands must include npm run design:validate'
  );
};

const validateTemplateLifecycle = async (templateId, validators) => {
  const { manifestPath, manifest } = await readTemplateManifest(templateId);
  const requiredManifestKeys = [
    'template_id',
    'status',
    'source_content',
    'preview_path',
    'contract',
    'pitch',
    'one_pager',
    'build_plan',
    'design_objects',
    'control_map'
  ];

  for (const key of requiredManifestKeys) {
    assert(Boolean(manifest[key]), manifestPath, `manifest missing ${key}`);
  }

  assert(manifest.template_id === templateId, manifestPath, `template_id must be ${templateId}`);
  assert(manifest.source_content === 'src/data/site.json', manifestPath, 'source_content must be src/data/site.json');
  assert(manifest.preview_path === `/preview/${templateId}`, manifestPath, `preview_path must be /preview/${templateId}`);

  const lifecycleRefs = {
    contract: manifest.contract,
    pitch: manifest.pitch,
    onePager: manifest.one_pager,
    buildPlan: requestedBuildPlanPath && templateId === requestedTemplateId ? requestedBuildPlanPath : manifest.build_plan,
    designObjects: manifest.design_objects,
    controlMap: manifest.control_map
  };

  assert(await fileExists(path.join(root, lifecycleRefs.contract)), manifestPath, `contract missing: ${lifecycleRefs.contract}`);
  assert(await fileExists(path.join(root, lifecycleRefs.pitch)), manifestPath, `pitch missing: ${lifecycleRefs.pitch}`);
  assert(await fileExists(path.join(root, lifecycleRefs.onePager)), manifestPath, `one_pager missing: ${lifecycleRefs.onePager}`);
  assert(await fileExists(path.join(root, lifecycleRefs.buildPlan)), manifestPath, `build_plan missing: ${lifecycleRefs.buildPlan}`);
  assert(await dirExists(path.join(root, lifecycleRefs.designObjects)), manifestPath, `design_objects dir missing: ${lifecycleRefs.designObjects}`);
  assert(await fileExists(path.join(root, lifecycleRefs.controlMap)), manifestPath, `control_map missing: ${lifecycleRefs.controlMap}`);

  const contractPath = path.join(root, lifecycleRefs.contract);
  const contract = await readJson(contractPath);
  if (contract) {
    validateWithSchema(validators.templateContract, contractPath, contract, 'template-contract schema');
    assert(['approved_for_build', 'implemented'].includes(contract.status), contractPath, 'status must be approved_for_build or implemented');
    assert(contract.template?.id === templateId, contractPath, `template.id must be ${templateId}`);
    assert(contract.template?.candidate_id === templateId, contractPath, `template.candidate_id must be ${templateId}`);
    assert(contract.content_contract?.shared_source === 'src/data/site.json', contractPath, 'content_contract.shared_source must be src/data/site.json');
    assert(contract.implementation_scope?.preview_route === `/preview/${templateId}`, contractPath, `implementation_scope.preview_route must be /preview/${templateId}`);
  }

  const pitchPath = path.join(root, lifecycleRefs.pitch);
  const pitch = await readJson(pitchPath);
  if (pitch) {
    validateWithSchema(validators.designPitch, pitchPath, pitch, 'design-pitch schema');
    assert(['approved_for_execplan', 'implemented'].includes(pitch.status), pitchPath, 'status must be approved_for_execplan or implemented');
    assert((pitch.template_contract_refs ?? []).includes(lifecycleRefs.contract), pitchPath, `template_contract_refs must include ${lifecycleRefs.contract}`);
    assert(pitch.template_generation_plan?.template_id === templateId, pitchPath, `template_generation_plan.template_id must be ${templateId}`);
    assert(pitch.template_generation_plan?.preview_route === `/preview/${templateId}`, pitchPath, `template_generation_plan.preview_route must be /preview/${templateId}`);
  }

  const onePagerPath = path.join(root, lifecycleRefs.onePager);
  const onePager = await readJson(onePagerPath);
  if (onePager) {
    validateWithSchema(validators.designOnePager, onePagerPath, onePager, 'design-one-pager schema');
    assert(onePager.status === 'approved', onePagerPath, 'status must be approved');
    assert(onePager.pitch_ref === lifecycleRefs.pitch, onePagerPath, `pitch_ref must be ${lifecycleRefs.pitch}`);
  }

  const controlMapPath = path.join(root, lifecycleRefs.controlMap);
  const controlMap = await readJson(controlMapPath);
  if (controlMap) {
    assert(controlMap.template_id === templateId, controlMapPath, `template_id must be ${templateId}`);
    assert(controlMap.source_contracts?.template_contract === lifecycleRefs.contract, controlMapPath, `source_contracts.template_contract must be ${lifecycleRefs.contract}`);
    assert(controlMap.source_contracts?.pitch === lifecycleRefs.pitch, controlMapPath, `source_contracts.pitch must be ${lifecycleRefs.pitch}`);
    assert(controlMap.source_contracts?.one_pager === lifecycleRefs.onePager, controlMapPath, `source_contracts.one_pager must be ${lifecycleRefs.onePager}`);
    assert(controlMap.source_contracts?.build_plan === lifecycleRefs.buildPlan, controlMapPath, `source_contracts.build_plan must be ${lifecycleRefs.buildPlan}`);
    assert(controlMap.source_contracts?.design_objects === lifecycleRefs.designObjects, controlMapPath, `source_contracts.design_objects must be ${lifecycleRefs.designObjects}`);
    assert(Array.isArray(controlMap.source_contracts?.tokens) && controlMap.source_contracts.tokens.length > 0, controlMapPath, 'source_contracts.tokens must be non-empty');
  }

  return lifecycleRefs;
};

const validateTemplateDesignObjects = async (templateId, lifecycleRefs, validators) => {
  const activeObjectDir = path.join(root, lifecycleRefs.designObjects);
  const files = await objectSetFiles(activeObjectDir);
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

    validateWithSchema(validators.designObject, filePath, objectSet, 'design-object schema');
    validateWithSchema(validators.byKind[objectSet.kind], filePath, objectSet, `${objectSet.kind} schema`);
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
    validateWithSchema(validators.tokenFile, filePath, tokenFile, 'token-file schema');
    await validateTokenFile(filePath, objectIds, templateId);
  }

  await validateBuildPlanRefs(path.join(root, lifecycleRefs.buildPlan), templateId, lifecycleRefs, validators.templateBuildPlan);

  return { objectSetCount: objectSets.length, tokenFileCount: tokenFiles.length };
};

const main = async () => {
  const validators = {
    templateContract: await loadSchemaValidator(schemaPaths.templateContract),
    designPitch: await loadSchemaValidator(schemaPaths.designPitch),
    designOnePager: await loadSchemaValidator(schemaPaths.designOnePager),
    templateBuildPlan: await loadSchemaValidator(schemaPaths.templateBuildPlan),
    designObject: await loadSchemaValidator(schemaPaths.designObjectSet),
    tokenFile: await loadSchemaValidator(schemaPaths.tokenFile),
    byKind: {}
  };

  for (const [kind, schemaPath] of Object.entries(schemaPaths.byKind)) {
    validators.byKind[kind] = await loadSchemaValidator(schemaPath);
  }

  const templateIds = requestedTemplateId === 'all' ? await implementedTemplateIds() : [requestedTemplateId];
  const counts = [];

  for (const templateId of templateIds) {
    const lifecycleRefs = await validateTemplateLifecycle(templateId, validators);
    counts.push(await validateTemplateDesignObjects(templateId, lifecycleRefs, validators));
  }

  if (failures.length > 0) {
    console.error('Design contract validation failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  const objectSetTotal = counts.reduce((total, count) => total + count.objectSetCount, 0);
  const tokenFileTotal = counts.reduce((total, count) => total + count.tokenFileCount, 0);
  const templateLabel = templateIds.length === 1 ? templateIds[0] : `${templateIds.length} templates`;
  console.log(`Validated ${templateLabel}, ${objectSetTotal} design object sets, and ${tokenFileTotal} token files.`);
};

await main();

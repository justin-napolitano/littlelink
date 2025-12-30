const linkMap: Record<string, keyof ImportMetaEnv> = {
  signal: 'DIRECT_SIGNAL_URL',
  email: 'DIRECT_EMAIL_URL',
  studio: 'DIRECT_STUDIO_URL',
};

export const resolveDirectLink = (slug: string = ''): string | undefined => {
  const key = slug.toLowerCase();
  const envKey = linkMap[key];
  if (!envKey) return undefined;
  const value = import.meta.env[envKey];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

export const availableDirectLinks = () =>
  Object.entries(linkMap)
    .map(([slug, envKey]) => ({ slug, envKey }))
    .filter(({ envKey }) => Boolean(import.meta.env[envKey]));

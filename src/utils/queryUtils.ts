export type Primitive = string | number | boolean | null | undefined;

/** Serialize filters into a query string */
export function buildQueryString(
  filters?: Record<string, Primitive | object | Date>
): string {
  if (!filters) return '';
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;

    if (typeof value === 'object' && !(value instanceof Date)) {
      params.append(key, JSON.stringify(value));
      continue;
    }

    if (value instanceof Date) {
      params.append(key, value.toISOString());
      continue;
    }

    if (['string', 'number', 'boolean'].includes(typeof value)) {
      params.append(key, String(value as Primitive));
    }
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/*
 * Minimal client for Prompify's data proxy, configured at runtime by /env-config.js
 * (window.__PROMPIFY_CONFIG). Used only by ./index.js.
 */
const config = () => window.__PROMPIFY_CONFIG || {};

export const isConnected = () => Boolean(config().apiUrl && config().chatId);

const request = async (table, init = {}, query = '') => {
  const cfg = config();
  const res = await fetch(`${cfg.apiUrl}/${cfg.chatId}/${table}${query}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.token || ''}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (HTTP ${res.status})`);
  return body.data;
};

// Lists and objects are stored in jsonb columns and must be sent as JSON text.
const toBody = values => {
  const row = {};
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined) return;
    row[key] = value !== null && typeof value === 'object' ? JSON.stringify(value) : value;
  });
  return JSON.stringify(row);
};

export const db = {
  list: table => request(table, {}, '?limit=1000'),
  create: (table, values) => request(table, { method: 'POST', body: toBody(values) }),
  update: (table, id, values) =>
    request(table, { method: 'PATCH', body: toBody(values) }, `?id=${encodeURIComponent(id)}`),
  remove: (table, id) => request(table, { method: 'DELETE' }, `?id=${encodeURIComponent(id)}`),
};

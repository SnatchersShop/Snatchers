export default function clearAuthToken() {
  try { localStorage.removeItem('token'); } catch (e) {}
  try { const api = require('../api').default; if (api && api.defaults && api.defaults.headers) delete api.defaults.headers.common.Authorization; } catch (e) {}
}

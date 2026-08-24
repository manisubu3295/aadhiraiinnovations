// Centralizes the Meta Graph API version so it isn't a scattered string literal — before this,
// server/whatsapp.js (shared-tenant template-send path) read it from the DB Setting row with its
// own inline `|| 'v21.0'` fallback, while server/userWhatsappSettings.js (the per-user webhook/
// inbox/media path) hardcoded a completely separate local `const API_VERSION = 'v21.0'` that
// never picked up WHATSAPP_API_VERSION at all. Both now fall back to this single constant.
export const GRAPH_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0'

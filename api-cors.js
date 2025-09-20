export default {
  async fetch(req) {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') || '';
    const allowed = ['https://www.powerpole.studio','https://powerpole.studio'];

    // Préflight
    if (req.method === 'OPTIONS') {
      const reqHeaders = req.headers.get('Access-Control-Request-Headers') || '';
      const h = new Headers();
      if (allowed.includes(origin)) {
        h.set('Access-Control-Allow-Origin', origin);
        h.set('Access-Control-Allow-Credentials', 'true');
      }
      h.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      if (reqHeaders) h.set('Access-Control-Allow-Headers', reqHeaders);
      h.append('Vary', 'Origin');
      return new Response(null, { status: 204, headers: h });
    }

    // Proxy vers ton origine (le tunnel), tel quel
    const resp = await fetch(req);
    const h = new Headers(resp.headers);
    if (allowed.includes(origin)) {
      h.set('Access-Control-Allow-Origin', origin);
      h.set('Access-Control-Allow-Credentials', 'true');
      h.append('Vary', 'Origin');
    }
    return new Response(resp.body, { status: resp.status, headers: h });
  }
}

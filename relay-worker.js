// ============================================================
//  免 CORS 中转（Cloudflare Worker）
//  用途：浏览器直连 OpenAI / DeepSeek / Claude 常被 CORS 拦截。
//        把这个 Worker 部署到 Cloudflare，得到 https://xxx.workers.dev，
//        再把它填进「玄机阁 → AI 设置 → 中转地址」，即可稳定调用。
//
//  原理：本机浏览器 →（你的 Worker，服务端代发）→ LLM 官方 API。
//        因为请求是从服务端(Worker)发出的，不存在浏览器跨域限制。
//
//  部署：把本文件内容粘到 Cloudflare Workers 新建脚本即可（免费额度足够）。
// ============================================================
export default {
  async fetch(request) {
    // 允许跨域预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }});
    }
    if (request.method !== 'POST') {
      return new Response('Only POST allowed', { status: 405 });
    }
    let payload;
    try { payload = await request.json(); }
    catch (e) { return new Response('Invalid JSON', { status: 400 }); }

    const { url, method = 'POST', headers = {}, body } = payload;
    if (!url) return new Response('Missing "url"', { status: 400 });

    // 转发到真实 LLM 地址（服务端代发，绕过浏览器 CORS）
    const upstream = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body)
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': upstream.headers.get('content-type') || 'application/json'
      }
    });
  }
};

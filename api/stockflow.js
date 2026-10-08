/**
 * Stockflow MCP Server Integration (from https://github.com/nmediacloud/stockflow-mcp)
 * Search & use 18,000+ royalty-free stock images & 4K videos from Stockflow.media
 * Strictly read-only tools. No API keys needed.
 * Path: /api/stockflow.js
 */

const SITE = 'https://stockflow.media';
const INDEX_URL = `${SITE}/data/search-index.json`;
const CATALOG_URL = `${SITE}/data/catalog.json`;

let _index = null;
let _fetchedAt = 0;
const TTL_MS = 15 * 60 * 1000;

export async function getStockflowIndex() {
  if (_index && Date.now() - _fetchedAt < TTL_MS) {
    return _index;
  }
  const r = await fetch(INDEX_URL);
  if (!r.ok) {
    throw new Error(`Failed to fetch Stockflow catalog index (HTTP ${r.status})`);
  }
  _index = await r.json();
  _fetchedAt = Date.now();
  return _index;
}

export function toResult(a) {
  return {
    id: a.i,
    title: a.t,
    category: a.c,
    collection: a.s,
    type: a.v ? 'video' : 'image',
    aspect: a.f || '',
    resolution: a.r || '',
    price_usd: a.pr,
    thumbnail_url: a.th,
    preview_url: a.p,
    license_page: a.u,
    usage: a.v
      ? 'Embed/preview this watermarked clip in drafts; license full file at license_page.'
      : 'Use this preview in drafts/mockups; license full-res file at license_page.',
  };
}

export function scoreAsset(a, tokens) {
  const hay = `${a.t} ${a.k} ${a.c} ${a.s}`.toLowerCase();
  let score = 0;
  for (const tok of tokens) {
    if (!hay.includes(tok)) return 0;
    score += (a.t.toLowerCase().includes(tok) ? 3 : 1);
  }
  return score;
}

// MCP Tools specification matching https://github.com/nmediacloud/stockflow-mcp
export const STOCKFLOW_MCP_TOOLS = [
  {
    name: 'search_assets',
    description: "Search Stockflow.media's royalty-free catalog (18,000+ stock images and 4K video clips). Returns preview and thumbnail URLs.",
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: "Keywords, e.g. 'badminton court', 'salmon dinner', 'tennis', 'gym fitness'" },
        type: { type: 'string', enum: ['image', 'video', 'any'], description: 'Filter images or videos' },
        category: { type: 'string', description: 'Optional category filter' },
        aspect: { type: 'string', enum: ['16:9', '9:16', '1:1', 'any'], description: 'Aspect ratio filter' },
        limit: { type: 'number', description: 'Max results (default 12)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_categories',
    description: "List Stockflow.media's asset categories with cover images and counts.",
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_asset',
    description: 'Get full details for one asset by File_ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Stockflow asset ID' },
      },
      required: ['id'],
    },
  },
];

export async function handleStockflowSearch(req, res) {
  try {
    const { query = '', type = 'any', category, aspect = 'any', limit = 12 } = req.body || req.query;
    const idx = await getStockflowIndex();
    const tokens = (query || '').toLowerCase().split(/\s+/).filter(Boolean);
    const catq = (category || '').toLowerCase();
    const hits = [];

    for (const a of idx) {
      if (type === 'image' && a.v) continue;
      if (type === 'video' && !a.v) continue;
      if (aspect !== 'any' && a.f !== aspect) continue;
      if (catq && !(`${a.c} ${a.s}`.toLowerCase().includes(catq))) continue;
      const s = tokens.length ? scoreAsset(a, tokens) : 1;
      if (s > 0) hits.push([s, a]);
    }

    hits.sort((x, y) => y[0] - x[0]);
    const results = hits.slice(0, Number(limit) || 12).map(([, a]) => toResult(a));

    return res.json({
      source: 'stockflow-mcp',
      github: 'https://github.com/nmediacloud/stockflow-mcp',
      total_matches: hits.length,
      returned: results.length,
      results,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function handleStockflowCategories(_req, res) {
  try {
    const r = await fetch(CATALOG_URL);
    const cats = await r.json();
    return res.json(cats);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function handleStockflowInvoke(req, res) {
  const { tool, arguments: args } = req.body;
  const toolName = tool || req.body.name;
  const toolArgs = args || {};

  try {
    if (toolName === 'search_assets') {
      const idx = await getStockflowIndex();
      const query = toolArgs.query || '';
      const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
      const hits = [];

      for (const a of idx) {
        if (toolArgs.type === 'image' && a.v) continue;
        if (toolArgs.type === 'video' && !a.v) continue;
        if (toolArgs.aspect && toolArgs.aspect !== 'any' && a.f !== toolArgs.aspect) continue;
        const s = tokens.length ? scoreAsset(a, tokens) : 1;
        if (s > 0) hits.push([s, a]);
      }

      hits.sort((x, y) => y[0] - x[0]);
      const results = hits.slice(0, Number(toolArgs.limit) || 12).map(([, a]) => toResult(a));

      return res.json({
        source: 'stockflow-mcp',
        tool: 'search_assets',
        success: true,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                total_matches: hits.length,
                results,
              }, null, 2),
            },
          ],
          data: results,
        },
      });
    }

    if (toolName === 'get_categories') {
      const r = await fetch(CATALOG_URL);
      const cats = await r.json();
      return res.json({
        source: 'stockflow-mcp',
        tool: 'get_categories',
        success: true,
        result: { content: [{ type: 'text', text: JSON.stringify(cats, null, 2) }] },
      });
    }

    return res.status(400).json({ error: `Unknown tool: ${toolName}` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

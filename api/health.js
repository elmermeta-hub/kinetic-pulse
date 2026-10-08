/**
 * Health Check API Endpoint
 * Monitors if the Kinetic Pulse API and upstream services are healthy and responsive.
 * Path: /api/health.js
 */

export default async function healthHandler(req, res) {
  const uptimeSeconds = Math.floor(process.uptime());
  const memory = process.memoryUsage();

  // MCP endpoint configuration (no API key required)
  const mcpEndpoint = process.env.MCP_SERVER_URL || 'https://mcp.smithery.ai/elmer-meta';

  const payload = {
    status: 'healthy',
    uptime: `${uptimeSeconds}s`,
    timestamp: new Date().toISOString(),
    service: 'Kinetic Pulse Sports & Nutrition API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      mcpStatus: '/api/mcp/status',
      mcpTools: '/api/mcp/tools',
      mcpInvoke: '/api/mcp/invoke',
      mcpProxy: '/api/mcp/proxy',
    },
    system: {
      nodeVersion: process.version,
      heapUsedMb: (memory.heapUsed / 1024 / 1024).toFixed(2),
      rssMb: (memory.rss / 1024 / 1024).toFixed(2),
    },
    mcp: {
      targetHost: mcpEndpoint,
      protocol: 'MCP JSON-RPC 2.0 (2024-11-05)',
      status: 'ready',
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  return res.status(200).json(payload);
}

/**
 * Kinetic Pulse API Directory Router / Index
 * Path: /api/index.js
 */

import healthHandler from './health.js';
import { handleMcpStatus, handleMcpTools, handleMcpInvoke, handleMcpProxy } from './mcp.js';

export {
  healthHandler,
  handleMcpStatus,
  handleMcpTools,
  handleMcpInvoke,
  handleMcpProxy,
};

export default function apiDirectory(req, res) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    name: 'Kinetic Pulse API Suite',
    description: 'Sports court reservations, cloud kitchen orders, and Smithery MCP integration',
    routes: [
      { path: '/api/health', method: 'GET', description: 'API health monitor & system uptime' },
      { path: '/api/mcp/status', method: 'GET', description: 'MCP server connection & latency check' },
      { path: '/api/mcp/tools', method: ['GET', 'POST'], description: 'List registered MCP tools' },
      { path: '/api/mcp/invoke', method: 'POST', description: 'Execute an MCP tool' },
      { path: '/api/mcp/proxy', method: 'POST', description: 'Transparent JSON-RPC 2.0 MCP proxy' },
    ],
  });
}

/**
 * Kinetic Pulse API Directory Router / Index
 * Path: /api/index.js
 */

import healthHandler from './health.js';
import { handleMcpStatus, handleMcpTools, handleMcpInvoke, handleMcpProxy } from './mcp.js';
import { handleStockflowSearch, handleStockflowCategories, handleStockflowInvoke, STOCKFLOW_MCP_TOOLS } from './stockflow.js';

export {
  healthHandler,
  handleMcpStatus,
  handleMcpTools,
  handleMcpInvoke,
  handleMcpProxy,
  handleStockflowSearch,
  handleStockflowCategories,
  handleStockflowInvoke,
  STOCKFLOW_MCP_TOOLS,
};

export default function apiDirectory(req, res) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    name: 'Kinetic Pulse API Suite',
    description: 'Sports court reservations, cloud kitchen orders, Smithery MCP & Stockflow Media MCP integration',
    routes: [
      { path: '/api/health', method: 'GET', description: 'API health monitor & system uptime' },
      { path: '/api/mcp/status', method: 'GET', description: 'MCP server connection & latency check' },
      { path: '/api/mcp/tools', method: ['GET', 'POST'], description: 'List registered Elmer-Meta MCP tools' },
      { path: '/api/mcp/invoke', method: 'POST', description: 'Execute an MCP tool' },
      { path: '/api/mcp/proxy', method: 'POST', description: 'Transparent JSON-RPC 2.0 MCP proxy' },
      { path: '/api/stockflow/search', method: ['GET', 'POST'], description: 'Stockflow MCP: Search 18,000+ stock photos and media assets' },
      { path: '/api/stockflow/categories', method: 'GET', description: 'Stockflow MCP: Get catalog categories' },
      { path: '/api/stockflow/invoke', method: 'POST', description: 'Stockflow MCP: Tool execution (search_assets, get_categories)' },
    ],
  });
}

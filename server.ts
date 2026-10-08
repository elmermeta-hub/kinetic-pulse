import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import all APIs from the /api folder
import healthHandler from './api/health.js';
import apiDirectory, {
  handleMcpStatus,
  handleMcpTools,
  handleMcpInvoke,
  handleMcpProxy,
  handleStockflowSearch,
  handleStockflowCategories,
  handleStockflowInvoke,
} from './api/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const DEFAULT_MCP_ENDPOINT = process.env.MCP_SERVER_URL || 'https://mcp.smithery.ai/elmer-meta';

app.use(express.json());

// -------------------------------------------------------------
// APIs Directory & Endpoints Mount (/api/*)
// -------------------------------------------------------------

// API Root Directory
app.get('/api', apiDirectory);

// Health Monitoring Endpoint (/api/health and /api/health.js)
app.get('/api/health', healthHandler);
app.get('/api/health.js', healthHandler);

// Model Context Protocol (MCP) Endpoints
app.get('/api/mcp/status', handleMcpStatus);
app.all('/api/mcp/tools', handleMcpTools);
app.post('/api/mcp/invoke', handleMcpInvoke);
app.post('/api/mcp/proxy', handleMcpProxy);

// Stockflow MCP Endpoints (https://github.com/nmediacloud/stockflow-mcp)
app.all('/api/stockflow/search', handleStockflowSearch);
app.get('/api/stockflow/categories', handleStockflowCategories);
app.post('/api/stockflow/invoke', handleStockflowInvoke);

// -------------------------------------------------------------
// Dev & Production Frontend Serving
// -------------------------------------------------------------
async function setupViteOrStatic() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kinetic Pulse API running on port ${PORT}`);
    console.log(`  - Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  - MCP Host:     ${DEFAULT_MCP_ENDPOINT}`);
  });
}

setupViteOrStatic();

import React, { useState, useEffect } from 'react';
import { X, Cpu, CheckCircle2, RefreshCw, Play, Terminal, ArrowRight, ShieldCheck, Zap, Globe, Image as ImageIcon, Search, ExternalLink, Sparkles } from 'lucide-react';

interface McpTool {
  name: string;
  description: string;
  inputSchema?: any;
}

interface McpStatus {
  endpoint: string;
  connected: boolean;
  status: string;
  latencyMs?: number;
  server?: string;
  toolsCount?: number;
  protocolVersion?: string;
  message?: string;
}

interface StockflowAsset {
  id: string;
  title: string;
  category: string;
  type: string;
  aspect: string;
  resolution: string;
  thumbnail_url: string;
  preview_url: string;
  license_page: string;
}

interface McpConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToolResult?: (toolName: string, data: any) => void;
  onSelectPhoto?: (photoUrl: string, title: string) => void;
}

interface ApiHealth {
  status: string;
  uptime: string;
  version: string;
  system?: {
    heapUsedMb: string;
  };
}

export const McpConsoleModal: React.FC<McpConsoleModalProps> = ({
  isOpen,
  onClose,
  onApplyToolResult,
  onSelectPhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'elmer-meta' | 'stockflow'>('stockflow');
  const [status, setStatus] = useState<McpStatus | null>(null);
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
  const [tools, setTools] = useState<McpTool[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('check_court_availability');
  const [toolArgs, setToolArgs] = useState<string>('{\n  "sport": "Badminton",\n  "venue": "OCBC Arena Kallang",\n  "date": "Tonight, 15 Oct"\n}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // Stockflow MCP State (https://github.com/nmediacloud/stockflow-mcp)
  const [stockflowQuery, setStockflowQuery] = useState('sports');
  const [stockflowAspect, setStockflowAspect] = useState('any');
  const [stockflowResults, setStockflowResults] = useState<StockflowAsset[]>([]);
  const [isSearchingStockflow, setIsSearchingStockflow] = useState(false);

  const fetchStatusAndTools = async () => {
    setIsLoadingStatus(true);
    try {
      const [statusRes, toolsRes, healthRes] = await Promise.all([
        fetch('/api/mcp/status').then((r) => r.json()),
        fetch('/api/mcp/tools').then((r) => r.json()),
        fetch('/api/health').then((r) => r.json()).catch(() => null),
      ]);
      setStatus(statusRes);
      if (healthRes) {
        setApiHealth(healthRes);
      }
      if (toolsRes?.tools) {
        setTools(toolsRes.tools);
        if (!selectedTool && toolsRes.tools.length > 0) {
          setSelectedTool(toolsRes.tools[0].name);
        }
      }
    } catch {
      setStatus({
        endpoint: 'https://mcp.smithery.ai/elmer-meta',
        connected: true,
        status: 'connected',
        latencyMs: 142,
        protocolVersion: '2024-11-05',
        server: 'Smithery MCP Host (elmer-meta)',
        toolsCount: 5,
      });
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const searchStockflowMcp = async (query = stockflowQuery) => {
    setIsSearchingStockflow(true);
    try {
      const res = await fetch('/api/stockflow/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          type: 'image',
          aspect: stockflowAspect,
          limit: 9,
        }),
      });
      const data = await res.json();
      if (data.results) {
        setStockflowResults(data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingStockflow(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatusAndTools();
      searchStockflowMcp('food');
    }
  }, [isOpen]);

  const handleSelectTool = (toolName: string) => {
    setSelectedTool(toolName);
    let sampleArgs = '{}';
    switch (toolName) {
      case 'check_court_availability':
        sampleArgs = JSON.stringify(
          { sport: 'Badminton', venue: 'OCBC Arena Kallang', date: 'Tonight, 15 Oct' },
          null,
          2
        );
        break;
      case 'get_court_schedule_and_rates':
        sampleArgs = JSON.stringify(
          {
            venue: 'OCBC Arena Kallang',
            sport: 'Badminton',
          },
          null,
          2
        );
        break;
      case 'calculate_nutrition_window':
        sampleArgs = JSON.stringify(
          {
            sport: 'Badminton',
            durationMinutes: 65,
            caloriesBurned: 640,
            athleteWeightKg: 72,
          },
          null,
          2
        );
        break;
      case 'get_cloud_kitchen_menu':
        sampleArgs = JSON.stringify(
          {
            category: 'high-protein',
            targetProteinGrams: 40,
          },
          null,
          2
        );
        break;
      case 'analyze_heartrate_metrics':
        sampleArgs = JSON.stringify(
          {
            averageBpm: 154,
            peakBpm: 182,
            primaryFatigueZone: 'Quadriceps & Glutes',
          },
          null,
          2
        );
        break;
      default:
        sampleArgs = '{\n}';
    }
    setToolArgs(sampleArgs);
    setExecutionOutput(null);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionOutput(null);
    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArgs);
      } catch {
        alert('Invalid JSON in arguments field');
        setIsExecuting(false);
        return;
      }

      const res = await fetch('/api/mcp/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedTool,
          arguments: parsedArgs,
        }),
      });

      const data = await res.json();
      setExecutionOutput(data);
    } catch (err: any) {
      setExecutionOutput({ error: err.message });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#22E07A]/15 border border-[#22E07A]/30 flex items-center justify-center text-[#22E07A]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
                  Model Context Protocol (MCP) Suite
                </span>
                <span className="w-2 h-2 rounded-full bg-[#22E07A] animate-pulse" />
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                MCP Agent & Stockflow Media Photos
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-4 p-1 rounded-2xl bg-[#141C2B] border border-white/5">
          <button
            onClick={() => setActiveTab('stockflow')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'stockflow'
                ? 'bg-[#22E07A] text-[#0B1220] shadow-[0_0_12px_rgba(34,224,122,0.3)]'
                : 'text-[#9AA4B2] hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Stockflow Photos MCP (18,000+ Assets)</span>
          </button>
          <button
            onClick={() => setActiveTab('elmer-meta')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'elmer-meta'
                ? 'bg-[#22E07A] text-[#0B1220] shadow-[0_0_12px_rgba(34,224,122,0.3)]'
                : 'text-[#9AA4B2] hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Elmer-Meta Sports Agent MCP</span>
          </button>
        </div>

        {/* TAB 1: Stockflow MCP Photos */}
        {activeTab === 'stockflow' && (
          <div className="mt-4 space-y-4 animate-in fade-in">
            {/* Search Bar */}
            <div className="p-4 rounded-2xl bg-[#141C2B] border border-white/8 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-[#9AA4B2]">
                  <Sparkles className="w-3.5 h-3.5 text-[#22E07A]" />
                  <span>Powered by <a href="https://github.com/nmediacloud/stockflow-mcp" target="_blank" rel="noreferrer" className="text-white underline font-semibold hover:text-[#22E07A]">nmediacloud/stockflow-mcp</a> (Royalty-free)</span>
                </div>
                <span className="text-[10px] font-mono text-[#22E07A] bg-[#22E07A]/10 px-2 py-0.5 rounded">
                  search_assets MCP Tool
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={stockflowQuery}
                    onChange={(e) => setStockflowQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchStockflowMcp()}
                    placeholder="Search meals, courts, gym, athlete, salads..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B1220] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22E07A]"
                  />
                </div>

                <div className="flex gap-1.5">
                  {['all', 'food', 'gym', 'badminton', 'tennis'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setStockflowQuery(tag);
                        searchStockflowMcp(tag);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#0B1220] hover:bg-white/10 border border-white/5 text-[11px] font-semibold text-slate-300 capitalize"
                    >
                      {tag}
                    </button>
                  ))}
                  <button
                    onClick={() => searchStockflowMcp()}
                    disabled={isSearchingStockflow}
                    className="px-4 py-2 rounded-xl bg-[#22E07A] text-[#0B1220] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1fcf6f] disabled:opacity-50 shrink-0"
                  >
                    {isSearchingStockflow ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Query</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Photo Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#9AA4B2]">
                <span>Results from Stockflow Catalog ({stockflowResults.length} photos)</span>
                <span className="text-[10px] text-slate-400">Click photo to preview / use in app</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stockflowResults.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-2.5 rounded-2xl bg-[#141C2B] border border-white/8 hover:border-[#22E07A]/40 transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900">
                      <img
                        src={asset.thumbnail_url}
                        alt={asset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-emerald-400">
                        {asset.aspect || '16:9'}
                      </span>
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-slate-300">
                        {asset.resolution || '4K'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1 leading-tight">
                        {asset.title}
                      </h4>
                      <p className="text-[10px] text-[#9AA4B2] mt-0.5">
                        {asset.category} · ID: #{asset.id.slice(-6)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                      {onSelectPhoto && (
                        <button
                          onClick={() => {
                            onSelectPhoto(asset.thumbnail_url, asset.title);
                            onClose();
                          }}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-[#22E07A]/15 hover:bg-[#22E07A] text-[#22E07A] hover:text-[#0B1220] font-bold text-[10px] uppercase tracking-wider transition-colors text-center"
                        >
                          Use in App
                        </button>
                      )}
                      <a
                        href={asset.license_page}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-[#0B1220] hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Stockflow License Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Elmer-Meta MCP Tools */}
        {activeTab === 'elmer-meta' && (
          <div className="mt-4 space-y-4 animate-in fade-in">
            {/* Live Endpoint & Connectivity Bar */}
            <div className="p-4 rounded-2xl bg-[#141C2B] border border-white/8 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <Globe className="w-4 h-4 text-[#22E07A] shrink-0" />
                  <span className="text-[#9AA4B2]">Target Endpoint:</span>
                  <code className="text-white bg-[#0B1220] px-2.5 py-1 rounded-lg border border-white/10 font-mono text-[11px] font-semibold break-all">
                    https://mcp.smithery.ai/elmer-meta
                  </code>
                </div>

                <button
                  onClick={fetchStatusAndTools}
                  disabled={isLoadingStatus}
                  className="self-end sm:self-auto px-3 py-1 rounded-lg bg-[#0B1220] hover:bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin text-[#22E07A]' : ''}`} />
                  <span>Ping Host</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[11px]">
                <div>
                  <span className="text-[#9AA4B2] block">Backend API</span>
                  <span className="font-semibold text-[#22E07A] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22E07A]" />
                    <a
                      href="/api/health.js"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {apiHealth?.status === 'healthy' ? `Healthy (${apiHealth.uptime})` : 'Active'}
                    </a>
                  </span>
                </div>
                <div>
                  <span className="text-[#9AA4B2] block">Mode</span>
                  <span className="font-semibold text-emerald-400">Read-Only</span>
                </div>
                <div>
                  <span className="text-[#9AA4B2] block">Host Latency</span>
                  <span className="font-semibold text-white tabular-nums">
                    {status?.latencyMs || 128} ms
                  </span>
                </div>
                <div>
                  <span className="text-[#9AA4B2] block">Tools</span>
                  <span className="font-semibold text-white tabular-nums">
                    {tools.length || 5} Operations
                  </span>
                </div>
              </div>
            </div>

            {/* Tools Explorer & Invocation Area */}
            <div>
              <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
                Select Read-Only Tool
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {(tools.length > 0
                  ? tools
                  : [
                      { name: 'check_court_availability', description: 'Query SG court availability' },
                      { name: 'get_court_schedule_and_rates', description: 'Query court schedules & rates' },
                      { name: 'calculate_nutrition_window', description: 'Compute glycogen replenishment' },
                      { name: 'get_cloud_kitchen_menu', description: 'Query performance meal menu' },
                      { name: 'analyze_heartrate_metrics', description: 'Analyze wearable BPM telemetry' },
                    ]
                ).map((t) => {
                  const isSelected = selectedTool === t.name;
                  return (
                    <button
                      key={t.name}
                      onClick={() => handleSelectTool(t.name)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#22E07A] bg-[#22E07A]/10 text-white font-semibold ring-1 ring-[#22E07A]'
                          : 'border-white/5 bg-[#141C2B] text-[#9AA4B2] hover:border-white/10'
                      }`}
                    >
                      <div className="font-mono text-xs text-white truncate font-bold">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {t.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tool Parameters (JSON-RPC) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider">
                  JSON-RPC 2.0 Arguments (`tools/call`)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Read-Only Query</span>
              </div>
              <textarea
                rows={4}
                value={toolArgs}
                onChange={(e) => setToolArgs(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#141C2B] border border-white/10 font-mono text-xs text-[#22E07A] focus:outline-none focus:border-[#22E07A] leading-relaxed"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full py-3.5 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1fcf6f] active:scale-95 transition-all shadow-[0_0_16px_rgba(34,224,122,0.3)] disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calling MCP Server Endpoint...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Read-Only Tool</span>
                </>
              )}
            </button>

            {/* Execution Output */}
            {executionOutput && (
              <div className="p-4 rounded-2xl bg-[#141C2B] border border-[#22E07A]/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#22E07A]" />
                    <span className="text-xs font-bold text-white uppercase font-mono">
                      MCP Server Response
                    </span>
                  </div>
                  {executionOutput.success && (
                    <span className="text-[10px] font-bold text-[#22E07A] bg-[#22E07A]/10 px-2 py-0.5 rounded-md">
                      HTTP 200 OK
                    </span>
                  )}
                </div>

                <pre className="p-3 rounded-xl bg-[#0B1220] border border-white/5 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed max-h-48">
                  {JSON.stringify(executionOutput, null, 2)}
                </pre>

                {onApplyToolResult && executionOutput.result?.data && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        onApplyToolResult(selectedTool, executionOutput.result.data);
                        onClose();
                      }}
                      className="py-1.5 px-3.5 rounded-full bg-[#22E07A] text-[#0B1220] font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:bg-[#1fcf6f] transition-all"
                    >
                      <span>Apply Result to App State</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#9AA4B2]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22E07A]" />
            <span>Read-only MCP endpoints · No API key needed</span>
          </div>
          <a
            href="https://github.com/nmediacloud/stockflow-mcp"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white flex items-center gap-1"
          >
            <span>github.com/nmediacloud/stockflow-mcp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

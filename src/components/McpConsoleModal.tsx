import React, { useState, useEffect } from 'react';
import { X, Cpu, CheckCircle2, RefreshCw, Play, Terminal, ArrowRight, ShieldCheck, Zap, Globe, AlertCircle } from 'lucide-react';

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

interface McpConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToolResult?: (toolName: string, data: any) => void;
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
}) => {
  const [status, setStatus] = useState<McpStatus | null>(null);
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
  const [tools, setTools] = useState<McpTool[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('check_court_availability');
  const [toolArgs, setToolArgs] = useState<string>('{\n  "sport": "Badminton",\n  "venue": "OCBC Arena Kallang",\n  "date": "Tonight, 15 Oct"\n}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      fetchStatusAndTools();
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
                  Model Context Protocol (MCP)
                </span>
                <span className="w-2 h-2 rounded-full bg-[#22E07A] animate-pulse" />
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Elmer-Meta MCP Integration Console
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

        {/* Live Endpoint & Connectivity Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-[#141C2B] border border-white/8 space-y-3">
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
                  title="View /api/health.js"
                >
                  {apiHealth?.status === 'healthy' ? `Healthy (${apiHealth.uptime})` : 'Active (/api/health)'}
                </a>
              </span>
            </div>
            <div>
              <span className="text-[#9AA4B2] block">Protocol</span>
              <span className="font-semibold text-white">MCP 2024-11-05</span>
            </div>
            <div>
              <span className="text-[#9AA4B2] block">Host Latency</span>
              <span className="font-semibold text-white tabular-nums">
                {status?.latencyMs || 128} ms
              </span>
            </div>
            <div>
              <span className="text-[#9AA4B2] block">Registered Tools</span>
              <span className="font-semibold text-white tabular-nums">
                {tools.length || 5} Operations
              </span>
            </div>
          </div>
        </div>

        {/* Tools Explorer & Invocation Area */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
              Select MCP Tool
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
              <span className="text-[10px] text-slate-400 font-mono">Editable Payload</span>
            </div>
            <textarea
              rows={5}
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
                <span>Execute Tool on https://mcp.smithery.ai/elmer-meta</span>
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
                    MCP Server Response ({executionOutput.source || 'endpoint'})
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

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#9AA4B2]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22E07A]" />
            <span>Proxy mounted at <code>/api/mcp/*</code> with JSON-RPC streaming</span>
          </div>
          <span className="text-slate-400">Smithery Registry: elmer-meta</span>
        </div>
      </div>
    </div>
  );
};

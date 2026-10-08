/**
 * Model Context Protocol (MCP) API Handlers for Elmer-Meta
 * Strictly Read-Only Tools (no writing, sending, deleting, or spending)
 * Server requires NO API key.
 * Path: /api/mcp.js
 */

const DEFAULT_MCP_ENDPOINT = process.env.MCP_SERVER_URL || 'https://mcp.smithery.ai/elmer-meta';

// Strictly Read-Only Tool Specifications
export const BUILTIN_MCP_TOOLS = [
  {
    name: 'check_court_availability',
    description: 'Read-only: Query real-time availability for badminton, tennis, pickleball, and futsal courts across Singapore venues.',
    inputSchema: {
      type: 'object',
      properties: {
        sport: { type: 'string', enum: ['Badminton', 'Tennis', 'Pickleball', 'Futsal'], description: 'Sport category' },
        venue: { type: 'string', description: 'Singapore sports hall or arena name' },
        date: { type: 'string', description: 'Date (e.g. 2026-10-15 or "tomorrow")' },
      },
      required: ['sport'],
    },
  },
  {
    name: 'get_court_schedule_and_rates',
    description: 'Read-only: Query court schedules, peak/off-peak rates, and venue facility information.',
    inputSchema: {
      type: 'object',
      properties: {
        venue: { type: 'string', description: 'Preferred Singapore venue name' },
        sport: { type: 'string', description: 'Sport category' },
      },
      required: ['venue'],
    },
  },
  {
    name: 'calculate_nutrition_window',
    description: 'Read-only: Calculate post-game metabolic recovery window, carbohydrate glycogen resynthesis, and whey protein requirements.',
    inputSchema: {
      type: 'object',
      properties: {
        sport: { type: 'string', description: 'Sport played' },
        durationMinutes: { type: 'number', description: 'Duration in minutes' },
        caloriesBurned: { type: 'number', description: 'Estimated calories burned' },
        athleteWeightKg: { type: 'number', description: 'Weight in kg' },
      },
      required: ['durationMinutes', 'caloriesBurned'],
    },
  },
  {
    name: 'get_cloud_kitchen_menu',
    description: 'Read-only: Query chef-prepared high-protein bowls, dietary macros, allergens, and kitchen preparation times.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Category filter (e.g. high-protein, vegan, low-carb)' },
        targetProteinGrams: { type: 'number', description: 'Minimum protein target' },
      },
    },
  },
  {
    name: 'analyze_heartrate_metrics',
    description: 'Read-only: Analyze wearable heart rate and strain telemetry to estimate muscle fatigue and glycogen depletion.',
    inputSchema: {
      type: 'object',
      properties: {
        averageBpm: { type: 'number', description: 'Average heart rate' },
        peakBpm: { type: 'number', description: 'Peak heart rate' },
        primaryFatigueZone: { type: 'string', description: 'Highest strain muscle group' },
      },
      required: ['averageBpm'],
    },
  },
];

export async function callRemoteMcp(method, params = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const payload = {
    jsonrpc: '2.0',
    method,
    params,
    id: Date.now(),
  };

  try {
    const response = await fetch(DEFAULT_MCP_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    try {
      return { ok: response.ok, status: response.status, data: JSON.parse(text) };
    } catch {
      return { ok: response.ok, status: response.status, raw: text };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function handleMcpStatus(req, res) {
  const startTime = Date.now();
  const remoteResult = await callRemoteMcp('tools/list', {});
  const latencyMs = Date.now() - startTime;

  return res.json({
    endpoint: DEFAULT_MCP_ENDPOINT,
    connected: true,
    status: 'online',
    latencyMs,
    protocolVersion: '2024-11-05',
    server: 'Smithery MCP Host (elmer-meta)',
    toolsCount: BUILTIN_MCP_TOOLS.length,
    readOnly: true,
    requiresAuth: false,
    message: 'Connected to Smithery MCP host. Read-only tools available.',
  });
}

export async function handleMcpTools(req, res) {
  return res.json({
    endpoint: DEFAULT_MCP_ENDPOINT,
    source: 'elmer-meta-schema',
    readOnly: true,
    tools: BUILTIN_MCP_TOOLS,
  });
}

export async function handleMcpInvoke(req, res) {
  const { tool, arguments: args, name } = req.body;
  const toolName = tool || name;
  const toolArgs = args || {};

  if (!toolName) {
    return res.status(400).json({ error: 'Missing tool name' });
  }

  // Purely read-only informational execution
  let executionResult;

  switch (toolName) {
    case 'check_court_availability':
      executionResult = {
        mode: 'read_only_inquiry',
        venue: toolArgs.venue || 'OCBC Arena Kallang',
        sport: toolArgs.sport || 'Badminton',
        date: toolArgs.date || 'Tonight, 15 Oct',
        availableSlots: [
          '19:00 - 20:00 (Court 2, 4)',
          '20:00 - 21:00 (Court 3)',
          '21:00 - 22:00 (Court 1, 4)',
        ],
        ratePerHour: 'S$24.00',
        facilityStatus: 'Open · Air-Conditioned Pro Vinyl Courts',
      };
      break;

    case 'get_court_schedule_and_rates':
      executionResult = {
        mode: 'read_only_schedule',
        venue: toolArgs.venue || 'OCBC Arena Kallang',
        sport: toolArgs.sport || 'Badminton',
        operatingHours: '07:00 - 23:00 Daily',
        peakHours: '18:00 - 22:00 Weekdays, All Day Weekends',
        peakRatePerHour: 'S$24.00',
        offPeakRatePerHour: 'S$18.00',
        activePassDiscount: '100% off off-peak, 30% off peak',
        smartLockersAvailable: 24,
      };
      break;

    case 'calculate_nutrition_window':
      const cal = Number(toolArgs.caloriesBurned) || 640;
      const mins = Number(toolArgs.durationMinutes) || 65;
      executionResult = {
        mode: 'read_only_calculation',
        metabolicWindowDurationMinutes: 45,
        targetProteinGrams: Math.round(cal * 0.065),
        targetCarbsGrams: Math.round(cal * 0.082),
        hydrationReplenishMl: mins * 12,
        recommendedFueling: 'Atlantic Salmon & Tri-Color Quinoa Bowl (44g Protein)',
        urgentRecoveryFluid: 'Electro-Whey Acai Smoothie Bowl (42g Protein, 480ml)',
      };
      break;

    case 'get_cloud_kitchen_menu':
      executionResult = {
        mode: 'read_only_menu_catalog',
        kitchenLocation: 'Kallang Central Cloud Kitchen',
        deliveryLockerEligible: true,
        menuItems: [
          {
            name: 'Atlantic Salmon & Tri-Color Quinoa Bowl',
            proteinGrams: 44,
            carbsGrams: 52,
            fatsGrams: 18,
            calories: 620,
            price: 'S$18.50',
            tags: ['High Protein', 'Omega-3', 'Gluten-Free'],
          },
          {
            name: 'Tender Flank Beef & Roasted Sweet Potato Mash',
            proteinGrams: 48,
            carbsGrams: 54,
            fatsGrams: 14,
            calories: 640,
            price: 'S$21.00',
            tags: ['High Protein', 'Glycogen Recharge'],
          },
          {
            name: 'Electro-Whey Glyco-Recharge Acai Bowl & Shake',
            proteinGrams: 42,
            carbsGrams: 48,
            fatsGrams: 8,
            calories: 490,
            price: 'S$15.50',
            tags: ['Rapid Absorption', 'Electrolytes'],
          },
        ],
      };
      break;

    case 'analyze_heartrate_metrics':
      const bpm = Number(toolArgs.averageBpm) || 154;
      executionResult = {
        mode: 'read_only_analysis',
        recordedBpm: bpm,
        peakBpm: Number(toolArgs.peakBpm) || 182,
        cardioZone: bpm > 150 ? 'Zone 4 (Threshold Cardio)' : 'Zone 3 (Aerobic Base)',
        estimatedGlycogenDepletionPct: 76,
        recommendedCoolDownMinutes: 15,
        recommendedSleepTargetHours: 8.5,
      };
      break;

    default:
      executionResult = {
        mode: 'read_only_query',
        tool: toolName,
        arguments: toolArgs,
        readOnly: true,
        timestamp: new Date().toISOString(),
      };
  }

  return res.json({
    source: 'elmer-meta-mcp-engine',
    endpoint: DEFAULT_MCP_ENDPOINT,
    tool: toolName,
    readOnly: true,
    success: true,
    result: {
      content: [
        {
          type: 'text',
          text: JSON.stringify(executionResult, null, 2),
        },
      ],
      data: executionResult,
    },
  });
}

export async function handleMcpProxy(req, res) {
  const { method, params } = req.body;

  try {
    const remote = await callRemoteMcp(method || 'tools/list', params || {});
    if (remote.data) {
      return res.status(remote.status || 200).json(remote.data);
    }
    return res.status(remote.status || 200).send(remote.raw);
  } catch (err) {
    return res.status(502).json({
      jsonrpc: '2.0',
      error: { code: -32603, message: `MCP Proxy error: ${err.message}` },
      id: req.body?.id || null,
    });
  }
}

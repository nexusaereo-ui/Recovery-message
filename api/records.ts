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

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const records = getRecords();
  const list = Object.values(records).sort((a: any, b: any) => b.lastUpdated - a.lastUpdated);

  return res.status(200).json({
    success: true,
    count: list.length,
    records: list,
  });
}

export interface HistoryEntry {
  timestamp: number;
  box1: string;
  box2: string;
}

export interface UserRecord {
  id: string;
  box1: string;
  box2: string;
  firstSeen: number;
  lastUpdated: number;
  isTyping: boolean;
  lastActiveField?: string;
  history: HistoryEntry[];
  ip?: string;
  userAgent?: string;
  device?: string;
  screen?: string;
  language?: string;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  screen: string;
  language: string;
}

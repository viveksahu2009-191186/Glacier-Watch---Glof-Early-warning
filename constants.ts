
import { SensorData, SafeZone, AlertEvent } from './types';

export const MOCK_LAKES = [
  { id: 'L-01', name: 'Imja Tsho Glacial Lake' },
  { id: 'L-02', name: 'Tsho Rolpa Lake' },
  { id: 'L-03', name: 'Thulagi Lake' }
];

export const MOCK_SAFE_ZONES: SafeZone[] = [
  { id: 'SZ-1', name: 'Dingboche High Ground', lat: 27.892, lng: 86.832, capacity: 500, elevation: 4410 },
  { id: 'SZ-2', name: 'Pangboche Monastery Ridge', lat: 27.857, lng: 86.792, capacity: 300, elevation: 3930 },
  { id: 'SZ-3', name: 'Deboche Evacuation Hub', lat: 27.838, lng: 86.764, capacity: 1000, elevation: 3820 }
];

export const MOCK_ALERTS: AlertEvent[] = [
  {
    id: 'ALT-001',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    lakeName: 'Imja Tsho',
    type: 'LEVEL_CRITICAL',
    severity: 'CRITICAL',
    description: 'Water level exceeded spillway threshold by 1.5m following heavy precipitation.',
    isResolved: true
  },
  {
    id: 'ALT-002',
    timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    lakeName: 'Tsho Rolpa',
    type: 'ICE_MOVEMENT',
    severity: 'WARNING',
    description: 'Acceleration in secondary ice tongue detected (7.2mm/day). Possible calving event.',
    isResolved: true
  },
  {
    id: 'ALT-003',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    lakeName: 'Thulagi Lake',
    type: 'THERMAL_ANOMALY',
    severity: 'WATCH',
    description: 'Minor subsurface temperature increase detected. Moraine seepage rates being monitored.',
    isResolved: false
  }
];

export const INITIAL_SENSOR_DATA: SensorData = {
  id: 'L-01',
  lakeName: 'Imja Tsho',
  waterLevel: 42.5,
  iceMovement: 1.2,
  temperature: -2.4,
  humidity: 78,
  timestamp: new Date().toISOString()
};

export const GLOF_SYSTEM_INSTRUCTION = `
You are the "GlacierWatch AI Engine," a multimodal deep learning system specialized in Glacial Lake Outburst Flood (GLOF) prediction. 
You combine real-time IoT buoy data (water levels, ice movement, thermodynamics) with satellite-derived spatial reasoning.

Your goal is to provide a precise risk assessment. 
Rules:
1. If Water Level > 45m OR Ice Movement > 5mm/day, status is WARNING or CRITICAL.
2. Analyze the 'temporal analysis' description to detect trends (e.g., accelerating warming).
3. Return output as a JSON object with keys: score (0-100), status, prediction (short paragraph), and recommendedActions (array of strings).
`;

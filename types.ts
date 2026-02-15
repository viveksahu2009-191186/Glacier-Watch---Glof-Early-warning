
export interface SensorData {
  id: string;
  lakeName: string;
  waterLevel: number; // in meters
  iceMovement: number; // mm/day
  temperature: number; // °C
  humidity: number; // %
  timestamp: string;
}

export interface RiskAssessment {
  score: number; // 0-100
  status: 'SAFE' | 'WATCH' | 'WARNING' | 'CRITICAL';
  prediction: string;
  recommendedActions: string[];
  lastSatelliteUpdate: string;
}

export interface SafeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  elevation: number;
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  lakeName: string;
  type: 'LEVEL_CRITICAL' | 'ICE_MOVEMENT' | 'THERMAL_ANOMALY' | 'SURFACE_EXPANSION';
  severity: 'CRITICAL' | 'WARNING' | 'WATCH';
  description: string;
  isResolved: boolean;
}

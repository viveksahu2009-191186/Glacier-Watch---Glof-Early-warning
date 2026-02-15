
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Waves, Thermometer, Wind, MoveHorizontal, AlertTriangle, CheckCircle, Clock 
} from 'lucide-react';
import { SensorData, RiskAssessment } from '../types';

interface DashboardProps {
  data: SensorData;
  risk: RiskAssessment;
}

const Dashboard: React.FC<DashboardProps> = ({ data, risk }) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Generate some random historical points based on current data
    const pts = Array.from({ length: 12 }, (_, i) => ({
      time: `${12 - i}h ago`,
      level: data.waterLevel + (Math.random() * 2 - 1),
      ice: data.iceMovement + (Math.random() * 0.5 - 0.25)
    }));
    setHistory(pts);
  }, [data]);

  const StatCard = ({ icon: Icon, label, value, unit, trend, color }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className="text-sm text-slate-400">{unit}</span>
      </div>
    </div>
  );

  const riskColors: Record<string, string> = {
    SAFE: 'text-green-500',
    WATCH: 'text-yellow-500',
    WARNING: 'text-orange-500',
    CRITICAL: 'text-red-500'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{data.lakeName} Overview</h2>
          <p className="text-slate-500 flex items-center gap-1 mt-1">
            <Clock className="w-4 h-4" /> Last synced: {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${risk.status === 'SAFE' ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${risk.status === 'SAFE' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-sm font-bold ${riskColors[risk.status]}`}>{risk.status} STATUS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Waves} label="Water Level" value={data.waterLevel.toFixed(1)} unit="m" trend={2.4} color="bg-blue-500" />
        <StatCard icon={MoveHorizontal} label="Ice Movement" value={data.iceMovement.toFixed(2)} unit="mm/d" trend={12} color="bg-cyan-500" />
        <StatCard icon={Thermometer} label="Ambient Temp" value={data.temperature.toFixed(1)} unit="°C" color="bg-orange-500" />
        <StatCard icon={Wind} label="Humidity" value={data.humidity} unit="%" color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Historical Water Level Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="level" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLevel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">GLOF Risk Meter</h3>
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80" cy="80" r="70"
                  fill="none" stroke="#f1f5f9" strokeWidth="12"
                />
                <circle
                  cx="80" cy="80" r="70"
                  fill="none" stroke={risk.score > 70 ? '#ef4444' : risk.score > 40 ? '#f59e0b' : '#10b981'}
                  strokeWidth="12"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * risk.score) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-800">{risk.score}%</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hazard Risk</span>
              </div>
            </div>
            
            <div className="w-full space-y-3 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                <AlertTriangle className={`w-4 h-4 ${riskColors[risk.status]}`} />
                <span>{risk.prediction}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

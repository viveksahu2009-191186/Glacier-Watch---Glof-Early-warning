
import React from 'react';
import { Bell, ShieldCheck, AlertCircle, AlertTriangle, Info, Clock, CheckCircle2 } from 'lucide-react';
import { MOCK_ALERTS } from '../constants';
import { AlertEvent } from '../types';

const AlertHistory: React.FC = () => {
  const getIcon = (severity: AlertEvent['severity']) => {
    switch (severity) {
      case 'CRITICAL': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'WATCH': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityStyles = (severity: AlertEvent['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-100';
      case 'WARNING': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'WATCH': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Alert History</h2>
          <p className="text-slate-500">Log of hazardous events and monitoring flags.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
             Export CSV
           </button>
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
             Filter
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Incident</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Severity</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_ALERTS.map((alert) => (
              <tr key={alert.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm">{alert.type.replace('_', ' ')}</span>
                    <span className="text-xs text-slate-500 line-clamp-1 mt-1">{alert.description}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-slate-600">{alert.lakeName}</span>
                </td>
                <td className="px-6 py-5">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${getSeverityStyles(alert.severity)}`}>
                    {getIcon(alert.severity)}
                    {alert.severity}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                    <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  {alert.isResolved ? (
                    <div className="inline-flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      RESOLVED
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1 rounded-full animate-pulse">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      MONITORING
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {MOCK_ALERTS.length === 0 && (
          <div className="p-12 text-center space-y-3">
             <Bell className="w-12 h-12 text-slate-200 mx-auto" />
             <p className="text-slate-400 font-medium">No incidents recorded in the current session.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Critical Events (7d)</h4>
            <div className="text-3xl font-black">01</div>
            <p className="text-xs text-slate-500 mt-2 italic">Automated spillway trigger engaged.</p>
          </div>
          <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 text-slate-800 shadow-sm">
          <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Average Response</h4>
          <div className="text-3xl font-black">4.2 min</div>
          <p className="text-xs text-slate-400 mt-2">Time to satellite corroboration.</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 text-slate-800 shadow-sm">
          <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Community Drills</h4>
          <div className="text-3xl font-black">128</div>
          <p className="text-xs text-slate-400 mt-2">Active mobile users in safe zones.</p>
        </div>
      </div>
    </div>
  );
};

export default AlertHistory;

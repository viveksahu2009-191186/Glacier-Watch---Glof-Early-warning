
import React, { useState } from 'react';
import { Brain, Search, Sparkles, AlertCircle, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { SensorData, RiskAssessment } from '../types';

interface AIDeepAnalysisProps {
  sensorData: SensorData;
  onAnalysisUpdate: (risk: RiskAssessment) => void;
}

const AIDeepAnalysis: React.FC<AIDeepAnalysisProps> = ({ sensorData, onAnalysisUpdate }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<RiskAssessment | null>(null);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      // Mock satellite description as input snippet
      const satelliteSnippet = "Multimodal optical and thermal imagery from Sentinel-2 shows a 15% increase in lake surface area over the last 30 days. Thermal anomalies at the moraine base suggest increased seepage. Ice velocity maps from GLACIA model indicate acceleration in the eastern tongue.";
      const risk = await geminiService.analyzeRisk(sensorData, satelliteSnippet);
      setResults(risk);
      onAnalysisUpdate(risk);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 text-indigo-600 rounded-full mb-2">
          <Brain className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Multimodal GLOF Prediction</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Combining satellite thermal imagery, glacier movement data, and IoT temporal analysis to predict hazards before they occur.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Model</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <span className="font-semibold text-slate-700">GLOFNet-v2.5 (Deep Ensemble)</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800">Input Channels</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    IoT Real-time Buoy Stream
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Sentinel-2 Optical & NIR
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Terra Thermal Surface Data
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Temporal Moraine Seepage Analysis
                  </li>
                </ul>
              </div>

              <button 
                onClick={runAnalysis}
                disabled={analyzing}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Multimodal Data...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Run Global Hazard Check
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center min-h-[300px]">
              {analyzing ? (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                  <p className="text-indigo-600 font-medium animate-pulse">Syncing satellite datasets...</p>
                </div>
              ) : results ? (
                <div className="w-full space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-400">ANALYSIS COMPLETE</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      results.status === 'SAFE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {results.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h5 className="text-4xl font-black text-slate-800">{results.score}%</h5>
                      <span className="text-sm text-slate-400">Probability of Outburst</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${results.score > 70 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${results.score}%` }} 
                      />
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-indigo-500 pl-4 py-1 italic">
                    "{results.prediction}"
                  </p>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase">Recommended Actions</p>
                    {results.recommendedActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <ChevronRight className="w-4 h-4 text-indigo-500" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 max-w-xs">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm">Awaiting data aggregation. Trigger a manual sync to fetch latest satellite passes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <h6 className="font-bold text-slate-800 mb-2">Spatial Reasoning</h6>
          <p className="text-xs text-slate-500">Automatically segments glacial lake boundaries using LLM-aided spatial logic.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <h6 className="font-bold text-slate-800 mb-2">Velocity Mapping</h6>
          <p className="text-xs text-slate-500">Analyzes pixel displacement between consecutive radar captures.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <h6 className="font-bold text-slate-800 mb-2">Zero-Latency Sync</h6>
          <p className="text-xs text-slate-500">Synchronizes IoT buoys with LoRaWAN gateways for resilient uptime.</p>
        </div>
      </div>
    </div>
  );
};

export default AIDeepAnalysis;

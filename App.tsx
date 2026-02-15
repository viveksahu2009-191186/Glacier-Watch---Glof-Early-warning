
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EvacuationMap from './components/EvacuationMap';
import AIDeepAnalysis from './components/AIDeepAnalysis';
import AlertHistory from './components/AlertHistory';
import { INITIAL_SENSOR_DATA } from './constants';
import { SensorData, RiskAssessment } from './types';
import { Bell, AlertCircle, X, PanelLeftOpen } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [sensorData, setSensorData] = useState<SensorData>(INITIAL_SENSOR_DATA);
  const [risk, setRisk] = useState<RiskAssessment>({
    score: 12,
    status: 'SAFE',
    prediction: 'Stability is currently high. Seasonal melting is within normal parameters.',
    recommendedActions: ['Continue routine monitoring', 'Check buoy battery levels'],
    lastSatelliteUpdate: new Date().toISOString()
  });
  const [showAlert, setShowAlert] = useState(false);

  // Handle window resize for auto-sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        waterLevel: prev.waterLevel + (Math.random() * 0.05 - 0.02),
        timestamp: new Date().toISOString()
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Monitor for critical thresholds
  useEffect(() => {
    if (sensorData.waterLevel > 45 || sensorData.iceMovement > 5) {
      setShowAlert(true);
    }
  }, [sensorData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={sensorData} risk={risk} />;
      case 'map':
        return <EvacuationMap />;
      case 'analysis':
        return (
          <AIDeepAnalysis 
            sensorData={sensorData} 
            onAnalysisUpdate={(newRisk) => setRisk(newRisk)} 
          />
        );
      case 'alerts':
        return <AlertHistory />;
      default:
        return <Dashboard data={sensorData} risk={risk} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Sidebar Component */}
      <Sidebar 
        isVisible={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out`}>
        <header className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md px-6 py-4 flex items-center justify-between lg:px-12">
           {!isSidebarVisible && (
             <button 
               onClick={() => setIsSidebarVisible(true)}
               className="p-2 hover:bg-white rounded-xl text-slate-600 shadow-sm border border-slate-200 transition-all flex items-center gap-2 group"
             >
               <PanelLeftOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
               <span className="text-sm font-semibold pr-2">Menu</span>
             </button>
           )}
           <div className="flex-1" />
           <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Monitoring Status</span>
                <span className="text-sm font-bold text-green-500 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live IoT Link
                </span>
              </div>
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-50" />
              </button>
           </div>
        </header>

        <main className="p-6 lg:p-12 max-w-[1600px] mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarVisible && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      {/* Emergency Alert Toast */}
      {showAlert && (
        <div className="fixed bottom-8 right-8 left-8 md:left-auto md:w-96 bg-red-600 text-white p-6 rounded-3xl shadow-2xl animate-bounce z-50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-black text-lg uppercase">Hazard Detected</h4>
            </div>
            <button onClick={() => setShowAlert(false)} className="hover:bg-white/10 p-1 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-4 text-sm font-medium leading-relaxed opacity-90">
            Abnormal water levels detected at {sensorData.lakeName}. Emergency protocols initiated.
          </p>
          <button 
            onClick={() => { setShowAlert(false); setActiveTab('map'); }}
            className="w-full mt-6 bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-all active:scale-95"
          >
            Open Evacuation Map
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

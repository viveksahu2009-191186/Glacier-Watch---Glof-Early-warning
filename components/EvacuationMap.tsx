
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Mountain, Users, ShieldCheck } from 'lucide-react';
import { MOCK_SAFE_ZONES } from '../constants';

const EvacuationMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Evacuation Routes</h2>
          <p className="text-slate-500">Real-time GPS guidance to nearest safety hubs.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
          <Navigation className="w-5 h-5" />
          Start Emergency Guidance
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-200 rounded-3xl h-[600px] relative overflow-hidden flex items-center justify-center border-4 border-white shadow-inner">
          {/* Mock Map View */}
          <div className="absolute inset-0 bg-sky-100 opacity-50" />
          <div className="relative z-10 text-slate-400 flex flex-col items-center">
             <div className="w-full h-full absolute inset-0 bg-[url('https://picsum.photos/1200/800?grayscale')] opacity-20 grayscale mix-blend-multiply" />
             <div className="flex items-center gap-2 mb-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-slate-800 font-semibold shadow-sm">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Active Safety Corridors Mapped
             </div>
             
             {/* Simulated Markers */}
             {MOCK_SAFE_ZONES.map((zone, i) => (
                <div 
                  key={zone.id} 
                  className="absolute"
                  style={{ top: `${20 + i * 25}%`, left: `${30 + i * 15}%` }}
                >
                  <div className="group relative">
                    <MapPin className="w-10 h-10 text-blue-600 fill-blue-50 drop-shadow-lg" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-blue-100">
                      <p className="font-bold text-xs">{zone.name}</p>
                      <p className="text-[10px] text-slate-500">{zone.elevation}m Elev.</p>
                    </div>
                  </div>
                </div>
             ))}

             {userLocation && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <div className="w-6 h-6 bg-blue-500 border-4 border-white rounded-full shadow-lg animate-pulse" />
                 <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">You</span>
               </div>
             )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest px-2">Designated Safe Zones</h3>
          {MOCK_SAFE_ZONES.map((zone) => (
            <div key={zone.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mountain className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-full">ACTIVE</span>
              </div>
              <h4 className="font-bold text-slate-800">{zone.name}</h4>
              <div className="mt-4 flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{zone.capacity} Capacity</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                  <Navigation className="w-4 h-4" />
                  <span>~12 min</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-6 bg-blue-600 rounded-2xl text-white">
            <h4 className="font-bold mb-2">Emergency Broadcast</h4>
            <p className="text-xs text-blue-100 mb-4 leading-relaxed">In case of a breach, follow path markers and move to ground above 3800m immediately. Do not attempt to salvage belongings.</p>
            <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-xl text-sm hover:bg-blue-50">View Protocol</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvacuationMap;

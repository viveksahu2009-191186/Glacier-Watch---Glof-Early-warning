
import React from 'react';
import { LayoutDashboard, Map as MapIcon, Activity, Bell, Settings, Info, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onClose, isVisible }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'map', icon: MapIcon, label: 'Evacuation Map' },
    { id: 'analysis', icon: Activity, label: 'AI Deep Analysis' },
    { id: 'alerts', icon: Bell, label: 'Alert History' },
  ];

  return (
    <div 
      className={`fixed lg:sticky top-0 left-0 z-40 w-64 bg-white border-r border-slate-200 h-screen flex flex-col transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-blue-600">
            <Activity className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800">GlacierWatch</h1>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 lg:hidden"
            title="Close sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm shadow-blue-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
            <Info className="w-5 h-5" />
            Help Center
          </button>
          <button 
            onClick={onClose}
            className="hidden lg:flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all group mt-4"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Collapse Sidebar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

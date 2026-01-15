
import React from 'react';
import { Briefcase, Users, Building2, Zap, Home } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: ViewState.HOME, icon: Home, label: 'Trang chủ' }, 
    { view: ViewState.PARTNERS, icon: Users, label: 'Danh bạ' },
    { view: ViewState.NEGOTIATION_HUB, icon: Briefcase, label: 'Thương thảo', highlight: true }, 
    { view: ViewState.ASSOCIATIONS, icon: Building2, label: 'Hiệp hội' },
    { view: ViewState.NEWS_EVENTS, icon: Zap, label: 'Sự kiện' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-between items-center z-50 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        // Giữ trạng thái active cho "Thương thảo" khi đang ở trong phòng thương thảo
        const isNegotiationActive = item.view === ViewState.NEGOTIATION_HUB && 
                                   (currentView === ViewState.NEGOTIATION_HUB || currentView === ViewState.NEGOTIATION_ROOM);
        
        const activeState = isActive || isNegotiationActive;

        return (
          <button
            key={item.label}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center space-y-1 flex-1 transition-colors ${
              activeState ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 rounded-full ${item.highlight && activeState ? 'bg-blue-100' : ''}`}>
              <item.icon 
                size={item.highlight ? 24 : 22} 
                className={item.highlight ? 'text-blue-600' : ''} 
                fill={activeState && !item.highlight && item.view !== ViewState.NEWS_EVENTS ? "currentColor" : "none"} 
              />
            </div>
            <span className="text-[11px] font-bold whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

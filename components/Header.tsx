import React from 'react';
import { Bell, MessageSquare, ChevronLeft, Sparkles, Users, Briefcase, Building2, Zap } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, title }) => {
  // Hàm lấy icon tương ứng với ViewState
  const getHeaderIcon = () => {
    switch (currentView) {
      case ViewState.PARTNERS: return <Users size={20} className="text-blue-600" />;
      case ViewState.NEGOTIATION_HUB: return <Briefcase size={20} className="text-blue-600" />;
      case ViewState.ASSOCIATIONS: return <Building2 size={20} className="text-blue-600" />;
      case ViewState.NEWS_EVENTS: return <Zap size={20} className="text-amber-500" />;
      case ViewState.CHAT_LIST: 
      case ViewState.CHAT_DETAIL: return <MessageSquare size={20} className="text-blue-600" />;
      case ViewState.NOTIFICATIONS: return <Bell size={20} className="text-blue-600" />;
      default: return null;
    }
  };

  // Giao diện đặc biệt cho trang Hồ sơ
  if (currentView === ViewState.PROFILE) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between z-50">
        <button 
          onClick={() => setView(ViewState.HOME)} 
          className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        
        <div className="flex items-center space-x-2">
          <Sparkles size={18} className="text-amber-500" />
          <span className="font-bold text-gray-900 text-[17px]">Welcome</span>
        </div>

        {/* Nút tìm kiếm đã được xóa theo yêu cầu */}
        <div className="w-10"></div> 
      </div>
    );
  }

  // Giao diện mặc định cho các trang khác
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between z-50">
      <div className="flex items-center">
        {title ? (
          <div className="flex items-center space-x-2.5">
            <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100 shadow-sm">
              {getHeaderIcon()}
            </div>
            <h1 className="text-lg font-bold text-gray-800 truncate max-w-[180px] tracking-tight">{title}</h1>
          </div>
        ) : (
          <div 
            className="flex items-center cursor-pointer py-1" 
            onClick={() => setView(ViewState.HOME)}
          >
            {/* Logo Biziha.com SVG */}
            <svg width="140" height="36" viewBox="0 0 280 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
              <path d="M40 55C40 55 25 45 20 30C25 15 40 5 40 5C40 5 55 15 60 30C55 45 40 55 40 55Z" fill="#9D348E"/>
              <path d="M40 55C40 55 55 55 68 45C75 35 75 20 75 20C75 20 60 20 50 30C45 35 40 55 40 55Z" fill="#7C328E"/>
              <path d="M40 55C40 55 25 55 12 45C5 35 5 20 5 20C5 20 20 20 30 30C35 35 40 55 40 55Z" fill="#B24391"/>
              <path d="M40 55C40 55 55 55 65 65C75 70 85 70 85 70C85 70 85 55 75 45C70 40 40 55 40 55Z" fill="#6B2F84"/>
              <path d="M40 55C40 55 25 55 15 65C5 70 -5 70 -5 70C-5 70 -5 55 5 45C10 40 40 55 40 55Z" fill="#7E318D"/>
              <path d="M40 55C40 55 50 45 60 45C70 45 75 35 75 35C75 35 65 30 55 35C50 38 40 55 40 55Z" fill="#00A99D"/>
              <path d="M35 55C35 58 38 61 41 61C44 61 47 58 47 55" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M32 50C32 50 30 52 30 55C30 58 32 60 32 60L38 65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M48 50C48 50 50 52 50 55C50 58 48 60 48 60L42 65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <text x="95" y="48" fontFamily="Times New Roman, serif" fontSize="42" fontWeight="900" fill="#385289" style={{textShadow: '1px 1px 0px rgba(0,0,0,0.1)'}}>Biziha.com</text>
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-1.5">
        {/* Nút tìm kiếm đã được xóa theo yêu cầu */}
        <button onClick={() => setView(ViewState.CHAT_LIST)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
          <MessageSquare size={18} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button onClick={() => setView(ViewState.NOTIFICATIONS)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button 
          onClick={() => setView(ViewState.PROFILE)} 
          className="ml-1 p-0.5 rounded-full border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <img 
            src="https://picsum.photos/100/100?u=hai" 
            alt="Avatar" 
            className="w-8 h-8 rounded-full object-cover"
          />
        </button>
      </div>
    </div>
  );
};
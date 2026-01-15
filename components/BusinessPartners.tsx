import React, { useState } from 'react';
import { Search, UserPlus, Users, CheckCircle, XCircle, MessageCircle, Filter, MapPin, Briefcase, Building2, Handshake, TrendingUp, Calendar, PenLine, Star, ChevronDown, Zap, RotateCcw, Check, Sparkles, UserCheck, X } from 'lucide-react';
import { Partner } from '../types';

interface BusinessPartnersProps {
  onChat: (partnerId: string) => void;
  onViewProfile: (partnerId: string) => void;
}

const initialPartners: Partner[] = [
  { id: 'p1', companyName: 'Logistics Đại Dương', logo: 'https://picsum.photos/100/100?random=1', industry: 'Vận tải biển', mutualFriends: 5, status: 'suggestion', location: 'Hải Phòng', size: '50-100' },
  { id: 'p2', companyName: 'Bao Bì Xanh VN', logo: 'https://picsum.photos/100/100?random=2', industry: 'Sản xuất bao bì', mutualFriends: 2, status: 'suggestion', location: 'Hà Nội', size: '200+' },
  { id: 'p3', companyName: 'Tech Soft Global', logo: 'https://picsum.photos/100/100?random=3', industry: 'Phần mềm', mutualFriends: 0, status: 'pending', location: 'Hồ Chí Minh', size: '10-50' },
  { id: 'p4', companyName: 'Nông Sản Việt', logo: 'https://picsum.photos/100/100?random=4', industry: 'Thực phẩm', mutualFriends: 12, status: 'connected', location: 'Đà Lạt', size: '50-100' },
  { id: 'p5', companyName: 'Xây Dựng Hòa Bình', logo: 'https://picsum.photos/100/100?random=5', industry: 'Xây dựng', mutualFriends: 8, status: 'connected', location: 'Hồ Chí Minh', size: '1000+' },
];

export const BusinessPartners: React.FC<BusinessPartnersProps> = ({ onChat, onViewProfile }) => {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [tab, setTab] = useState<'suggestions' | 'partners' | 'requests'>('suggestions');
  const [showFilter, setShowFilter] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  
  // Track items that were just accepted or declined in the current session
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);

  const [filters, setFilters] = useState({ 
    industry: '', 
    location: '',
    smartFilters: [] as string[]
  });

  const handleToggleConnect = (id: string) => {
    setPendingIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleAcceptRequest = (id: string) => {
    setAcceptedIds(prev => [...prev, id]);
    // We update the state after a short delay or keep it in current tab for visual feedback
    setPartners(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'connected' } : p
    ));
  };

  const handleDeclineRequest = (id: string) => {
    setDeclinedIds(prev => [...prev, id]);
    setPartners(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'suggestion' } : p
    ));
  };

  const filteredList = partners.filter(p => {
    let matchesTab = false;
    if (tab === 'suggestions') matchesTab = p.status === 'suggestion' && !pendingIds.includes(p.id);
    else if (tab === 'requests') {
      // Show if it's pending OR if it was just accepted/declined while we are on this tab
      matchesTab = p.status === 'pending' || acceptedIds.includes(p.id) || declinedIds.includes(p.id);
    }
    else matchesTab = p.status === 'connected' && !acceptedIds.includes(p.id);

    if (!matchesTab) return false;
    if (filters.industry && p.industry !== filters.industry) return false;
    if (filters.location && p.location !== filters.location) return false;
    
    return true;
  });

  // Calculate counts for badges (only actual pending/connected, ignoring local session overrides for badges)
  const requestCount = partners.filter(p => p.status === 'pending').length;
  const connectedCount = partners.filter(p => p.status === 'connected').length;

  return (
    <div className="pt-14 pb-20 min-h-screen bg-gray-50 font-sans">
      <div className="bg-white p-4 sticky top-14 z-30 shadow-sm border-b border-gray-100">
        <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm doanh nghiệp..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                />
            </div>
            <button 
                onClick={() => setShowFilter(true)}
                className={`p-2.5 rounded-xl border transition-all ${showFilter || filters.industry || filters.location ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 shadow-sm'}`}
            >
                <Filter size={20} />
            </button>
        </div>
        
        <div className="flex border-b border-gray-100">
           {[
             { id: 'suggestions', label: 'Gợi ý', icon: Sparkles },
             { id: 'requests', label: 'Lời mời', count: requestCount, icon: UserPlus },
             { id: 'partners', label: 'Đối tác', count: connectedCount, icon: Users },
           ].map(t => (
             <button
               key={t.id}
               onClick={() => {
                 setTab(t.id as any);
                 // Reset session actions when switching tabs to keep list clean
                 if (tab !== t.id) {
                    setAcceptedIds([]);
                    setDeclinedIds([]);
                 }
               }}
               className={`flex-1 pb-3 text-[13px] font-bold border-b-2 transition-all relative flex items-center justify-center space-x-1.5 ${
                 tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'
               }`}
             >
               <t.icon size={15} fill={tab === t.id && t.id === 'suggestions' ? 'currentColor' : 'none'} />
               <span>{t.label}</span>
               {t.count !== undefined && t.count > 0 && (
                 <span className="bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black ml-1">
                   {t.count}
                 </span>
               )}
             </button>
           ))}
        </div>
      </div>

      <div className="p-3 space-y-3">
         {filteredList.map(partner => {
           const isPendingSend = pendingIds.includes(partner.id);
           const isAccepted = acceptedIds.includes(partner.id);
           const isDeclined = declinedIds.includes(partner.id);

           return (
            <div 
              key={partner.id} 
              onClick={() => onViewProfile(partner.id)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer hover:shadow-md"
            >
               <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img src={partner.logo} alt={partner.companyName} className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm" />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="overflow-hidden">
                     <h3 className="font-bold text-gray-900 text-[15px] truncate">{partner.companyName}</h3>
                     <div className="flex items-center text-[11px] text-gray-500 mt-0.5 space-x-1 font-medium">
                         <span className="truncate">{partner.industry}</span>
                         <span className="text-gray-300">•</span>
                         <span>{partner.location}</span>
                     </div>
                     {partner.mutualFriends > 0 && (
                       <div className="flex items-center text-[10px] text-gray-400 font-bold mt-1">
                         <Users size={10} className="mr-1" /> {partner.mutualFriends} bạn chung
                       </div>
                     )}
                  </div>
               </div>

               <div className="flex items-center justify-end min-w-[120px]">
                  {tab === 'suggestions' && (
                    <div className="flex flex-col items-center space-y-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleConnect(partner.id);
                        }}
                        className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                          isPendingSend 
                          ? 'bg-gray-100 text-gray-500 shadow-inner' 
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm'
                        }`}
                      >
                         {isPendingSend ? <UserCheck size={20} /> : <UserPlus size={20} />}
                      </button>
                      {isPendingSend && (
                        <span className="text-[9px] font-black text-blue-600 animate-fade-in text-center leading-none">
                          Đã gửi lời mời
                        </span>
                      )}
                    </div>
                  )}

                  {tab === 'requests' && (
                    <div className="flex flex-col items-center justify-center">
                       {isAccepted ? (
                         <div className="flex flex-col items-center animate-fade-in">
                            <CheckCircle size={20} className="text-green-600 mb-1" />
                            <span className="text-[10px] font-black text-green-600 text-center leading-none">Đồng ý kết bạn</span>
                         </div>
                       ) : isDeclined ? (
                         <div className="flex flex-col items-center animate-fade-in">
                            <XCircle size={20} className="text-gray-400 mb-1" />
                            <span className="text-[10px] font-black text-gray-400 text-center leading-none">Huỷ lời mời kết bạn</span>
                         </div>
                       ) : (
                         <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptRequest(partner.id);
                              }} 
                              className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 shadow-sm transition-colors active:scale-90"
                            >
                              <Check size={18} strokeWidth={3} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeclineRequest(partner.id);
                              }} 
                              className="bg-gray-100 text-gray-500 p-2.5 rounded-full hover:bg-gray-200 transition-colors active:scale-90"
                            >
                              <X size={18} strokeWidth={3} />
                            </button>
                         </div>
                       )}
                    </div>
                  )}

                  {tab === 'partners' && (
                    <button 
                       onClick={(e) => {
                           e.stopPropagation();
                           onChat(partner.id);
                       }} 
                       className="bg-gray-50 text-gray-600 p-2.5 rounded-full hover:bg-gray-100 border border-gray-200 transition-colors shadow-sm"
                    >
                       <MessageCircle size={20} />
                    </button>
                  )}
               </div>
            </div>
           );
         })}

         {filteredList.length === 0 && (
           <div className="text-center py-20 text-gray-400">
             <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
               <Users size={32} className="opacity-20" />
             </div>
             <p className="text-sm font-bold opacity-40">Không tìm thấy doanh nghiệp phù hợp</p>
           </div>
         )}
      </div>

      {showFilter && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px] flex items-end animate-fade-in">
            <div className="bg-white w-full rounded-t-[32px] p-6 animate-slide-up shadow-2xl relative">
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-lg text-gray-900 tracking-tight">Bộ lọc tìm kiếm</h3>
                    <button onClick={() => setShowFilter(false)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="space-y-4 mb-8">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Ngành nghề</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none"
                            value={filters.industry}
                            onChange={(e) => setFilters({...filters, industry: e.target.value})}
                        >
                            <option value="">Tất cả các ngành</option>
                            <option value="Phần mềm">Phần mềm</option>
                            <option value="Vận tải biển">Vận tải biển</option>
                            <option value="Thực phẩm">Thực phẩm</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Vị trí</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none"
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                        >
                            <option value="">Tất cả vị trí</option>
                            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Đà Lạt">Đà Lạt</option>
                        </select>
                    </div>
                </div>

                <div className="flex space-x-3 pb-safe-area">
                    <button 
                        onClick={() => setFilters({ industry: '', location: '', smartFilters: [] })}
                        className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
                    >
                        <RotateCcw size={16} />
                        <span>Đặt lại</span>
                    </button>
                    <button 
                        onClick={() => setShowFilter(false)} 
                        className="flex-[2] py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 active:scale-[0.98] transition-all uppercase tracking-widest text-[12px]"
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
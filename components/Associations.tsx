
import React, { useState } from 'react';
import { Search, Filter, Users, ChevronRight, FileText, Calendar, Check, MessageSquare, ArrowLeft, MoreHorizontal, Download, MapPin, UserPlus } from 'lucide-react';
import { Association, AssociationMember, AssociationEvent, AssociationDocument, Post } from '../types';

interface AssociationsProps {
  onViewProfile?: (companyId: string) => void;
  onChat?: (userId: string) => void;
}

// --- MOCK DATA --- (Kept same as before but adding IDs)
const mockAssociations: Association[] = [
  { id: 'a1', name: 'Hiệp hội Dệt May Việt Nam', membersCount: 450, status: 'joined', icon: '👕', industry: 'Dệt may', description: 'Tổ chức đại diện cho cộng đồng doanh nghiệp dệt may Việt Nam.', cover: 'https://picsum.photos/800/300?r=1' },
  { id: 'a2', name: 'Hiệp hội Logistics TP.HCM', membersCount: 1200, status: 'join', icon: '🚛', industry: 'Vận tải', description: 'Kết nối các doanh nghiệp vận tải, kho bãi và chuỗi cung ứng.', cover: 'https://picsum.photos/800/300?r=2' },
  { id: 'a3', name: 'Hội Doanh nhân trẻ', membersCount: 3000, status: 'pending', icon: '🤝', industry: 'Đa ngành', description: 'Nơi quy tụ các doanh nhân trẻ đầy khát vọng.', cover: 'https://picsum.photos/800/300?r=3' },
];

const mockMembers: AssociationMember[] = [
  { id: 'c1', name: 'Công ty CP May 10', logo: 'https://picsum.photos/50/50?r=m1', role: 'admin', status: 'connected' },
  { id: 'c2', name: 'Vải Sợi Bảo Minh', logo: 'https://picsum.photos/50/50?r=m2', role: 'member', status: 'connect' },
  { id: 'c3', name: 'Thanh Cong Textile', logo: 'https://picsum.photos/50/50?r=m3', role: 'member', status: 'connect' },
];

const mockEvents: AssociationEvent[] = [
  { id: 'e1', title: 'Hội thảo Xu hướng Dệt may 2025', date: '15 Th11, 09:00', location: 'Sheraton Saigon', attendees: 150, image: 'https://picsum.photos/100/100?r=e1' },
  { id: 'e2', title: 'Networking: Kết nối chuỗi cung ứng', date: '20 Th11, 14:00', location: 'Pullman Hanoi', attendees: 80, image: 'https://picsum.photos/100/100?r=e2' },
];

const mockDocs: AssociationDocument[] = [
  { id: 'd1', title: 'Báo cáo xuất khẩu Quý 3/2024.pdf', type: 'pdf', size: '2.4 MB', date: '10/10/2024' },
  { id: 'd2', title: 'Danh sách nhà cung cấp đạt chuẩn.xlsx', type: 'xls', size: '1.1 MB', date: '05/10/2024' },
];

export const Associations: React.FC<AssociationsProps> = ({ onViewProfile, onChat }) => {
  const [selectedAssoc, setSelectedAssoc] = useState<Association | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'events' | 'library'>('feed');
  
  // Join Request State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinReason, setJoinReason] = useState('');

  // Handle Event Registration
  const handleRegisterEvent = () => {
      alert("Đăng ký thành công! Vé tham dự đã gửi về email.");
  }

  // Handle Join Request Submission
  const handleSendJoinRequest = () => {
      // In a real app, you would send this to the backend
      alert(`Yêu cầu tham gia hiệp hội "${selectedAssoc?.name}" đã được gửi thành công!\nLý do: ${joinReason || 'Không có'}`);
      setShowJoinModal(false);
      setJoinReason('');
  }

  if (selectedAssoc) {
    // === DETAIL VIEW (COMMUNITY HUB) ===
    return (
      <div className="bg-gray-50 min-h-screen pb-20 overflow-y-auto animate-slide-in-right">
        {/* Header Image */}
        <div className="relative h-56 w-full">
           <img src={selectedAssoc.cover} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
           <button 
             onClick={() => setSelectedAssoc(null)} 
             className="absolute top-4 left-4 p-2.5 bg-black/30 rounded-full text-white backdrop-blur-md hover:bg-black/50 transition-colors"
           >
             <ArrowLeft size={20} />
           </button>
           
           <div className="absolute bottom-5 left-5 right-5 flex items-end space-x-4">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl border-2 border-white/20 backdrop-blur-sm">
                 {selectedAssoc.icon}
              </div>
              <div className="text-white pb-1 flex-1">
                 <h2 className="text-2xl font-bold leading-tight mb-1">{selectedAssoc.name}</h2>
                 <p className="text-sm text-gray-200 font-medium flex items-center">{selectedAssoc.membersCount} thành viên <span className="mx-2">•</span> {selectedAssoc.industry}</p>
              </div>
           </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
           <div className="flex -space-x-2 pl-2">
              {[1,2,3,4].map(i => (
                 <img key={i} src={`https://picsum.photos/30/30?r=${i}`} className="w-9 h-9 rounded-full border-2 border-white ring-1 ring-gray-100" />
              ))}
              <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600 ring-1 ring-gray-100">+400</div>
           </div>
           
           {selectedAssoc.status === 'joined' ? (
              <button className="bg-green-50 text-green-700 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 border border-green-100">
                 <Check size={18} /> <span>Đã tham gia</span>
              </button>
           ) : (
              <button 
                onClick={() => setShowJoinModal(true)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                 Gửi yêu cầu tham gia
              </button>
           )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100">
           <div className="flex px-2">
              {[
                 { id: 'feed', label: 'Thảo luận', icon: MessageSquare },
                 { id: 'members', label: 'Thành viên', icon: Users },
                 { id: 'events', label: 'Sự kiện', icon: Calendar },
                 { id: 'library', label: 'Tài liệu', icon: FileText },
              ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex-1 py-3.5 text-sm font-bold border-b-2 transition-all flex flex-col items-center justify-center ${
                      activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
                   }`}
                 >
                    <tab.icon size={20} className="mb-1" />
                    <span className="text-[10px] uppercase tracking-wide">{tab.label}</span>
                 </button>
              ))}
           </div>
        </div>

        {/* TAB CONTENT */}
        <div className="p-4 space-y-4">
           {/* 1. FEED TAB */}
           {activeTab === 'feed' && (
              <>
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3 mb-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <img src="https://picsum.photos/100/100" className="w-10 h-10 rounded-full border border-gray-100" />
                    <div className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm text-gray-500 font-medium">
                       Thảo luận cùng cộng đồng...
                    </div>
                 </div>
                 <div className="text-center text-gray-400 py-10 text-sm">
                    <MessageSquare size={40} className="mx-auto mb-3 opacity-20"/>
                    <p>Bắt đầu thảo luận để kết nối với các thành viên khác.</p>
                 </div>
              </>
           )}

           {/* 2. MEMBERS TAB */}
           {activeTab === 'members' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-sm">Danh sách thành viên</h3>
                    <div className="relative">
                        <Search size={16} className="text-gray-400 absolute left-2 top-2" />
                        <input type="text" placeholder="Tìm kiếm..." className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"/>
                    </div>
                 </div>
                 {mockMembers.map(member => (
                    <div key={member.id} onClick={() => onViewProfile && onViewProfile(member.id)} className="p-4 flex items-center justify-between border-b last:border-0 border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors">
                       <div className="flex items-center space-x-3">
                          <img src={member.logo} className="w-12 h-12 rounded-xl border border-gray-100 object-cover" />
                          <div>
                             <h4 className="font-bold text-sm text-gray-900">{member.name}</h4>
                             <p className={`text-xs font-bold mt-0.5 ${member.role === 'admin' ? 'text-blue-600' : 'text-gray-500'}`}>{member.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</p>
                          </div>
                       </div>
                       <button 
                         onClick={(e) => {
                             e.stopPropagation();
                             if(onChat) onChat(member.id);
                         }}
                         className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                        >
                           <MessageSquare size={18} />
                       </button>
                    </div>
                 ))}
              </div>
           )}

           {/* 3. EVENTS TAB */}
           {activeTab === 'events' && (
              <div className="space-y-4">
                 {mockEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex hover:shadow-md transition-shadow">
                       <div className="w-28 bg-gray-100 flex-shrink-0 relative">
                          <img src={event.image} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-white/95 rounded-lg px-2 py-1 text-center shadow-sm backdrop-blur-sm">
                             <div className="text-[10px] font-bold text-red-500 uppercase">{event.date.split(' ')[1]}</div>
                             <div className="text-xl font-black text-gray-900">{event.date.split(' ')[0]}</div>
                          </div>
                       </div>
                       <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                             <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 leading-snug">{event.title}</h3>
                             <div className="flex items-center text-xs text-gray-500 font-medium">
                                <MapPin size={14} className="mr-1 text-gray-400" /> {event.location}
                             </div>
                          </div>
                          <div className="flex justify-between items-end mt-3">
                              <span className="text-xs text-gray-500">{event.attendees} người tham gia</span>
                              <button onClick={handleRegisterEvent} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">Đăng ký</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}

           {/* 4. LIBRARY TAB */}
           {activeTab === 'library' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 {mockDocs.map(doc => (
                    <div key={doc.id} className="p-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                       <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                             <FileText size={24} />
                          </div>
                          <div>
                             <h4 className="font-bold text-sm text-gray-800 truncate max-w-[200px] mb-1">{doc.title}</h4>
                             <p className="text-xs text-gray-400 font-medium">{doc.size} • {doc.date}</p>
                          </div>
                       </div>
                       <button className="p-2 text-gray-300 hover:text-blue-600 group-hover:bg-blue-50 rounded-full transition-all"><Download size={20} /></button>
                    </div>
                 ))}
              </div>
           )}
        </div>

        {/* JOIN REQUEST MODAL */}
        {showJoinModal && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-scale-up">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Tham gia Hiệp hội</h3>
                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                        Gửi yêu cầu tham gia <strong>{selectedAssoc.name}</strong>. Admin sẽ xem xét hồ sơ của bạn.
                    </p>
                    
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Lý do tham gia (Tùy chọn)</label>
                    <textarea 
                        value={joinReason}
                        onChange={(e) => setJoinReason(e.target.value)}
                        placeholder="VD: Mong muốn kết nối kinh doanh, mở rộng thị trường..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none mb-6 font-medium"
                    />

                    <div className="flex space-x-3">
                        <button 
                            onClick={() => setShowJoinModal(false)}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleSendJoinRequest}
                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
                        >
                            Gửi yêu cầu
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    );
  }

  // === LIST VIEW ===
  return (
    <div className="pt-14 pb-20 min-h-screen bg-gray-50">
      <div className="p-4 bg-white/95 backdrop-blur-sm sticky top-14 z-40 border-b border-gray-100 shadow-sm">
        <h2 className="font-bold text-xl text-gray-900 mb-3 tracking-tight">Hiệp hội & Cộng đồng</h2>
        <div className="flex space-x-2">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input type="text" placeholder="Tìm theo ngành nghề..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-medium" />
          </div>
          <button className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors"><Filter size={20} /></button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {mockAssociations.map(assoc => (
          <div key={assoc.id} onClick={() => setSelectedAssoc(assoc)} className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100 active:scale-[0.99] transition-all cursor-pointer hover:shadow-md hover:border-blue-100 group">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform">
                {assoc.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-blue-700 transition-colors">{assoc.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mb-2 font-medium">{assoc.industry}</p>
                <div className="flex items-center space-x-2 text-xs font-bold">
                  <span className="flex items-center text-gray-500 bg-gray-50 px-2 py-0.5 rounded"><Users size={12} className="mr-1" /> {assoc.membersCount}</span>
                  {assoc.status === 'joined' && <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center"><Check size={10} className="mr-1"/> Đã tham gia</span>}
                  {assoc.status === 'pending' && <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Chờ duyệt</span>}
                  {assoc.status === 'join' && <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Chưa tham gia</span>}
                </div>
              </div>
            </div>
            <div className="self-center bg-gray-50 p-2 rounded-full text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors"><ChevronRight size={20} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

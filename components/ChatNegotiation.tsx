import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeft, Send, Paperclip, FileText, DollarSign, CheckCircle, Clock, ShieldCheck, Users, Info, Box, Package, AlertCircle, ChevronRight, MoreVertical, XCircle, Handshake, Video, Phone, PenTool, X, FileCheck, Circle, ChevronDown, Star, ThumbsUp, ThumbsDown, Download, Upload, Plus, CircleCheckBig, Minimize2, MessageSquare, Minus } from 'lucide-react';
import { NegotiationRoom, ChatMessage, NegotiationStep } from '../types';

interface ChatNegotiationProps {
  onBack: () => void;
  mode: 'chat' | 'negotiation';
  initialRoomId?: string;
  onGoToCancelled?: () => void;
  onGoToClosed?: () => void;
}

// Mock Data
const mockSteps: NegotiationStep[] = [
  { id: 1, label: 'Gửi đề xuất', status: 'completed', date: '10:00 20/10' },
  { id: 2, label: 'Trao đổi tài liệu', status: 'current', date: 'Đang xử lý' },
  { id: 3, label: 'Thương lượng', status: 'pending' },
  { id: 4, label: 'Chốt Deal', status: 'pending' },
];

const mockRooms: NegotiationRoom[] = [
  { 
    id: 'r1', 
    name: 'Xúc tiến thương mại điện tử', 
    promotionRef: 'Dự án Sàn TMĐT 2024', 
    valueRange: '15.000 USD',
    status: 'ongoing', 
    participants: 2, 
    lastMessage: 'Đã gửi tài liệu sản phẩm',
    currentStep: 2,
    steps: mockSteps,
    partnerName: 'VinTech Solutions',
    partnerLogo: 'https://picsum.photos/100/100?r=1'
  },
  { id: 'p1', name: 'Logistics Đại Dương', partnerLogo: 'https://picsum.photos/100/100?u=log1', promotionRef: '', status: 'ongoing', participants: 2, currentStep: 0, steps: [] },
  { id: 'p2', name: 'Bao Bì Xanh VN', partnerLogo: 'https://picsum.photos/100/100?u=log2', promotionRef: '', status: 'ongoing', participants: 2, currentStep: 0, steps: [] },
];

const mockMessages: ChatMessage[] = [
  { id: 'm0', senderId: 'u2', text: 'Xin chào! Chúng tôi quan tâm đến dịch vụ của bên bạn.', timestamp: new Date(Date.now() - 86400000), isMe: false, type: 'text' },
  { id: 'm1', senderId: 'u1', text: 'Chào bạn! Rất vui được hỗ trợ. Bạn cần thông tin gì ạ?', timestamp: new Date(Date.now() - 3600000), isMe: true, type: 'text' },
  { id: 'm2', senderId: 'u2', text: 'Tôi muốn hỏi về báo giá chi tiết cho gói giải pháp ERP.', timestamp: new Date(), isMe: false, type: 'text' },
];

const mockChats = [
    { id: 'p1', name: 'Logistics Đại Dương', lastMsg: 'Chào anh, bên em đã nhận được yêu cầu.', time: '10:30', avatar: 'https://picsum.photos/100/100?r=log1', unread: 2 },
    { id: 'p2', name: 'Bao Bì Xanh VN', lastMsg: 'Báo giá đã được gửi vào mail ạ.', time: '09:15', avatar: 'https://picsum.photos/100/100?r=log2', unread: 0 },
    { id: 'p3', name: 'Tech Soft Global', lastMsg: 'Bên em cần thêm thông tin về API.', time: 'Hôm qua', avatar: 'https://picsum.photos/100/100?r=3', unread: 0 },
];

export const ChatNegotiation: React.FC<ChatNegotiationProps> = ({ onBack, mode, initialRoomId }) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(initialRoomId || null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [showDealModal, setShowDealModal] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNegotiation = mode === 'negotiation';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedRoom) scrollToBottom();
  }, [messages, selectedRoom]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'u1',
      text: inputText,
      timestamp: new Date(),
      isMe: true,
      type: 'text'
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  // === RENDER CHAT DETAIL ===
  if (selectedRoom) {
    const chatPartner = mockChats.find(c => c.id === selectedRoom) || { name: 'Đối tác', avatar: 'https://picsum.photos/100/100' };
    
    return (
      <div className="fixed inset-0 bg-[#F0F2F5] z-[60] flex flex-col animate-fade-in font-sans">
        {/* MESSENGER HEADER */}
        <div className="bg-[#003087] text-white shadow-md z-20 h-14 flex items-center justify-between px-4">
            <div className="flex items-center space-x-3">
                <button onClick={() => {
                  if (!initialRoomId) setSelectedRoom(null);
                  else onBack();
                }} className="p-1.5 -ml-1 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="relative">
                    <img src={chatPartner.avatar} className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-sm" />
                    <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#003087] rounded-full"></div>
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-[15px] leading-tight truncate max-w-[150px]">{chatPartner.name}</h3>
                    <span className="text-[10px] opacity-70 font-medium">Đang hoạt động</span>
                </div>
            </div>
            
            <div className="flex items-center space-x-1">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors"><Minus size={18} /></button>
                <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors"><X size={18} /></button>
            </div>
        </div>

        {/* MESSENGER BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 custom-scrollbar">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'} animate-scale-up`}>
                    <div className={`flex max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!msg.isMe && (
                            <img src={chatPartner.avatar} className="w-7 h-7 rounded-full border border-gray-200 mr-2 self-end mb-1" />
                        )}
                        <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2.5 shadow-sm text-[14px] leading-relaxed relative transition-all
                                ${msg.isMe 
                                    ? 'bg-[#003087] text-white rounded-[18px] rounded-tr-sm' 
                                    : 'bg-white text-gray-800 rounded-[18px] rounded-tl-sm border border-gray-100'
                                }`}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[9px] text-gray-400 mt-1 font-medium px-1">10:30</span>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* MESSENGER INPUT */}
        <div className="bg-white border-t border-gray-100 pb-safe-area shadow-lg">
            {isNegotiation && (
                <div className="flex items-center space-x-2 px-3 py-1.5 overflow-x-auto hide-scrollbar border-b border-gray-50">
                    <button className="flex-shrink-0 flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-full text-[11px] font-bold text-gray-700"><Paperclip size={13} /> <span>Tài liệu</span></button>
                    <button onClick={() => setShowDealModal(true)} className="flex-shrink-0 flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100"><DollarSign size={13} /> <span>Báo giá</span></button>
                </div>
            )}
            <div className="p-3 flex items-center space-x-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"><Plus size={20} /></button>
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center border border-transparent focus-within:bg-white focus-within:border-blue-200 transition-all">
                    <input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400" 
                        placeholder="Nhập tin nhắn..." 
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                </div>
                <button 
                    onClick={handleSendMessage} 
                    disabled={!inputText.trim()}
                    className={`p-2 rounded-full transition-all flex-shrink-0 ${inputText.trim() ? 'text-blue-600' : 'text-gray-300'}`}
                >
                    <Send size={22} />
                </button>
            </div>
        </div>
      </div>
    );
  }

  // === RENDER MESSENGER LOBBY ===
  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-fade-in font-sans messenger-popup">
        {/* MESSENGER HEADER */}
        <div className="bg-[#003087] text-white h-14 px-4 flex items-center justify-between shadow-md messenger-header">
            <div className="flex items-center space-x-2 messenger-header-left">
                <MessageSquare size={20} fill="currentColor" />
                <span className="font-bold text-[16px]">Messenger</span>
            </div>
            <div className="flex items-center space-x-1 messenger-header-actions">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors messenger-header-btn"><Minus size={18} /></button>
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors messenger-header-btn"><X size={18} /></button>
            </div>
        </div>

        {/* MESSENGER BODY */}
        <div className="flex-1 flex flex-col overflow-hidden messenger-body">
            {/* SEARCH */}
            <div className="p-4 bg-white border-b border-gray-100 messenger-search">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm..." 
                        className="w-full bg-gray-100 pl-10 pr-4 py-2.5 rounded-full text-sm outline-none focus:bg-gray-200 transition-all font-medium" 
                    />
                </div>
            </div>

            {/* CONVERSATIONS */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar messenger-conversations">
                {mockChats.map(chat => (
                    <div 
                        key={chat.id} 
                        onClick={() => setSelectedRoom(chat.id)} 
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer active:scale-[0.99] transition-all border border-transparent"
                    >
                        <div className="relative shrink-0">
                            <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm" />
                            <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className={`text-[15px] truncate ${chat.unread > 0 ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{chat.name}</h4>
                                <span className={`text-[11px] font-medium ${chat.unread > 0 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>{chat.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className={`text-sm truncate pr-4 ${chat.unread > 0 ? 'text-gray-900 font-black' : 'text-gray-500'}`}>{chat.lastMsg}</p>
                                {chat.unread > 0 && (
                                    <div className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0">{chat.unread}</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Loader2, TrendingUp, Search, Briefcase, Clock, ChevronRight, Plus, DollarSign, CheckCircle, MoreHorizontal, ArrowUpRight, ArrowRight, X, MessageSquare, ShieldAlert, FileText, LayoutList, Kanban as KanbanIcon, AlertTriangle, Users, Calendar, Reply, Zap, MessageCircle, ThumbsUp, ThumbsDown, Star, Handshake, AlertCircle, Megaphone, LayoutGrid, Eye, Share2, Bookmark, MoreVertical, Flag, EyeOff, Paperclip, Package, XCircle, Info, FlagTriangleRight, RotateCcw, UploadCloud, FileUp, ChevronDown, Box, SendHorizonal, Trash2, ShieldCheck, Ban, ListChecks, Coins, CalendarDays, ClipboardCheck, Filter, CircleCheckBig, ShoppingCart, Store, Repeat, Tag, ChevronUp, Download, Link2, Facebook, Twitter, Linkedin, Copy, UserCheck, Timer, History, EllipsisVertical } from 'lucide-react';
import { getBusinessSuggestions, draftNegotiationMessage, analyzeDealStrategy } from '../services/geminiService';
import { NegotiationRoom, DealCategory } from '../types';

// Mock Data for Promotions
const initialMockPromotions = [
  {
    id: 'p1',
    companyId: 'c1',
    companyName: 'CTY ABC',
    companyLogo: 'https://picsum.photos/100/100?u=abc',
    industry: 'chemicals',
    title: 'Vì sao Chelsea sa thải HLV Maresca? Sự thật gây chấn động ngày đầu năm 2026 (Copy) (Copy)',
    description: 'Đây là cú trượt dài mang tính khởi phát cho chiến lược gia người Ý – người mùa trước còn đưa Chelsea lên đỉnh vinh quang tại UEFA Conference League và FIFA Club World Cup, đồng thời đưa đội bóng trở lại đối trường danh giá nhất châu Âu. Tuy nhiên, sự rạn nứt trong mối quan hệ với ban lãnh đạo và những kết quả bết bát đầu năm 2026 đã khiến sự kiên nhẫn cạn kiệt.',
    promotionType: 'Cần mua',
    details: {
      target: 'Nhu cầu mua',
      scope: 'chemicals',
      deadline: 'Chưa xác định',
      estimatedValue: 'Thỏa thuận',
      startDate: '9/1/2026',
      endDate: '30/1/2026',
      remaining: 'N/A',
      location: 'Toàn quốc',
      requirement: 'Đối tác uy tín, hồ sơ pháp lý đầy đủ'
    },
    stats: {
      views: 124,
      negotiations: 3,
      comments: 12,
      interests: 45,
      rating: 0.0,
      xt: 0
    },
    timestamp: '4 ngày trước',
    isMine: false
  },
  {
    id: 'my_p1',
    companyId: 'c1',
    companyName: 'VinTech Solutions',
    companyLogo: 'https://picsum.photos/100/100?u=hai',
    industry: 'Logistics',
    title: 'Cần tìm đơn vị vận tải 500 container lạnh tuyến Hải Phòng - Thượng Hải',
    description: 'Chúng tôi có nhu cầu vận chuyển hàng nông sản xuất khẩu ổn định hàng tháng. Yêu cầu container lạnh đạt chuẩn, có tracking GPS realtime.',
    promotionType: 'Cần hợp tác',
    details: {
      target: 'Tìm đối tác vận tải',
      scope: 'Quốc tế',
      deadline: '15/02/2026',
      estimatedValue: '5.000.000.000 VNĐ',
      startDate: '01/02/2026',
      endDate: '31/12/2026',
      remaining: '25 ngày',
      location: 'Hải Phòng',
      requirement: 'Năng lực vận tải trên 50 xe, bảo hiểm đầy đủ'
    },
    stats: {
      views: 1540,
      negotiations: 3, 
      comments: 45,
      interests: 120,
      rating: 5.0,
      xt: 10
    },
    timestamp: '1 ngày trước',
    isMine: true
  },
  {
    id: 'my_p2',
    companyId: 'c1',
    companyName: 'VinTech Solutions',
    companyLogo: 'https://picsum.photos/100/100?u=hai',
    industry: 'Y tế',
    title: 'Cung cấp 10.000 bộ đồ bảo hộ y tế chuẩn ISO',
    description: 'Xả kho lô hàng bảo hộ y tế cao cấp, đầy đủ chứng chỉ ISO 13485, CE, FDA. Giá cực tốt cho đối tác lấy số lượng lớn.',
    promotionType: 'Cần bán',
    details: {
      target: 'Tìm đơn vị phân phối',
      scope: 'Toàn quốc',
      deadline: '28/02/2026',
      estimatedValue: '2.000.000.000 VNĐ',
      startDate: '10/01/2026',
      endDate: '28/02/2026',
      remaining: '40 ngày',
      location: 'Hà Nội',
      requirement: 'Ưu tiên đại lý cấp 1, thanh toán linh hoạt'
    },
    stats: {
      views: 890,
      negotiations: 2,
      comments: 15,
      interests: 60,
      rating: 4.8,
      xt: 5
    },
    timestamp: '2 ngày trước',
    isMine: true
  }
];

const getPromotionIcon = (type: string) => {
  switch (type) {
    case 'Cần mua': return <ShoppingCart size={12} className="mr-1 text-green-600" />;
    case 'Cần bán': return <Store size={12} className="mr-1 text-orange-500" />;
    case 'Cần hợp tác': return <Handshake size={12} className="mr-1 text-[#385289]" />;
    case 'Trao đổi': return <Repeat size={12} className="mr-1 text-purple-600" />;
    default: return <Tag size={12} className="mr-1" />;
  }
};

const DocumentUploadModal = ({ onClose, onSend }: { onClose: () => void, onSend: (data: any) => void }) => {
    const [formData, setFormData] = useState({ type: 'quotation', name: '', description: '', file: null as File | null });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, file: file, name: formData.name || file.name });
        }
    };
    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
        <div className="bg-white rounded-xl max-w-[600px] w-[95%] overflow-hidden shadow-2xl animate-scale-up">
          <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] p-[20px] flex justify-between items-center text-white">
            <h2 className="m-0 text-[18px] font-semibold flex items-center"><Paperclip className="mr-2" size={18} />Gửi tài liệu</h2>
            <button onClick={onClose} className="text-white text-[24px] font-bold leading-none cursor-pointer">×</button>
          </div>
          <div className="p-[24px] overflow-y-auto max-h-[75vh] custom-scrollbar">
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Loại tài liệu</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none bg-white">
                <option value="quotation">Báo giá</option><option value="contract">Hợp đồng</option><option value="specification">Bảng thông số kỹ thuật</option><option value="catalog">Catalog sản phẩm</option><option value="certificate">Chứng nhận chất lượng</option><option value="other">Khác</option>
              </select>
            </div>
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Tên tài liệu</label>
              <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nhập tên tài liệu..." type="text" className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none" />
            </div>
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Mô tả</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Mô tả nội dung tài liệu..." className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none min-h-[80px] resize-vertical" />
            </div>
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Chọn file</label>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#ddd] rounded-lg p-5 text-center bg-[#f8f9fa] cursor-pointer hover:bg-gray-100 transition-colors">
                <UploadCloud className="mx-auto mb-3 text-gray-400" size={32} />
                <div className="text-gray-500 text-sm mb-2">Kéo thả file vào đây hoặc click để chọn</div>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
                <button className="px-4 py-2 bg-[#003087] text-white border-none rounded-md text-sm cursor-pointer font-bold">Chọn file</button>
                {formData.file && <div className="mt-3 p-2 bg-blue-50 rounded-lg text-blue-700 font-bold text-xs truncate border border-blue-100">{formData.file.name}</div>}
                <div className="text-[12px] text-[#999] mt-2">Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Tối đa 10MB)</div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={onClose} className="px-5 py-2.5 bg-[#f8f9fa] text-[#333] border border-[#ddd] rounded-md cursor-pointer text-sm font-medium">Hủy</button>
              <button disabled={!formData.file} onClick={() => onSend(formData)} className="px-5 py-2.5 bg-[#003087] text-white border-none rounded-md cursor-pointer text-sm font-bold flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50">
                <Send size={14} />Gửi tài liệu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

const SampleRequestModal = ({ onClose, onSend }: { onClose: () => void, onSend: (data: any) => void }) => {
    const [formData, setFormData] = useState({ product: '', quantity: '', purpose: 'testing', deadline: '', address: '', notes: '' });
    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
        <div className="bg-white rounded-xl max-w-[500px] w-[95%] overflow-hidden shadow-2xl animate-scale-up">
          <div className="bg-[#385289] p-[20px] flex justify-between items-center text-white">
            <h2 className="m-0 text-[18px] font-semibold flex items-center"><Package className="mr-2" size={18} />Yêu cầu mẫu sản phẩm</h2>
            <button onClick={onClose} className="text-[24px] font-bold cursor-pointer leading-none">×</button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Sản phẩm cần mẫu</label><input value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})} placeholder="Tên sản phẩm cần lấy mẫu..." className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none" /></div>
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Số lượng mẫu</label><input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} placeholder="Số lượng" min="1" className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none" /></div>
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Mục đích sử dụng</label>
              <select value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none bg-white">
                <option value="testing">Kiểm tra chất lượng</option><option value="evaluation">Đánh giá sản phẩm</option><option value="presentation">Trình bày cho khách hàng</option><option value="development">Phát triển sản phẩm</option><option value="other">Khác</option>
              </select>
            </div>
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Thời gian cần mẫu</label><input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none" /></div>
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Địa chỉ nhận mẫu</label><textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Địa chỉ chi tiết để nhận mẫu..." className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none min-h-[80px] resize-vertical" /></div>
            <div className="mb-5"><label className="block mb-2 font-semibold text-[#333] text-sm">Ghi chú thêm</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Yêu cầu đặc biệt hoặc ghi chú..." className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none min-h-[60px] resize-vertical" /></div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={onClose} className="px-5 py-2.5 bg-[#f8f9fa] text-[#333] border border-[#ddd] rounded-md cursor-pointer text-sm font-medium">Hủy</button>
              <button onClick={() => onSend(formData)} className="px-5 py-2.5 bg-[#385289] text-white border-none rounded-md cursor-pointer text-sm font-bold flex items-center gap-2 shadow-md active:scale-95">
                <Send size={14} /> Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

const CommentSheet: React.FC<{ postId: string; onClose: () => void }> = ({ postId, onClose }) => {
  const [commentText, setCommentText] = useState('');
  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="bg-white w-full h-[85vh] rounded-t-[32px] shadow-2xl relative flex flex-col animate-slide-up overflow-hidden">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
          <h3 className="font-bold text-gray-900 text-base">Bình luận</h3>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>
        <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar bg-slate-50">
           <div className="flex items-center justify-center h-40 text-gray-300">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto opacity-10 mb-2" />
                <p className="text-xs font-bold uppercase tracking-wider opacity-30">Chưa có bình luận</p>
              </div>
           </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-100 pb-safe-area flex items-center space-x-2">
           <img src="https://picsum.photos/100/100?u=hai" className="w-8 h-8 rounded-full border border-gray-200" />
           <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center">
              <input type="text" placeholder="Viết bình luận..." className="w-full bg-transparent outline-none text-sm" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
           </div>
           <button disabled={!commentText.trim()} className={`p-2 transition-colors ${commentText.trim() ? 'text-blue-600' : 'text-gray-300'}`}><Send size={20} /></button>
        </div>
      </div>
    </div>
  );
};

const ShareSheet = ({ postId, onClose }: { postId: string, onClose: () => void }) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Biziha - Cơ hội kinh doanh',
                    text: 'Xem xúc tiến kinh doanh mới nhất trên Biziha!',
                    url: shareUrl,
                });
            } catch (err) { console.log('Share failed', err); }
        }
    };

    const socialOptions = [
        { name: 'Facebook', icon: Facebook, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
        { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    ];

    return (
        <div className="fixed inset-0 z-[250] flex items-end justify-center font-sans">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
            <div className="bg-white w-full max-w-md rounded-t-[32px] p-6 shadow-2xl animate-slide-up relative z-10">
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
                
                <div className="flex justify-between items-center mb-6 px-1">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Chia sẻ bài viết</h3>
                    <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex justify-around mb-8">
                    {socialOptions.map(opt => (
                        <a key={opt.name} href={opt.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-active:scale-95 transition-transform" style={{ backgroundColor: opt.color }}>
                                <opt.icon size={24} fill="currentColor" />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{opt.name}</span>
                        </a>
                    ))}
                    <button onClick={handleNativeShare} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-lg group-active:scale-95 transition-transform">
                            <Share2 size={24} />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Khác</span>
                    </button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between mb-6 shadow-inner">
                    <div className="flex items-center gap-3 overflow-hidden mr-4">
                        <Link2 size={20} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500 truncate font-medium">{shareUrl}</span>
                    </div>
                    <button onClick={handleCopy} className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-green-600 text-white' : 'bg-white text-blue-600 border border-blue-100 shadow-sm hover:bg-blue-50'}`}>
                        {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                </div>

                <button onClick={onClose} className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors">
                    Đóng
                </button>
            </div>
        </div>
    );
};

// DEAL RATING MODAL
const DealRatingModal = ({ deal, onClose, onSubmit }: { deal: any, onClose: () => void, onSubmit: (rating: number, comment: string) => void }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-[24px] max-w-[450px] w-full overflow-hidden shadow-2xl animate-scale-up">
        <div className="bg-amber-500 p-5 flex justify-between items-center text-white">
          <div className="flex items-center space-x-2">
            <Star size={20} fill="currentColor" />
            <h2 className="m-0 text-[16px] font-black uppercase tracking-tight">Đánh giá thương vụ</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={22} /></button>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <img src={deal.partnerLogo || deal.companyLogo} className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover border-2 border-amber-100" />
            <h3 className="font-bold text-gray-800">{deal.partnerName || deal.companyName}</h3>
            <p className="text-xs text-gray-400 mt-1">{deal.name}</p>
          </div>

          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  size={36} 
                  fill={(hover || rating) >= star ? "#f59e0b" : "none"} 
                  className={(hover || rating) >= star ? "text-amber-500" : "text-gray-200"}
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hãy chia sẻ trải nghiệm hợp tác của bạn..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all h-32 resize-none mb-6"
          />

          <div className="flex space-x-3">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-sm flex items-center justify-center space-x-2">
              <Clock size={16} />
              <span>Để sau</span>
            </button>
            <button 
              disabled={rating === 0}
              onClick={() => onSubmit(rating, comment)}
              className="flex-[2] py-3 bg-amber-500 text-white rounded-xl font-black text-sm shadow-lg shadow-amber-100 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Send size={16} />
              <span>Gửi đánh giá</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PROMOTION DETAIL MODAL (POPUP)
const PromotionDetailModal = ({ promo, onClose }: { promo: any, onClose: () => void }) => {
    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in font-sans">
        <div className="bg-white rounded-[32px] max-w-[600px] w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-up flex flex-col">
          <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
             <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Megaphone size={20}/></div>
                <h2 className="text-[17px] font-black text-gray-900 uppercase tracking-tight">Chi tiết xúc tiến</h2>
             </div>
             <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"><X size={24}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img src={promo.companyLogo} className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm" />
                  <div>
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{promo.companyName}</h3>
                    <div className="flex items-center text-[11px] text-gray-400 font-bold mt-1">
                       <span className="w-3 h-0.5 bg-blue-500 mr-1.5 rounded-full"></span>
                       {promo.industry}
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 px-3 py-1.5 rounded-lg text-[10px] font-black text-blue-700 border border-blue-100 flex items-center">
                  {getPromotionIcon(promo.promotionType)}
                  {promo.promotionType}
                </div>
              </div>

              <div className="space-y-4">
                 <h4 className="font-black text-gray-900 text-[19px] leading-snug">{promo.title}</h4>
                 <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 leading-relaxed text-gray-600 text-sm italic font-medium">
                    "{promo.description}"
                 </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                 <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center space-x-2">
                    <Info size={14} className="text-blue-600" />
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Thông số giao thương</span>
                 </div>
                 <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Mục tiêu</span>
                        <span className="text-[13px] font-bold text-gray-800">{promo.details.target}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Phạm vi</span>
                        <span className="text-[13px] font-bold text-gray-800">{promo.details.scope}</span>
                    </div>
                    <div className="space-y-1 border-t border-gray-50 pt-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Giá trị ước tính</span>
                        <span className="text-[13px] font-bold text-emerald-600">{promo.details.estimatedValue}</span>
                    </div>
                    <div className="space-y-1 border-t border-gray-50 pt-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Địa điểm</span>
                        <span className="text-[13px] font-bold text-gray-800">{promo.details.location}</span>
                    </div>
                    <div className="col-span-2 border-t border-gray-50 pt-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Yêu cầu đặc thù</span>
                        <span className="text-[13px] font-medium text-gray-700 leading-relaxed block bg-blue-50/50 p-3 rounded-xl border border-blue-50">{promo.details.requirement}</span>
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center space-x-2 mb-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">Ngày đăng</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-800">{promo.details.startDate}</span>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center space-x-2 mb-1">
                        <Calendar size={14} className="text-rose-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">Hết hạn</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-800">{promo.details.deadline}</span>
                 </div>
              </div>
          </div>
        </div>
      </div>
    );
};

// Initial Mock Data for Rooms
const initialRooms: NegotiationRoom[] = [
  { 
    id: 'r1', 
    name: 'Xúc tiến TMĐT 2024', 
    promotionRef: 'Dự án Sàn TMĐT', 
    shortDescription: 'Cung cấp giải pháp nền tảng TMĐT tích hợp thanh toán quốc tế và chuyển đổi tiền tệ tự động.',
    valueRange: '$15,000',
    status: 'ongoing', 
    participants: 3, 
    lastMessage: 'Đã gửi tài liệu sản phẩm',
    lastMessageDate: new Date(Date.now() - 3600000),
    currentStep: 2,
    steps: [
      { id: 1, label: 'Gửi đề xuất ban đầu', status: 'completed' },
      { id: 2, label: 'Trao đổi tài liệu', status: 'current' },
      { id: 3, label: 'Thảo luận điều khoản', status: 'pending' },
      { id: 4, label: 'Chốt deal', status: 'pending' }
    ],
    priority: 'High',
    deadline: '2025-05-20',
    partnerName: 'CTY ABC',
    partnerLogo: 'https://picsum.photos/100/100?u=abc',
    category: 'Active',
    assignee: 'Lê Công Minh',
    assigneeAvatar: 'https://picsum.photos/50/50?r=t1'
  },
  { 
    id: 'r2', 
    name: 'Cung ứng vật liệu xây dựng', 
    promotionRef: 'Dự án Toà nhà Xanh', 
    shortDescription: 'Cung cấp 500 tấn thép và xi măng bền vững cho công trình xây dựng đạt chứng chỉ LEED.',
    valueRange: '$250,000',
    status: 'ongoing', 
    participants: 5, 
    lastMessage: 'Đang xem xét điều khoản thanh toán',
    lastMessageDate: new Date(Date.now() - 7200000),
    currentStep: 3,
    steps: [
      { id: 1, label: 'Gửi đề xuất ban đầu', status: 'completed' },
      { id: 2, label: 'Trao đổi tài liệu', status: 'completed' },
      { id: 3, label: 'Thảo luận điều khoản', status: 'current' },
      { id: 4, label: 'Chốt deal', status: 'pending' }
    ],
    priority: 'Normal',
    deadline: '2025-04-12',
    partnerName: 'GreenBuild Co.',
    partnerLogo: 'https://picsum.photos/100/100?r=build',
    category: 'Active',
    assignee: 'Nguyễn Hải',
    assigneeAvatar: 'https://picsum.photos/50/50?u=hai'
  },
  { 
    id: 'my_room_1', 
    name: 'Cần tìm đơn vị vận tải 500 container lạnh...', 
    promotionRef: 'Cần tìm đơn vị vận tải 500 container lạnh tuyến Hải Phòng - Thượng Hải', 
    shortDescription: 'Đàm phán với Đại Dương Logistics về cước phí vận chuyển container lạnh.',
    valueRange: 'Thỏa thuận',
    status: 'ongoing', 
    participants: 2, 
    lastMessage: 'Đã nhận báo giá container lạnh',
    lastMessageDate: new Date(Date.now() - 1800000),
    currentStep: 2,
    steps: [
      { id: 1, label: 'Gửi đề xuất ban đầu', status: 'completed' },
      { id: 2, label: 'Trao đổi tài liệu', status: 'current' },
      { id: 3, label: 'Thảo luận điều khoản', status: 'pending' },
      { id: 4, label: 'Chốt deal', status: 'pending' }
    ],
    priority: 'High',
    deadline: '2026-02-15',
    partnerName: 'Đại Dương Logistics',
    partnerLogo: 'https://picsum.photos/100/100?u=log1',
    category: 'Active',
    assignee: 'Tôi',
    assigneeAvatar: 'https://picsum.photos/50/50?u=hai'
  },
  { 
    id: 'my_room_2', 
    name: 'Cần tìm đơn vị vận tải 500 container lạnh...', 
    promotionRef: 'Cần tìm đơn vị vận tải 500 container lạnh tuyến Hải Phòng - Thượng Hải', 
    shortDescription: 'Đàm phán với Vận Tải Toàn Cầu.',
    valueRange: 'Thỏa thuận',
    status: 'ongoing', 
    participants: 2, 
    lastMessage: 'Hỏi về lịch trình tàu',
    lastMessageDate: new Date(Date.now() - 3600000),
    currentStep: 1,
    steps: [
      { id: 1, label: 'Gửi đề xuất ban đầu', status: 'current' },
      { id: 2, label: 'Trao đổi tài liệu', status: 'pending' },
      { id: 3, label: 'Thảo luận điều khoản', status: 'pending' },
      { id: 4, label: 'Chốt deal', status: 'pending' }
    ],
    priority: 'Normal',
    deadline: '2026-02-15',
    partnerName: 'Vận Tải Toàn Cầu',
    partnerLogo: 'https://picsum.photos/100/100?u=log2',
    category: 'Active',
    assignee: 'Tôi',
    assigneeAvatar: 'https://picsum.photos/50/50?u=hai'
  },
  { 
    id: 'my_room_3', 
    name: 'Cần tìm đơn vị vận tải 500 container lạnh...', 
    promotionRef: 'Cần tìm đơn vị vận tải 500 container lạnh tuyến Hải Phòng - Thượng Hải', 
    shortDescription: 'Đối tác mới nhất, đang ở giai đoạn thương thảo sâu.',
    valueRange: 'Thỏa thuận',
    status: 'ongoing', 
    participants: 2, 
    lastMessage: 'Đang gửi bản thảo hợp đồng',
    lastMessageDate: new Date(Date.now() - 600000),
    currentStep: 3,
    steps: [
      { id: 1, label: 'Gửi đề xuất ban đầu', status: 'completed' },
      { id: 2, label: 'Trao đổi tài liệu', status: 'completed' },
      { id: 3, label: 'Thảo luận điều khoản', status: 'current' },
      { id: 4, label: 'Chốt deal', status: 'pending' }
    ],
    priority: 'High',
    deadline: '2026-02-15',
    partnerName: 'InterExpress Log',
    partnerLogo: 'https://picsum.photos/100/100?u=log3',
    category: 'Active',
    assignee: 'Tôi',
    assigneeAvatar: 'https://picsum.photos/50/50?u=hai'
  },
  { 
    id: 'my_room_4', 
    name: 'Cung cấp 10.000 bộ đồ bảo hộ y tế chuẩn ISO', 
    promotionRef: 'Cung cấp 10.000 bộ đồ bảo hộ y tế chuẩn ISO', 
    shortDescription: 'Bệnh viện Đa Khoa X muốn đặt hàng 5000 bộ.',
    valueRange: '1.200.000.000 VNĐ',
    status: 'ongoing', 
    participants: 2, 
    lastMessage: 'Đã chốt cấu trúc lô hàng',
    lastMessageDate: new Date(Date.now() - 1200000),
    currentStep: 4,
    steps: [
      { id: 1, label: 'Gửi đề xuất ban đầu', status: 'completed' },
      { id: 2, label: 'Trao đổi tài liệu', status: 'completed' },
      { id: 3, label: 'Thảo luận điều khoản', status: 'completed' },
      { id: 4, label: 'Chốt deal', status: 'current' }
    ],
    priority: 'High',
    deadline: '2026-02-28',
    partnerName: 'Bệnh viện An Việt',
    partnerLogo: 'https://picsum.photos/100/100?u=med1',
    category: 'Active',
    assignee: 'Tôi',
    assigneeAvatar: 'https://picsum.photos/50/50?u=hai'
  },
  { 
    id: 'my_room_5', 
    name: 'Cung cấp 10.000 bộ đồ bảo hộ y tế chuẩn ISO', 
    promotionRef: 'Cung cấp 10.000 bộ đồ bảo hộ y tế chuẩn ISO', 
    shortDescription: 'Công ty dược phẩm quan tâm đại lý.',
    valueRange: 'Thỏa thuận',
    status: 'ongoing', 
    participants: 2, 
    lastMessage: 'Gửi bảng giá đại lý',
    lastMessageDate: new Date(Date.now() - 7200000),
    currentStep: 2,
    steps: [
      { id: 1, label: 'Gửi đề xuất ban đầu', status: 'completed' },
      { id: 2, label: 'Trao đổi tài liệu', status: 'current' },
      { id: 3, label: 'Thảo luận điều khoản', status: 'pending' },
      { id: 4, label: 'Chốt deal', status: 'pending' }
    ],
    priority: 'Normal',
    deadline: '2026-02-28',
    partnerName: 'Pharmacity Group',
    partnerLogo: 'https://picsum.photos/100/100?u=med2',
    category: 'Active',
    assignee: 'Tôi',
    assigneeAvatar: 'https://picsum.photos/50/50?u=hai'
  }
];

const FinalizeDealModal = ({ promo, lastProposal, onClose, onConfirm }: { promo: any, lastProposal: any, onClose: () => void, onConfirm: (data: any) => void }) => {
    const [formData, setFormData] = useState({ 
        finalPrice: lastProposal?.offerValue || promo.details?.estimatedValue || promo.valueRange || 'Thỏa thuận', 
        deliveryTime: lastProposal?.expectedEndDate || 'Theo thỏa thuận',
        notes: 'Các bên thống nhất thực hiện thương vụ theo các điều khoản đã đàm phán.' 
    });

    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
        <div className="bg-white rounded-[24px] max-w-[550px] w-full flex flex-col overflow-hidden shadow-2xl border border-emerald-100 animate-scale-up">
          <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-2">
                <ShieldCheck className="text-white" size={20} />
                <h2 className="m-0 text-[15px] font-black text-white uppercase tracking-tight">Xác nhận chốt thương vụ</h2>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X size={22} strokeWidth={2.5} /></button>
          </div>
          
          <div className="p-6 space-y-5 bg-slate-50/30 overflow-y-auto max-h-[75vh] custom-scrollbar">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-start space-x-3">
                <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-sm border border-emerald-100">
                    <ClipboardCheck size={20}/>
                </div>
                <div>
                    <h4 className="text-[13px] font-bold text-emerald-800">Tổng hợp nội dung thỏa thuận</h4>
                    <p className="text-[11px] text-emerald-600 font-medium">Xác nhận các điều khoản cuối cùng để đóng giao dịch.</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-7 space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá trị chốt cuối cùng (VNĐ)</label>
                <div className="relative">
                    <input 
                        value={formData.finalPrice} 
                        onChange={(e) => setFormData({...formData, finalPrice: e.target.value})} 
                        className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-3 text-[18px] font-black text-emerald-700 outline-none shadow-sm" 
                    />
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-300" size={18} />
                </div>
              </div>
              
              <div className="col-span-12 sm:col-span-5 space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày hoàn tất</label>
                <div className="relative">
                    <input 
                        type="text"
                        value={formData.deliveryTime} 
                        onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})} 
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-bold text-gray-700 outline-none shadow-sm" 
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                </div>
              </div>

              <div className="col-span-12 space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center">
                    <ListChecks size={12} className="mr-1.5 text-emerald-500" /> Cấu trúc thanh toán & Tiến độ (Đã đề xuất)
                 </label>
                 <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
                    {lastProposal?.stages && lastProposal.stages.length > 0 ? (
                        lastProposal.stages.map((stage: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-black">
                                        {idx + 1}
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-700">{stage.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[14px] font-black text-emerald-600">{stage.percent}%</span>
                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                        <div className="h-full bg-emerald-500" style={{ width: `${stage.percent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-2 flex flex-col items-center">
                            <Info size={16} className="text-gray-300 mb-1" />
                            <p className="text-[11px] text-gray-400 font-medium italic">Vui lòng kiểm tra lại tiến độ triển khai.</p>
                        </div>
                    )}
                 </div>
              </div>

              <div className="col-span-12 space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ghi chú & Điều khoản bổ sung</label>
                <textarea 
                    value={formData.notes} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-medium text-gray-600 outline-none h-24 resize-none shadow-sm leading-relaxed" 
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-5 bg-white border-t border-gray-100 flex items-center space-x-3">
              <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Clock size={14} />
                  <span>Để sau</span>
              </button>
              <button onClick={() => onConfirm(formData)} className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-black text-[12px] uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
                  <CircleCheckBig size={16} />
                  <span>Chốt ngay</span>
              </button>
          </div>
        </div>
      </div>
    );
};

const CancelNegotiationModal = ({ onClose, onConfirm }: { onClose: () => void, onConfirm: (reason: string) => void }) => {
    const [reason, setReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const reasons = [
        'Đối tác không phản hồi',
        'Không thống nhất được giá & điều khoản',
        'Tìm thấy đối tác phù hợp hơn',
        'Dự án bị tạm dừng/hủy bỏ',
        'Khác'
    ];

    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
        <div className="bg-white rounded-[24px] max-w-[450px] w-[95%] overflow-hidden shadow-2xl border border-rose-100 animate-scale-up">
          <div className="bg-gradient-to-br from-rose-500 to-red-600 p-[20px] flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
                <XCircle size={20} />
                <h2 className="m-0 text-[16px] font-black uppercase tracking-tight">Dừng thương thảo</h2>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-[24px] font-bold leading-none cursor-pointer">×</button>
          </div>
          <div className="p-6">
            <p className="text-[13px] text-gray-600 mb-5 font-bold leading-relaxed px-1">Lý do dừng cuộc thương thảo này là gì?</p>
            <div className="space-y-2 mb-6">
              {reasons.map(r => (
                <button 
                  key={r} 
                  onClick={() => setReason(r)} 
                  className={`w-full text-left p-3.5 rounded-xl border text-[13px] font-bold transition-all flex items-center justify-between ${reason === r ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm ring-1 ring-rose-500/20' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'}`}
                >
                  <span className="whitespace-nowrap">{r}</span>
                  {reason === r && <CheckCircle size={16} />}
                </button>
              ))}
              {reason === 'Khác' && (
                  <textarea 
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Vui lòng nhập lý do khác..."
                    className="w-full mt-2 p-3 bg-white border border-rose-200 rounded-xl text-[12px] font-medium text-gray-700 outline-none h-20 resize-none animate-slide-down"
                  />
              )}
            </div>
            <div className="flex gap-[12px] justify-end pt-2">
              <button onClick={onClose} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-[13px] hover:bg-gray-200 transition-colors">Giữ lại</button>
              <button 
                disabled={!reason || (reason === 'Khác' && !otherReason.trim())} 
                onClick={() => onConfirm(reason === 'Khác' ? otherReason : reason)} 
                className="px-8 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-[13px] shadow-md shadow-rose-200 active:scale-95 transition-all disabled:opacity-30"
              >
                Xác nhận dừng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

const ProposalModal = ({ onClose, onSend }: { onClose: () => void, onSend: (data: any) => void }) => {
    const [formData, setFormData] = useState({
        offerValue: '',
        paymentMethod: 'cash',
        paymentTerms: 'immediate',
        specialTerms: '',
        startDate: '',
        expectedEndDate: '',
        stages: [{ id: Date.now(), name: 'Giai đoạn 1', percent: '' }],
        notes: ''
    });

    const addStage = () => {
        setFormData({
            ...formData,
            stages: [...formData.stages, { id: Date.now(), name: `Giai đoạn ${formData.stages.length + 1}`, percent: '' }]
        });
    };

    const removeStage = (id: number) => {
        if (formData.stages.length > 1) {
            setFormData({
                ...formData,
                stages: formData.stages.filter(s => s.id !== id)
            });
        }
    };

    const updateStage = (id: number, field: 'name' | 'percent', value: string) => {
        setFormData({
            ...formData,
            stages: formData.stages.map(s => s.id === id ? { ...s, [field]: value } : s)
        });
    };

    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
        <div className="bg-white rounded-xl max-w-[800px] w-[95%] overflow-hidden shadow-2xl animate-scale-up">
          <div className="bg-[#385289] p-[20px] flex justify-between items-center text-white">
            <h2 className="m-0 text-[18px] font-semibold flex items-center"><Handshake className="mr-2" size={20} />Gửi đề xuất hợp tác</h2>
            <button onClick={onClose} className="text-[24px] font-bold leading-none cursor-pointer">×</button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="m-0 mb-4 text-[16px] text-[#333] font-bold border-b border-gray-100 pb-2">Chi tiết đề xuất</h4>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-semibold text-[#333] text-[14px]">Giá trị đề xuất (VNĐ)</label>
                        <input type="number" value={formData.offerValue} onChange={(e) => setFormData({...formData, offerValue: e.target.value})} placeholder="Nhập giá trị..." className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none focus:border-[#385289]" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-semibold text-[#333] text-[14px]">Phương thức thanh toán</label>
                        <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none bg-white">
                            <option value="cash">Tiền mặt</option><option value="bank_transfer">Chuyển khoản ngân hàng</option><option value="installment">Trả góp</option><option value="credit">Tín dụng thương mại</option><option value="l/c">Thư tín dụng (L/C)</option><option value="other">Khác</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-semibold text-[#333] text-[14px]">Thời gian thanh toán</label>
                        <select value={formData.paymentTerms} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})} className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none bg-white">
                            <option value="immediate">Thanh toán ngay</option><option value="7_days">7 ngày</option><option value="15_days">15 ngày</option><option value="30_days">30 ngày</option><option value="60_days">60 ngày</option><option value="custom">Tùy chỉnh</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-semibold text-[#333] text-[14px]">Điều kiện đặc biệt</label>
                        <textarea value={formData.specialTerms} onChange={(e) => setFormData({...formData, specialTerms: e.target.value})} placeholder="Các điều kiện đặc biệt..." className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none min-h-[100px] resize-vertical" />
                    </div>
                </div>
                <div>
                    <h4 className="m-0 mb-4 text-[16px] text-[#333] font-bold border-b border-gray-100 pb-2">Thời gian triển khai</h4>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-semibold text-[#333] text-[14px]">Thời gian bắt đầu</label>
                        <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-semibold text-[#333] text-[14px]">Thời gian hoàn thành dự kiến</label>
                        <input type="date" value={formData.expectedEndDate} onChange={(e) => setFormData({...formData, expectedEndDate: e.target.value})} className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-semibold text-[#333] text-[14px]">Các giai đoạn triển khai</label>
                        <div className="space-y-2 mb-3">
                            {formData.stages.map((stage, idx) => (
                                <div key={stage.id} className="flex gap-2 items-center">
                                    <input placeholder={`Giai đoạn ${idx + 1}`} type="text" value={stage.name} onChange={(e) => updateStage(stage.id, 'name', e.target.value)} className="flex-1 p-2 border border-[#ddd] rounded-md text-[13px] outline-none" />
                                    <input placeholder="%" type="number" value={stage.percent} onChange={(e) => updateStage(stage.id, 'percent', e.target.value)} className="w-[60px] p-2 border border-[#ddd] rounded-md text-[13px] outline-none" />
                                    <button onClick={() => removeStage(stage.id)} className={`p-2 text-rose-500 hover:bg-rose-50 rounded-md ${formData.stages.length <= 1 ? 'invisible' : ''}`}><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={addStage} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8f9fa] text-[#333] border border-[#ddd] rounded-md cursor-pointer text-xs font-bold"><Plus size={14} /> Thêm giai đoạn</button>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-semibold text-[#333] text-[14px]">Ghi chú</label>
                        <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Ghi chú thêm về đề xuất..." className="w-full p-2.5 border border-[#ddd] rounded-md text-sm outline-none min-h-[100px] resize-none" />
                    </div>
                </div>
            </div>
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-100 mt-4">
                <button onClick={onClose} className="px-6 py-2.5 bg-[#f8f9fa] text-[#333] border border-[#ddd] rounded-md cursor-pointer text-sm font-medium">Hủy</button>
                <button onClick={() => onSend(formData)} className="px-8 py-2.5 bg-[#003087] text-white border-none rounded-md cursor-pointer text-sm font-bold flex items-center gap-2 shadow-md active:scale-95"><Send size={16} /> Gửi đề xuất</button>
            </div>
          </div>
        </div>
      </div>
    );
};

const NegotiationModal = ({ promo, onClose, onFirstMessageSend, onGoToCancelled, onGoToClosed }: { promo: any, onClose: () => void, onFirstMessageSend: (promo: any) => void, onGoToCancelled?: () => void, onGoToClosed?: () => void }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [lastProposal, setLastProposal] = useState<any>(null);

  const handleSendMessage = (text?: string) => { 
    const msgText = text || inputText;
    if (!msgText.trim()) return; 
    if (messages.length === 0) onFirstMessageSend(promo); 
    setMessages([...messages, { type: 'user', text: msgText }]); 
    setInputText(''); 
  };
  
  const handleConfirmCancel = (reason: string) => {
    if (onGoToCancelled) onGoToCancelled();
    onClose();
  };

  const handleConfirmFinalize = (data: any) => {
    if (onGoToClosed) onGoToClosed();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-xl max-w-[1000px] w-[95%] h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-scale-up">
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-3"><img src={promo.partnerLogo || promo.companyLogo || "https://picsum.photos/100/100"} className="w-10 h-10 rounded-lg border-2 border-white object-cover" alt="Partner" /><div><h2 className="text-[17px] font-bold leading-tight">{promo.partnerName || promo.companyName}</h2><div className="flex items-center text-[11px] opacity-80"><span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>Đang online</div></div></div>
          <button onClick={onClose} className="text-white cursor-pointer"><X size={28} strokeWidth={2.5} /></button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col bg-[#f8f9fa] border-r border-gray-200">
            <div className="p-3 bg-white border-b border-gray-200 flex items-center"><div className="flex items-center space-x-2 flex-shrink-0"><Handshake size={18} className="text-[#003087]" /><span className="font-bold text-gray-700 text-sm">Lịch sử thương thảo</span></div></div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-gray-400 opacity-60">
                  <MessageCircle size={48} className="mx-auto mb-3" />
                  <p className="font-bold text-sm tracking-wide">Bắt đầu trò chuyện để xúc tiến thương thảo</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`self-end max-w-[80%] animate-slide-up whitespace-pre-line`}>
                    {m.type === 'file' ? (
                        <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center space-x-3 shadow-sm">
                            <div className="p-2 bg-red-50 text-red-500 rounded-lg"><FileText size={20}/></div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-700">{m.text}</span>
                                <span className="text-[9px] text-gray-400 uppercase font-black tracking-tighter mt-0.5">{m.size || 'Tài liệu'}</span>
                            </div>
                            <button className="p-1.5 bg-gray-50 text-gray-400 rounded-full ml-1"><Download size={12} /></button>
                        </div>
                    ) : (
                        <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm text-[13px] font-medium">
                            {m.text}
                        </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex gap-2 w-full">
                    <button onClick={() => setShowDocumentModal(true)} className="flex-1 flex items-center justify-center gap-1.5 px-[8px] py-[10px] bg-[#f8f9fa] border border-[#dddddd] rounded-[8px] text-[11px] font-bold text-[#333333] shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap overflow-hidden">
                        <Paperclip size={14} className="shrink-0" />
                        <span className="whitespace-nowrap">Tài liệu</span>
                    </button>
                    <button onClick={() => setShowSampleModal(true)} className="flex-1 flex items-center justify-center gap-1.5 px-[8px] py-[10px] bg-[#f8f9fa] border border-[#dddddd] rounded-[8px] text-[11px] font-bold text-[#333333] shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap overflow-hidden">
                        <Package size={14} className="shrink-0" />
                        <span className="whitespace-nowrap">Yêu cầu mẫu</span>
                    </button>
                    <button onClick={() => setShowProposalModal(true)} className="flex-1 flex items-center justify-center gap-1.5 px-[8px] py-[10px] bg-[#f8f9fa] border border-[#dddddd] rounded-[8px] text-[11px] font-bold text-[#333333] shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap overflow-hidden">
                        <Handshake size={14} className="shrink-0" />
                        <span className="whitespace-nowrap">Đề xuất</span>
                    </button>
                </div>
                <div className="flex gap-2 w-full">
                    <button onClick={() => setShowFinalizeModal(true)} className="flex-[2] flex items-center justify-center gap-2 px-[12px] py-[12px] bg-green-600 text-white rounded-[8px] text-[12px] font-black uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap">
                        <CircleCheckBig size={16} />
                        <span className="whitespace-nowrap">Chốt ngay</span>
                    </button>
                    <button onClick={() => setShowCancelModal(true)} className="flex-1 flex items-center justify-center gap-2 px-[12px] py-[12px] bg-rose-600 text-white rounded-[8px] text-[12px] font-black uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap">
                        <XCircle size={16} />
                        <span className="whitespace-nowrap">Hủy</span>
                    </button>
                </div>
              </div>
              <div className="flex items-end space-x-2"><div className="flex-1"><textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Nhập tin nhắn..." className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-4 py-2.5 text-sm outline-none focus:bg-white transition-all resize-none max-h-32" rows={1} /></div><button onClick={() => handleSendMessage()} className="bg-[#003087] text-white p-2.5 rounded-full shadow-lg active:scale-95 shrink-0"><Send size={20} /></button></div>
            </div>
          </div>
        </div>
        {showDocumentModal && <DocumentUploadModal onClose={() => setShowDocumentModal(false)} onSend={(d) => { if (messages.length === 0) onFirstMessageSend(promo); setMessages([...messages, { type: 'file', text: d.name, size: d.file ? (d.file.size / 1024 / 1024).toFixed(1) + ' MB' : 'N/A' }]); setShowDocumentModal(false); }} />}
        {showSampleModal && <SampleRequestModal onClose={() => setShowSampleModal(false)} onSend={(d) => { if (messages.length === 0) onFirstMessageSend(promo); setMessages([...messages, { type: 'user', text: `📦 Yêu cầu mẫu: ${d.product}\nSố lượng: ${d.quantity}\nMục đích: ${d.purpose}\nĐịa chỉ: ${d.address}` }]); setShowSampleModal(false); }} />}
        {showProposalModal && <ProposalModal onClose={() => setShowProposalModal(false)} onSend={(d) => { if (messages.length === 0) onFirstMessageSend(promo); setLastProposal(d); setMessages([...messages, { type: 'user', text: `🤝 Gửi đề xuất: ${d.offerValue} VNĐ\nPhương thức: ${d.paymentMethod}\nThanh toán: ${d.paymentTerms}\nBắt đầu: ${d.startDate}` }]); setShowProposalModal(false); }} />}
        {showFinalizeModal && <FinalizeDealModal promo={promo} lastProposal={lastProposal} onClose={() => setShowFinalizeModal(false)} onConfirm={handleConfirmFinalize} />}
        {showCancelModal && <CancelNegotiationModal onClose={() => setShowCancelModal(false)} onConfirm={handleConfirmCancel} />}
      </div>
    </div>
  );
};

interface PromotionCardProps {
  promo: any;
  onHide: (id: string) => void;
  onReport: (id: string) => void;
  onNegotiate: (promo: any) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
  onViewProfile: (id: string) => void;
  onViewManagement?: (promoId: string) => void;
  isManagementView?: boolean;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promo, onHide, onReport, onNegotiate, onComment, onShare, onViewProfile, onViewManagement, isManagementView }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [showReadMore, setShowReadMore] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, offsetHeight } = contentRef.current;
      setShowReadMore(scrollHeight > offsetHeight);
    }
  }, [promo.description]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4 animate-fade-in font-sans relative">
      <div className="flex justify-between items-start mb-4">
        <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onViewProfile(promo.companyId || 'c1')}
        >
          <img src={promo.companyLogo} className="w-12 h-12 rounded-xl border border-gray-100 object-cover shadow-sm" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">{promo.companyName}</h3>
            <div className="flex items-center text-[11px] text-gray-400 font-bold mt-0.5">
               <span className="w-3 h-0.5 bg-yellow-500 mr-1.5 rounded-full"></span>
               {promo.industry}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <div className="bg-blue-50 px-2 py-1 rounded text-[10px] font-bold text-blue-800 border border-blue-100 flex items-center">
              {getPromotionIcon(promo.promotionType)}
              {promo.promotionType}
            </div>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                <MoreVertical size={18} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-[1000] py-2 animate-scale-up">
                    <button onClick={() => { setIsSaved(!isSaved); setShowMenu(false); }} className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 font-bold text-sm text-gray-700">
                        <Bookmark size={16} className="text-gray-400" />
                        <span>{isSaved ? 'Bỏ lưu' : 'Lưu bài viết'}</span>
                    </button>
                    <button onClick={() => { onReport(promo.id); setShowMenu(false); }} className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-rose-50 font-bold text-sm text-rose-500">
                        <Flag size={16} />
                        <span>Báo cáo</span>
                    </button>
                    <button onClick={() => { onHide(promo.id); setShowMenu(false); }} className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 font-bold text-sm text-gray-700">
                        <EyeOff size={16} />
                        <span>Ẩn bài viết</span>
                    </button>
                </div>
              )}
            </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-gray-900 text-[17px] mb-2 leading-tight">{promo.title}</h4>
        <div className="relative mb-4">
          <p 
            ref={contentRef}
            className={`text-gray-500 text-[14px] leading-relaxed transition-all ${isExpanded ? '' : 'line-clamp-3'}`}
          >
            {promo.description}
          </p>
          {showReadMore && (
            <div className="flex justify-end mt-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-1 text-blue-600 text-[12px] font-bold hover:text-blue-800 bg-white pl-2"
              >
                <span>{isExpanded ? 'Thu gọn' : 'Xem tiếp'}</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50 mb-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="text-[12px]"><span className="text-gray-400 font-bold">Mục tiêu:</span> <span className="text-gray-800 font-black ml-1">{promo.details.target}</span></div>
            <div className="text-[12px]"><span className="text-gray-400 font-bold">Phạm vi:</span> <span className="text-gray-800 font-black ml-1">{promo.details.scope}</span></div>
            <div className="text-[12px]"><span className="text-gray-400 font-bold">Hạn đăng ký:</span> <span className="text-gray-800 font-black ml-1">{promo.details.deadline}</span></div>
            <div className="text-[12px]"><span className="text-gray-400 font-bold">Giá trị ước tính:</span> <span className="text-gray-800 font-black ml-1">{promo.details.estimatedValue}</span></div>
            <div className="text-[12px]"><span className="text-gray-400 font-bold">Bắt đầu:</span> <span className="text-gray-800 font-black ml-1">{promo.details.startDate}</span></div>
            <div className="text-[12px]"><span className="text-gray-400 font-bold">Kết thúc:</span> <span className="text-gray-800 font-black ml-1">{promo.details.endDate}</span></div>
            <div className="text-[12px]"><span className="text-gray-400 font-bold">Còn lại:</span> <span className="text-gray-800 font-black ml-1">{promo.details.remaining}</span></div>
            <div className="text-[12px]"><span className="text-gray-400 font-bold">Địa điểm:</span> <span className="text-gray-800 font-black ml-1">{promo.details.location}</span></div>
            <div className="col-span-2 text-[12px] pt-1">
              <span className="text-gray-400 font-bold">Yêu cầu:</span> 
              <span className="text-gray-800 font-black ml-1 leading-snug">{promo.details.requirement}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-4">
        <div className="flex items-center space-x-3.5">
           <div className="flex items-center space-x-1 select-none pointer-events-none">
              <Eye size={13} className="text-gray-400" />
              <span className="text-gray-700 font-black text-[12px]">{promo.stats.views}</span>
              <span className="text-[10px] text-gray-400 font-medium">xem</span>
           </div>
           <div className="flex items-center space-x-1 select-none pointer-events-none">
              <MessageCircle size={13} className="text-gray-400" />
              <span className="text-gray-700 font-black text-[12px]">{promo.stats.comments}</span>
              <span className="text-[10px] text-gray-400 font-medium">bình luận</span>
           </div>
           <div className="flex items-center space-x-1 select-none pointer-events-none">
              <Bookmark size={13} className="text-gray-400" />
              <span className="text-gray-700 font-black text-[12px]">{promo.stats.interests}</span>
              <span className="text-[10px] text-gray-400 font-medium">đã lưu</span>
           </div>
        </div>
        <div className="flex items-center text-gray-400 text-[11px] font-bold">
           <Clock size={12} className="mr-1" />
           {promo.timestamp}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {isManagementView ? (
           <button 
             onClick={() => onViewManagement && onViewManagement(promo.id)}
             className="flex-1 bg-[#385289] text-white py-2.5 rounded-lg font-black text-[13px] flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-transform"
           >
             <Handshake size={16} fill="currentColor" />
             <span>Thương thảo ({promo.stats.negotiations})</span>
           </button>
        ) : (
           <button onClick={() => onNegotiate(promo)} className="flex-1 bg-[#003087] text-white py-2.5 rounded-lg font-black text-[14px] flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-transform">
             <Handshake size={18} fill="currentColor" />
             <span>Thương thảo</span>
           </button>
        )}
        <button onClick={() => onComment(promo.id)} className="p-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors active:scale-95">
          <MessageCircle size={18}/>
        </button>
        <button onClick={() => onShare(promo.id)} className="p-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 active:scale-95 transition-transform">
            <Share2 size={18}/>
        </button>
        <button onClick={() => setIsSaved(!isSaved)} className={`p-2.5 border rounded-lg transition-all ${isSaved ? 'bg-amber-50 text-amber-500 border-amber-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
};

interface NegotiationHubProps {
  onOpenRoom: (roomId: string) => void;
  onViewProfile: (id: string) => void;
  activeTab: 'feed' | 'negotiation' | 'closed' | 'my' | 'cancelled' | 'saved';
  setActiveTab: (tab: 'feed' | 'negotiation' | 'closed' | 'my' | 'cancelled' | 'saved') => void;
  onCreatePromotion?: () => void;
}

export const NegotiationHub: React.FC<NegotiationHubProps> = ({ onOpenRoom, onViewProfile, activeTab, setActiveTab, onCreatePromotion }) => {
  const [rooms, setRooms] = useState<NegotiationRoom[]>(initialRooms);
  const [promotions, setPromotions] = useState(initialMockPromotions);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterHub, setShowFilterHub] = useState(false);
  const [showPromoFilter, setShowPromoFilter] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [reportModalPromoId, setReportModalPromoId] = useState<string | null>(null);
  const [negotiatePromo, setNegotiatePromo] = useState<any>(null);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<string | null>(null);
  const [ratingDeal, setRatingDeal] = useState<any | null>(null);
  const [viewingPromotion, setViewingPromotion] = useState<any | null>(null);
  
  // Quản lý xem chi tiết đàm phán của một bài viết cá nhân
  const [expandedMyPromoId, setExpandedMyPromoId] = useState<string | null>(null);

  // Quản lý menu ba chấm trong tab thương thảo
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [promoFilters, setPromoFilters] = useState({
      status: '',
      industry: '',
      timeRange: '',
      sort: 'newest'
  });

  const [hubFilters, setHubFilters] = useState({
      status: '',
      industry: '',
      timeRange: '',
      sort: 'newest'
  });

  const handleFirstMessageSend = (promo: any) => { const existingRoom = rooms.find(r => r.id === `room_${promo.id}`); if (!existingRoom) { const newRoom: NegotiationRoom = { id: `room_${promo.id}`, name: promo.title, promotionRef: promo.title, shortDescription: promo.description, valueRange: promo.details.estimatedValue, status: 'ongoing', participants: 2, lastMessage: 'Vừa bắt đầu thương thảo', lastMessageDate: new Date(), currentStep: 1, steps: [ { id: 1, label: 'Gửi đề xuất ban đầu', status: 'completed' }, { id: 2, label: 'Trao đổi tài liệu', status: 'pending' }, { id: 3, label: 'Thảo luận điều khoản', status: 'pending' }, { id: 4, label: 'Chốt deal', status: 'pending' } ], priority: 'Normal', deadline: promo.details.endDate, partnerName: promo.companyName, partnerLogo: promo.companyLogo, category: 'Active', assignee: 'Tôi', assigneeAvatar: 'https://picsum.photos/100/100?u=hai' }; setRooms(prev => [newRoom, ...prev]); showNotification(`Xúc tiến đã được chuyển sang tab Thương thảo.`); } };
  const handleHidePromotion = (id: string) => { setPromotions(prev => prev.filter(p => p.id !== id)); showNotification("Đã ẩn bài viết thành công."); };
  const handleReportPromotion = (id: string) => { setReportModalPromoId(id); };
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => { setNotification({ message, type }); setTimeout(() => setNotification(null), 3000); };
  const submitReport = () => { showNotification("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét sớm nhất."); setReportModalPromoId(null); };

  const handleToggleMenu = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === roomId ? null : roomId);
  };

  const handleActionMenu = (action: 'save' | 'report' | 'hide', roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (action === 'save') {
        showNotification("Đã lưu thương thảo vào danh sách đã lưu.");
    } else if (action === 'report') {
        handleReportPromotion(roomId);
    } else if (action === 'hide') {
        setRooms(prev => prev.filter(r => r.id !== roomId));
        showNotification("Đã ẩn thương thảo thành công.");
    }
  };

  return (
    <div className="pt-14 pb-24 min-h-screen bg-[#F9FAFB]">
      <div className="bg-white px-2 py-3 sticky top-14 z-30 border-b border-gray-100 shadow-sm overflow-hidden">
         <div className="flex p-1 bg-gray-100 rounded-xl space-x-0.5 w-full">
            <button onClick={() => setActiveTab('feed')} className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all flex flex-col items-center justify-center space-y-0.5 ${activeTab === 'feed' ? 'bg-white text-[#385289] shadow-sm' : 'text-gray-500'}`}><LayoutGrid size={13} /><span className="whitespace-nowrap">Bảng tin</span></button>
            <button onClick={() => setActiveTab('negotiation')} className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all flex flex-col items-center justify-center space-y-0.5 ${activeTab === 'negotiation' ? 'bg-white text-[#385289] shadow-sm' : 'text-gray-500'}`}><Handshake size={13} /><span className="whitespace-nowrap">Thương thảo</span></button>
            <button onClick={() => setActiveTab('my')} className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all flex flex-col items-center justify-center space-y-0.5 ${activeTab === 'my' ? 'bg-white text-[#385289] shadow-sm' : 'text-gray-500'}`}><Megaphone size={13} /><span className="whitespace-nowrap">Của tôi</span></button>
            <button onClick={() => setActiveTab('closed')} className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all flex flex-col items-center justify-center space-y-0.5 ${activeTab === 'closed' ? 'bg-white text-[#385289] shadow-sm' : 'text-gray-500'}`}><CircleCheckBig size={13} /><span className="whitespace-nowrap">Đã chốt</span></button>
            <button onClick={() => setActiveTab('cancelled')} className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all flex flex-col items-center justify-center space-y-0.5 ${activeTab === 'cancelled' ? 'bg-white text-[#385289] shadow-sm' : 'text-gray-500'}`}><XCircle size={13} /><span className="whitespace-nowrap">Đã huỷ</span></button>
            <button onClick={() => setActiveTab('saved')} className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all flex flex-col items-center justify-center space-y-0.5 ${activeTab === 'saved' ? 'bg-white text-[#385289] shadow-sm' : 'text-gray-500'}`}><Bookmark size={13} /><span className="whitespace-nowrap">Lưu</span></button>
         </div>
      </div>

      <div className="p-4">
        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#385289]" size={18} />
                <input type="text" placeholder="Tìm kiếm xúc tiến..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" />
              </div>
              <button onClick={() => setShowPromoFilter(true)} className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                  <Filter size={18} />
              </button>
              <button onClick={onCreatePromotion} className="bg-[#385289] text-white p-2.5 rounded-xl shadow-lg active:scale-95 transition-all">
                  <Plus size={20} />
              </button>
            </div>
            {promotions.filter(p => !p.isMine).length > 0 ? (promotions.filter(p => !p.isMine).map(promo => (<PromotionCard key={promo.id} promo={promo} onHide={handleHidePromotion} onReport={handleReportPromotion} onNegotiate={(p) => setNegotiatePromo(p)} onComment={(id) => setActiveCommentPost(id)} onShare={(id) => setActiveSharePost(id)} onViewProfile={onViewProfile} />))) : (<div className="text-center py-20 text-gray-400 font-bold">Không còn xúc tiến</div>)}
          </div>
        )}

        {activeTab === 'negotiation' && (
          <div className="animate-fade-in space-y-6">
             <div className="flex items-center space-x-2">
               <div className="relative group flex-1">
                 <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                 <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm deal..." className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none" />
               </div>
               <button onClick={() => setShowFilterHub(true)} className="p-2.5 rounded-xl border bg-white border-gray-200 text-gray-600">
                 <Filter size={20} />
               </button>
               <button onClick={onCreatePromotion} className="bg-[#385289] text-white p-2.5 rounded-xl shadow-lg active:scale-95 transition-all">
                 <Plus size={20} />
               </button>
             </div>
             <div className="space-y-4">
                {rooms.filter(r => r.category === 'Active' && r.assignee !== 'Tôi').map(room => {
                    const progress = (room.currentStep / room.steps.length) * 100;
                    return (
                        <div 
                            key={room.id} 
                            className={`bg-white rounded-2xl border p-5 shadow-sm transition-all relative overflow-hidden border-gray-100 cursor-pointer active:scale-[0.99]`}
                        >
                            <div 
                                className="flex justify-between items-start mb-3"
                                onClick={() => setNegotiatePromo(room)}
                            >
                                <div 
                                    className="flex flex-1 items-center space-x-3 cursor-pointer hover:opacity-70 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewProfile(room.id === 'r1' ? 'c1' : 'c1');
                                    }}
                                >
                                    <img src={room.partnerLogo} className="w-11 h-11 rounded-lg border border-gray-100 object-cover shadow-sm" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 flex items-center text-[15px]">{room.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1 font-medium flex items-center">
                                            <Briefcase size={12} className="mr-1.5 text-gray-400" /> {room.partnerName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2 ml-2">
                                    <div className="flex items-center space-x-1">
                                        <div className="bg-blue-50 px-2 py-1 rounded text-[10px] font-bold text-blue-800 border border-blue-100 flex items-center">
                                            <ShoppingCart size={12} className="mr-1 text-green-600" />
                                            Cần mua
                                        </div>
                                        <div className="relative" ref={activeMenuId === room.id ? menuRef : null}>
                                            <button 
                                                onClick={(e) => handleToggleMenu(room.id, e)}
                                                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                                            >
                                                <EllipsisVertical size={18} />
                                            </button>
                                            {activeMenuId === room.id && (
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-[1000] py-2 animate-scale-up">
                                                    <button 
                                                        onClick={(e) => handleActionMenu('save', room.id, e)}
                                                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 font-bold text-sm text-gray-700"
                                                    >
                                                        <Bookmark size={16} className="text-gray-400" />
                                                        <span>Lưu bài viết</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleActionMenu('report', room.id, e)}
                                                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-rose-50 font-bold text-sm text-rose-500"
                                                    >
                                                        <Flag size={16} />
                                                        <span>Báo cáo</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleActionMenu('hide', room.id, e)}
                                                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 font-bold text-sm text-gray-700"
                                                    >
                                                        <EyeOff size={16} />
                                                        <span>Ẩn bài viết</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {room.valueRange && (
                                        <div className="bg-blue-50 px-2 py-1 rounded text-[11px] font-black text-blue-700 border border-blue-100 flex items-center shrink-0">
                                            <DollarSign size={10} className="mr-0.5" />
                                            {room.valueRange}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div 
                                className="flex items-center space-x-4 mb-4 pb-3 border-b border-gray-50"
                                onClick={() => setNegotiatePromo(room)}
                            >
                                <div className="flex items-center text-[10px] text-gray-400 font-bold tracking-tighter">
                                    <Clock size={12} className="mr-1 text-gray-400" />
                                    Hạn: {room.deadline || 'Chưa xác định'}
                                </div>
                                <div className="flex items-center text-[10px] text-gray-400 font-bold tracking-tighter">
                                    <Users size={12} className="mr-1 text-gray-400" />
                                    {room.participants} đối tác tham gia
                                </div>
                            </div>

                            <div 
                                style={{ marginBottom: '16px' }}
                                onClick={() => setNegotiatePromo(room)}
                            >
                                <div className="flex items-center" style={{ fontSize: '12px', color: 'rgb(102, 102, 102)', marginBottom: '8px', fontWeight: 'bold' }}>
                                    <TrendingUp size={14} className="mr-1.5 text-blue-600" /> 📈 Tiến độ thương thảo
                                </div>
                                <div style={{ background: 'rgb(233, 236, 239)', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                                    <div style={{ 
                                        background: 'linear-gradient(90deg, rgb(0, 48, 135) 0%, rgb(102, 126, 234) 100%)', 
                                        height: '100%', 
                                        width: `${progress}%`, 
                                        transition: 'width 0.5s ease-out' 
                                    }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ fontSize: '11px', color: 'rgb(102, 102, 102)', fontWeight: 500 }}>
                                        {Math.round(progress)}% - {room.steps[room.currentStep-1]?.label || 'Bắt đầu'}
                                    </div>
                                    <div className="flex items-center" style={{ fontSize: '10px', color: 'rgb(40, 167, 69)', fontWeight: 500 }}>
                                        <RotateCcw size={10} className="mr-1 animate-spin-slow" /> 🔄 Hoạt động
                                    </div>
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgb(102, 102, 102)', marginBottom: '4px', fontWeight: 'bold' }}>Các mốc quan trọng:</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {room.steps.map((step) => (
                                        <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ 
                                                width: '12px', 
                                                height: '12px', 
                                                background: step.status === 'completed' ? 'rgb(56, 82, 137)' : step.status === 'current' ? 'rgb(102, 126, 234)' : 'rgb(233, 236, 239)', 
                                                borderRadius: '50%', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                color: 'rgb(255, 255, 255)', 
                                                fontSize: '8px',
                                                boxShadow: step.status === 'current' ? 'rgba(102, 126, 234, 0.5) 0px 0px 5px' : 'none'
                                            }}>
                                                {step.status === 'completed' ? '✓' : '○'}
                                            </div>
                                            <span style={{ 
                                                color: step.status === 'pending' ? 'rgb(156, 163, 175)' : 'rgb(51, 65, 85)', 
                                                textDecoration: 'none', 
                                                fontSize: '11px',
                                                fontWeight: step.status === 'current' ? 'bold' : 'normal'
                                            }}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div 
                                className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 select-none pointer-events-none"
                            >
                                <div className="flex items-center space-x-3.5">
                                    <div className="flex items-center space-x-1">
                                        <Eye size={13} className="text-gray-400" />
                                        <span className="text-gray-700 font-black text-[12px]">24</span>
                                        <span className="text-[10px] text-gray-400 font-medium">xem</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <MessageCircle size={13} className="text-gray-400" />
                                        <span className="text-gray-700 font-black text-[12px]">5</span>
                                        <span className="text-[10px] text-gray-400 font-medium">bình luận</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Bookmark size={13} className="text-gray-400" />
                                        <span className="text-gray-700 font-black text-[12px]">8</span>
                                        <span className="text-[10px] text-gray-400 font-medium">đã lưu</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-400 text-[11px] font-bold">
                                    <Clock size={12} className="mr-1" />
                                    {room.lastMessageDate ? 'Mới cập nhật' : '4 ngày trước'}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-4">
                                <button 
                                    onClick={() => setNegotiatePromo(room)} 
                                    className="flex-1 bg-[#003087] text-white py-2.5 rounded-lg font-black text-[14px] flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-transform"
                                >
                                    <Handshake size={18} fill="currentColor" />
                                    <span>Thương thảo</span>
                                </button>
                                <button 
                                    onClick={() => setActiveCommentPost(room.id)} 
                                    className="p-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
                                >
                                    <MessageCircle size={18}/>
                                </button>
                                <button 
                                    onClick={() => setActiveSharePost(room.id)} 
                                    className="p-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 active:scale-95 transition-transform"
                                >
                                    <Share2 size={18}/>
                                </button>
                                <button 
                                    className="p-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 active:scale-95"
                                >
                                    <Bookmark size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
             </div>
          </div>
        )}

        {/* TAB CỦA TÔI - HIỂN THỊ XÚC TIẾN CÁ NHÂN VÀ QUẢN LÝ ĐỐI TÁC */}
        {activeTab === 'my' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#385289]" size={18} />
                <input type="text" placeholder="Tìm kiếm xúc tiến..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" />
              </div>
              <button onClick={() => setShowPromoFilter(true)} className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                  <Filter size={18} />
              </button>
              <button onClick={onCreatePromotion} className="bg-[#385289] text-white p-2.5 rounded-xl shadow-lg active:scale-95 transition-all">
                  <Plus size={20} />
              </button>
            </div>

            {promotions.filter(p => p.isMine).map(promo => {
               // Lấy danh sách các thương thảo liên quan đến xúc tiến này một cách động dựa trên promotionRef
               const relatedNegotiations = rooms.filter(r => r.promotionRef === promo.title)
                                                 .sort((a, b) => b.currentStep - a.currentStep); // Ưu tiên sắp xếp theo tiến độ giảm dần

               return (
                  <div key={promo.id} className="relative">
                    <PromotionCard 
                      promo={{...promo, stats: {...promo.stats, negotiations: relatedNegotiations.length}}} 
                      onHide={handleHidePromotion} 
                      onReport={handleReportPromotion} 
                      onNegotiate={() => {}} 
                      onComment={(id) => setActiveCommentPost(id)} 
                      onShare={(id) => setActiveSharePost(id)}
                      onViewProfile={onViewProfile}
                      isManagementView={true}
                      onViewManagement={(id) => setExpandedMyPromoId(expandedMyPromoId === id ? null : id)}
                    />

                    {/* DANH SÁCH ĐỐI TÁC ĐANG THƯƠNG THẢO TRÊN BÀI NÀY - SẮP XẾP THEO TIẾN ĐỘ */}
                    {expandedMyPromoId === promo.id && (
                       <div className="mt-[-16px] mb-6 mx-2 p-5 bg-white border-x border-b border-gray-100 rounded-b-[24px] shadow-xl shadow-slate-200/50 animate-slide-down z-10 relative border-t-2 border-t-blue-50">
                          <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black text-[#385289] uppercase tracking-widest flex items-center">
                                    <LayoutList size={14} className="mr-1.5" /> Đối tác thương thảo
                                </span>
                                <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Ưu tiên theo tiến độ xử lý</span>
                              </div>
                              <div className="bg-blue-50 px-2 py-1 rounded text-[10px] font-black text-blue-700">
                                {relatedNegotiations.length} Đang đàm phán
                              </div>
                          </div>
                          
                          <div className="space-y-4">
                             {relatedNegotiations.length > 0 ? relatedNegotiations.map((room, idx) => {
                                const progressPercent = (room.currentStep / 4) * 100;
                                return (
                                  <div key={room.id} onClick={() => setNegotiatePromo(room)} className="group bg-slate-50/50 p-3.5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all cursor-pointer active:scale-[0.98] shadow-sm hover:shadow-md">
                                     <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                           <div className="relative">
                                              <img src={room.partnerLogo} className="w-11 h-11 rounded-xl border border-white object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${idx === 0 ? 'bg-amber-400' : 'bg-green-400 shadow-sm'}`}></div>
                                           </div>
                                           <div className="overflow-hidden">
                                              <h4 className="text-[14px] font-black text-gray-800 truncate leading-tight">{room.partnerName}</h4>
                                              <div className="mt-1 space-y-0.5">
                                                 <div className="flex items-center text-[10px] text-gray-400 font-bold tracking-tight">
                                                    <Timer size={10} className="mr-1" /> Cập nhật: 15 phút trước
                                                 </div>
                                                 <div className="text-[10px] text-blue-600 font-bold">
                                                    {room.steps[room.currentStep-1]?.label}
                                                 </div>
                                              </div>
                                           </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                           <div className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider mb-1 ${
                                              room.currentStep >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                           }`}>
                                              Bước {room.currentStep}/4
                                           </div>
                                        </div>
                                     </div>

                                     <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase">
                                           <span>Tiến độ thực tế</span>
                                           <span>{progressPercent}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200/50 h-1.5 rounded-full overflow-hidden">
                                           <div 
                                              className={`h-full transition-all duration-700 ${
                                                room.currentStep >= 3 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                                              }`} 
                                              style={{ width: `${progressPercent}%` }}
                                           ></div>
                                        </div>
                                     </div>

                                     <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center -space-x-2">
                                           {[1,2].map(i => <div key={i} className="w-5 h-5 rounded-full border border-white bg-gray-100 text-[8px] flex items-center justify-center font-bold text-gray-400"><UserCheck size={10} /></div>)}
                                        </div>
                                        <button className="flex items-center space-x-1.5 bg-[#385289] text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 group-hover:bg-blue-700">
                                           <MessageSquare size={12} />
                                           <span>Trao đổi</span>
                                        </button>
                                     </div>
                                  </div>
                                );
                             }) : (
                                <div className="text-center py-6 text-gray-400 italic text-[11px] font-medium">
                                    Chưa có ai tham gia thương thảo cho bài đăng này.
                                </div>
                             )}
                          </div>

                          {relatedNegotiations.length > 0 && (
                            <div className="mt-5 pt-2 flex justify-center">
                                <button className="text-[10px] font-black text-[#385289] hover:text-blue-800 uppercase tracking-widest flex items-center space-x-2 border-b-2 border-transparent hover:border-blue-200 pb-1 transition-all">
                                    <span>Xem tất cả hồ sơ quan tâm khác</span>
                                    <ChevronRight size={14} strokeWidth={3} />
                                </button>
                            </div>
                          )}
                       </div>
                    )}
                  </div>
               );
            })}
            {promotions.filter(p => p.isMine).length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                    <Megaphone size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-bold">Bạn chưa đăng xúc tiến nào</p>
                    <button onClick={onCreatePromotion} className="mt-4 text-blue-600 font-bold text-sm">Đăng xúc tiến đầu tiên ngay</button>
                </div>
            )}
          </div>
        )}

        {activeTab === 'closed' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#385289]" size={18} />
                <input type="text" placeholder="Tìm kiếm xúc tiến..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" />
              </div>
              <button onClick={() => setShowPromoFilter(true)} className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                  <Filter size={18} />
              </button>
              <button onClick={onCreatePromotion} className="bg-[#385289] text-white p-2.5 rounded-xl shadow-lg active:scale-95 transition-all">
                  <Plus size={20} />
              </button>
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-4 px-1">Thương vụ đã chốt</h3>
            <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-white rounded-bl-xl shadow-sm">
                  <CircleCheckBig size={16} />
               </div>
               <div 
                    className="flex items-center space-x-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onViewProfile('c1')}
               >
                  <img src="https://picsum.photos/100/100?u=abc" className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-md" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-[15px]">CTY ABC</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Xúc tiến TMĐT 2024</p>
                  </div>
               </div>
               <div className="space-y-2 mb-4 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500 font-medium">Giá trị chốt:</span><span className="font-black text-emerald-600">$15,000</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500 font-medium">Ngày hoàn tất:</span><span className="font-bold text-gray-700">Hôm nay</span></div>
               </div>
               
               <div className="grid grid-cols-4 gap-2">
                 <button 
                  onClick={() => setViewingPromotion(initialMockPromotions[0])} 
                  className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-100 rounded-xl text-blue-600 shadow-sm hover:bg-blue-50 active:scale-95 transition-all"
                 >
                   <Eye size={18} />
                   <span className="text-[9px] font-black mt-1 uppercase">Xem</span>
                 </button>
                 <button 
                  onClick={() => setActiveCommentPost('r1')}
                  className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-100 rounded-xl text-gray-600 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                 >
                   <MessageCircle size={18} />
                   <span className="text-[9px] font-black mt-1 uppercase">Bình luận</span>
                 </button>
                 <button 
                  onClick={() => {
                      const room = rooms.find(r => r.id === 'r1');
                      if (room) setNegotiatePromo(room);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-100 rounded-xl text-indigo-600 shadow-sm hover:bg-indigo-50 active:scale-95 transition-all"
                 >
                   <History size={18} />
                   <span className="text-[9px] font-black mt-1 uppercase">Lịch sử</span>
                 </button>
                 <button 
                  onClick={() => setRatingDeal({id: 'r1', partnerName: 'CTY ABC', name: 'Xúc tiến TMĐT 2024', partnerLogo: 'https://picsum.photos/100/100?u=abc'})}
                  className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-100 rounded-xl text-amber-500 shadow-sm hover:bg-amber-50 active:scale-95 transition-all"
                 >
                   <Star size={18} />
                   <span className="text-[9px] font-black mt-1 uppercase">Đánh giá</span>
                 </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'cancelled' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#385289]" size={18} />
                <input type="text" placeholder="Tìm kiếm xúc tiến..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" />
              </div>
              <button onClick={() => setShowPromoFilter(true)} className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                  <Filter size={18} />
              </button>
              <button onClick={onCreatePromotion} className="bg-[#385289] text-white p-2.5 rounded-xl shadow-lg active:scale-95 transition-all">
                  <Plus size={20} />
              </button>
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-4 px-1">Thương thảo đã hủy</h3>
            <div className="text-center py-20 text-gray-400 font-bold bg-white rounded-2xl border border-dashed border-gray-200">
               <XCircle size={40} className="mx-auto mb-3 opacity-20" />
               <p>Chưa có thương thảo nào bị hủy</p>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#385289]" size={18} />
                <input type="text" placeholder="Tìm kiếm xúc tiến..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" />
              </div>
              <button onClick={() => setShowPromoFilter(true)} className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                  <Filter size={18} />
              </button>
              <button onClick={onCreatePromotion} className="bg-[#385289] text-white p-2.5 rounded-xl shadow-lg active:scale-95 transition-all">
                  <Plus size={20} />
              </button>
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-4 px-1">Xúc tiến đã lưu</h3>
            {promotions.slice(0, 1).map(promo => (<PromotionCard key={promo.id} promo={promo} onHide={handleHidePromotion} onReport={handleReportPromotion} onNegotiate={(p) => setNegotiatePromo(p)} onComment={(id) => setActiveCommentPost(id)} onShare={(id) => setActiveSharePost(id)} onViewProfile={onViewProfile} />))}
            {promotions.length === 0 && <div className="text-center py-20 text-gray-400 font-bold">Chưa có bài viết nào được lưu</div>}
          </div>
        )}
      </div>

      {/* RATING MODAL */}
      {ratingDeal && (
        <DealRatingModal 
          deal={ratingDeal} 
          onClose={() => setRatingDeal(null)} 
          onSubmit={(rating, comment) => {
            showNotification(`Cảm ơn bạn đã đánh giá ${rating} sao cho ${ratingDeal.partnerName}!`);
            setRatingDeal(null);
          }} 
        />
      )}

      {/* PROMOTION DETAIL MODAL */}
      {viewingPromotion && (
        <PromotionDetailModal 
          promo={viewingPromotion} 
          onClose={() => setViewingPromotion(null)} 
        />
      )}

      {/* FILTER MODAL FOR FEED */}
      {showPromoFilter && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end animate-fade-in">
          <div className="bg-white w-full rounded-t-[32px] p-5 animate-slide-up shadow-2xl relative overflow-hidden">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
            
            <div className="flex justify-between items-center mb-6 px-1">
              <h3 className="font-black text-lg text-gray-900 flex items-center">
                <Filter size={20} className="text-[#385289] mr-2" />
                Bộ lọc Bảng tin
              </h3>
              <button onClick={() => setShowPromoFilter(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6 mb-8 px-1">
              <div className="flex flex-wrap gap-3">
                <select 
                  style={{ padding: '10px 12px', border: '1px solid rgb(226, 232, 240)', borderRadius: '8px', fontSize: '14px', background: 'white', cursor: 'pointer', minWidth: '160px' }}
                  className="flex-1 outline-none shadow-sm focus:border-[#385289]"
                  value={promoFilters.status}
                  onChange={(e) => setPromoFilters({...promoFilters, status: e.target.value})}
                >
                  <option value="">📊 Trạng thái</option>
                  <option value="active">🟢 Đang thương thảo</option>
                  <option value="pending">🟡 Chờ phản hồi</option>
                  <option value="completed">✅ Hoàn thành</option>
                  <option value="cancelled">❌ Đã hủy</option>
                </select>

                <select 
                  style={{ padding: '10px 12px', border: '1px solid rgb(226, 232, 240)', borderRadius: '8px', fontSize: '14px', background: 'white', cursor: 'pointer', minWidth: '160px' }}
                  className="flex-1 outline-none shadow-sm focus:border-[#385289]"
                  value={promoFilters.industry}
                  onChange={(e) => setPromoFilters({...promoFilters, industry: e.target.value})}
                >
                  <option value="">🏢 Tất cả ngành</option>
                  <option value="agriculture">🌾 Nông nghiệp & Thực phẩm</option>
                  <option value="technology">💻 Công nghệ thông tin</option>
                  <option value="logistics">🚛 Logistics & Vận tải</option>
                  <option value="manufacturing">🏭 Sản xuất công nghiệp</option>
                  <option value="textile">👔 Dệt may & Thời trang</option>
                  <option value="pharmaceutical">💊 Dược phẩm & Y tế</option>
                  <option value="furniture">🪑 Đồ gỗ & Nội thất</option>
                  <option value="seafood">🐟 Thủy sản & Hải sản</option>
                  <option value="packaging">📦 Bao bì & Đóng gói</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'rgb(74, 85, 104)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Khoảng thời gian</label>
                  <select 
                    style={{ width: '100%', padding: '10px', border: '1px solid rgb(226, 232, 240)', borderRadius: '8px', fontSize: '13px', background: '#f8fafc', fontWeight: 600 }}
                    value={promoFilters.timeRange}
                    onChange={(e) => setHubFilters({...promoFilters, timeRange: e.target.value})}
                  >
                    <option value="">Tất cả thời gian</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'rgb(74, 85, 104)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sắp xếp theo</label>
                  <select 
                    style={{ width: '100%', padding: '10px', border: '1px solid rgb(226, 232, 240)', borderRadius: '8px', fontSize: '13px', background: '#f8fafc', fontWeight: 600 }}
                    value={promoFilters.sort}
                    onChange={(e) => setHubFilters({...promoFilters, sort: e.target.value})}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="most_viewed">Xem nhiều nhất</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pb-safe-area">
                <button 
                  onClick={() => setPromoFilters({ status: '', industry: '', timeRange: '', sort: 'newest' })}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                >
                  <RotateCcw size={16} />
                  <span>Đặt lại</span>
                </button>
                <button 
                  onClick={() => setShowPromoFilter(false)}
                  className="flex-[2] py-4 bg-[#385289] text-white font-black rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-100 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                >
                  <CircleCheckBig size={18} />
                  <span>Áp dụng bộ lọc</span>
                </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER MODAL FOR HUB (NEGOTIATION) */}
      {showFilterHub && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end animate-fade-in">
            <div className="bg-white w-full rounded-t-[32px] p-5 animate-slide-up shadow-2xl relative overflow-hidden">
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
                <div className="flex justify-between items-center mb-6 px-1">
                    <h3 className="font-black text-lg text-gray-900 flex items-center">
                        <Filter size={20} className="text-[#385289] mr-2" />
                        Bộ lọc Thương thảo
                    </h3>
                    <button onClick={() => setShowFilterHub(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                        <XCircle size={20} />
                    </button>
                </div>
                <div className="space-y-6 mb-8 px-1">
                    <div className="flex flex-wrap gap-3">
                        <select 
                            className="flex-1 outline-none shadow-sm focus:border-[#385289]"
                            style={{ padding: '10px 12px', border: '1px solid rgb(226, 232, 240)', borderRadius: '8px', fontSize: '14px', background: 'white', cursor: 'pointer', minWidth: '160px' }}
                            value={hubFilters.status}
                            onChange={(e) => setHubFilters({...hubFilters, status: e.target.value})}
                        >
                            <option value="">📊 Trạng thái</option>
                            <option value="active">🟢 Đang thương thảo</option>
                            <option value="pending">🟡 Chờ phản hồi</option>
                            <option value="completed">✅ Hoàn thành</option>
                            <option value="cancelled">❌ Đã hủy</option>
                        </select>
                        <select 
                            className="flex-1 outline-none shadow-sm focus:border-[#385289]"
                            style={{ padding: '10px 12px', border: '1px solid rgb(226, 232, 240)', borderRadius: '8px', fontSize: '14px', background: 'white', cursor: 'pointer', minWidth: '160px' }}
                            value={hubFilters.industry}
                            onChange={(e) => setHubFilters({...hubFilters, industry: e.target.value})}
                        >
                            <option value="">🏢 Tất cả ngành</option>
                            <option value="agriculture">🌾 Nông nghiệp & Thực phẩm</option>
                            <option value="technology">💻 Công nghệ thông tin</option>
                            <option value="logistics">🚛 Logistics & Vận tải</option>
                            <option value="manufacturing">🏭 Sản xuất công nghiệp</option>
                            <option value="textile">👔 Dệt may & Thời trang</option>
                            <option value="pharmaceutical">💊 Dược phẩm & Y tế</option>
                            <option value="furniture">🪑 Đồ gỗ & Nội thất</option>
                            <option value="seafood">🐟 Thủy sản & Hải sản</option>
                            <option value="packaging">📦 Bao bì & Đóng gói</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'rgb(74, 85, 104)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Khoảng thời gian</label>
                            <select 
                                style={{ width: '100%', padding: '10px', border: '1px solid rgb(226, 232, 240)', borderRadius: '8px', fontSize: '13px', background: 'white', fontWeight: 600 }}
                                value={hubFilters.timeRange}
                                onChange={(e) => setHubFilters({...hubFilters, timeRange: e.target.value})}
                            >
                                <option value="">Tất cả thời gian</option>
                                <option value="today">Hôm nay</option>
                                <option value="week">Tuần này</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'rgb(74, 85, 104)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sắp xếp theo</label>
                            <select 
                                style={{ width: '100%', padding: '10px', border: '1px solid rgb(226, 232, 240)', borderRadius: '8px', fontSize: '13px', background: 'white', fontWeight: 600 }}
                                value={hubFilters.sort}
                                onChange={(e) => setHubFilters({...hubFilters, sort: e.target.value})}
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="most_viewed">Xem nhiều nhất</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-3 pb-safe-area">
                    <button 
                        onClick={() => setHubFilters({ status: '', industry: '', timeRange: '', sort: 'newest' })}
                        className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                    >
                        <RotateCcw size={14} />
                        <span>Đặt lại</span>
                    </button>
                    <button 
                        onClick={() => setShowFilterHub(false)}
                        className="flex-[2] py-4 bg-[#385289] text-white font-black rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-100 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                    >
                        <CircleCheckBig size={18} />
                        <span>Áp dụng bộ lọc</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {notification && (<div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-full shadow-lg text-white font-bold text-xs animate-slide-up ${notification.type === 'success' ? 'bg-[#385289]' : 'bg-rose-600'}`}><span>{notification.message}</span></div>)}
      {negotiatePromo && (<NegotiationModal promo={negotiatePromo} onClose={() => setNegotiatePromo(null)} onFirstMessageSend={handleFirstMessageSend} onGoToCancelled={() => setActiveTab('cancelled')} onGoToClosed={() => setActiveTab('closed')} />)}
      {activeCommentPost && <CommentSheet postId={activeCommentPost} onClose={() => setActiveCommentPost(null)} />}
      {activeSharePost && <ShareSheet postId={activeSharePost} onClose={() => setActiveSharePost(null)} />}
      {reportModalPromoId && (<div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end animate-fade-in"><div className="bg-white w-full rounded-t-[32px] p-6 animate-slide-up shadow-2xl relative"><div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-gray-900 text-lg">Báo cáo bài viết</h3><button onClick={() => setReportModalPromoId(null)}><X size={20} /></button></div><div className="space-y-3 mb-8">{['Nội dung không phù hợp', 'Lừa đảo', 'Spam'].map(reason => (<button key={reason} onClick={submitReport} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-left font-bold text-sm text-gray-700">{reason}</button>))}</div><button onClick={() => setReportModalPromoId(null)} className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-xl">Hủy bỏ</button></div></div>)}
    </div>
  );
};
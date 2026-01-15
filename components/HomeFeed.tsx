import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, X, Send, Link, CheckCircle, Briefcase, CornerDownRight, PenLine, Megaphone, Bookmark, Handshake, Flag, EyeOff, AlertTriangle, ThumbsUp, Facebook, Twitter, Linkedin, Link2, Eye, MoreVertical, Tag, ShoppingCart, Store, Repeat, Tag as TagIcon, ChevronDown, ChevronUp, Clock, CircleCheckBig, XCircle, DollarSign, ShieldCheck, Paperclip, Package, FileText, Download, UploadCloud, Plus, Trash2, ClipboardCheck, Info, Calendar, ListChecks, Copy, Filter, RotateCcw, Search, Circle, Timer } from 'lucide-react';

interface HomeFeedProps {
  setCreatePost: (type?: 'thought' | 'promotion') => void;
  onViewProfile: (companyId: string) => void;
  onViewPartners?: () => void;
  onGoToSaved?: () => void;
  onGoToCancelled?: () => void;
  onGoToClosed?: () => void;
}

const mockPosts: any[] = [
  {
    id: 'p1',
    author: { name: 'VinTech Solutions', avatar: 'https://picsum.photos/100/100?u=hai', id: 'c1' },
    companyId: 'c1',
    companyName: 'VinTech Solutions',
    companyLogo: 'https://picsum.photos/100/100?u=hai',
    industry: 'Nông nghiệp & Thực phẩm',
    title: 'Vì sao Chelsea sa thải HLV Maresca? Sự thật gây chấn động ngày đầu năm 2026 (Copy) (Copy)',
    description: 'Đây là cú trượt dài mang tính khởi phát cho chiến lược gia người Ý – người mùa trước còn đưa Chelsea lên đỉnh vinh quang tại UEFA Conference League và FIFA Club World Cup, đồng thời đưa đội bóng trở lại đối trường danh giá nhất châu Âu. Tuy nhiên, sự rạn nứt trong mối quan hệ với ban lãnh đạo và những kết quả bết bát đầu năm 2026 đã khiến sự kiên nhẫn cạn kiệt.',
    stats: { views: 124, comments: 12, interests: 45, negotiations: 3 },
    timestamp: '4 ngày trước',
    type: 'promotion',
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
    }
  }
];

const getPromotionIcon = (type: string) => {
  switch (type) {
    case 'Cần mua': return <ShoppingCart size={12} className="mr-1 text-green-600" />;
    case 'Cần bán': return <Store size={12} className="mr-1 text-orange-500" />;
    case 'Cần hợp tác': return <Handshake size={12} className="mr-1 text-[#385289]" />;
    case 'Trao đổi': return <Repeat size={12} className="mr-1 text-purple-600" />;
    default: return <TagIcon size={12} className="mr-1" />;
  }
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
        <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar bg-slate-50 text-center text-gray-400 py-10">
            <MessageCircle size={48} className="mx-auto opacity-10 mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider opacity-30">Chưa có bình luận</p>
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
    return (
        <div className="fixed inset-0 z-[250] flex items-end justify-center font-sans">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
            <div className="bg-white w-full max-w-md rounded-t-[32px] p-6 shadow-2xl animate-slide-up relative z-10">
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
                <div className="flex justify-between items-center mb-6 px-1">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Chia sẻ bài viết</h3>
                    <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"><X size={20} /></button>
                </div>
                <div className="flex justify-around mb-8 text-center">
                    <button className="flex flex-col items-center gap-2"><div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white"><Facebook size={20}/></div><span className="text-[10px] font-bold">Facebook</span></button>
                    <button className="flex flex-col items-center gap-2"><div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white"><Linkedin size={20}/></div><span className="text-[10px] font-bold">LinkedIn</span></button>
                    <button onClick={handleCopy} className="flex flex-col items-center gap-2"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${copied ? 'bg-green-600' : 'bg-gray-700'}`}>{copied ? <CheckCircle size={20}/> : <Copy size={20}/>}</div><span className="text-[10px] font-bold">Sao chép</span></button>
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
                <button onClick={onClose} className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl text-sm hover:bg-gray-200">Đóng</button>
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
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promo, onHide, onReport, onNegotiate, onComment, onShare, onViewProfile }) => {
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
          onClick={() => onViewProfile(promo.companyId || promo.author.id || 'c1')}
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
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2 animate-scale-up">
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
        <p ref={contentRef} className={`text-gray-500 text-[14px] leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>{promo.description}</p>
        {showReadMore && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600 text-xs font-bold mt-1">{isExpanded ? 'Thu gọn' : 'Xem thêm'}</button>
        )}
        
        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50 mt-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="text-[11px]"><span className="text-gray-400 font-bold tracking-tight">Hạn chót:</span> <span className="text-gray-800 font-black ml-1">{promo.details.deadline}</span></div>
            <div className="text-[11px]"><span className="text-gray-400 font-bold tracking-tight">Vị trí:</span> <span className="text-gray-800 font-black ml-1">{promo.details.location}</span></div>
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
              <span className="text-gray-700 font-black text-[12px]">{promo.stats.interests || 8}</span>
              <span className="text-[10px] text-gray-400 font-medium">đã lưu</span>
           </div>
        </div>
        <div className="flex items-center text-gray-400 text-[11px] font-bold">
           <Clock size={12} className="mr-1" />
           {promo.timestamp}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={() => onNegotiate(promo)} className="flex-1 bg-[#003087] text-white py-2.5 rounded-lg font-black text-[14px] flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-transform">
          <Handshake size={18} fill="currentColor" />
          <span>Thương thảo</span>
        </button>
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

export const HomeFeed: React.FC<HomeFeedProps> = ({ setCreatePost, onViewProfile }) => {
  const [promotions, setPromotions] = useState(mockPosts);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<string | null>(null);
  const [showChooser, setShowChooser] = useState(false);

  return (
    <div className="pb-20 pt-14 min-h-screen bg-gray-50">
      <div className="bg-white p-4 sticky top-14 z-30 border-b border-gray-100 shadow-sm">
        {showChooser ? (
            <div id="feedPostChooser" className="bg-white border border-[#E9ECEF] rounded-xl p-4 mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] relative animate-fade-in">
                <div className="flex flex-col space-y-2.5 pr-6">
                    <button 
                        onClick={() => { setCreatePost('thought'); setShowChooser(false); }}
                        className="w-full p-3.5 border border-[#E0E0E0] bg-white rounded-xl cursor-pointer flex items-center justify-center gap-3 text-[14px] font-bold transition-all active:bg-gray-50 shadow-sm"
                    >
                        <PenLine size={20} className="text-[#2196F3]" />
                        <span>Đăng cảm nghĩ</span>
                    </button>
                    <button 
                        onClick={() => { setCreatePost('promotion'); setShowChooser(false); }}
                        className="w-full p-3.5 border border-[#E0E0E0] bg-white rounded-xl cursor-pointer flex items-center justify-center gap-3 text-[14px] font-bold transition-all active:bg-gray-50 shadow-sm"
                    >
                        <Megaphone size={20} className="text-[#FF9800]" />
                        <span>Đăng xúc tiến mới</span>
                    </button>
                </div>
                <button 
                    onClick={() => setShowChooser(false)}
                    className="absolute right-1.5 top-1.5 bg-white/80 backdrop-blur-sm border border-gray-100 text-[#666666] shadow-sm cursor-pointer p-1 rounded-full hover:text-gray-900 transition-colors z-10"
                    aria-label="Đóng"
                >
                    <X size={14} />
                </button>
            </div>
        ) : (
            <div 
              onClick={() => setShowChooser(true)} 
              className="flex items-center space-x-[10px] cursor-pointer"
            >
              <img 
                alt="Avatar" 
                src="https://picsum.photos/100/100?u=hai" 
                className="w-9 h-9 rounded-full object-cover border-2 border-slate-400/40"
              />
              <div className="flex-1 px-3 py-[10px] border border-[#E0E0E0] rounded-[999px] text-[14px] text-[#666666] bg-[#F8F9FA]">
                Đăng cảm nghĩ hoặc bản tin xúc tiến mới?
              </div>
            </div>
        )}
      </div>
      <div className="p-4 space-y-4">
        {promotions.map((promo) => (
          <PromotionCard key={promo.id} promo={promo} onHide={(id) => setPromotions(p => p.filter(x => x.id !== id))} onReport={() => alert('Đã báo cáo')} onNegotiate={() => alert('Thương thảo')} onComment={setActiveCommentPost} onShare={setActiveSharePost} onViewProfile={onViewProfile} />
        ))}
      </div>
      {activeCommentPost && <CommentSheet postId={activeCommentPost} onClose={() => setActiveCommentPost(null)} />}
      {activeSharePost && <ShareSheet postId={activeSharePost} onClose={() => setActiveSharePost(null)} />}
    </div>
  );
};
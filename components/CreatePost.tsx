import React, { useState } from 'react';
import { 
  X, Globe, Image, MapPin, 
  ShoppingCart, Store, Handshake, 
  ChevronDown, UploadCloud, ArrowLeft, Send, 
  Eye, Users, Tag, Repeat, Info, Calendar, DollarSign, Target, ClipboardList
} from 'lucide-react';

interface CreatePostProps {
  onClose: () => void;
  type: 'thought' | 'promotion';
}

export const CreatePost: React.FC<CreatePostProps> = ({ onClose, type }) => {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'custom'>('public');
  const [promotionType, setPromotionType] = useState<'buy' | 'sell' | 'cooperation' | 'exchange' | ''>('');
  
  const [promoData, setPromoData] = useState({
    industry: '',
    title: '',
    minValue: '',
    maxValue: '',
    demand: '',
    requirements: '',
    startDate: '',
    endDate: ''
  });

  const handlePromoInputChange = (field: string, value: string) => {
    setPromoData(prev => ({ ...prev, [field]: value }));
  };

  const isPostDisabled = type === 'promotion' && (!promotionType || !promoData.title || !promoData.startDate || !promoData.endDate);

  // --- THOUGHT POST VIEW ---
  if (type === 'thought') {
    return (
      <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 font-sans animate-fade-in">
        <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
          <div className="px-6 py-4 border-b border-gray-100 relative">
            <button onClick={onClose} className="absolute right-4 top-4 p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            <h2 className="text-[18px] font-bold text-gray-900 leading-tight">Tạo bài viết mới</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <img alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-gray-100" src="https://picsum.photos/100/100?u=hai" />
              <div className="flex-1">
                <div className="text-[14px] font-bold text-gray-900">Bạn</div>
                <div className="flex items-center mt-1">
                  <button onClick={() => setVisibility(visibility === 'public' ? 'custom' : 'public')} className="flex items-center bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
                    <Globe size={12} className="text-gray-500 mr-1.5" />
                    <span className="text-[11px] font-bold text-gray-700 uppercase">{visibility === 'public' ? 'Công khai' : 'Tùy chọn'}</span>
                    <ChevronDown size={10} className="text-gray-400 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative border border-gray-200 rounded-2xl p-4 bg-gray-50/30 focus-within:border-blue-200 focus-within:bg-white focus-within:shadow-inner transition-all duration-200">
              <textarea 
                rows={4}
                className="w-full bg-transparent text-[16px] text-gray-800 outline-none resize-none leading-relaxed placeholder-gray-400 min-h-[120px]"
                placeholder="Bạn đang nghĩ gì?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end space-x-3 bg-gray-50/30">
            <button onClick={onClose} className="px-5 py-2 text-[14px] font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
            <button disabled={!content.trim()} className={`px-8 py-2.5 rounded-xl text-[14px] font-bold transition-all ${!content.trim() ? 'bg-gray-200 text-gray-400' : 'bg-[#385289] text-white shadow-lg'}`}>Đăng</button>
          </div>
        </div>
      </div>
    );
  }

  // --- PROMOTION VIEW (Mẫu form chuẩn theo yêu cầu) ---
  return (
    <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-white w-full max-w-[600px] h-full max-h-[95vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
        {/* Modal Content Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-[18px] font-bold text-gray-800">Đăng xúc tiến thương mại mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors text-2xl font-light" aria-label="Đóng">×</button>
        </div>

        {/* Form Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Quyền truy cập */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-500 flex items-center gap-2">
              <Eye size={14} />Quyền truy cập
            </label>
            <div className="flex gap-3">
              <label 
                className={`flex-1 p-2.5 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-2
                  ${visibility === 'public' ? 'border-[#003087] bg-[#003087]/5' : 'border-gray-200 bg-white'}`}
              >
                <input type="radio" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="mr-1.5 accent-[#003087]" />
                <Globe size={16} className="text-[#003087]" />
                <strong className="text-[14px] text-gray-700">Công khai</strong>
              </label>
              <label 
                className={`flex-1 p-2.5 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-2
                  ${visibility === 'custom' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-white'}`}
                style={visibility === 'custom' ? { borderColor: '#003087', background: 'rgba(0, 48, 135, 0.05)' } : {}}
              >
                <input type="radio" value="custom" checked={visibility === 'custom'} onChange={() => setVisibility('custom')} className="mr-1.5 accent-[#003087]" />
                <Users size={16} className="text-[#003087]" />
                <strong className="text-[14px] text-gray-700">Tùy chọn</strong>
              </label>
            </div>
          </div>

          {/* Loại xúc tiến */}
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-gray-700 flex items-center gap-2">
              <Tag size={16} />Loại xúc tiến *<span className="text-[12px] text-gray-400 font-normal ml-1">(Bắt buộc chọn 1 trong 4)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'buy', label: 'Cần mua', icon: ShoppingCart, color: '#4CAF50' },
                { id: 'sell', label: 'Cần bán', icon: Store, color: '#FF9800' },
                { id: 'cooperation', label: 'Cần hợp tác', icon: Handshake, color: '#003087' },
                { id: 'exchange', label: 'Trao đổi hàng hoá & dịch vụ', icon: Repeat, color: '#9C27B0' }
              ].map((p) => (
                <label 
                  key={p.id} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 cursor-pointer transition-all
                    ${promotionType === p.id ? 'border-[#385289] bg-blue-50/50' : 'border-gray-100 bg-white'}`}
                >
                  <input 
                    type="radio" 
                    name="pmType" 
                    value={p.id} 
                    checked={promotionType === p.id} 
                    onChange={() => setPromotionType(p.id as any)} 
                    className="hidden"
                  />
                  <p.icon size={14} style={{ color: p.color }} />
                  <span className="text-[13px] font-medium text-gray-700">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ngành hàng */}
          <div>
            <select 
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none appearance-none pr-10 focus:border-blue-600 cursor-pointer shadow-sm"
              value={promoData.industry}
              onChange={(e) => handlePromoInputChange('industry', e.target.value)}
            >
              <option value="">Tất cả ngành</option>
              <option value="agriculture">🌾 Nông nghiệp & Thực phẩm</option>
              <option value="technology">💻 Công nghệ thông tin</option>
              <option value="logistics">🚛 Logistics & Vận tải</option>
              <option value="manufacturing">🏭 Sản xuất công nghiệp</option>
              <option value="textile">👔 Dệt may & Thời trang</option>
              <option value="pharmaceutical">💊 Dược phẩm & Y tế</option>
              <option value="furniture">🪑 Đồ gỗ & Nội thất</option>
              <option value="seafood">🐟 Thủy sản & Hải sản</option>
              <option value="packaging">📦 Bao bì & Đóng gói</option>
              <option value="construction">🏗️ Xây dựng & Bất động sản</option>
              <option value="energy">⚡ Năng lượng & Điện lực</option>
              <option value="automotive">🚗 Ô tô & Phụ tùng</option>
              <option value="electronics">📱 Điện tử & Viễn thông</option>
              <option value="chemicals">🧪 Hóa chất & Vật liệu</option>
              <option value="machinery">⚙️ Máy móc & Thiết bị</option>
              <option value="food-beverage">🍽️ Thực phẩm & Đồ uống</option>
              <option value="retail">🛍️ Bán lẻ & Thương mại</option>
              <option value="finance">💰 Tài chính & Ngân hàng</option>
              <option value="education">🎓 Giáo dục & Đào tạo</option>
              <option value="healthcare">🏥 Y tế & Chăm sóc sức khỏe</option>
              <option value="tourism">✈️ Du lịch & Khách sạn</option>
              <option value="entertainment">🎬 Giải trí & Truyền thông</option>
              <option value="consulting">💼 Tư vấn & Dịch vụ</option>
              <option value="environment">🌱 Môi trường & Năng lượng tái tạo</option>
              <option value="security">🔒 An ninh & Bảo mật</option>
              <option value="agriculture-tech">🌾 Nông nghiệp công nghệ cao</option>
              <option value="e-commerce">🛒 Thương mại điện tử</option>
              <option value="startup">🚀 Khởi nghiệp & Đổi mới</option>
            </select>
          </div>

          {/* Tên xúc tiến */}
          <div className="space-y-1">
             <input 
              type="text" 
              placeholder="Tên xúc tiến" 
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-600 shadow-sm"
              value={promoData.title}
              onChange={(e) => handlePromoInputChange('title', e.target.value)}
            />
          </div>

          {/* Nội dung */}
          <div className="space-y-1">
            <textarea 
              rows={4}
              placeholder="Nội dung"
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-600 shadow-sm resize-none leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Giá trị */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-gray-500 ml-1 block" htmlFor="promotion-value-min">Giá trị tối thiểu (VND)</label>
              <input 
                id="promotion-value-min"
                type="number" 
                placeholder="Giá trị tối thiểu (VND)"
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none"
                value={promoData.minValue}
                onChange={(e) => handlePromoInputChange('minValue', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-gray-500 ml-1 block" htmlFor="promotion-value-max">Giá trị tối đa (VND)</label>
              <input 
                id="promotion-value-max"
                type="number" 
                placeholder="Giá trị tối đa (VND)"
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none"
                value={promoData.maxValue}
                onChange={(e) => handlePromoInputChange('maxValue', e.target.value)}
              />
            </div>
          </div>

          {/* Nhu cầu kết nối */}
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-gray-500 ml-1 block" htmlFor="promotion-demand">Nhu cầu kết nối</label>
            <input 
              id="promotion-demand"
              type="text" 
              placeholder="Nhu cầu kết nối"
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none"
              value={promoData.demand}
              onChange={(e) => handlePromoInputChange('demand', e.target.value)}
            />
          </div>

          {/* Yêu cầu */}
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-gray-500 ml-1 block" htmlFor="promotion-requirements">Yêu cầu</label>
            <textarea 
              id="promotion-requirements"
              rows={3}
              placeholder="Ví dụ: cần gửi hàng mẫu, chứng nhận chất lượng, bảo hành 12 tháng..."
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-600 shadow-sm resize-none"
              value={promoData.requirements}
              onChange={(e) => handlePromoInputChange('requirements', e.target.value)}
            />
          </div>

          {/* Ngày bắt đầu / kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-gray-500 ml-1 block" htmlFor="promotion-start-date">Ngày bắt đầu *</label>
              <input 
                id="promotion-start-date"
                type="date" 
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none"
                value={promoData.startDate}
                onChange={(e) => handlePromoInputChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-gray-500 ml-1 block" htmlFor="promotion-end-date">Ngày kết thúc *</label>
              <input 
                id="promotion-end-date"
                type="date" 
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none"
                value={promoData.endDate}
                onChange={(e) => handlePromoInputChange('endDate', e.target.value)}
              />
            </div>
          </div>

          {/* Hình ảnh */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-500 ml-1 block">Hình ảnh (tối đa 5 ảnh)</label>
            <div 
              className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              title="Tải ảnh lên"
            >
              <UploadCloud size={24} className="text-gray-400 mb-1" />
              <span className="text-[13px] font-medium text-gray-500">Chọn ảnh</span>
              <input type="file" multiple accept="image/*" className="hidden" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white sticky bottom-0 z-10">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button 
            disabled={isPostDisabled}
            className={`px-8 py-2.5 font-bold text-sm rounded-lg transition-all
              ${isPostDisabled 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#003087] text-white hover:bg-[#002568] shadow-md'}`}
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
};

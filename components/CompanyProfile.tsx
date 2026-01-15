import React, { useState } from 'react';
import { MapPin, Globe, Mail, Phone, Edit, CheckCircle, Lock, Shield, Settings, Grid, Users, FileText, ArrowLeft, MessageCircle, Award, Briefcase, X, Save, RotateCcw, Building, Package, Handshake, User as UserIcon, Upload, Trash2, ChevronDown, MoreHorizontal, LayoutGrid, Megaphone, Star, Clock, Info, ShieldCheck, Heart, Share2, Bookmark, CircleCheckBig } from 'lucide-react';
import { Company, ContactPerson, LegalRepresentative } from '../types';

interface CompanyProfileProps {
  onBack?: () => void;
  onChat?: () => void;
  onOpenNegotiationHistory?: () => void;
}

const BRAND_BLUE = "#385289";

const initialCompany: Company = {
  id: 'c1',
  name: 'VinTech Solutions',
  industry: 'Nông nghiệp & Thực phẩm',
  description: 'Cung cấp giải pháp chuyển đổi số toàn diện cho doanh nghiệp SME. Đối tác chiến lược của nhiều tập đoàn lớn tại Việt Nam và khu vực APAC.',
  logo: 'https://picsum.photos/100/100',
  cover: 'https://picsum.photos/800/400',
  verified: true,
  email: 'contact@vintech.vn',
  website: 'https://chat.zalo.me/',
  phone: '0392853609',
  address: {
    province: 'Hoà Bình',
    district: 'Hoà Bình',
    ward: 'Mông Hoá',
    detail: '66 Hồ Tùng Mậu'
  },
  foundedYear: '2000',
  employeeCount: 'Dưới 5',
  taxId: '0392853609',
  enterpriseType: 'Công ty TNHH',
  legalRepresentative: {
    name: 'Lê Công A',
    position: 'Giám Đốc',
    phone: '0392853609',
    email: '0392853609@gmail.com'
  },
  estimatedRevenue: 'Dưới 5 tỷ',
  coreProducts: '0392853609',
  desiredPartners: '0392853609',
  marketDomestic: ['Toàn quốc', 'TP. Hồ Chí Minh', 'Miền Bắc'],
  marketInternational: ['Hàn Quốc', 'Trung Quốc'],
  salesMethod: '0392853609',
  foreignCoopCapacity: '0392853609',
  foreignPartners: '0392853609',
  contactPerson: {
    name: 'Lê Thị B',
    department: 'Kinh Doanh',
    position: 'Trưởng phòng',
    mobile: '0392853609',
    fax: '0392853609',
    email: '0969055316@gmail.com'
  },
  associations: ['Hiệp hội Phần mềm', 'VCCI', 'Hội Doanh nhân trẻ'],
  trustScore: 95,
  dealsCompleted: 142,
  certificates: [
    { id: 'cert1', name: 'ISO 27001', issuer: 'TUV Nord', year: '2023', image: 'https://picsum.photos/150/100?r=1' },
    { id: 'cert2', name: 'Top 10 Sao Khuê', issuer: 'VINASA', year: '2024', image: 'https://picsum.photos/150/100?r=2' }
  ],
  team: [
    { id: 't1', name: 'Lê Công Minh', role: 'CEO & Founder', avatar: 'https://picsum.photos/60/60?r=t1' },
    { id: 't2', name: 'Nguyễn Thị Hoa', role: 'CMO', avatar: 'https://picsum.photos/60/60?r=t2' },
  ]
};

const mockFriends = [
  'https://picsum.photos/100/100?u=1',
  'https://picsum.photos/100/100?u=2',
  'https://picsum.photos/100/100?u=3',
  'https://picsum.photos/100/100?u=4',
  'https://picsum.photos/100/100?u=5',
  'https://picsum.photos/100/100?u=6',
];

export const CompanyProfile: React.FC<CompanyProfileProps> = ({ onBack, onChat, onOpenNegotiationHistory }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'timeline' | 'associations' | 'kyc'>('timeline');
  const [showTrustReport, setShowTrustReport] = useState(false);
  const [company, setCompany] = useState<Company>(initialCompany);
  const [isEditing, setIsEditing] = useState(false);
  const [tempCompany, setTempCompany] = useState<Company>(initialCompany);

  const handleEditToggle = () => {
    if (!isEditing) {
      setTempCompany(company);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setCompany(tempCompany);
    setIsEditing(false);
    alert("Thông tin doanh nghiệp đã được cập nhật thành công!");
  };

  const handleInputChange = (path: string, value: any) => {
    setTempCompany(prev => {
      const keys = path.split('.');
      if (keys.length === 1) {
        return { ...prev, [path]: value };
      }
      
      const newObj = { ...prev } as any;
      let current = newObj;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newObj;
    });
  };

  const toggleMarket = (list: string[], item: string, path: string) => {
    const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    handleInputChange(path, newList);
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 z-[60] bg-white flex flex-col overflow-hidden animate-fade-in">
        <div className="bg-white px-4 h-14 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <h2 style={{ color: BRAND_BLUE }} className="font-bold text-lg">Chỉnh sửa thông tin doanh nghiệp</h2>
          <button onClick={() => setIsEditing(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-4 space-y-10 custom-scrollbar pb-32">
          
          {/* I. THÔNG TIN DOANH NGHIỆP */}
          <section className="space-y-6">
            <div className="bg-[#F8FAFC] border-l-4 p-3 rounded-r-xl flex items-center space-x-3" style={{ borderLeftColor: BRAND_BLUE }}>
              <div className="bg-white p-2 rounded-lg shadow-sm" style={{ color: BRAND_BLUE }}>
                <Building size={18} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-tight" style={{ color: BRAND_BLUE }}>I. THÔNG TIN DOANH NGHIỆP / INFORMATION OF ENTERPRISE</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="col-span-1">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Tên doanh nghiệp *</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none transition-all"
                  style={{ focusBorderColor: BRAND_BLUE }}
                  value={tempCompany.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Ngành</label>
                <div className="relative">
                  <select 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none appearance-none pr-10"
                    value={tempCompany.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  >
                    <option>🌾 Nông nghiệp & Thực phẩm</option>
                    <option>💻 Công nghệ thông tin</option>
                    <option>🏭 Sản xuất</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Điện thoại *</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                  value={tempCompany.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Email *</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                  value={tempCompany.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Website</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                  value={tempCompany.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Địa chỉ</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                   <div className="relative">
                     <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none appearance-none pr-8" value={tempCompany.address.province} onChange={(e) => handleInputChange('address.province', e.target.value)}>
                       <option>Hoà Bình</option>
                       <option>Hà Nội</option>
                       <option>TP. HCM</option>
                     </select>
                     <ChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" size={14} />
                   </div>
                   <div className="relative">
                     <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none appearance-none pr-8" value={tempCompany.address.district} onChange={(e) => handleInputChange('address.district', e.target.value)}>
                       <option>Hoà Bình</option>
                       <option>Kỳ Sơn</option>
                     </select>
                     <ChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" size={14} />
                   </div>
                   <div className="relative">
                     <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none appearance-none pr-8" value={tempCompany.address.ward} onChange={(e) => handleInputChange('address.ward', e.target.value)}>
                       <option>Mông Hoá</option>
                       <option>Dân Hoà</option>
                     </select>
                     <ChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" size={14} />
                   </div>
                </div>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                  placeholder="66 Hồ Tùng Mậu"
                  value={tempCompany.address.detail}
                  onChange={(e) => handleInputChange('address.detail', e.target.value)}
                />
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Năm thành lập</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                  value={tempCompany.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Quy mô nhân sự</label>
                <div className="relative">
                  <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none appearance-none pr-10" value={tempCompany.employeeCount} onChange={(e) => handleInputChange('employeeCount', e.target.value)}>
                    <option>Dưới 5</option>
                    <option>5-20</option>
                    <option>20-50</option>
                    <option>Trên 50</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Mã số thuế</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                  value={tempCompany.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Loại hình DN</label>
                <div className="relative">
                  <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none appearance-none pr-10" value={tempCompany.enterpriseType} onChange={(e) => handleInputChange('enterpriseType', e.target.value)}>
                    <option>Công ty TNHH</option>
                    <option>Công ty Cổ phần</option>
                    <option>Doanh nghiệp tư nhân</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-[13px] font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Người đại diện pháp luật</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="col-span-1">
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Họ và tên</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    value={tempCompany.legalRepresentative?.name}
                    onChange={(e) => handleInputChange('legalRepresentative.name', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Chức vụ</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    value={tempCompany.legalRepresentative?.position}
                    onChange={(e) => handleInputChange('legalRepresentative.position', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Điện thoại</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    value={tempCompany.legalRepresentative?.phone}
                    onChange={(e) => handleInputChange('legalRepresentative.phone', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Email</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    value={tempCompany.legalRepresentative?.email}
                    onChange={(e) => handleInputChange('legalRepresentative.email', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Giới thiệu</label>
              <textarea 
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none h-24 resize-none leading-relaxed"
                placeholder="0392853609"
                value={tempCompany.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </section>

          {/* II. THÔNG TIN SẢN PHẨM */}
          <section className="space-y-6">
            <div className="bg-[#F8FAFC] border-l-4 border-[#FFB800] p-3 rounded-r-xl flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-sm text-[#FFB800]">
                <Package size={18} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-tight" style={{ color: BRAND_BLUE }}>II. THÔNG TIN SẢN PHẨM / INFORMATION OF PRODUCTS</h3>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Doanh thu ước tính</label>
              <div className="relative">
                <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none appearance-none pr-10" value={tempCompany.estimatedRevenue} onChange={(e) => handleInputChange('estimatedRevenue', e.target.value)}>
                  <option>Dưới 5 tỷ</option>
                  <option>5-10 tỷ</option>
                  <option>10-50 tỷ</option>
                  <option>Trên 50 tỷ</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Sản phẩm/Dịch vụ cốt lõi</label>
              <textarea 
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none h-24 resize-none"
                placeholder="0392853609"
                value={tempCompany.coreProducts}
                onChange={(e) => handleInputChange('coreProducts', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Ảnh đại diện công ty (chỉ 1 ảnh)</label>
                  <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center relative group bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                      <div className="relative">
                        <img src={tempCompany.logo} className="w-24 h-24 object-contain rounded-lg mb-2 shadow-sm border border-gray-200" />
                        <button className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md"><X size={12}/></button>
                      </div>
                      <div className="mt-4 flex flex-col items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-400 border border-gray-100"><Upload size={18}/></div>
                        <p className="text-[10px] text-gray-400 mt-2 text-center leading-relaxed">Hỗ trợ PNG/JPG, tối đa 5MB. Chỉ cho phép 1 ảnh đại diện.</p>
                      </div>
                  </div>
               </div>

               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Hồ sơ giấy tờ liên quan (nhiều ảnh)</label>
                  <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center relative bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                      <div className="flex flex-wrap justify-center gap-2">
                        {tempCompany.certificates?.map(c => (
                          <div key={c.id} className="relative">
                            <img src={c.image} className="w-20 h-16 object-cover rounded border border-gray-200 shadow-sm" />
                            <button className="absolute -top-1.5 -right-1.5 p-0.5 bg-gray-400/80 text-white rounded-full"><X size={10}/></button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-col items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-400 border border-gray-100"><Upload size={18}/></div>
                        <p className="text-[10px] text-gray-400 mt-2 text-center leading-relaxed">Hỗ trợ PNG/JPG, tối đa 5MB/ảnh. Có thể chọn nhiều ảnh.</p>
                      </div>
                  </div>
               </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Nhu cầu/Đối tác mong muốn</label>
              <textarea 
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none h-24 resize-none"
                placeholder="0392853609"
                value={tempCompany.desiredPartners}
                onChange={(e) => handleInputChange('desiredPartners', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Thị trường Trong nước</label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden h-44 overflow-y-auto shadow-inner bg-white custom-scrollbar">
                    {['Toàn quốc', 'Hà Nội', 'TP. Hồ Chí Minh', 'Miền Bắc', 'Miền Trung', 'Miền Nam'].map(item => (
                      <div 
                        key={item} 
                        onClick={() => toggleMarket(tempCompany.marketDomestic || [], item, 'marketDomestic')}
                        className={`px-4 py-2.5 text-xs font-medium cursor-pointer transition-all border-b border-gray-50 last:border-0 ${tempCompany.marketDomestic?.includes(item) ? 'bg-[#385289] text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
               </div>
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Thị trường Quốc tế</label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden h-44 overflow-y-auto shadow-inner bg-white custom-scrollbar">
                    {['ASEAN', 'Nhật Bản', 'Hàn Quốc', 'Trung Quốc', 'EU', 'Hoa Kỳ'].map(item => (
                      <div 
                        key={item} 
                        onClick={() => toggleMarket(tempCompany.marketInternational || [], item, 'marketInternational')}
                        className={`px-4 py-2.5 text-xs font-medium cursor-pointer transition-all border-b border-gray-50 last:border-0 ${tempCompany.marketInternational?.includes(item) ? 'bg-[#385289] text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Hình thức bán hàng</label>
              <input 
                type="text" 
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                placeholder="0392853609"
                value={tempCompany.salesMethod}
                onChange={(e) => handleInputChange('salesMethod', e.target.value)}
              />
            </div>
          </section>

          {/* III. NHU CẦU HỢP TÁC VỚI ĐỐI TÁC NƯỚC NGOÀI */}
          <section className="space-y-6">
            <div className="bg-[#F8FAFC] border-l-4 border-emerald-500 p-3 rounded-r-xl flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-500">
                <Handshake size={18} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-tight" style={{ color: BRAND_BLUE }}>III. NHU CẦU HỢP TÁC VỚI ĐỐI TÁC NƯỚC NGOÀI / COOPERATION NEEDS WITH FOREIGN INVESTORS</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Năng lực hợp tác</label>
                  <textarea 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none h-24 resize-none leading-relaxed"
                    placeholder="0392853609"
                    value={tempCompany.foreignCoopCapacity}
                    onChange={(e) => handleInputChange('foreignCoopCapacity', e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Đối tác nước ngoài đã hợp tác</label>
                  <textarea 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none h-24 resize-none leading-relaxed"
                    placeholder="0392853609"
                    value={tempCompany.foreignPartners}
                    onChange={(e) => handleInputChange('foreignPartners', e.target.value)}
                  />
               </div>
            </div>
          </section>

          {/* IV. THÔNG TIN NGƯỜI LIÊN HỆ */}
          <section className="space-y-6">
            <div className="bg-[#F8FAFC] border-l-4 border-blue-400 p-3 rounded-r-xl flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-sm text-blue-400">
                <UserIcon size={18} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-tight" style={{ color: BRAND_BLUE }}>IV. THÔNG TIN NGƯỜI LIÊN HỆ / CONTACT PERSON INFORMATION</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Họ tên</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    placeholder="Lê Thị B"
                    value={tempCompany.contactPerson?.name}
                    onChange={(e) => handleInputChange('contactPerson.name', e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Bộ phận</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    placeholder="Kinh Doanh"
                    value={tempCompany.contactPerson?.department}
                    onChange={(e) => handleInputChange('contactPerson.department', e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Chức vụ</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    placeholder="Trưởng phòng"
                    value={tempCompany.contactPerson?.position}
                    onChange={(e) => handleInputChange('contactPerson.position', e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Di động</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    placeholder="0392853609"
                    value={tempCompany.contactPerson?.mobile}
                    onChange={(e) => handleInputChange('contactPerson.mobile', e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Fax</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    placeholder="0392853609"
                    value={tempCompany.contactPerson?.fax}
                    onChange={(e) => handleInputChange('contactPerson.fax', e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1.5 block">Email</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    placeholder="0969055316@gmail.com"
                    value={tempCompany.contactPerson?.email}
                    onChange={(e) => handleInputChange('contactPerson.email', e.target.value)}
                  />
               </div>
            </div>
          </section>
        </div>

        <div className="bg-white p-4 border-t border-gray-100 flex space-x-3 sticky bottom-0 left-0 right-0 z-20 pb-safe-area shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
          <button 
            onClick={() => setIsEditing(false)}
            className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3.5 text-white font-bold rounded-xl shadow-lg shadow-blue-100 active:scale-[0.98] transform transition-transform"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            Lưu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 overflow-y-auto animate-fade-in custom-scrollbar">
      
      {/* Header / Cover */}
      <div className="relative bg-white shadow-sm pb-2">
        {onBack && (
            <button onClick={onBack} className="absolute top-4 left-4 z-20 p-2.5 bg-black/30 rounded-full text-white backdrop-blur-md hover:bg-black/50 transition-colors">
                <ArrowLeft size={20} />
            </button>
        )}
        <div className="h-48 w-full relative">
          <img src={company.cover} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
        
        <div className="px-4 pb-2">
          <div className="flex justify-between items-end -mt-14 mb-4 relative z-10">
             <div className="relative">
               <img src={company.logo} alt="Logo" className="w-28 h-28 rounded-full border-[4px] border-white shadow-xl object-cover" />
               {company.verified && (
                 <div className="absolute bottom-1 right-1 bg-blue-500 border-[3px] border-white p-1 rounded-full text-white shadow-sm">
                    <CircleCheckBig size={16} fill="currentColor" color="white" />
                 </div>
               )}
             </div>
             
             {/* Refined Partners-Friends list */}
             <div className="flex flex-col items-start mb-1 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm">
                <div className="flex items-center space-x-1.5 mb-2">
                    <Users size={12} className="text-gray-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Bạn bè - Đối tác</span>
                </div>
                <div className="flex -space-x-2">
                    {mockFriends.slice(0, 5).map((avatar, idx) => (
                        <div key={idx} className="relative group">
                            <img 
                                src={avatar} 
                                alt="Friend" 
                                className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm transition-transform hover:scale-110 hover:z-20 cursor-pointer"
                            />
                        </div>
                    ))}
                    <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-white text-[9px] font-black shadow-sm relative z-10">
                        +12
                    </div>
                </div>
             </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{company.name}</h1>
            <p className="text-gray-500 text-sm mb-3 font-medium flex items-center">
                <Briefcase size={14} className="mr-1.5 text-gray-400" />
                {company.industry} 
                <span className="mx-2 text-gray-300">•</span> 
                <MapPin size={14} className="mr-1.5 text-red-500" />
                {company.address.province}
            </p>
          </div>
          
          {/* Company Stats Bar */}
          <div 
            className={`flex justify-between bg-white p-4 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 mb-2 cursor-pointer hover:border-blue-200`}
          >
              <div className="text-center flex-1 border-r border-gray-100 last:border-0 flex flex-col items-center">
                  <div className="flex items-center space-x-1 mb-1" style={{ color: BRAND_BLUE }}>
                      <Megaphone size={14} />
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Xúc tiến</span>
                  </div>
                  <div className="text-[15px] text-gray-800">24</div>
              </div>
              <div className="text-center flex-1 border-r border-gray-100 last:border-0 flex flex-col items-center">
                  <div className="flex items-center space-x-1 mb-1 text-emerald-500">
                      <Handshake size={14} fill="none" />
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Chốt deal</span>
                  </div>
                  <div className="text-[15px] text-gray-800">156</div>
              </div>
              <div className="text-center flex-1 flex flex-col items-center">
                  <div className="flex items-center space-x-1 mb-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Đánh giá</span>
                  </div>
                  <div className="text-[15px] text-gray-800">89</div>
              </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 sticky top-14 bg-white/95 backdrop-blur-sm z-20 shadow-sm overflow-x-auto no-scrollbar">
           {[
             { id: 'timeline', label: 'Bảng tin', icon: Clock },
             { id: 'about', label: 'Giới thiệu', icon: Info },
             { id: 'associations', label: 'Mạng lưới', icon: Users },
             { id: 'kyc', label: 'KYC', icon: ShieldCheck },
           ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[80px] flex items-center justify-center space-x-1 py-3.5 text-[12px] font-bold border-b-2 transition-all ${
                  activeTab === tab.id ? 'text-[#385289]' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
                style={{ borderBottomColor: activeTab === tab.id ? BRAND_BLUE : 'transparent' }}
             >
               <tab.icon size={14} />
               <span>{tab.label}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-0 pt-2">
        
        {/* === ABOUT TAB === */}
        {activeTab === 'about' && (
          <div className="space-y-3 p-4 pt-2">
             {/* Description */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group">
                <h3 className="font-bold text-gray-900 text-base mb-3">Giới thiệu chung</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{company.description}</p>
             </div>

             {/* Core Products */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                    <Package className="text-[#FFB800] mr-2" size={20}/> Sản phẩm cốt lõi
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">{company.coreProducts}</p>
             </div>

             {/* Certificates */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                    <Award className="text-amber-500 mr-2" size={20}/> Năng lực & Chứng chỉ
                </h3>
                <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2">
                    {company.certificates?.map(cert => (
                        <div key={cert.id} className="min-w-[150px] bg-slate-50 border border-gray-100 rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                            <img src={cert.image} className="w-full h-24 object-cover rounded-lg mb-3 bg-white shadow-sm" />
                            <div className="font-bold text-sm text-gray-800 truncate mb-1">{cert.name}</div>
                            <div className="text-[10px] text-gray-500 font-medium uppercase">{cert.issuer} • {cert.year}</div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Team */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-base">Ban lãnh đạo</h3>
                <div className="grid grid-cols-3 gap-4">
                    {company.team?.map(member => (
                        <div key={member.id} className="text-center group">
                            <div className="relative inline-block mb-2">
                                <img src={member.avatar} className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover group-hover:border-blue-200 transition-colors" />
                            </div>
                            <div className="font-bold text-xs text-gray-900 mb-0.5">{member.name}</div>
                            <div className="text-[10px] font-bold uppercase" style={{ color: BRAND_BLUE }}>{member.role}</div>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        )}

        {/* === TIMELINE TAB === */}
        {activeTab === 'timeline' && (
          <div className="space-y-4 px-2 pt-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-5 shadow-sm rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <img src={company.logo} className="w-10 h-10 rounded-full border border-gray-100" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{company.name}</h4>
                    <span className="text-xs text-gray-400 font-medium">2 giờ trước • Công khai</span>
                  </div>
                </div>
                <p className="text-gray-800 text-sm mb-3 leading-relaxed">Lễ ký kết hợp tác chiến lược với đối tác Nhật Bản. Mở ra cơ hội xuất khẩu phần mềm quy mô lớn.</p>
                <div className="grid grid-cols-2 gap-1.5 rounded-xl overflow-hidden mb-4">
                    <img src={`https://picsum.photos/300/200?r=${i}a`} className="w-full h-36 object-cover" />
                    <img src={`https://picsum.photos/300/200?r=${i}b`} className="w-full h-36 object-cover" />
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <div className="flex items-center space-x-5 text-gray-500">
                        <button className="flex items-center space-x-1.5 hover:text-rose-500 transition-colors">
                            <Heart size={18} />
                            <span className="text-xs font-bold">124</span>
                        </button>
                        <button className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors">
                            <MessageCircle size={18} />
                            <span className="text-xs font-bold">12</span>
                        </button>
                        <button className="flex items-center space-x-1.5 hover:text-indigo-500 transition-colors">
                            <Share2 size={18} />
                        </button>
                        <button className="flex items-center space-x-1.5 hover:text-amber-500 transition-colors">
                            <Bookmark size={18} />
                        </button>
                    </div>
                    {/* Giả định bài đầu tiên là bài xúc tiến */}
                    {i === 1 && (
                        <button 
                            onClick={onOpenNegotiationHistory}
                            className="flex items-center justify-center bg-blue-50 w-9 h-9 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm"
                            style={{ color: BRAND_BLUE, borderColor: BRAND_BLUE + '20' }}
                        >
                            <Handshake size={18} />
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === ASSOCIATIONS TAB === */}
        {activeTab === 'associations' && (
           <div className="p-4 pt-2">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-800 font-bold mb-4 text-base">Thành viên hiệp hội</h3>
                <div className="space-y-3">
                {company.associations.map((assoc, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-100 transition-colors" style={{ color: BRAND_BLUE }}>
                            <Users size={20} />
                        </div>
                        <span className="font-bold text-sm text-gray-800">{assoc}</span>
                        </div>
                        <CheckCircle size={18} className="text-green-500" fill="currentColor" color="white"/>
                    </div>
                ))}
                </div>
             </div>
           </div>
        )}

        {/* === KYC TAB === */}
        {activeTab === 'kyc' && (
          <div className="p-4 pt-2 space-y-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 text-base">Xác thực doanh nghiệp</h3>
                    <span className="bg-green-50 text-green-700 text-[10px] font-black px-3 py-1 rounded-full border border-green-100 uppercase tracking-wider">Đã xác minh</span>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-gray-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm" style={{ color: BRAND_BLUE }}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800">Giấy phép kinh doanh</p>
                            <p className="text-[10px] text-gray-500 font-medium">Cập nhật: 12/05/2023</p>
                        </div>
                        <CheckCircle size={16} className="ml-auto text-green-500" fill="currentColor" color="white"/>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-gray-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm" style={{ color: BRAND_BLUE }}>
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800">Xác minh người đại diện</p>
                            <p className="text-[10px] text-gray-500 font-medium">eKYC hoàn tất qua CCCD</p>
                        </div>
                        <CheckCircle size={16} className="ml-auto text-green-500" fill="currentColor" color="white"/>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-gray-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm" style={{ color: BRAND_BLUE }}>
                            <Building size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800">Xác thực trụ sở</p>
                            <p className="text-[10px] text-gray-500 font-medium">Đã kiểm tra thực tế</p>
                        </div>
                        <CheckCircle size={16} className="ml-auto text-green-500" fill="currentColor" color="white"/>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center space-x-3">
                    <ShieldCheck size={24} style={{ color: BRAND_BLUE }} />
                    <p className="text-[11px] leading-relaxed font-medium" style={{ color: BRAND_BLUE }}>
                        Hệ thống định danh doanh nghiệp <strong>Biziha Trust™</strong> đảm bảo tính pháp lý minh bạch cho mọi giao dịch trên nền tảng.
                    </p>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* TRUST REPORT MODAL */}
      {showTrustReport && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl transform scale-100">
                  <button onClick={() => setShowTrustReport(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-1 rounded-full"><X size={20}/></button>
                  
                  <div className="text-center mb-8">
                      <div className="inline-block p-5 rounded-full bg-blue-50 border-4 border-blue-100 mb-3 shadow-inner">
                          <Shield size={48} style={{ color: BRAND_BLUE }} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Báo cáo Tín nhiệm</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">Cập nhật: 20/10/2024</p>
                  </div>

                  <div className="space-y-5 mb-8">
                      <div className="flex justify-between items-center border-b border-dashed border-gray-100 pb-3">
                          <span className="text-sm text-gray-600 font-medium">Xác thực Pháp lý</span>
                          <span className="text-sm font-bold text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-lg"><CheckCircle size={14} className="mr-1"/> Đạt</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-dashed border-gray-100 pb-3">
                          <span className="text-sm text-gray-600 font-medium">Hoạt động liên tục</span>
                          <span className="text-sm font-bold text-gray-900">{new Date().getFullYear() - parseInt(company.foundedYear || '2015')} Năm</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-dashed border-gray-100 pb-3">
                          <span className="text-sm text-gray-600 font-medium">Tỷ lệ hoàn thành Deal</span>
                          <span className="text-sm font-bold" style={{ color: BRAND_BLUE }}>98%</span>
                      </div>
                      <div className="flex justify-between items-center pb-1">
                          <span className="text-sm text-gray-600 font-medium">Khiếu nại / Tranh chấp</span>
                          <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">0</span>
                      </div>
                  </div>

                  <button onClick={() => setShowTrustReport(false)} className="w-full py-3.5 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-colors" style={{ backgroundColor: BRAND_BLUE }}>Đóng báo cáo</button>
              </div>
          </div>
      )}
    </div>
  );
};
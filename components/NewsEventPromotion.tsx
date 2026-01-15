
import React, { useState } from 'react';
import { Calendar, Tag, MapPin, ArrowRight, Handshake } from 'lucide-react';

interface NewsEventPromotionProps {
  onJoinNegotiation: () => void;
  onCreatePost?: () => void;
}

export const NewsEventPromotion: React.FC<NewsEventPromotionProps> = ({ onJoinNegotiation, onCreatePost }) => {
  const [tab, setTab] = useState<'news' | 'promotion' | 'event'>('promotion');

  return (
    <div className="pt-14 pb-20 min-h-screen">
      <div className="bg-white px-4 pt-2 shadow-sm sticky top-14 z-30">
         <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-3">
            {[
                {id: 'promotion', label: 'Xúc tiến TM'}, 
                {id: 'news', label: 'Tin tức'}, 
                {id: 'event', label: 'Sự kiện'}
            ].map(t => (
               <button 
                 key={t.id}
                 onClick={() => setTab(t.id as any)}
                 className={`whitespace-nowrap pb-2 text-sm font-bold border-b-2 transition-colors ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
               >
                  {t.label}
               </button>
            ))}
         </div>
      </div>

      <div className="p-4 space-y-4">
         {tab === 'news' && [1, 2, 3].map(i => (
            <div key={i} className="flex bg-white p-3 rounded-xl shadow-sm border border-gray-100">
               <img src={`https://picsum.photos/200/20${i}`} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
               <div className="ml-3 flex flex-col justify-between">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2">Xuất khẩu nông sản sang EU tăng trưởng mạnh trong quý 3</h3>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                     <span>Báo Công Thương</span>
                     <span>2h trước</span>
                  </div>
               </div>
            </div>
         ))}

         {tab === 'promotion' && (
             <>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-4">
                    <h3 className="font-bold text-blue-800 mb-1">Cơ hội giao thương</h3>
                    <p className="text-xs text-blue-600 mb-3">Kết nối trực tiếp với các đơn vị đang tìm kiếm đối tác.</p>
                    <button onClick={onCreatePost} className="bg-blue-600 text-white w-full py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">Đăng tin Xúc tiến</button>
                </div>

                {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="relative">
                        <img src={`https://picsum.photos/800/40${i}`} className="w-full h-32 object-cover" />
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                            TÌM NHÀ CUNG CẤP
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Tìm kiếm đối tác cung ứng bao bì giấy Kraft</h3>
                        <p className="text-gray-500 text-xs mb-3">Đăng bởi: Công ty CP Thực Phẩm Á Châu</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">Ngành in ấn</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">Số lượng lớn</span>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                            <span className="text-xs text-red-500 font-medium">Hết hạn: 20/11/2024</span>
                            <button 
                                onClick={onJoinNegotiation}
                                className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                <Handshake size={16} />
                                <span>Thương thảo ngay</span>
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
            </>
         )}

         {tab === 'event' && [1, 2].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex">
               <div className="w-16 h-16 bg-red-50 rounded-lg flex flex-col items-center justify-center text-red-600 flex-shrink-0 border border-red-100">
                  <span className="text-xs font-bold uppercase">Tháng 10</span>
                  <span className="text-2xl font-bold">15</span>
               </div>
               <div className="ml-3 flex-1">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1">Diễn đàn Kinh tế Số 2024</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                     <MapPin size={12} className="mr-1" /> GEM Center, TP.HCM
                  </div>
                  <button className="bg-white border border-gray-300 text-gray-700 w-full py-1.5 rounded-lg text-xs font-bold">Quan tâm</button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

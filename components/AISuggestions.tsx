import React, { useState } from 'react';
import { Sparkles, Send, Loader2, TrendingUp, Users, Calendar } from 'lucide-react';
import { getBusinessSuggestions } from '../services/geminiService';

export const AISuggestions: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse(null);
    const result = await getBusinessSuggestions(prompt);
    setResponse(result);
    setLoading(false);
  };

  const suggestionChips = [
    "Tìm đối tác dệt may",
    "Xu hướng Logistics 2024",
    "Sự kiện Tech sắp tới",
    "Gợi ý chiến lược Marketing B2B"
  ];

  return (
    <div className="pb-20 pt-14 min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-lg text-white shadow-lg">
            <Sparkles size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Trợ lý AI Biziha</h2>
        </div>

        {/* Suggestion Chips */}
        {!response && !loading && (
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3 font-medium uppercase tracking-wide">Gợi ý nhanh</p>
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(chip)}
                  className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 shadow-sm border border-gray-100 hover:border-blue-300 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center mb-6">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Bạn cần tìm kiếm cơ hội gì hôm nay?"
            className="flex-1 px-3 py-2 outline-none text-gray-700 placeholder-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !prompt.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>

        {/* Dynamic Cards (Pre-generated placeholders for visual richness) */}
        {!response && (
           <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                 <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="text-green-500" size={20} />
                    <h3 className="font-semibold text-gray-800">Cơ hội Xúc tiến</h3>
                 </div>
                 <p className="text-gray-600 text-sm">Có 3 phiên giao thương mới trong ngành của bạn tuần này.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                 <div className="flex items-center space-x-2 mb-2">
                    <Users className="text-blue-500" size={20} />
                    <h3 className="font-semibold text-gray-800">Đối tác tiềm năng</h3>
                 </div>
                 <p className="text-gray-600 text-sm">Công ty ABC Group vừa gia nhập Hiệp hội Logistic.</p>
              </div>
           </div>
        )}

        {/* AI Response Area */}
        {response && (
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 animate-fade-in">
             <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-3">
                <Sparkles size={18} className="text-amber-500" />
                <span className="font-semibold text-gray-800">Kết quả phân tích</span>
             </div>
             <div className="prose prose-sm prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {response}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
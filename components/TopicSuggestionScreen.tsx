
import React, { useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS, EDUCATION_LEVELS, SUBJECTS, getFilteredSubjects } from '../constants';
import { aiService } from '../services/aiService';
import { SKKNSuggestion } from '../types';

export const TopicSuggestionScreen: React.FC = () => {
  const { state, setTopic, setStatus, setEducationLevel, setSubject } = useAppContext();
  const [formData, setFormData] = useState({
    strength: "",
    product: "",
    goal: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SKKNSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setHasSearched(true);
    try {
      const results = await aiService.generateSkknSuggestions({
        educationLevel: state.educationLevel,
        subject: state.subject,
        strength: formData.strength,
        product: formData.product,
        goal: formData.goal
      });
      setSuggestions(results);
    } catch (error) {
      console.error("Failed to suggest topics", error);
    } finally {
      setIsGenerating(false);
    }
  }, [state.educationLevel, state.subject, formData]);

  const selectTopic = (title: string) => {
    setTopic(title);
    setStatus("GATHERING_INFO");
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setStatus("GATHERING_INFO")}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Tư vấn đề tài SKKN</h2>
          <p className="text-slate-500">Chọn môn học và nhấn nút để AI gợi ý các đề tài sáng tạo nhất.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Input */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 h-fit space-y-6">
           <form onSubmit={onFormSubmit} className="space-y-5">
             <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
               <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Thông tin bắt buộc</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Cấp học</label>
                   <select 
                      value={state.educationLevel}
                      onChange={(e) => {
                        const newLevel = e.target.value;
                        setEducationLevel(newLevel);
                        if (newLevel === "THPT" && state.subject === "Giáo dục công dân") {
                          setSubject("Giáo dục Kinh tế và Pháp luật");
                        } else if (newLevel !== "THPT" && state.subject === "Giáo dục Kinh tế và Pháp luật") {
                          setSubject("Giáo dục công dân");
                        }
                      }}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   >
                     {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Môn học</label>
                   <select 
                      value={state.subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   >
                     {getFilteredSubjects(state.educationLevel).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
               </div>
             </div>

             <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Thông tin bổ sung (Không bắt buộc)</h3>
               
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Thế mạnh của bạn?</label>
                 <textarea 
                  value={formData.strength}
                  onChange={(e) => setFormData({...formData, strength: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] text-sm"
                  placeholder="VD: Sử dụng CNTT, làm đồ dùng trực quan..."
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Công cụ/Phương pháp áp dụng?</label>
                 <textarea 
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] text-sm"
                  placeholder="VD: Phần mềm Quizizz, sơ đồ tư duy..."
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Mục tiêu đạt được?</label>
                 <textarea 
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] text-sm"
                  placeholder="VD: Học sinh hứng thú, tăng kỹ năng nói..."
                 />
               </div>
             </div>

             <button 
              disabled={isGenerating}
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
             >
               {isGenerating ? <><ICONS.Loader /> Đang phân tích...</> : <><ICONS.Sparkles /> Tìm đề tài phù hợp ngay</>}
             </button>
           </form>
        </div>

        {/* Suggestions Column */}
        <div className="space-y-6">
           {isGenerating ? (
             <div className="h-full flex flex-col items-center justify-center space-y-4 p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
               <div className="relative">
                 <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl animate-pulse"></div>
                 <div className="relative text-indigo-600 animate-spin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                 </div>
               </div>
               <p className="text-slate-500 font-bold italic animate-pulse">AI đang phân tích môn {state.subject}...</p>
             </div>
           ) : hasSearched && suggestions.length > 0 ? (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
               <div className="flex items-center justify-between px-2">
                 <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                   <span className="p-1.5 bg-green-100 text-green-600 rounded-lg"><ICONS.Check /></span>
                   Kết quả dành cho bạn
                 </h3>
                 <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-tighter">Môn {state.subject}</span>
               </div>
               {suggestions.map((s, idx) => (
                 <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-indigo-600">
                   <div className="flex justify-between items-start gap-4">
                      <div className="flex-grow">
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors leading-snug">
                          {s.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed italic">
                          {s.description}
                        </p>
                      </div>
                      <button 
                        onClick={() => selectTopic(s.title)}
                        className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex-shrink-0 shadow-sm"
                        title="Sử dụng đề tài này"
                      >
                        <ICONS.ArrowRight />
                      </button>
                   </div>
                 </div>
               ))}
               <button 
                onClick={handleGenerate}
                className="w-full py-3 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors border border-dashed border-slate-200 rounded-2xl hover:bg-indigo-50"
               >
                 Tạo các gợi ý khác
               </button>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-slate-400">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-indigo-200">
                 <ICONS.Sparkles />
               </div>
               <h3 className="text-lg font-bold text-slate-500">Bắt đầu ngay</h3>
               <p className="text-center text-sm max-w-[280px] mt-2 leading-relaxed">
                 Hãy chọn <span className="text-indigo-600 font-bold">Cấp học & Môn học</span> bên trái, sau đó nhấn nút tìm kiếm để AI bắt đầu tư vấn đề tài.
               </p>
               <div className="mt-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-3 text-[11px] text-indigo-700">
                 <div className="mt-0.5"><ICONS.Check /></div>
                 <p>Bạn có thể nhập thêm các thông tin bổ sung để kết quả mang tính cá nhân hóa và sát thực tế hơn.</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

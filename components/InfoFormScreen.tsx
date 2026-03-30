
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SUBJECTS, WRITING_STYLES, ICONS, EDUCATION_LEVELS, getFilteredSubjects } from '../constants';
import { SKKN_TEMPLATES, DETAILED_OUTLINE } from '../constants/templates';
import { aiService } from '../services/aiService';
import { parseTemplateToTree } from '../utils/outlineParser';
import { WritingStyle, SKKNTemplate } from '../types';

export const InfoFormScreen: React.FC = () => {
  const { 
    state, 
    setUserInfo, 
    setDetailedConfig,
    setTopic, 
    setOutline, 
    setStatus, 
    setWritingStyle, 
    setErrorMessage,
    setEducationLevel,
    setSubject,
    setSelectedTemplate
  } = useAppContext();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDetailedOpen, setIsDetailedOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.topic) {
      setErrorMessage("Vui lòng nhập tiêu đề hoặc chọn đề tài gợi ý.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    try {
      let outline;

      // 1. Ưu tiên 1: Sử dụng Template đã được chọn thủ công
      if (state.selectedTemplate) {
        outline = parseTemplateToTree(state.selectedTemplate.outlineText, state.targetWordCount);
      } 
      // 2. Ưu tiên 2: Sử dụng Dàn ý tùy chỉnh do người dùng nhập
      else if (state.customOutlineText) {
        outline = parseTemplateToTree(state.customOutlineText, state.targetWordCount);
      }
      // 3. Ưu tiên 3: Tìm kiếm Template tự động dựa trên tên tiêu đề hoặc môn học
      else {
        const matchedTemplate = SKKN_TEMPLATES.find(t => t.name === state.topic || t.subject === state.subject);
        if (matchedTemplate) {
          outline = parseTemplateToTree(matchedTemplate.outlineText, state.targetWordCount);
        } else {
          // 4. Ưu tiên 4: Nếu không khớp gì cả, sử dụng dàn ý chuẩn mặc định (DETAILED_OUTLINE)
          outline = parseTemplateToTree(DETAILED_OUTLINE, state.targetWordCount);
        }
      }
      
      setOutline(outline);
      setStatus("REVIEWING_OUTLINE");
    } catch (err) {
      setErrorMessage("Không thể tạo dàn ý. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDetailedChange = (field: string, value: string) => {
    setDetailedConfig({ [field]: value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Bắt đầu sáng kiến mới</h2>
        <p className="text-slate-500">Cung cấp thông tin cơ bản để AI chuẩn bị nội dung tốt nhất cho bạn.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Đề tài */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm">1</span>
              Thông tin đề tài
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tiêu đề Sáng kiến kinh nghiệm</label>
              <textarea 
                required
                value={state.topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (state.selectedTemplate && e.target.value !== state.selectedTemplate.name) {
                    setSelectedTemplate(null);
                  }
                }}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]"
                placeholder="VD: Một số giải pháp nâng cao chất lượng dạy học môn Toán..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Cấp học</label>
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
               <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Môn học</label>
                <select 
                  value={state.subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {getFilteredSubjects(state.educationLevel).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Phong cách & Tác giả */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm">2</span>
              Phong cách và tác giả
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Giọng văn chủ đạo</label>
                <select 
                  value={state.writingStyle}
                  onChange={(e) => setWritingStyle(e.target.value as WritingStyle)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {WRITING_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tên người thực hiện</label>
                <input 
                  type="text"
                  value={state.userInfo.name}
                  onChange={(e) => setUserInfo({ ...state.userInfo, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Họ và tên giáo viên"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Info */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDetailedOpen(!isDetailedOpen)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200"
            >
              <div className="flex items-center gap-2 font-bold text-indigo-600">
                <svg className={`transition-transform duration-300 ${isDetailedOpen ? 'rotate-90' : ''}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                <span>➕ Bổ sung thông tin chi tiết (Giúp bài viết thực tế hơn)</span>
              </div>
              <span className="text-xs text-slate-400 font-medium italic">Không bắt buộc</span>
            </button>

            {isDetailedOpen && (
              <div className="p-6 space-y-8 bg-white border border-slate-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nhóm 1: Thông tin đơn vị & Đối tượng</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Vùng miền</label>
                      <select 
                        value={state.detailedConfig.schoolType}
                        onChange={(e) => handleDetailedChange('schoolType', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      >
                        <option value="Thành thị">Thành thị</option>
                        <option value="Nông thôn">Nông thôn</option>
                        <option value="Miền núi">Miền núi</option>
                        <option value="Hải đảo">Hải đảo</option>
                        <option value="Vùng khó khăn">Vùng khó khăn</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Quy mô trường</label>
                      <input 
                        type="text"
                        value={state.detailedConfig.schoolScale}
                        onChange={(e) => handleDetailedChange('schoolScale', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        placeholder="VD: 30 lớp, 1200 học sinh"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600">Đặc điểm học sinh</label>
                      <textarea 
                        value={state.detailedConfig.studentCharacteristics}
                        onChange={(e) => handleDetailedChange('studentCharacteristics', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none min-h-[60px]"
                        placeholder="VD: Thuận lợi: Ngoan, hiếu động; Khó khăn: Kỹ năng đọc còn yếu..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nhóm 2: Nội dung thực tế</h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Thực trạng/Vấn đề cần giải quyết</label>
                      <textarea 
                        value={state.detailedConfig.problemStatus}
                        onChange={(e) => handleDetailedChange('problemStatus', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none min-h-[80px]"
                        placeholder="Mô tả ngắn gọn thực tế khi chưa áp dụng sáng kiến..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Các giải pháp chính đã áp dụng</label>
                      <textarea 
                        value={state.detailedConfig.mainSolutions}
                        onChange={(e) => handleDetailedChange('mainSolutions', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none min-h-[80px]"
                        placeholder="Liệt kê 2-3 giải pháp cốt lõi bạn đã làm..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? <><ICONS.Loader /> Đang khởi tạo dàn ý...</> : <>Tiếp tục <ICONS.ArrowRight /></>}
          </button>
        </form>
      </div>

      {/* Footer Suggestions */}
      <div className="grid grid-cols-1 gap-4">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
               <ICONS.Sparkles />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gợi ý đề tài</div>
              <div className="text-lg font-bold text-slate-800">Bạn chưa có ý tưởng đề tài?</div>
              <p className="text-sm text-slate-500">Hãy để AI giúp bạn tư vấn một đề tài SKKN hay và phù hợp.</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setStatus("GENERATING_TOPIC")} 
            className="px-8 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 whitespace-nowrap"
          >
            Nhờ AI tư vấn đề tài
          </button>
        </div>
      </div>
    </div>
  );
};

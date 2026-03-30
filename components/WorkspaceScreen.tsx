
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS } from '../constants';
import { aiService } from '../services/aiService';
import { flattenOutline } from '../utils/formatting';
import { exportToWord, copyToClipboard } from '../utils/exportService';

export const WorkspaceScreen: React.FC = () => {
  const { state, updateOutlineNode, setProgressIndex, setStatus, setErrorMessage } = useAppContext();
  const [isAutoWriting, setIsAutoWriting] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const flatOutline = useMemo(() => flattenOutline(state.outline), [state.outline]);
  const totalSections = flatOutline.length;
  const progressPercent = totalSections > 0 ? Math.round((state.progressIndex / totalSections) * 100) : 0;

  const currentWritingNode = useMemo(() => flatOutline.find(n => n.status === "PENDING"), [flatOutline]);
  
  const selectedNode = useMemo(() => 
    flatOutline.find(n => n.id === (selectedNodeId || currentWritingNode?.id || flatOutline[0]?.id)),
  [flatOutline, selectedNodeId, currentWritingNode]);

  const generateSection = async (nodeId: string) => {
    const node = flatOutline.find(n => n.id === nodeId);
    if (!node) return;

    setIsWriting(true);
    setErrorMessage(null);
    try {
      const content = await aiService.generateSectionContent(
        state.topic,
        node.title,
        state.writingStyle,
        state.userInfo,
        state.detailedConfig,
        { educationLevel: state.educationLevel, subject: state.subject },
        node.userGuidance
      );
      
      updateOutlineNode(nodeId, {
        content,
        status: "COMPLETED",
        actualWordCount: content.split(/\s+/).filter(Boolean).length
      });
      
      setProgressIndex(prev => prev + 1);
    } catch (err) {
      setErrorMessage(`Lỗi khi viết phần "${node.title}".`);
    } finally {
      setIsWriting(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportToWord(state.outline, state.topic, state.userInfo);
    } catch (error) {
      setErrorMessage("Không thể xuất file Word. Vui lòng kiểm tra lại cấu trúc dàn ý.");
    }
  };

  useEffect(() => {
    if (isAutoWriting && currentWritingNode && !isWriting) {
      generateSection(currentWritingNode.id);
    } else if (isAutoWriting && !currentWritingNode) {
      setIsAutoWriting(false);
    }
  }, [isAutoWriting, currentWritingNode, isWriting]);

  if (state.status === "COMPLETED") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-200">
          <div className="text-center mb-16 border-b-2 border-slate-100 pb-12">
            <h1 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Sáng kiến kinh nghiệm hoàn chỉnh</h1>
            <h2 className="text-3xl font-extrabold text-slate-900 px-10 italic leading-snug">"{state.topic}"</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
              <span className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Tác giả: {state.userInfo.name}</span>
              <span className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Đơn vị: {state.userInfo.school}</span>
              <span className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Năm học: {state.userInfo.schoolYear}</span>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none">
            {state.outline.map((node) => (
              <div key={node.id} className="mb-12 page-break-inside-avoid">
                <h3 className="text-xl font-bold text-slate-900 mb-6 border-l-4 border-indigo-600 pl-4">{node.title}</h3>
                <div className="text-slate-700 leading-relaxed text-justify whitespace-pre-wrap font-serif text-lg">{node.content}</div>
                {node.children?.map(child => (
                  <div key={child.id} className="mt-8 ml-8">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">{child.title}</h4>
                    <div className="text-slate-600 leading-relaxed text-justify whitespace-pre-wrap font-serif text-lg">{child.content}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 no-print">
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Viết bài mới
          </button>
          <button 
            onClick={handleExport} 
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
             Tải file Word (.docx)
          </button>
          <button 
            onClick={() => setStatus("GENERATING_CONTENT")} 
            className="px-8 py-4 bg-indigo-50 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-100 transition-all"
          >
            Quay lại chỉnh sửa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[70vh]">
      {/* Sidebar: Outline */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Tiến trình soạn thảo</h3>
            <span className="text-sm font-bold text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button 
              onClick={() => setIsAutoWriting(!isAutoWriting)}
              className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${isAutoWriting ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
            >
              {isAutoWriting ? <><ICONS.Loader /> Đang viết tự động...</> : <><ICONS.Sparkles /> Viết tự động toàn bộ</>}
            </button>
            {progressPercent === 100 && (
              <button 
                onClick={() => setStatus("COMPLETED")}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 animate-pulse"
              >
                Hoàn tất & Xem bài viết
              </button>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
             <h3 className="font-bold text-slate-800 mb-4 px-2 text-sm uppercase tracking-wider">Dàn ý bài viết</h3>
             <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {flatOutline.map((node) => (
                 <button 
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between group transition-all ${selectedNode?.id === node.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50'}`}
                 >
                   <div className="flex items-center gap-3 overflow-hidden">
                     {node.status === "COMPLETED" ? (
                       <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                         <ICONS.Check />
                       </div>
                     ) : (isWriting && currentWritingNode?.id === node.id) ? (
                       <div className="w-5 h-5 text-indigo-600 animate-spin flex-shrink-0">
                         <ICONS.Loader />
                       </div>
                     ) : (
                       <div className="w-5 h-5 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                         -
                       </div>
                     )}
                     <span className={`text-sm truncate ${selectedNode?.id === node.id ? 'font-bold text-indigo-700' : 'text-slate-600'}`}>
                       {node.title}
                     </span>
                   </div>
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow space-y-6">
        {selectedNode && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col min-h-[600px] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 font-bold">
                   {flatOutline.indexOf(selectedNode) + 1}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedNode.title}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                    {selectedNode.status === 'COMPLETED' ? '✓ Đã hoàn thiện' : '○ Đang chờ soạn thảo'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 {selectedNode.status === 'COMPLETED' && (
                   <button 
                    onClick={() => {
                      copyToClipboard(selectedNode.content);
                      alert("Đã sao chép nội dung vào bộ nhớ tạm!");
                    }}
                    className="p-3 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 rounded-xl transition-all shadow-sm"
                    title="Copy nội dung"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                   </button>
                 )}
                 <button 
                  disabled={isWriting}
                  onClick={() => generateSection(selectedNode.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-sm ${isWriting ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'}`}
                  title="Tạo lại nội dung phần này"
                 >
                   <svg className={isWriting && currentWritingNode?.id === selectedNode.id ? 'animate-spin' : ''} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M21 21v-5h-5"/></svg>
                   {selectedNode.content ? 'Viết lại' : 'Soạn thảo'}
                 </button>
              </div>
            </div>

            <div className="p-10 flex-grow overflow-auto prose prose-slate max-w-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe-light.png')] bg-fixed">
              {isWriting && selectedNode.id === currentWritingNode?.id ? (
                <div className="space-y-6 max-w-2xl mx-auto py-10">
                  <div className="h-6 bg-slate-100 rounded-lg w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse delay-75"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-5/6 animate-pulse delay-150"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse delay-300"></div>
                  <div className="h-6 bg-slate-100 rounded-lg w-1/2 animate-pulse pt-10"></div>
                  <div className="flex flex-col items-center gap-4 py-20">
                    <div className="relative">
                       <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl animate-pulse"></div>
                       <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-indigo-100">
                         <ICONS.Loader />
                       </div>
                    </div>
                    <p className="text-center text-indigo-600 font-bold italic tracking-wide animate-bounce">AI đang miệt mài gõ phím...</p>
                  </div>
                </div>
              ) : selectedNode.content ? (
                <div className="whitespace-pre-wrap leading-relaxed text-slate-800 text-justify animate-in fade-in zoom-in-95 duration-700 bg-white p-10 rounded-3xl shadow-sm border border-slate-100 min-h-[400px] font-serif text-lg">
                  {selectedNode.content}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 m-4">
                  <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6">
                    <ICONS.Pen />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">Chưa có nội dung</h3>
                  <p className="max-w-xs text-center mt-2 text-sm">Nhấn nút "Soạn thảo" để AI bắt đầu viết nội dung cho phần này dựa trên đề tài của bạn.</p>
                  <button 
                    onClick={() => generateSection(selectedNode.id)}
                    className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Viết phần này ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

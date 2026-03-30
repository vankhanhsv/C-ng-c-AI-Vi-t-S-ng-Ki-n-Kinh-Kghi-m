
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS } from '../constants';
import { aiService } from '../services/aiService';
import { DETAILED_OUTLINE } from '../constants/templates';
import { parseTemplateToTree } from '../utils/outlineParser';
import { OutlineNode } from '../types';

export const OutlineReviewScreen: React.FC = () => {
  const { state, setStatus, setOutline, updateOutlineNode, addOutlineNode, deleteOutlineNode, setErrorMessage } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  
  // State cho việc thêm mục mới
  const [addingUnderParentId, setAddingUnderParentId] = useState<string | "ROOT" | null>(null);
  const [newNodeTitle, setNewNodeTitle] = useState("");

  const handleRegenerate = async () => {
    if (!confirm("Tạo lại dàn ý sẽ xóa các thay đổi bạn đã sửa. Bạn có chắc chắn?")) return;
    setErrorMessage(null);
    try {
      const template = state.selectedTemplate;
      const outlineText = template ? template.outlineText : DETAILED_OUTLINE;
      const outline = parseTemplateToTree(outlineText, state.targetWordCount);
      setOutline(outline);
    } catch (err) {
      setErrorMessage("Không thể tạo lại dàn ý.");
    }
  };

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setTempTitle(currentTitle);
    setAddingUnderParentId(null); // Đóng form thêm nếu đang mở
  };

  const saveEdit = (id: string) => {
    if (!tempTitle.trim()) {
      setErrorMessage("Tiêu đề không được để trống.");
      return;
    }
    updateOutlineNode(id, { title: tempTitle.trim() });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này và toàn bộ các mục con của nó không?")) {
      deleteOutlineNode(id);
    }
  };

  const handleAddNode = (parentId: string | null) => {
    if (!newNodeTitle.trim()) {
      setErrorMessage("Vui lòng nhập tiêu đề mục mới.");
      return;
    }
    addOutlineNode(parentId, newNodeTitle.trim());
    setNewNodeTitle("");
    setAddingUnderParentId(null);
  };

  const renderAddForm = (parentId: string | null) => (
    <div className={`flex items-center gap-2 p-1 pl-3 bg-white border border-indigo-200 ring-2 ring-indigo-50 rounded-xl animate-in slide-in-from-left-2 duration-300`}>
      <input
        autoFocus
        type="text"
        value={newNodeTitle}
        onChange={(e) => setNewNodeTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAddNode(parentId);
          if (e.key === 'Escape') setAddingUnderParentId(null);
        }}
        placeholder="Nhập tiêu đề mục mới..."
        className="flex-grow bg-transparent outline-none text-slate-800 font-semibold text-sm py-2"
      />
      <div className="flex items-center gap-1 pr-1">
        <button 
          onClick={() => handleAddNode(parentId)}
          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Thêm mục"
        >
          <ICONS.Check />
        </button>
        <button 
          onClick={() => setAddingUnderParentId(null)}
          className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
          title="Hủy"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  );

  const renderOutlineTree = (nodes: OutlineNode[], level = 0) => {
    return (
      <>
        {nodes.map((node, index) => (
          <div key={node.id} className={`space-y-2 ${level > 0 ? 'ml-8 mt-2' : 'mb-4'}`}>
            <div className="flex items-center gap-3 group">
              {/* Numbering/Index Indicator */}
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm border transition-all ${level === 0 ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-500 border-slate-200'}`}>
                {level === 0 ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][index] : index + 1}
              </span>

              {/* Title or Editable Field */}
              <div className={`flex-grow flex items-center gap-2 p-1 pl-3 bg-white border rounded-xl transition-all ${editingId === node.id ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-sm' : 'border-slate-200 hover:border-indigo-200'}`}>
                {editingId === node.id ? (
                  <>
                    <input
                      autoFocus
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(node.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="flex-grow bg-transparent outline-none text-slate-800 font-semibold text-sm py-2"
                    />
                    <div className="flex items-center gap-1 pr-1">
                      <button 
                        onClick={() => saveEdit(node.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Lưu"
                      >
                        <ICONS.Check />
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Hủy"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex-grow text-slate-800 font-semibold text-sm py-2">
                      {node.title}
                    </span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setAddingUnderParentId(node.id);
                          setNewNodeTitle("");
                          setEditingId(null);
                        }}
                        className="p-2 text-slate-300 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Thêm mục con"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <button 
                        onClick={() => startEditing(node.id, node.title)}
                        className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Sửa tiêu đề"
                      >
                        <ICONS.Pen />
                      </button>
                      <button 
                        onClick={() => handleDelete(node.id)}
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Xóa mục này"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Recursive Children Rendering */}
            {((node.children && node.children.length > 0) || addingUnderParentId === node.id) && (
              <div className="border-l-2 border-slate-100 ml-4 pl-4 space-y-2">
                 {node.children && renderOutlineTree(node.children, level + 1)}
                 {addingUnderParentId === node.id && renderAddForm(node.id)}
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </span>
            Kiểm tra dàn ý
          </h2>
          <p className="text-slate-500 mt-1">Bạn có thể sửa tiêu đề, thêm mục mới hoặc thay đổi cấu trúc dàn ý.</p>
        </div>
        <button 
          onClick={handleRegenerate}
          className="group flex flex-col items-center gap-1 p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
          title="Tạo lại dàn ý ban đầu"
        >
          <svg className="group-hover:rotate-180 transition-transform duration-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Làm mới</span>
        </button>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 min-h-[400px]">
        <div className="py-2 space-y-4">
           {renderOutlineTree(state.outline)}
           
           {/* Nút thêm mục lớn ở cuối Root */}
           {addingUnderParentId === "ROOT" ? (
             <div className="mt-4">
               {renderAddForm(null)}
             </div>
           ) : (
             <button 
               onClick={() => {
                 setAddingUnderParentId("ROOT");
                 setNewNodeTitle("");
                 setEditingId(null);
               }}
               className="w-full mt-4 py-3 border-2 border-dashed border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm group"
             >
               <span className="p-1 bg-white border border-slate-100 rounded-lg group-hover:border-indigo-200 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
               </span>
               Thêm mục lớn (Cấp I, II, III...)
             </button>
           )}
        </div>
        
        {state.outline.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <ICONS.Loader />
             <p className="mt-4 font-medium italic">Đang tải dàn ý...</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 no-print">
        <button 
          onClick={() => setStatus("GATHERING_INFO")}
          className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Quay lại thông tin
        </button>
        <button 
          onClick={() => setStatus("GENERATING_CONTENT")}
          className="flex-[2] py-4 px-12 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          Bắt đầu soạn thảo <ICONS.ArrowRight />
        </button>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
        <div className="text-amber-600 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p className="text-amber-800 text-sm leading-relaxed">
          <span className="font-bold">Hướng dẫn:</span> Bạn có thể <span className="text-indigo-600 font-bold">sửa tiêu đề</span> bằng biểu tượng chiếc bút, <span className="text-red-600 font-bold">xóa mục</span> không cần thiết bằng biểu tượng thùng rác, hoặc <span className="text-green-600 font-bold">thêm mục mới</span> bằng biểu tượng dấu cộng (+) xuất hiện khi di chuột qua các mục.
        </p>
      </div>
    </div>
  );
};

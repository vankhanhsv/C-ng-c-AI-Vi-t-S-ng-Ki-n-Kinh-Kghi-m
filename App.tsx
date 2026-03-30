
import React from 'react';
import { ICONS, APP_TITLE, APP_SUBTITLE, APP_AUTHOR } from './constants';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { InfoFormScreen } from './components/InfoFormScreen';
import { TopicSuggestionScreen } from './components/TopicSuggestionScreen';
import { OutlineReviewScreen } from './components/OutlineReviewScreen';
import { WorkspaceScreen } from './components/WorkspaceScreen';
import { exportToWord } from './utils/exportService';

/**
 * Main Content Router
 * Switches views based on the application status stored in global context.
 */
const MainRouter: React.FC = () => {
  const { state } = useAppContext();

  switch (state.status) {
    case "GATHERING_INFO":
      return <InfoFormScreen />;
    case "GENERATING_TOPIC":
      return <TopicSuggestionScreen />;
    case "REVIEWING_OUTLINE":
    case "GENERATING_OUTLINE":
      return <OutlineReviewScreen />;
    case "GENERATING_CONTENT":
    case "COMPLETED":
      return <WorkspaceScreen />;
    default:
      return <InfoFormScreen />;
  }
};

const SKKNApp: React.FC = () => {
  const { 
    state, 
    setStatus, 
    setErrorMessage
  } = useAppContext();

  const handleExport = () => {
    if (state.outline.length === 0) {
      setErrorMessage("Chưa có nội dung để tải xuống.");
      return;
    }
    // Sử dụng exportToWord chuyên nghiệp đã được định nghĩa trong exportService.ts
    exportToWord(state.outline, state.topic, state.userInfo);
  };

  // Nút tải xuống hiển thị khi ở màn hình soạn thảo hoặc đã hoàn tất
  const showDownloadBtn = state.status === "COMPLETED" || state.status === "GENERATING_CONTENT";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => {
              if (confirm("Quay lại màn hình chính sẽ xóa tiến trình hiện tại. Bạn có chắc chắn?")) {
                window.location.reload();
              }
            }}
          >
            <img 
              src="https://yt3.googleusercontent.com/yTvPnt3EB5SSM279ukBxEeNlaf6_tCsOUljpHjfnlyks0HqMyHTNwv-vlddX9BifKLyFs7u_hw=s160-c-k-c0x00ffffff-no-rj"
              alt="Logo"
              className="w-10 h-10 rounded-xl shadow-lg shadow-indigo-100 group-hover:scale-105 transition-all duration-300"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">{APP_TITLE}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 hidden sm:block tracking-[0.2em]">{APP_SUBTITLE}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {showDownloadBtn && (
              <button 
                onClick={handleExport}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center gap-2 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Tải xuống .DOCX
              </button>
            )}
            
            {/* Status Indicator Dots */}
            <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-full border border-slate-100 shadow-inner">
               <div title="Thông tin" className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${state.status === 'GATHERING_INFO' || state.status === 'GENERATING_TOPIC' ? 'bg-indigo-600 ring-4 ring-indigo-100 scale-125' : 'bg-slate-300'}`}></div>
               <div title="Dàn ý" className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${state.status === 'REVIEWING_OUTLINE' || state.status === 'GENERATING_OUTLINE' ? 'bg-indigo-600 ring-4 ring-indigo-100 scale-125' : 'bg-slate-300'}`}></div>
               <div title="Soạn thảo" className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${state.status === 'GENERATING_CONTENT' ? 'bg-indigo-600 ring-4 ring-indigo-100 scale-125' : 'bg-slate-300'}`}></div>
               <div title="Hoàn tất" className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${state.status === 'COMPLETED' ? 'bg-green-500 ring-4 ring-green-100 scale-125' : 'bg-slate-300'}`}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {state.errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center justify-between shadow-sm animate-in slide-in-from-top-4 duration-300 no-print">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
               </div>
               <div>
                 <p className="font-bold text-sm">Đã xảy ra lỗi</p>
                 <p className="text-xs opacity-80">{state.errorMessage}</p>
               </div>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="w-10 h-10 flex items-center justify-center text-red-900 hover:bg-red-100 rounded-xl transition-all font-bold"
            >
              &times;
            </button>
          </div>
        )}

        <MainRouter />
      </main>

      {/* Footer Info */}
      <footer className="mt-20 border-t border-slate-200 py-12 bg-white no-print">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 opacity-80">
              <img 
                src="https://yt3.googleusercontent.com/yTvPnt3EB5SSM279ukBxEeNlaf6_tCsOUljpHjfnlyks0HqMyHTNwv-vlddX9BifKLyFs7u_hw=s160-c-k-c0x00ffffff-no-rj"
                alt="Logo"
                className="w-6 h-6 rounded-md grayscale opacity-70"
              />
              <span className="font-bold text-lg tracking-tight">{APP_TITLE}</span>
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
              © {new Date().getFullYear()} • bởi {APP_AUTHOR} (Trường TH Tân Công Chí 1)
            </p>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Hướng dẫn sử dụng</a>
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Phản hồi</a>
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Hỗ trợ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <SKKNApp />
  </AppProvider>
);

export default App;

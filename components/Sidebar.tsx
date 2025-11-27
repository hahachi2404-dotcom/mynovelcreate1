import React from 'react';
import { Chapter } from '../types';
import { FileText, CheckCircle, Circle, ChevronRight } from 'lucide-react';

interface SidebarProps {
  chapters: Chapter[];
  currentChapterId: string | null;
  onSelectChapter: (id: string) => void;
  title: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ chapters, currentChapterId, onSelectChapter, title }) => {
  return (
    <div className="w-80 bg-slate-50 border-r border-slate-200 h-full flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 font-serif leading-tight">{title || '未命名小说'}</h1>
        <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide font-semibold">目录</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            onClick={() => onSelectChapter(chapter.id)}
            className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors duration-200 group
              ${currentChapterId === chapter.id 
                ? 'bg-white shadow-md border border-indigo-100 ring-1 ring-indigo-50' 
                : 'hover:bg-slate-100 border border-transparent'
              }`}
          >
            <div className="mt-1 flex-shrink-0">
              {chapter.isGenerated ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : chapter.isGenerating ? (
                 <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
              ) : (
                <Circle className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold uppercase mb-0.5 ${currentChapterId === chapter.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                第 {index + 1} 章
              </p>
              <h3 className={`text-sm font-medium truncate ${currentChapterId === chapter.id ? 'text-slate-900' : 'text-slate-700'}`}>
                {chapter.title}
              </h3>
            </div>
            {currentChapterId === chapter.id && (
              <ChevronRight className="w-4 h-4 text-indigo-400 mt-2" />
            )}
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-400 text-center">
        由 Gemini 3 生成
      </div>
    </div>
  );
};
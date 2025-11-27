import React, { useRef, useEffect } from 'react';
import { Chapter } from '../types';
import { Button } from './Button';
import { PenTool, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReaderProps {
  chapter: Chapter | undefined;
  onGenerate: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ chapter, onGenerate }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom while generating
  useEffect(() => {
    if (chapter?.isGenerating) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chapter?.content, chapter?.isGenerating]);

  if (!chapter) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-slate-400">
        <p>选择一个章节开始</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white flex flex-col relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-8 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">{chapter.title}</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl truncate">{chapter.summary}</p>
        </div>
        <div className="flex gap-2">
            {!chapter.isGenerated && !chapter.isGenerating && (
                 <Button onClick={onGenerate} size="sm">
                    <PenTool className="w-4 h-4 mr-2" />
                    写作本章
                 </Button>
            )}
             {chapter.isGenerated && (
                <Button variant="secondary" onClick={() => {
                    // Simple download feature
                    const blob = new Blob([chapter.content], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${chapter.title}.md`;
                    a.click();
                }}>
                    <Download className="w-4 h-4 mr-2" />
                    导出
                </Button>
            )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-8 py-8 md:px-16 lg:px-24 max-w-5xl mx-auto w-full">
        {!chapter.content && !chapter.isGenerating ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
             <div className="bg-slate-50 p-6 rounded-full mb-4">
                <PenTool className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-slate-500 max-w-sm mb-6">
               本章内容为空。点击上方按钮，根据大纲自动生成内容。
             </p>
             <Button onClick={onGenerate}>开始写作</Button>
          </div>
        ) : (
          <article className="prose prose-lg prose-slate prose-p:font-serif prose-headings:font-sans mx-auto pb-20">
             <ReactMarkdown>{chapter.content}</ReactMarkdown>
             {chapter.isGenerating && (
                <div className="animate-pulse mt-4 flex space-x-2">
                    <div className="h-2 w-2 bg-indigo-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-indigo-400 rounded-full animation-delay-200"></div>
                    <div className="h-2 w-2 bg-indigo-400 rounded-full animation-delay-400"></div>
                </div>
             )}
             <div ref={bottomRef} />
          </article>
        )}
      </div>
    </div>
  );
};
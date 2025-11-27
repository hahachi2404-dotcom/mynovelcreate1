import React, { useState, useCallback } from 'react';
import { SetupWizard } from './components/SetupWizard';
import { Sidebar } from './components/Sidebar';
import { Reader } from './components/Reader';
import { NovelConfig, Chapter, ViewState } from './types';
import { generateNovelOutline, generateChapterContentStream } from './services/geminiService';
import { GenerateContentResponse } from '@google/genai';

function App() {
  const [viewState, setViewState] = useState<ViewState>('setup');
  const [config, setConfig] = useState<NovelConfig | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

  // Handle generating the initial outline
  const handleGenerateOutline = async (novelConfig: NovelConfig) => {
    setIsGeneratingOutline(true);
    try {
      const outline = await generateNovelOutline(novelConfig);
      
      const newChapters: Chapter[] = outline.map((item, index) => ({
        id: `chap-${index}`,
        title: item.title,
        summary: item.summary,
        content: '',
        isGenerated: false,
        isGenerating: false
      }));

      setConfig(novelConfig);
      setChapters(newChapters);
      if (newChapters.length > 0) {
        setCurrentChapterId(newChapters[0].id);
      }
      setViewState('writing');
    } catch (error) {
      alert("生成大纲失败，请重试。");
      console.error(error);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Handle generating text for a specific chapter
  const handleGenerateChapter = useCallback(async () => {
    if (!currentChapterId || !config) return;

    const chapterIndex = chapters.findIndex(c => c.id === currentChapterId);
    if (chapterIndex === -1) return;

    const chapter = chapters[chapterIndex];
    if (chapter.isGenerating || chapter.isGenerated) return; // Prevent double generation

    // Update state to generating
    setChapters(prev => prev.map(c => 
      c.id === currentChapterId ? { ...c, isGenerating: true, content: '' } : c
    ));

    try {
      // Get brief context from previous chapter if available
      let previousContext = undefined;
      if (chapterIndex > 0) {
        const prevChap = chapters[chapterIndex - 1];
        if (prevChap.content) {
            // Take the last 500 chars as context roughly
            previousContext = prevChap.content.slice(-1000);
        }
      }

      const stream = await generateChapterContentStream(
        chapter.title,
        chapter.summary,
        config,
        previousContext
      );

      let accumulatedText = '';

      for await (const chunk of stream) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          accumulatedText += chunkText;
          setChapters(prev => prev.map(c => 
            c.id === currentChapterId ? { ...c, content: accumulatedText } : c
          ));
        }
      }

      // Mark as done
      setChapters(prev => prev.map(c => 
        c.id === currentChapterId ? { ...c, isGenerating: false, isGenerated: true } : c
      ));

    } catch (error) {
      console.error("Error generating chapter:", error);
      alert("生成章节内容失败。");
      setChapters(prev => prev.map(c => 
        c.id === currentChapterId ? { ...c, isGenerating: false } : c
      ));
    }
  }, [currentChapterId, config, chapters]);

  // Main Render
  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col md:flex-row overflow-hidden">
      {viewState === 'setup' ? (
        <div className="w-full h-full overflow-y-auto">
          <SetupWizard 
            onGenerateOutline={handleGenerateOutline} 
            isGenerating={isGeneratingOutline} 
          />
        </div>
      ) : (
        <>
          <Sidebar 
            chapters={chapters} 
            currentChapterId={currentChapterId} 
            onSelectChapter={setCurrentChapterId}
            title={config?.title || ''}
          />
          <Reader 
            chapter={chapters.find(c => c.id === currentChapterId)}
            onGenerate={handleGenerateChapter}
          />
        </>
      )}
    </div>
  );
}

export default App;
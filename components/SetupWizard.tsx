import React, { useState } from 'react';
import { NovelConfig } from '../types';
import { Button } from './Button';
import { BookOpen, Sparkles, PenTool } from 'lucide-react';

interface SetupWizardProps {
  onGenerateOutline: (config: NovelConfig) => void;
  isGenerating: boolean;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onGenerateOutline, isGenerating }) => {
  const [config, setConfig] = useState<NovelConfig>({
    title: '',
    genre: '奇幻',
    style: '细腻且沉浸',
    keywords: '',
    targetAudience: '青少年'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateOutline(config);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          InkWeaver AI
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          基于 Gemini 3 引擎。描述你的构思，我们为你创作章节。
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">小说标题 (或暂定名)</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="例如：最后的星际飞船"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">类型</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={config.genre}
                onChange={(e) => setConfig({ ...config, genre: e.target.value })}
              >
                <option>奇幻</option>
                <option>科幻</option>
                <option>武侠 / 仙侠</option>
                <option>悬疑 / 惊悚</option>
                <option>言情 / 浪漫</option>
                <option>历史小说</option>
                <option>恐怖</option>
                <option>文学小说</option>
                <option>赛博朋克</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">目标读者</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={config.targetAudience}
                onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
              >
                <option>青少年</option>
                <option>成人</option>
                <option>中年级</option>
                <option>儿童</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">写作风格</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="例如：快节奏，黑暗写实，天马行空"
              value={config.style}
              onChange={(e) => setConfig({ ...config, style: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              关键词与剧情构思
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="输入关键元素、角色或场景细节... (例如：一个能看见鬼魂的侦探，背景设定在1920年代的上海，雨夜，爵士乐)"
              value={config.keywords}
              onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg" 
              isLoading={isGenerating}
            >
              {isGenerating ? '正在构思大纲...' : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  生成小说大纲
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
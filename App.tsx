
import React, { useState } from 'react';
import { REVIEW_ELEMENTS, OUTLOOK_ELEMENTS } from './constants.tsx';
import { EraType, GeneratedImage } from './types';
import { generateVisionaryImage } from './services/geminiService';

export default function App() {
  const [images, setImages] = useState<{ [key in EraType]?: GeneratedImage }>({});
  const [loading, setLoading] = useState<{ [key in EraType]?: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [useHighQuality, setUseHighQuality] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState<{ show: boolean, era?: EraType }>({ show: false });

  const handleKeySelection = async (era: EraType) => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setShowKeyModal({ show: false });
      startGeneration(era);
    } catch (err) {
      console.error("Failed to open key selector", err);
    }
  };

  const checkAndGenerate = async (era: EraType) => {
    if (useHighQuality) {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setShowKeyModal({ show: true, era });
        return;
      }
    }
    startGeneration(era);
  };

  const startGeneration = async (era: EraType) => {
    setLoading(prev => ({ ...prev, [era]: true }));
    setError(null);

    const elements = era === EraType.REVIEW ? REVIEW_ELEMENTS : OUTLOOK_ELEMENTS;
    const techString = elements.map(e => e.label).join(', ');
    
    const basePrompt = era === EraType.REVIEW 
      ? `A high-tech cinematic landscape reflecting the digital evolution of the past decade, featuring metaphors for: ${techString}. Cyberpunk blueprint style, neon teal and deep blue tones, 4K resolution.`
      : `A breathtaking futuristic vision of the next technological frontier, featuring: ${techString}. Solarpunk-tech fusion, sleek gold and white robotics, ethereal intelligence, 8K ultra-realistic cinematic art.`;

    try {
      const imageUrl = await generateVisionaryImage(basePrompt, "16:9", useHighQuality);
      setImages(prev => ({
        ...prev,
        [era]: { url: imageUrl, prompt: basePrompt, timestamp: Date.now() }
      }));
    } catch (err: any) {
      if (err.message === "API_KEY_RESET_REQUIRED") {
        setShowKeyModal({ show: true, era });
      } else {
        setError(`${era}: ${err.message || "生成失败"}`);
      }
    } finally {
      setLoading(prev => ({ ...prev, [era]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl shadow-blue-500/20">V</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none">TECH <span className="text-blue-500">HORIZON</span></h1>
              <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase mt-1">AI Powered Vision Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-900/50 px-5 py-2.5 rounded-2xl border border-white/5">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={useHighQuality} 
                onChange={(e) => setUseHighQuality(e.target.checked)}
                className="w-5 h-5 rounded-lg border-slate-700 bg-slate-950 text-blue-600 focus:ring-offset-slate-950"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">PRO MODE</span>
                <span className="text-[10px] text-slate-500">Gemini 3 Pro Image</span>
              </div>
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 lg:p-12">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center animate-bounce">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* 回顾板块 */}
          <EraCard 
            title="回顾：数字化沉淀"
            subtitle="The Era of Connectivity (2014-2024)"
            elements={REVIEW_ELEMENTS}
            era={EraType.REVIEW}
            image={images[EraType.REVIEW]}
            isLoading={loading[EraType.REVIEW]}
            onGenerate={() => checkAndGenerate(EraType.REVIEW)}
            accentColor="blue"
          />

          {/* 展望板块 */}
          <EraCard 
            title="展望：智能新纪元"
            subtitle="The Frontier of Intelligence (2025+)"
            elements={OUTLOOK_ELEMENTS}
            era={EraType.OUTLOOK}
            image={images[EraType.OUTLOOK]}
            isLoading={loading[EraType.OUTLOOK]}
            onGenerate={() => checkAndGenerate(EraType.OUTLOOK)}
            accentColor="indigo"
          />
        </div>
      </main>

      {/* 弹窗 */}
      {showKeyModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <div className="bg-slate-900 max-w-md w-full p-8 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl mb-6">🔑</div>
            <h2 className="text-2xl font-bold mb-3">需要高阶 API 密钥</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              您当前开启了 <strong>PRO 模式</strong>。生成高质量图像需要连接您的付费 Google Cloud 项目密钥。
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => handleKeySelection(showKeyModal.era!)}
                className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all"
              >
                选择密钥
              </button>
              <button 
                onClick={() => { setShowKeyModal({ show: false }); setUseHighQuality(false); }}
                className="w-full py-4 text-slate-500 hover:text-white font-medium"
              >
                改用标准模式
              </button>
            </div>
            <p className="mt-6 text-[10px] text-center text-slate-600">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">了解计费规则</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function EraCard({ title, subtitle, elements, era, image, isLoading, onGenerate, accentColor }: any) {
  const isBlue = accentColor === 'blue';
  
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-2 ${isBlue ? 'bg-blue-500/10 text-blue-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
          {isBlue ? 'Past Evolution' : 'Future Vision'}
        </div>
        <h2 className="text-4xl font-black mb-2">{title}</h2>
        <p className="text-slate-500 font-medium">{subtitle}</p>
      </div>

      <div className={`flex-1 flex flex-col bg-slate-900/30 rounded-[2.5rem] border border-white/5 overflow-hidden p-8 transition-all hover:border-white/10 ${isLoading ? 'ring-2 ring-blue-500/20' : ''}`}>
        <div className="flex flex-wrap gap-2 mb-8">
          {elements.map((el: any, i: number) => (
            <span key={i} className="px-4 py-2 bg-white/5 rounded-xl text-sm font-semibold border border-white/5 flex items-center gap-2 hover:bg-white/10 transition-colors">
              <span className="opacity-70">{el.icon}</span>
              {el.label}
            </span>
          ))}
        </div>

        <div className="relative flex-1 group min-h-[400px]">
          {image ? (
            <div className="h-full animate-in fade-in zoom-in duration-1000">
              <img 
                src={image.url} 
                className="w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10" 
                alt={title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end rounded-3xl">
                <p className="text-xs text-slate-400 mb-4 line-clamp-3 italic">"{image.prompt}"</p>
                <a href={image.url} download={`tech-${era}.png`} className="w-fit bg-white text-black px-6 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">下载图片</a>
              </div>
            </div>
          ) : (
            <div className="w-full h-full rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-12 bg-slate-950/20">
              {isLoading ? (
                <div className="flex flex-col items-center gap-6">
                  <div className={`w-16 h-16 border-4 ${isBlue ? 'border-blue-500' : 'border-indigo-500'} border-t-transparent rounded-full animate-spin shadow-lg`}></div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold animate-pulse">正在构建时空视觉...</p>
                    <p className="text-xs text-slate-500">正在调优光影、构图与技术元素融合</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-6xl mb-6 grayscale opacity-20">🌠</div>
                  <p className="text-slate-500 font-medium max-w-xs">点击下方按钮，将关键词转化为令人惊叹的视觉概念图</p>
                </>
              )}
            </div>
          )}
        </div>

        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className={`mt-8 w-full py-5 rounded-[1.5rem] font-black text-lg tracking-tight transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl ${
            isBlue 
              ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' 
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
          }`}
        >
          {isLoading ? 'GENERATING...' : `GENERATE ${isBlue ? 'RETROSPECTIVE' : 'PROJECTION'}`}
        </button>
      </div>
    </div>
  );
}

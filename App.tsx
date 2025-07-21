import React, { useState, useEffect, useRef } from 'react';
import { NotificationProvider } from './contextx/NotificationContext';
import { useLanguage } from './services/i18n';
import GlassCard from './components/GlassCard';
import LiquidButton from './components/LiquidButton';
import ResearchProgress from './components/ResearchProgress';
import FinalReport from './components/FinalReport';
import ThemeSwitcher from './components/ThemeSwitcher';
import ClarificationChat from './components/ClarificationChat';
import ReportVisualizer from './components/ReportVisualizer';
import SettingsModal from './components/SettingsModal';
import HistoryPanel from './components/HistoryPanel';
import { useAppLogic } from './hooks/useAppLogic';
import { ResearchMode } from './types';

const App: React.FC = () => {
    return (
        <NotificationProvider>
            <AppContent />
        </NotificationProvider>
    )
}

const AppContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { t, toggleLanguage } = useLanguage();
  const finalReportRef = useRef<HTMLDivElement>(null);
  
  const {
      query, setQuery, guidedQuery, setGuidedQuery, selectedFile, researchUpdates, finalData, mode, setMode, appState,
      clarificationHistory, clarificationLoading, startClarificationProcess, handleAnswerSubmit,
      handleStopResearch, handleFileChange, handleRemoveFile, handleReset, fileInputRef,
      isVisualizing, visualizedReportHtml, handleVisualizeReport, handleCloseVisualizer, handleSkipClarification,
      isRegenerating, handleRegenerateReport, handleReportRewrite,
      isSettingsOpen, setIsSettingsOpen,
      isVisualizerOpen, handleVisualizerFeedback,
      handleContinueResearch,
      handleGenerateReportFromPause,
      history, loadFromHistory, deleteHistoryItem, clearHistory,
      translationState,
      handleTranslateReport,
      handleToggleLanguage,
      handleClearTranslation
  } = useAppLogic();

  const [isLogVisible, setIsLogVisible] = useState<boolean>(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isGuidedSearchOpen, setIsGuidedSearchOpen] = useState(false);
  
  const modes = [
    { id: 'Balanced' as ResearchMode, label: 'Balanced' },
    { id: 'DeepDive' as ResearchMode, label: 'DeepDive' },
    { id: 'Fast' as ResearchMode, label: 'Fast' },
    { id: 'UltraFast' as ResearchMode, label: 'UltraFast' }
  ];
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (appState === 'complete' && finalData && finalReportRef.current) {
        setTimeout(() => {
            finalReportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [appState, finalData]);

  const handleStart = () => {
    startClarificationProcess(guidedQuery);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStart();
    }
  };
  
  const handleLoadFromHistory = (id: string) => {
    loadFromHistory(id);
    setIsHistoryOpen(false);
  }


  const handleVisualizationRequest = (reportMarkdown: string) => {
    handleVisualizeReport(reportMarkdown, false);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      
      <div className="w-full max-w-4xl flex flex-col gap-4">
        {/* Toolbar: No longer absolute, part of the layout flow */}
        <div className="flex justify-end items-center gap-4">
          <button 
            onClick={toggleLanguage} 
            className="px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            title="Switch Language"
          >
            {t('languageSwitch')}
          </button>
          <button onClick={() => setIsHistoryOpen(true)} className="p-2 rounded-full cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title={t('history')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="sr-only">{t('history')}</span>
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title={t('settings')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="sr-only">{t('settings')}</span>
          </button>
          <a href="https://github.com/KuekHaoYang/KResearch" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title="View on GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span className="sr-only">{t('githubLink')}</span>
          </a>
          <ThemeSwitcher isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        </div>

        <GlassCard className="p-6 sm:p-8 flex flex-col gap-6">
          <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t('appTitle')}</h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">{t('modeDescriptions.balanced')}</p>
          </header>

          {appState === 'idle' && (
            <div className="animate-fade-in space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {modes.map((m) => {
                  // Map mode IDs to i18n keys
                  const modeKeyMap: Record<string, string> = {
                    'Balanced': 'balanced',
                    'DeepDive': 'deepDive',
                    'Fast': 'fast',
                    'UltraFast': 'ultraFast'
                  };
                  const modeKey = modeKeyMap[m.id] || m.id.toLowerCase();
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`p-3 rounded-2xl text-sm font-semibold transition-all duration-300 text-center border ${mode === m.id ? 'bg-glow-light/20 dark:bg-glow-dark/30 text-gray-900 dark:text-white shadow-md border-glow-light dark:border-glow-dark' : 'bg-glass-light/50 dark:bg-glass-dark/50 text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 border-border-light dark:border-border-dark'}`}
                      title={t('modeDescriptions.' + modeKey)}
                    >
                      {t('researchModes.' + modeKey)}
                    </button>
                  );
                })}
              </div>
              <div className="relative">
                <textarea value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder={t('researchQuery')} className="w-full h-32 p-4 pr-12 rounded-2xl resize-none bg-white/40 dark:bg-black/20 border border-transparent focus:border-glow-light dark:focus:border-glow-dark focus:ring-2 focus:ring-glow-light/50 dark:focus:ring-glow-dark/50 focus:outline-none transition-all duration-300" disabled={appState !== 'idle'}/>
                <div className="absolute inset-y-0 right-0 flex items-end p-3">
                    <input type="file" id="file-upload" ref={fileInputRef} className="hidden" onChange={handleFileChange} disabled={appState !== 'idle'} />
                    <label htmlFor="file-upload" className="p-2 rounded-full cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title={t('attachFiles')}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg><span className="sr-only">{t('attachFiles')}</span></label>
                </div>
              </div>
              <div className="rounded-2xl bg-white/40 dark:bg-black/20 border border-transparent focus-within:border-glow-light dark:focus-within:border-glow-dark focus-within:ring-2 focus-within:ring-glow-light/50 dark:focus-within:ring-glow-dark/50 transition-all duration-300">
                  <button onClick={() => setIsGuidedSearchOpen(prev => !prev)} className={`flex items-center justify-between w-full text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium ${isGuidedSearchOpen ? 'pb-2' : ''}`} aria-expanded={isGuidedSearchOpen} aria-controls="guided-search-panel">
                      <span>{`${t('search')}: ${t('methodology')}`}</span>
                      <svg className={`w-5 h-5 transition-transform duration-300 ${isGuidedSearchOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div id="guided-search-panel" className={`transition-all duration-500 ease-in-out overflow-hidden ${isGuidedSearchOpen ? 'max-h-40' : 'max-h-0'}`}>
                      <textarea
                          value={guidedQuery}
                          onChange={(e) => setGuidedQuery(e.target.value)}
                          placeholder={`${t('search')}: ${t('keyFindings')}... (one per line)`}
                          className="w-full h-24 px-4 pb-4 bg-transparent resize-none focus:outline-none transition-all duration-300 placeholder:text-gray-500/80 dark:placeholder:text-gray-500/80"
                          disabled={appState !== 'idle'}
                      />
                  </div>
              </div>
              {selectedFile && <div className="flex items-center justify-between px-3 py-2 text-sm rounded-2xl bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/20"><span className="truncate text-gray-700 dark:text-gray-300" title={selectedFile.name}>{selectedFile.name}</span><button onClick={handleRemoveFile} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Remove file"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg><span className="sr-only">Remove file</span></button></div>}
              <LiquidButton onClick={handleStart} disabled={appState !== 'idle' || !query.trim()} className="w-full">{t('startResearch')}</LiquidButton>
            </div>
          )}
          
          {appState === 'clarifying' && (<ClarificationChat history={clarificationHistory} onAnswerSubmit={handleAnswerSubmit} onSkip={handleSkipClarification} isLoading={clarificationLoading}/>)}
          
          {appState === 'researching' && (<LiquidButton onClick={handleStopResearch} className="w-full bg-red-500/30 hover:bg-red-500/40 border-red-500/50">{t('stop')}</LiquidButton>)}
          
          {appState === 'paused' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                <LiquidButton onClick={handleContinueResearch} className="w-full">{t('resume')}</LiquidButton>
                <LiquidButton onClick={handleGenerateReportFromPause} className="w-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:shadow-none hover:-translate-y-0 active:translate-y-px">{t('researchReport')}</LiquidButton>
            </div>
          )}

          {(appState === 'researching' || appState === 'paused' || (appState === 'complete' && researchUpdates.length > 0)) && (
            <div className="animate-fade-in space-y-4">
              {appState === 'complete' && (<button onClick={() => setIsLogVisible(!isLogVisible)} className="flex items-center justify-between w-full text-left font-semibold text-lg p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5"><span>{isLogVisible ? t('close') : t('viewReport')} {t('researchProgress')}</span><svg className={`w-5 h-5 transition-transform ${isLogVisible ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>)}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isLogVisible ? 'max-h-[30rem]' : 'max-h-0'}`}>
                  <ResearchProgress updates={researchUpdates} isResearching={appState === 'researching'} />
              </div>
            </div>
          )}
          
          {appState === 'complete' && finalData && (
              <div ref={finalReportRef} className="animate-fade-in space-y-6 border-t border-border-light dark:border-border-dark pt-6 mt-6">
                   <FinalReport 
                      data={finalData} 
                      onVisualize={handleVisualizationRequest}
                      isVisualizing={isVisualizing}
                      onRegenerate={handleRegenerateReport}
                      isRegenerating={isRegenerating}
                      onRewrite={handleReportRewrite}
                      translatedReport={translationState.translatedReports.get(finalData.citations?.length.toString() || 'report')}
                      onTranslate={() => handleTranslateReport(finalData.citations?.length.toString() || 'report', finalData.report)}
                      isTranslating={translationState.isTranslating}
                      showOriginalText={translationState.currentLanguage === 'en'}
                      onToggleOriginal={handleToggleLanguage}
                   />
                   <LiquidButton onClick={handleReset} className="w-full mt-4">{t('startResearch')}</LiquidButton>
              </div>
          )}
        </GlassCard>
      </div>
      
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoad={handleLoadFromHistory}
        onDelete={deleteHistoryItem}
        onClear={clearHistory}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} currentMode={mode} />

      <ReportVisualizer 
        isOpen={isVisualizerOpen}
        isLoading={isVisualizing} 
        htmlContent={visualizedReportHtml} 
        onClose={handleCloseVisualizer} 
        onRegenerate={finalData?.report ? () => handleVisualizeReport(finalData.report, true) : undefined}
        onSubmitFeedback={handleVisualizerFeedback}
      />
      
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} {t('appTitle')}. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;

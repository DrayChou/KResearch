import React from 'react';

// Internationalization service for KResearch
// Supports Chinese and English language switching

export type Language = 'en' | 'zh';

export interface TranslationSet {
  // App header
  appTitle: string;
  languageSwitch: string;
  githubLink: string;
  settings: string;

  // Main interface
  researchQuery: string;
  researchModes: {
    balanced: string;
    deepDive: string;
    fast: string;
    ultraFast: string;
  };
  modeDescriptions: {
    balanced: string;
    deepDive: string;
    fast: string;
    ultraFast: string;
  };
  startResearch: string;
  attachFiles: string;
  maxFileSize: string;

  // Clarification phase
  clarifying: string;
  aiClarifying: string;
  clarificationQuestion: string;
  yourResponse: string;
  submitResponse: string;
  skipClarification: string;
  proceedToResearch: string;

  // Research phase
  researching: string;
  aiResearching: string;
  researchProgress: string;
  cycle: string;
  pause: string;
  resume: string;
  stop: string;
  generatingReport: string;

  // Report display
  researchReport: string;
  viewReport: string;
  regenerateReport: string;
  downloadReport: string;
  citations: string;
  knowledgeGraph: string;
  viewKnowledgeGraph: string;

  // History
  history: string;
  noHistory: string;
  loadSession: string;
  deleteHistory: string;
  confirmDelete: string;

  // Settings
  apiKeys: string;
  geminiApiKey: string;
  openaiApiKey: string;
  modelSettings: string;
  parameters: string;
  temperature: string;
  maxTokens: string;
  saveSettings: string;
  resetSettings: string;

  // Error messages
  error: string;
  apiKeyRequired: string;
  invalidApiKey: string;
  networkError: string;
  fileTooLarge: string;
  invalidFileType: string;
  uploadError: string;

  // Notifications
  success: string;
  settingsSaved: string;
  reportGenerated: string;
  researchCompleted: string;
  researchPaused: string;
  researchStopped: string;

  // Common
  loading: string;
  cancel: string;
  confirm: string;
  close: string;
  yes: string;
  no: string;
  back: string;
  next: string;
  previous: string;
  submit: string;
  clear: string;
  search: string;
  filter: string;
  download: string;
  share: string;
  copy: string;
  copied: string;
  retry: string;
  edit: string;
  delete: string;
  save: string;
  update: string;

  // Visualizer
  visualReport: string;
  interactiveGraph: string;
  feedback: string;
  provideFeedback: string;
  improvingVisualization: string;

  // Research modes full names
  researchModeNames: {
    balanced: string;
    deepDive: string;
    fast: string;
    ultraFast: string;
  };

  // File upload
  dropFilesHere: string;
  orClickToSelect: string;
  supportedFormats: string;
  uploading: string;
  uploadComplete: string;
  removeFile: string;

  // Report sections
  summary: string;
  keyFindings: string;
  detailedAnalysis: string;
  methodology: string;
  recommendations: string;
  sources: string;
  appendix: string;
}

const translations: Record<Language, TranslationSet> = {
  en: {
    appTitle: 'KResearch',
    languageSwitch: '中文',
    githubLink: 'GitHub',
    settings: 'Settings',

    researchQuery: 'Enter your research query',
    researchModes: {
      balanced: 'Balanced',
      deepDive: 'Deep Dive',
      fast: 'Fast',
      ultraFast: 'Ultra Fast'
    },
    modeDescriptions: {
      balanced: 'Comprehensive research with moderate depth and speed',
      deepDive: 'Thorough research with extensive analysis and citations',
      fast: 'Quick research with essential findings',
      ultraFast: 'Rapid research with key insights only'
    },
    startResearch: 'Start Research',
    attachFiles: 'Attach Files',
    maxFileSize: 'Max 5MB per file',

    clarifying: 'Clarifying',
    aiClarifying: 'AI is clarifying your research needs...',
    clarificationQuestion: 'Clarification Question',
    yourResponse: 'Your Response',
    submitResponse: 'Submit Response',
    skipClarification: 'Skip Clarification',
    proceedToResearch: 'Proceed to Research',

    researching: 'Researching',
    aiResearching: 'AI is conducting research...',
    researchProgress: 'Research Progress',
    cycle: 'Cycle',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    generatingReport: 'Generating Report...',

    researchReport: 'Research Report',
    viewReport: 'View Report',
    regenerateReport: 'Regenerate Report',
    downloadReport: 'Download Report',
    citations: 'Citations',
    knowledgeGraph: 'Knowledge Graph',
    viewKnowledgeGraph: 'View Knowledge Graph',

    history: 'History',
    noHistory: 'No research history yet',
    loadSession: 'Load Session',
    deleteHistory: 'Delete History',
    confirmDelete: 'Are you sure you want to delete this history item?',

    apiKeys: 'API Keys',
    geminiApiKey: 'Google Gemini API Key',
    openaiApiKey: 'OpenAI API Key',
    modelSettings: 'Model Settings',
    parameters: 'Parameters',
    temperature: 'Temperature',
    maxTokens: 'Max Tokens',
    saveSettings: 'Save Settings',
    resetSettings: 'Reset Settings',

    error: 'Error',
    apiKeyRequired: 'API key is required to start research',
    invalidApiKey: 'Invalid API key. Please check your settings.',
    networkError: 'Network error. Please check your connection.',
    fileTooLarge: 'File size exceeds 5MB limit',
    invalidFileType: 'Invalid file type. Please upload supported formats.',
    uploadError: 'Error uploading file',

    success: 'Success',
    settingsSaved: 'Settings saved successfully',
    reportGenerated: 'Report generated successfully',
    researchCompleted: 'Research completed successfully',
    researchPaused: 'Research paused',
    researchStopped: 'Research stopped',

    loading: 'Loading...',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    clear: 'Clear',
    search: 'Search',
    filter: 'Filter',
    download: 'Download',
    share: 'Share',
    copy: 'Copy',
    copied: 'Copied',
    retry: 'Retry',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    update: 'Update',

    visualReport: 'Visual Report',
    interactiveGraph: 'Interactive Knowledge Graph',
    feedback: 'Feedback',
    provideFeedback: 'Provide feedback to improve the visualization',
    improvingVisualization: 'Improving visualization based on your feedback...',

    researchModeNames: {
      balanced: 'Balanced Research',
      deepDive: 'Deep Dive Research',
      fast: 'Fast Research',
      ultraFast: 'Ultra Fast Research'
    },

    dropFilesHere: 'Drop files here',
    orClickToSelect: 'or click to select files',
    supportedFormats: 'Supports: PDF, DOCX, TXT, MD',
    uploading: 'Uploading...',
    uploadComplete: 'Upload complete',
    removeFile: 'Remove file',

    summary: 'Summary',
    keyFindings: 'Key Findings',
    detailedAnalysis: 'Detailed Analysis',
    methodology: 'Methodology',
    recommendations: 'Recommendations',
    sources: 'Sources',
    appendix: 'Appendix'
  },
  zh: {
    appTitle: 'KResearch',
    languageSwitch: 'English',
    githubLink: 'GitHub',
    settings: '设置',

    researchQuery: '输入您的研究问题',
    researchModes: {
      balanced: '平衡模式',
      deepDive: '深度研究',
      fast: '快速模式',
      ultraFast: '极速模式'
    },
    modeDescriptions: {
      balanced: '综合研究，平衡深度和速度',
      deepDive: '深入研究，包含详细分析和引用',
      fast: '快速研究，获取关键发现',
      ultraFast: '极速研究，仅获取核心见解'
    },
    startResearch: '开始研究',
    attachFiles: '附加文件',
    maxFileSize: '单个文件最大5MB',

    clarifying: '澄清阶段',
    aiClarifying: 'AI正在澄清您的研究需求...',
    clarificationQuestion: '澄清问题',
    yourResponse: '您的回答',
    submitResponse: '提交回答',
    skipClarification: '跳过澄清',
    proceedToResearch: '继续研究',

    researching: '研究中',
    aiResearching: 'AI正在进行研究...',
    researchProgress: '研究进度',
    cycle: '周期',
    pause: '暂停',
    resume: '继续',
    stop: '停止',
    generatingReport: '正在生成报告...',

    researchReport: '研究报告',
    viewReport: '查看报告',
    regenerateReport: '重新生成报告',
    downloadReport: '下载报告',
    citations: '引用',
    knowledgeGraph: '知识图谱',
    viewKnowledgeGraph: '查看知识图谱',

    history: '历史记录',
    noHistory: '暂无研究历史',
    loadSession: '加载会话',
    deleteHistory: '删除历史',
    confirmDelete: '确定要删除这条历史记录吗？',

    apiKeys: 'API密钥',
    geminiApiKey: 'Google Gemini API密钥',
    openaiApiKey: 'OpenAI API密钥',
    modelSettings: '模型设置',
    parameters: '参数设置',
    temperature: '温度',
    maxTokens: '最大令牌数',
    saveSettings: '保存设置',
    resetSettings: '重置设置',

    error: '错误',
    apiKeyRequired: '需要API密钥才能开始研究',
    invalidApiKey: 'API密钥无效，请检查您的设置',
    networkError: '网络错误，请检查您的连接',
    fileTooLarge: '文件大小超过5MB限制',
    invalidFileType: '文件类型无效，请上传支持的格式',
    uploadError: '文件上传错误',

    success: '成功',
    settingsSaved: '设置保存成功',
    reportGenerated: '报告生成成功',
    researchCompleted: '研究完成',
    researchPaused: '研究已暂停',
    researchStopped: '研究已停止',

    loading: '加载中...',
    cancel: '取消',
    confirm: '确认',
    close: '关闭',
    yes: '是',
    no: '否',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    submit: '提交',
    clear: '清除',
    search: '搜索',
    filter: '筛选',
    download: '下载',
    share: '分享',
    copy: '复制',
    copied: '已复制',
    retry: '重试',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    update: '更新',

    visualReport: '可视化报告',
    interactiveGraph: '交互式知识图谱',
    feedback: '反馈',
    provideFeedback: '提供反馈以改进可视化',
    improvingVisualization: '根据您的反馈改进可视化...',

    researchModeNames: {
      balanced: '平衡研究',
      deepDive: '深度研究',
      fast: '快速研究',
      ultraFast: '极速研究'
    },

    dropFilesHere: '将文件拖放到此处',
    orClickToSelect: '或点击选择文件',
    supportedFormats: '支持格式：PDF、DOCX、TXT、MD',
    uploading: '上传中...',
    uploadComplete: '上传完成',
    removeFile: '移除文件',

    summary: '摘要',
    keyFindings: '主要发现',
    detailedAnalysis: '详细分析',
    methodology: '方法论',
    recommendations: '建议',
    sources: '来源',
    appendix: '附录'
  }
};

class I18nService {
  private currentLanguage: Language = 'en';
  private listeners: Array<(lang: Language) => void> = [];

  constructor() {
    // Load saved language preference
    const saved = localStorage.getItem('kresearch-language');
    if (saved === 'en' || saved === 'zh') {
      this.currentLanguage = saved as Language;
    }
  }

  get currentLang(): Language {
    return this.currentLanguage;
  }

  // 支持嵌套 key，如 'researchModes.balanced'
  t(key: string, ...args: any[]): string {
    const keys = key.split('.');
    let translation: any = translations[this.currentLanguage];
    for (const k of keys) {
      translation = translation?.[k];
      if (translation === undefined) return key; // fallback
    }
    if (typeof translation === 'string') {
      return this.formatString(translation, ...args);
    }
    return key;
  }

  private formatString(str: string, ...args: any[]): string {
    return str.replace(/\$(\d+)/g, (match, index) => {
      const argIndex = parseInt(index) - 1;
      return args[argIndex] !== undefined ? String(args[argIndex]) : match;
    });
  }

  setLanguage(lang: Language): void {
    if (lang !== this.currentLanguage) {
      this.currentLanguage = lang;
      localStorage.setItem('kresearch-language', lang);
      this.notifyListeners();
    }
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === 'en' ? 'zh' : 'en';
    this.setLanguage(newLang);
  }

  onLanguageChange(callback: (lang: Language) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  getAvailableLanguages(): Array<{ code: Language; name: string }> {
    return [
      { code: 'en', name: 'English' },
      { code: 'zh', name: '中文' }
    ];
  }
}

// Singleton instance
export const i18n = new I18nService();

// Hook for React components
export function useLanguage() {
  const [language, setLanguageState] = React.useState<Language>(i18n.currentLang);

  React.useEffect(() => {
    const unsubscribe = i18n.onLanguageChange((newLang) => {
      setLanguageState(newLang);
    });

    return unsubscribe;
  }, []);

  const setLanguage = React.useCallback((lang: Language) => {
    i18n.setLanguage(lang);
  }, []);

  const toggleLanguage = React.useCallback(() => {
    i18n.toggleLanguage();
  }, []);

  return {
    language,
    setLanguage,
    toggleLanguage,
    t: i18n.t.bind(i18n)
  };
}

// Default export for direct usage
export default i18n;
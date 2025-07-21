import { UnifiedAIClient } from './aiClientFactory';

export interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage: string;
  preserveFormatting?: boolean;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedLanguage?: string;
}

export interface LanguagePack {
  [key: string]: string;
}

export interface TranslationState {
  currentLanguage: 'en' | 'zh';
  translatedReports: Map<string, string>;
  isTranslating: boolean;
  translationError?: string;
}

export class TranslationService {
  private aiClient: UnifiedAIClient;
  private languagePacks: Map<string, LanguagePack>;

  constructor(aiClient: UnifiedAIClient) {
    this.aiClient = aiClient;
    this.languagePacks = new Map();
    this.initializeLanguagePacks();
  }

  private initializeLanguagePacks() {
    // 英文语言包
    this.languagePacks.set('en', {
      'app.title': 'KResearch - AI Research Assistant',
      'research.modes.balanced': 'Balanced',
      'research.modes.deepdive': 'Deep Dive',
      'research.modes.fast': 'Fast',
      'research.modes.ultrafast': 'Ultra Fast',
      'query.placeholder': 'Enter your research query...',
      'button.startResearch': 'Start Research',
      'button.stopResearch': 'Stop Research',
      'button.pauseResearch': 'Pause Research',
      'button.resumeResearch': 'Resume Research',
      'button.generateReport': 'Generate Report',
      'button.translate': 'Translate',
      'button.original': 'Original',
      'button.translated': 'Chinese',
      'report.header': 'Research Report',
      'report.summary': 'Executive Summary',
      'report.citations': 'Citations',
      'report.toolbox': 'Report Tools',
      'settings.title': 'Settings',
      'settings.apiKey': 'API Key',
      'settings.model': 'Model',
      'settings.language': 'Language',
      'notification.researchStarted': 'Research started',
      'notification.researchCompleted': 'Research completed',
      'notification.researchPaused': 'Research paused',
      'notification.researchStopped': 'Research stopped',
      'error.apiKeyRequired': 'API key is required',
      'error.network': 'Network error occurred',
      'error.translation': 'Translation failed',
      'status.clarifying': 'Clarifying your query...',
      'status.researching': 'Researching...',
      'status.generatingReport': 'Generating report...',
      'status.translating': 'Translating...',
      'history.title': 'Research History',
      'history.empty': 'No research history',
      'history.clear': 'Clear History',
      'file.attachments': 'Attachments',
      'file.select': 'Select Files',
      'file.remove': 'Remove',
    });

    // 中文语言包
    this.languagePacks.set('zh', {
      'app.title': 'KResearch - AI研究助手',
      'research.modes.balanced': '平衡模式',
      'research.modes.deepdive': '深度研究',
      'research.modes.fast': '快速模式',
      'research.modes.ultrafast': '极速模式',
      'query.placeholder': '输入您的研究问题...',
      'button.startResearch': '开始研究',
      'button.stopResearch': '停止研究',
      'button.pauseResearch': '暂停研究',
      'button.resumeResearch': '继续研究',
      'button.generateReport': '生成报告',
      'button.translate': '翻译',
      'button.original': '原文',
      'button.translated': '中文',
      'report.header': '研究报告',
      'report.summary': '执行摘要',
      'report.citations': '引用文献',
      'report.toolbox': '报告工具',
      'settings.title': '设置',
      'settings.apiKey': 'API密钥',
      'settings.model': '模型',
      'settings.language': '语言',
      'notification.researchStarted': '研究已开始',
      'notification.researchCompleted': '研究已完成',
      'notification.researchPaused': '研究已暂停',
      'notification.researchStopped': '研究已停止',
      'error.apiKeyRequired': '需要API密钥',
      'error.network': '网络错误',
      'error.translation': '翻译失败',
      'status.clarifying': '正在澄清您的问题...',
      'status.researching': '正在研究...',
      'status.generatingReport': '正在生成报告...',
      'status.translating': '正在翻译...',
      'history.title': '研究历史',
      'history.empty': '暂无研究历史',
      'history.clear': '清空历史',
      'file.attachments': '附件',
      'file.select': '选择文件',
      'file.remove': '移除',
    });
  }

  public getLanguagePack(language: string): LanguagePack {
    return this.languagePacks.get(language) || this.languagePacks.get('en')!;
  }

  public translate(key: string, language: string): string {
    const pack = this.getLanguagePack(language);
    return pack[key] || key;
  }

  public async translateText(
    text: string,
    options: TranslationOptions,
    model?: string
  ): Promise<TranslationResult> {
    const { targetLanguage, sourceLanguage, preserveFormatting = true } = options;

    if (!text.trim()) {
      return {
        translatedText: '',
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
      };
    }

    const prompt = this.buildTranslationPrompt(text, targetLanguage, sourceLanguage, preserveFormatting);

    try {
      const requestParams: any = { 
        contents: [{ parts: [{ text: prompt }] }]
      };
      
      // Add model parameter if provided
      if (model) {
        requestParams.model = model;
      }
      
      const response = await this.aiClient.models.generateContent(requestParams);
      const translatedText = this.extractTranslatedText(response);

      return {
        translatedText,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async translateReport(
    reportContent: string,
    targetLanguage: string = 'zh',
    model?: string
  ): Promise<string> {
    const sections = this.splitReportIntoSections(reportContent);
    const translatedSections: string[] = [];

    for (const section of sections) {
      const translatedSection = await this.translateText(section, {
        targetLanguage,
        preserveFormatting: true,
      }, model);
      translatedSections.push(translatedSection.translatedText);
    }

    return translatedSections.join('\n\n');
  }

  private buildTranslationPrompt(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string,
    preserveFormatting?: boolean
  ): string {
    const sourceLang = sourceLanguage ? `${sourceLanguage} language` : 'detected language';
    const preserve = preserveFormatting ? 'Preserve all markdown formatting, headers, links, and citations.' : '';

    return `Translate the following text from ${sourceLang} to ${targetLanguage}.

Requirements:
- Provide an accurate and natural translation
- ${preserve}
- Maintain the original meaning and context
- Translate technical terms appropriately
- Keep any URLs and references intact

Text to translate:
${text}

Provide only the translated text without any additional comments or explanations.`;
  }

  private extractTranslatedText(response: any): string {
    // Handle Gemini API response format
    if (response.response && response.response.text) {
      return response.response.text().trim();
    }
    // Fallback for other formats
    if (typeof response === 'string') {
      return response.trim();
    }
    // Extract from candidates array if present
    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0]) {
      return response.candidates[0].content.parts[0].text.trim();
    }
    return String(response).trim();
  }

  private splitReportIntoSections(content: string): string[] {
    // Split by major sections (h1 or h2 headers)
    const sections = content.split(/\n(?=#+\s)/g);
    return sections.filter(section => section.trim().length > 0);
  }

  public getSupportedLanguages(): string[] {
    return ['en', 'zh'];
  }

  public isLanguageSupported(language: string): boolean {
    return this.getSupportedLanguages().includes(language);
  }
}

// Export singleton instance
let translationService: TranslationService | null = null;

export const getTranslationService = (aiClient?: UnifiedAIClient): TranslationService => {
  if (!translationService && aiClient) {
    translationService = new TranslationService(aiClient);
  }
  if (!translationService) {
    throw new Error('Translation service not initialized');
  }
  return translationService;
};

export const initializeTranslationService = (aiClient: UnifiedAIClient): TranslationService => {
  translationService = new TranslationService(aiClient);
  return translationService;
};
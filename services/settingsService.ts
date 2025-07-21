import { apiKeyService } from './apiKeyService';
import { getAvailableModels } from './openaiClient';
import { AppSettings } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  modelOverrides: {
    planner: null,
    searcher: null,
    synthesizer: null,
    clarification: null,
    visualizer: null,
  },
  researchParams: {
    minCycles: 7,
    maxCycles: 20,
    maxDebateRounds: 20,
  },
  apiConfig: {
    provider: 'gemini',
    baseUrl: null,
    openaiApiKey: null,
  },
};

class SettingsService {
  private settings: AppSettings;
  private availableModels: string[] = [];

  constructor() {
    this.settings = this.load();
    
    // Override with environment variables if available
    const envBaseUrl = process.env.GEMINI_BASE_URL;
    if (envBaseUrl) {
      this.settings.apiConfig.baseUrl = envBaseUrl;
    }
  }

  private load(): AppSettings {
    try {
      const storedSettings = localStorage.getItem('k-research-settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        return {
          modelOverrides: { ...DEFAULT_SETTINGS.modelOverrides, ...parsed.modelOverrides },
          researchParams: { ...DEFAULT_SETTINGS.researchParams, ...parsed.researchParams },
          apiConfig: { ...DEFAULT_SETTINGS.apiConfig, ...parsed.apiConfig },
        };
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  public save(newSettings: AppSettings) {
    const toStore: AppSettings = {
        modelOverrides: newSettings.modelOverrides || this.settings.modelOverrides,
        researchParams: newSettings.researchParams || this.settings.researchParams,
        apiConfig: newSettings.apiConfig || this.settings.apiConfig,
    };
    try {
      localStorage.setItem('k-research-settings', JSON.stringify(toStore));
      this.settings = toStore;
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  }

  public getSettings(): AppSettings {
    return this.settings;
  }
  
  public async fetchAvailableModels(forceRefetch: boolean = false): Promise<string[]> {
    const apiKeys = apiKeyService.getApiKeys();
    if (apiKeys.length === 0) {
      this.availableModels = [];
      throw new Error("API Key not set.");
    }
    
    if (this.availableModels.length > 0 && !forceRefetch) return this.availableModels;

    try {
        this.availableModels = await getAvailableModels();
        return this.availableModels;
    } catch (error) {
        console.error("Error fetching available models:", error);
        // Fallback to default Gemini models
        this.availableModels = [
            'gemini-2.5-pro',
            'gemini-2.5-flash',
            'gemini-2.5-flash-lite-preview-06-17',
            'gemini-1.5-pro',
            'gemini-1.5-flash'
        ];
        return this.availableModels;
    }
  }
}

export const settingsService = new SettingsService();
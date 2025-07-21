import { ai as geminiClient } from './geminiClient';
import { ai as openaiClient, getAvailableModels as getOpenAIModels } from './openaiClient';
import { settingsService } from './settingsService';
import { apiKeyService } from './apiKeyService';
import { ApiProvider } from '../types';

// Unified AI client interface
export interface UnifiedAIClient {
    models: {
        generateContent: (params: any) => Promise<any>;
        generateContentStream: (params: any) => Promise<any>;
    };
    chat?: {
        completions: {
            create: (params: any) => Promise<any>;
        };
    };
}

// Factory function to get the appropriate client based on current settings
export const getAIClient = (): UnifiedAIClient => {
    const settings = settingsService.getSettings();
    const provider = settings.apiConfig.provider;

    switch (provider) {
        case 'gemini':
            return geminiClient;
        case 'openai':
        case 'custom':
            return openaiClient;
        default:
            return geminiClient; // fallback
    }
};

// Get available models based on current provider
export const getAvailableModels = async (): Promise<string[]> => {
    const settings = settingsService.getSettings();
    const provider = settings.apiConfig.provider;

    try {
        switch (provider) {
            case 'gemini':
                return await settingsService.fetchAvailableModels();
            case 'openai':
            case 'custom':
                return await getOpenAIModels();
            default:
                return await settingsService.fetchAvailableModels();
        }
    } catch (error) {
        console.error('Failed to fetch models:', error);
        // Return default models based on provider
        switch (provider) {
            case 'gemini':
                return [
                    'gemini-2.5-pro',
                    'gemini-2.5-flash',
                    'gemini-2.5-flash-lite-preview-06-17',
                    'gemini-1.5-pro',
                    'gemini-1.5-flash'
                ];
            case 'openai':
                return [
                    'gpt-4o',
                    'gpt-4o-mini',
                    'gpt-4',
                    'gpt-3.5-turbo'
                ];
            case 'custom':
                return [
                    'gpt-4o',
                    'gpt-4o-mini',
                    'gpt-4',
                    'gpt-3.5-turbo',
                    'claude-3-5-sonnet-20241022',
                    'claude-3-5-haiku-20241022'
                ];
            default:
                return [];
        }
    }
};

// Get provider-specific configuration status
export const getProviderStatus = () => {
    const settings = settingsService.getSettings();
    const provider = settings.apiConfig.provider;
    
    switch (provider) {
        case 'gemini':
            return {
                isConfigured: apiKeyService.hasKey(),
                missingConfig: apiKeyService.hasKey() ? [] : ['Gemini API Key']
            };
        case 'openai':
            return {
                isConfigured: !!settings.apiConfig.openaiApiKey,
                missingConfig: settings.apiConfig.openaiApiKey ? [] : ['OpenAI API Key']
            };
        case 'custom':
            const missing = [];
            if (!settings.apiConfig.openaiApiKey) missing.push('API Key');
            if (!settings.apiConfig.baseUrl) missing.push('Base URL');
            return {
                isConfigured: missing.length === 0,
                missingConfig: missing
            };
        default:
            return {
                isConfigured: false,
                missingConfig: ['Unknown provider']
            };
    }
};

// Get the appropriate base URL for current provider
export const getEffectiveBaseURL = (): string => {
    const settings = settingsService.getSettings();
    const provider = settings.apiConfig.provider;
    
    switch (provider) {
        case 'gemini':
            // For Gemini, we still use OpenAI-compatible endpoint for better proxy support
            return settings.apiConfig.baseUrl || 'https://generativelanguage.googleapis.com/v1beta/openai/';
        case 'openai':
            return settings.apiConfig.baseUrl || 'https://api.openai.com/v1';
        case 'custom':
            return settings.apiConfig.baseUrl || 'https://api.openai.com/v1';
        default:
            return 'https://generativelanguage.googleapis.com/v1beta/openai/';
    }
};

// Get the appropriate API key for current provider
export const getEffectiveAPIKey = (): string | null => {
    const settings = settingsService.getSettings();
    const provider = settings.apiConfig.provider;
    
    switch (provider) {
        case 'gemini':
            return apiKeyService.getNextApiKey() || null;
        case 'openai':
        case 'custom':
            return settings.apiConfig.openaiApiKey;
        default:
            return null;
    }
};
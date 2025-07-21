import OpenAI from 'openai';
import { apiKeyService, AllKeysFailedError } from "./apiKeyService";
import { settingsService } from "./settingsService";

// Utility function for clean error messages
const getCleanErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred.';
    if (typeof error === 'string') return error;

    if (error.message && typeof error.message === 'string') {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'object' && error !== null) {
        try {
            return JSON.stringify(error, null, 2);
        } catch {
            return 'Received an un-stringifiable error object.';
        }
    }

    return String(error);
};

// Map Gemini model names to OpenAI-compatible names for the proxy
const getOpenAIModelName = (modelName: string, provider: string): string => {
    // Only apply model mapping for Gemini provider
    if (provider !== 'gemini') {
        return modelName; // For openai/custom providers, use model name as-is
    }
    
    const modelMap: Record<string, string> = {
        'gemini-2.5-pro': 'gpt-4o',
        'gemini-2.5-flash': 'gpt-4o-mini', 
        'gemini-2.5-flash-lite-preview-06-17': 'gpt-3.5-turbo',
        'gemini-1.5-pro': 'gpt-4',
        'gemini-1.5-flash': 'gpt-3.5-turbo'
    };
    
    return modelMap[modelName] || modelName;
};

// Core executor with retry logic
async function executeWithRetry<T>(
    apiCall: (client: OpenAI) => Promise<T>,
    operationName: string
): Promise<T> {
    const keys = apiKeyService.getApiKeys();
    if (keys.length === 0) {
        throw new Error("No API keys provided. Please add at least one key in the application settings.");
    }

    const maxAttempts = keys.length;
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const key = apiKeyService.getNextApiKey();
        if (!key) {
            continue;
        }

        try {
            // Get configuration based on provider
            const settings = settingsService.getSettings();
            const provider = settings.apiConfig.provider;
            
            let baseURL: string;
            let apiKey: string;
            
            switch (provider) {
                case 'gemini':
                    baseURL = settings.apiConfig.baseUrl || 'https://generativelanguage.googleapis.com/v1beta/openai/';
                    apiKey = key; // Use Gemini API key
                    break;
                case 'openai':
                    baseURL = settings.apiConfig.baseUrl || 'https://api.openai.com/v1';
                    apiKey = settings.apiConfig.openaiApiKey || key;
                    break;
                case 'custom':
                    baseURL = settings.apiConfig.baseUrl || 'https://api.openai.com/v1';
                    apiKey = settings.apiConfig.openaiApiKey || key;
                    break;
                default:
                    baseURL = 'https://generativelanguage.googleapis.com/v1beta/openai/';
                    apiKey = key;
            }
            
            const client = new OpenAI({
                apiKey: apiKey,
                baseURL: baseURL,
                dangerouslyAllowBrowser: true // Required for browser usage
            });
            
            const result = await apiCall(client);
            return result;
        } catch (error) {
            console.warn(`[Attempt ${attempt}/${maxAttempts}] API call for '${operationName}' with key ending in ...${key.slice(-4)} failed. Trying next key.`);
            lastError = error;
        }
    }

    // All keys have failed
    const finalErrorMessage = getCleanErrorMessage(lastError);
    console.error(`All ${maxAttempts} API keys failed for operation '${operationName}'. Last error:`, lastError);
    throw new AllKeysFailedError(`All API keys failed. Last error: ${finalErrorMessage}`);
}

// OpenAI-compatible API wrapper for Gemini
export const ai = {
    chat: {
        completions: {
            create: (params: OpenAI.Chat.Completions.ChatCompletionCreateParams) => {
                return executeWithRetry(client => client.chat.completions.create(params), 'chat.completions.create');
            }
        }
    },
    models: {
        // Compatibility layer for existing code
        generateContent: async (params: any) => {
            const settings = settingsService.getSettings();
            const provider = settings.apiConfig.provider;
            const model = getOpenAIModelName(params.model, provider);
            
            // Handle different content formats
            let messages: any[] = [];
            
            if (typeof params.contents === 'string') {
                // String format: contents: "prompt text"
                messages = [{ role: 'user', content: params.contents }];
            } else if (Array.isArray(params.contents)) {
                // Array format: contents: [{ role: 'user', parts: [...] }]
                messages = params.contents.map((content: any) => ({
                    role: content.role === 'model' ? 'assistant' : 'user',
                    content: typeof content.parts === 'string' ? content.parts : 
                            Array.isArray(content.parts) ? content.parts.map((p: any) => p.text || p).join('') : 
                            content.parts?.text || String(content.parts)
                }));
            } else if (params.contents && typeof params.contents === 'object') {
                // Object format: contents: { parts: [...] }
                const parts = params.contents.parts || [];
                const content = Array.isArray(parts) ? 
                    parts.map((p: any) => p.text || p).join('') : 
                    (typeof parts === 'string' ? parts : String(parts));
                messages = [{ role: 'user', content }];
            } else {
                // Fallback
                messages = [{ role: 'user', content: 'No content provided' }];
            }

            const response = await executeWithRetry(client => 
                client.chat.completions.create({
                    model,
                    messages,
                    temperature: params.generationConfig?.temperature,
                    max_tokens: params.generationConfig?.maxOutputTokens,
                    top_p: params.generationConfig?.topP
                }), 'generateContent'
            );

            // Convert OpenAI response to Gemini-like format
            const text = response.choices[0]?.message?.content || '';
            return {
                text: text, // Direct property access
                response: {
                    text: () => text, // Function access for compatibility
                    candidates: [{
                        content: {
                            parts: [{ text: text }]
                        }
                    }]
                }
            };
        },
        generateContentStream: async (params: any) => {
            const settings = settingsService.getSettings();
            const provider = settings.apiConfig.provider;
            const model = getOpenAIModelName(params.model, provider);
            
            // Handle different content formats (same logic as generateContent)
            let messages: any[] = [];
            
            if (typeof params.contents === 'string') {
                messages = [{ role: 'user', content: params.contents }];
            } else if (Array.isArray(params.contents)) {
                messages = params.contents.map((content: any) => ({
                    role: content.role === 'model' ? 'assistant' : 'user',
                    content: typeof content.parts === 'string' ? content.parts : 
                            Array.isArray(content.parts) ? content.parts.map((p: any) => p.text || p).join('') : 
                            content.parts?.text || String(content.parts)
                }));
            } else if (params.contents && typeof params.contents === 'object') {
                const parts = params.contents.parts || [];
                const content = Array.isArray(parts) ? 
                    parts.map((p: any) => p.text || p).join('') : 
                    (typeof parts === 'string' ? parts : String(parts));
                messages = [{ role: 'user', content }];
            } else {
                messages = [{ role: 'user', content: 'No content provided' }];
            }

            return executeWithRetry(client => 
                client.chat.completions.create({
                    model,
                    messages,
                    stream: true,
                    temperature: params.generationConfig?.temperature,
                    max_tokens: params.generationConfig?.maxOutputTokens,
                    top_p: params.generationConfig?.topP
                }), 'generateContentStream'
            );
        }
    }
};

// Helper function to get available models through OpenAI endpoint
export const getAvailableModels = async (): Promise<string[]> => {
    try {
        const result = await executeWithRetry(client => client.models.list(), 'models.list');
        return result.data
            .filter(model => model.id.includes('gemini') || model.id.includes('gpt'))
            .map(model => model.id)
            .sort();
    } catch (error) {
        console.error('Failed to fetch available models:', error);
        return [
            'gemini-2.5-pro',
            'gemini-2.5-flash',
            'gemini-2.5-flash-lite-preview-06-17',
            'gemini-1.5-pro',
            'gemini-1.5-flash'
        ];
    }
};
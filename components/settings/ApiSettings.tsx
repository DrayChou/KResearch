import React from 'react';
import { apiKeyService } from '../../services/apiKeyService';
import { ApiProvider } from '../../types';
import { getProviderStatus } from '../../services/aiClientFactory';

interface ApiSettingsProps {
    apiKey: string;
    setApiKey: (key: string) => void;
    baseUrl: string;
    setBaseUrl: (url: string) => void;
    provider: ApiProvider;
    setProvider: (provider: ApiProvider) => void;
    openaiApiKey: string;
    setOpenaiApiKey: (key: string) => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({ 
    apiKey, setApiKey, baseUrl, setBaseUrl, provider, setProvider, openaiApiKey, setOpenaiApiKey 
}) => {
    const isEnvKey = apiKeyService.isEnvKey();
    const providerStatus = getProviderStatus();

    const providers = [
        { id: 'gemini' as ApiProvider, name: 'Google Gemini', description: 'Official Gemini API with OpenAI compatibility' },
        { id: 'openai' as ApiProvider, name: 'OpenAI', description: 'Official OpenAI API' },
        { id: 'custom' as ApiProvider, name: 'Custom Provider', description: 'Custom API endpoint (Claude, etc.)' }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Provider Selection */}
            <div>
                <h3 className="text-lg font-semibold mb-4">API Provider</h3>
                <div className="grid grid-cols-1 gap-3">
                    {providers.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setProvider(p.id)}
                            className={`p-4 rounded-2xl text-left border transition-all ${
                                provider === p.id
                                    ? 'bg-glow-light/20 dark:bg-glow-dark/30 border-glow-light dark:border-glow-dark text-gray-900 dark:text-white'
                                    : 'bg-white/40 dark:bg-black/20 border-gray-200 dark:border-gray-700 hover:bg-black/5 dark:hover:bg-white/10'
                            }`}
                        >
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{p.description}</div>
                        </button>
                    ))}
                </div>
                
                {/* Provider Status */}
                <div className={`mt-3 p-3 text-sm rounded-2xl ${
                    providerStatus.isConfigured 
                        ? 'bg-green-500/10 text-green-800 dark:text-green-200 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-800 dark:text-yellow-200 border border-yellow-500/20'
                }`}>
                    {providerStatus.isConfigured ? (
                        `✅ ${providers.find(p => p.id === provider)?.name} is configured and ready`
                    ) : (
                        `⚠️ Missing configuration: ${providerStatus.missingConfig.join(', ')}`
                    )}
                </div>
            </div>

            {/* Gemini API Key */}
            {provider === 'gemini' && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Gemini API Key(s)</h3>
                    {isEnvKey ? (
                        <div className="w-full p-3 rounded-2xl bg-slate-200/60 dark:bg-black/20 text-gray-500 dark:text-gray-400 border border-transparent">
                            API Key(s) are configured by the application host.
                        </div>
                    ) : (
                        <textarea 
                            id="gemini-api-key-input"
                            value={apiKey} 
                            onChange={(e) => setApiKey(e.target.value)} 
                            placeholder="Enter one or more Gemini API keys, separated by commas or newlines." 
                            className="w-full h-32 p-3 rounded-2xl bg-white/60 dark:bg-black/20 border border-transparent focus:border-glow-light dark:focus:border-glow-dark focus:ring-2 focus:ring-glow-light/50 dark:focus:ring-glow-dark/50 focus:outline-none transition-all resize-y"
                            spellCheck="false"
                        />
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {isEnvKey ? "Keys cannot be changed from the UI." : "Enter multiple keys to rotate them and avoid rate limits. Your keys are stored only in your browser's local storage."} Get keys from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.
                    </p>
                    {!apiKeyService.hasKey() && (
                        <div className="p-3 text-sm rounded-2xl bg-yellow-500/10 text-yellow-800 dark:text-yellow-200 border border-yellow-500/20 mt-2">
                            At least one API Key is required to use the application.
                        </div>
                    )}
                </div>
            )}

            {/* OpenAI API Key */}
            {(provider === 'openai' || provider === 'custom') && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">{provider === 'openai' ? 'OpenAI' : 'Custom'} API Key</h3>
                    <input
                        id="openai-api-key-input"
                        type="password"
                        value={openaiApiKey}
                        onChange={(e) => setOpenaiApiKey(e.target.value)}
                        placeholder={`Enter your ${provider === 'openai' ? 'OpenAI' : 'API'} key`}
                        className="w-full p-3 rounded-2xl bg-white/60 dark:bg-black/20 border border-transparent focus:border-glow-light dark:focus:border-glow-dark focus:ring-2 focus:ring-glow-light/50 dark:focus:ring-glow-dark/50 focus:outline-none transition-all"
                        spellCheck="false"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {provider === 'openai' 
                            ? <>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI Platform</a>.</>
                            : 'Enter your API key for the custom provider.'
                        }
                    </p>
                </div>
            )}

            {/* Base URL Configuration */}
            {(provider === 'openai' || provider === 'custom' || (provider === 'gemini' && baseUrl)) && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        {provider === 'custom' ? 'API Endpoint (Required)' : 'API Proxy Configuration (Optional)'}
                    </h3>
                    <div className="relative">
                        <input
                            id="base-url-input"
                            type="url"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder={
                                provider === 'gemini' ? 'https://generativelanguage.googleapis.com/v1beta/openai/' :
                                provider === 'openai' ? 'https://api.openai.com/v1' :
                                'https://api.anthropic.com/v1'
                            }
                            className="w-full p-3 pr-12 rounded-2xl bg-white/60 dark:bg-black/20 border border-transparent focus:border-glow-light dark:focus:border-glow-dark focus:ring-2 focus:ring-glow-light/50 dark:focus:ring-glow-dark/50 focus:outline-none transition-all"
                            spellCheck="false"
                        />
                        {baseUrl && (
                            <button
                                onClick={() => setBaseUrl('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                                title="Clear URL"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {provider === 'custom' ? (
                            'Required: Enter the base URL for your API provider (e.g., Claude, local models).'
                        ) : baseUrl ? (
                            <>Currently using: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">{baseUrl}</code></>
                        ) : (
                            <>Default: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
                                {provider === 'gemini' ? 'https://generativelanguage.googleapis.com/v1beta/openai/' : 'https://api.openai.com/v1'}
                            </code></>
                        )}
                        {provider === 'gemini' && (
                            <>
                                <br />
                                Example proxy: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">https://api.genai.gd.edu.kg/google</code>
                            </>
                        )}
                    </p>
                </div>
            )}

            {/* Quick Setup Button for Gemini Proxy */}
            {provider === 'gemini' && !baseUrl && (
                <div>
                    <button
                        onClick={() => setBaseUrl('https://api.genai.gd.edu.kg/google')}
                        className="w-full p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-800 dark:text-blue-200 transition-all"
                    >
                        🚀 Quick Setup: Use Educational Proxy
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Click to automatically configure a proxy for regions with restrictions
                    </p>
                </div>
            )}
        </div>
    );
};

export default ApiSettings;

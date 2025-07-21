import React, { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../../services/settingsService';
import { getDefaultModelForRole } from '../../services/models';
import { AppSettings, AgentRole, ResearchMode } from '../../types';
import Spinner from '../Spinner';

interface ModelSettingsProps {
    settings: AppSettings;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
    currentMode: ResearchMode;
}

const AGENT_ROLES: AgentRole[] = ['planner', 'searcher', 'synthesizer', 'clarification', 'visualizer'];

const ModelSettings: React.FC<ModelSettingsProps> = ({ settings, setSettings, currentMode }) => {
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [modelsError, setModelsError] = useState<string | null>(null);
    const [customModels, setCustomModels] = useState<{[key in AgentRole]?: string}>({});
    const [isCustomInput, setIsCustomInput] = useState<{[key in AgentRole]?: boolean}>({});

    const fetchModels = useCallback(async (force = false) => {
        setIsLoadingModels(true);
        setModelsError(null);
        try {
            const models = await settingsService.fetchAvailableModels(force);
            setAvailableModels(models);
        } catch (e: any) {
            setModelsError(e.message || "An unknown error occurred while fetching models.");
        } finally {
            setIsLoadingModels(false);
        }
    }, []);

    useEffect(() => {
        fetchModels();
    }, [fetchModels]);


    const handleModelOverrideChange = (role: AgentRole, value: string) => {
        if (value === 'custom') {
            setIsCustomInput(prev => ({ ...prev, [role]: true }));
            setCustomModels(prev => ({ ...prev, [role]: settings.modelOverrides[role] || '' }));
        } else {
            setIsCustomInput(prev => ({ ...prev, [role]: false }));
            setSettings(prev => ({
                ...prev,
                modelOverrides: { ...prev.modelOverrides, [role]: value === 'default' ? null : value }
            }));
        }
    };

    const handleCustomModelChange = (role: AgentRole, value: string) => {
        setCustomModels(prev => ({ ...prev, [role]: value }));
        setSettings(prev => ({
            ...prev,
            modelOverrides: { ...prev.modelOverrides, [role]: value.trim() || null }
        }));
    };

    const handleCustomModelSubmit = (role: AgentRole) => {
        const customModel = customModels[role]?.trim();
        if (customModel) {
            setIsCustomInput(prev => ({ ...prev, [role]: false }));
        }
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Model Configuration</h3>
                <div className="flex items-center gap-2">
                     {isLoadingModels && <div className="flex items-center gap-2 text-sm"><Spinner /><span>Loading...</span></div>}
                     <button onClick={() => fetchModels(true)} disabled={isLoadingModels} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50" title="Refresh Model List">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 -960 960 960" fill="currentColor">
                            <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
                        </svg>
                     </button>
                </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Override default models for each agent. Select "Default" to use the model specified by the current research mode.</p>
            {modelsError && <div className="p-3 text-sm rounded-2xl bg-red-500/10 text-red-800 dark:text-red-200 border border-red-500/20">{modelsError}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AGENT_ROLES.map(role => {
                    const defaultModelName = getDefaultModelForRole(role, currentMode);
                    const currentValue = settings.modelOverrides[role];
                    const isModelInList = !currentValue || availableModels.includes(currentValue);
                    const selectValue = isCustomInput[role] ? 'custom' : (isModelInList ? (currentValue || 'default') : 'custom');
                    
                    return (
                        <div key={role} className="space-y-2">
                            <label htmlFor={`model-${role}`} className="font-semibold text-gray-700 dark:text-gray-300 capitalize text-sm">{role}</label>
                            
                            {!isCustomInput[role] ? (
                                <select 
                                    id={`model-${role}`} 
                                    value={selectValue}
                                    onChange={e => handleModelOverrideChange(role, e.target.value)} 
                                    disabled={isLoadingModels} 
                                    className="w-full p-2 rounded-2xl bg-white/60 dark:bg-black/20 border border-transparent focus:border-glow-light dark:focus:border-glow-dark focus:ring-1 focus:ring-glow-light/50 dark:focus:ring-glow-dark/50 focus:outline-none transition-all text-sm disabled:opacity-50"
                                >
                                    <option value="default">{`Default (${defaultModelName})`}</option>
                                    {availableModels.map(modelName => (
                                        <option key={modelName} value={modelName}>{modelName}</option>
                                    ))}
                                    <option value="custom">🖊️ Custom Model Name...</option>
                                </select>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={customModels[role] || ''}
                                        onChange={e => handleCustomModelChange(role, e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                handleCustomModelSubmit(role);
                                            } else if (e.key === 'Escape') {
                                                setIsCustomInput(prev => ({ ...prev, [role]: false }));
                                            }
                                        }}
                                        placeholder="Enter model name (e.g., claude-3-5-sonnet-20241022)"
                                        className="w-full p-2 pr-20 rounded-2xl bg-white/60 dark:bg-black/20 border border-transparent focus:border-glow-light dark:focus:border-glow-dark focus:ring-1 focus:ring-glow-light/50 dark:focus:ring-glow-dark/50 focus:outline-none transition-all text-sm"
                                        autoFocus
                                    />
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                                        <button
                                            onClick={() => handleCustomModelSubmit(role)}
                                            className="p-1 rounded-full hover:bg-green-500/20 text-green-600 dark:text-green-400 transition-colors"
                                            title="Confirm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setIsCustomInput(prev => ({ ...prev, [role]: false }))}
                                            className="p-1 rounded-full hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                                            title="Cancel"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Show current custom model if it's not in the list */}
                            {currentValue && !isModelInList && !isCustomInput[role] && (
                                <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">
                                    Custom: <code className="bg-blue-500/20 px-1 rounded">{currentValue}</code>
                                    <button
                                        onClick={() => {
                                            setCustomModels(prev => ({ ...prev, [role]: currentValue }));
                                            setIsCustomInput(prev => ({ ...prev, [role]: true }));
                                        }}
                                        className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ModelSettings;
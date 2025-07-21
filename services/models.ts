import { settingsService } from './settingsService';
import { ResearchMode, AgentRole } from '../types';

const geminiModels: Record<AgentRole, Record<ResearchMode, string>> = {
    planner: {
        Balanced: 'gemini-2.5-pro',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite-preview-06-17',
    },
    searcher: {
        Balanced: 'gemini-2.5-flash-lite-preview-06-17',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite-preview-06-17',
    },
    synthesizer: {
        Balanced: 'gemini-2.5-flash',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite-preview-06-17',
    },
    clarification: {
        Balanced: 'gemini-2.5-flash',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite-preview-06-17',
    },
    visualizer: {
        Balanced: 'gemini-2.5-flash',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite-preview-06-17',
    }
};

const openaiModels: Record<AgentRole, Record<ResearchMode, string>> = {
    planner: {
        Balanced: 'gpt-4o',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-3.5-turbo',
    },
    searcher: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-3.5-turbo',
    },
    synthesizer: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-3.5-turbo',
    },
    clarification: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-3.5-turbo',
    },
    visualizer: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-3.5-turbo',
    }
};

const getProviderModels = (): Record<AgentRole, Record<ResearchMode, string>> => {
    const provider = settingsService.getSettings().apiConfig.provider;
    switch (provider) {
        case 'gemini':
            return geminiModels;
        case 'openai':
        case 'custom':
            return openaiModels;
        default:
            return geminiModels;
    }
};

export const getDefaultModelForRole = (role: AgentRole, mode: ResearchMode): string => {
    const models = getProviderModels();
    return models[role][mode];
}

/**
 * Gets the appropriate model for a given agent role and research mode.
 * It first checks for a user-defined override in settings, then falls back
 * to the default model for the selected mode.
 * @param role The role of the agent (e.g., 'planner', 'searcher').
 * @param mode The current research mode (e.g., 'Balanced', 'DeepDive').
 * @returns The name of the model to be used.
 */
export const getModel = (role: AgentRole, mode: ResearchMode): string => {
    const override = settingsService.getSettings().modelOverrides[role];
    if (override) {
        return override;
    }
    return getDefaultModelForRole(role, mode);
};
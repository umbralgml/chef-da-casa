import { GeminiProvider } from './providers/gemini';
import { MockAIProvider } from './providers/mock';
import type { AIProvider, Recipe, RecipeRequest } from './types';

function buildProvider(geminiKey?: string): AIProvider {
  const key = geminiKey || process.env.EXPO_PUBLIC_GEMINI_KEY;
  if (key) return new GeminiProvider(key);
  return new MockAIProvider();
}

let activeProvider: AIProvider = buildProvider();

export function setGeminiKey(key: string): void {
  activeProvider = key ? new GeminiProvider(key) : new MockAIProvider();
}

export function getProviderName(): string {
  return activeProvider.name;
}

export async function generateRecipes(request: RecipeRequest): Promise<Recipe[]> {
  if (request.ingredients.length === 0) {
    throw new Error('Adicione pelo menos um ingrediente.');
  }
  return activeProvider.generateRecipes(request);
}

export type { Recipe, RecipeRequest };

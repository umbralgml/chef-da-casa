import { GeminiProvider } from './providers/gemini';
import { MockAIProvider } from './providers/mock';
import type { AIProvider, Recipe, RecipeRequest } from './types';

// Lazy init: provider is built on first use, so localStorage has time to load.
let activeProvider: AIProvider | null = null;

function getProvider(): AIProvider {
  if (!activeProvider) {
    const key = process.env.EXPO_PUBLIC_GEMINI_KEY ?? '';
    activeProvider = key ? new GeminiProvider(key) : new MockAIProvider();
  }
  return activeProvider;
}

export function setGeminiKey(key: string): void {
  activeProvider = key.trim() ? new GeminiProvider(key.trim()) : new MockAIProvider();
}

export function getProviderName(): string {
  return getProvider().name;
}

export async function testGeminiKey(key: string): Promise<void> {
  await new GeminiProvider(key.trim()).testConnection();
}

export async function generateRecipes(request: RecipeRequest): Promise<Recipe[]> {
  if (request.ingredients.length === 0) {
    throw new Error('Adicione pelo menos um ingrediente.');
  }
  return getProvider().generateRecipes(request);
}

export type { Recipe, RecipeRequest };

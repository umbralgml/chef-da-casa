import { MockAIProvider } from './providers/mock';
import type { AIProvider, Recipe, RecipeRequest } from './types';

// Active provider — swap to GeminiProvider or OpenAIProvider when keys are available.
// MockAIProvider is the default (zero cost, offline-safe).
let activeProvider: AIProvider = new MockAIProvider();

export function setAIProvider(provider: AIProvider): void {
  activeProvider = provider;
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

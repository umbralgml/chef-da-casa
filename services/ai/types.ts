export interface RecipeRequest {
  ingredients: string[];
  cookingStyle: 'quick' | 'gourmet' | 'creative';
  servings?: number;
}

export interface RecipeStep {
  order: number;
  instruction: string;
  duration?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: RecipeStep[];
  totalTime: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  cookingStyle: 'quick' | 'gourmet' | 'creative';
  servings: number;
}

export interface AIProvider {
  name: string;
  generateRecipes(request: RecipeRequest): Promise<Recipe[]>;
}

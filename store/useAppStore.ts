import { create } from 'zustand';
import type { CookingStyleId } from '@/constants';
import type { Recipe } from '@/services/ai/types';

interface AppState {
  ingredients: string[];
  selectedStyle: CookingStyleId | null;
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;

  setIngredients: (ingredients: string[]) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  setSelectedStyle: (style: CookingStyleId) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  ingredients: [],
  selectedStyle: null,
  recipes: [],
  selectedRecipe: null,
  isLoading: false,
  error: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setIngredients: (ingredients) => set({ ingredients }),

  addIngredient: (ingredient) =>
    set((state) => ({
      ingredients: state.ingredients.includes(ingredient.trim().toLowerCase())
        ? state.ingredients
        : [...state.ingredients, ingredient.trim().toLowerCase()],
    })),

  removeIngredient: (ingredient) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i !== ingredient),
    })),

  setSelectedStyle: (style) => set({ selectedStyle: style }),

  setRecipes: (recipes) => set({ recipes }),

  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));

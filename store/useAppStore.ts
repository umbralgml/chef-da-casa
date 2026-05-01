import { create } from 'zustand';
import type { CookingStyleId } from '@/constants';
import type { Recipe } from '@/services/ai/types';
import { setGeminiKey } from '@/services/ai/recipeService';

interface AppState {
  ingredients: string[];
  selectedStyle: CookingStyleId | null;
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  geminiKey: string;

  setIngredients: (ingredients: string[]) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  setSelectedStyle: (style: CookingStyleId) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  saveGeminiKey: (key: string) => void;
  reset: () => void;
}

function loadStoredKey(): string {
  try {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('gemini_key')) || '';
  } catch {
    return '';
  }
}

const storedKey = loadStoredKey();
if (storedKey) setGeminiKey(storedKey);

const initialState = {
  ingredients: [],
  selectedStyle: null,
  recipes: [],
  selectedRecipe: null,
  isLoading: false,
  error: null,
  geminiKey: storedKey,
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

  saveGeminiKey: (key) => {
    try {
      if (typeof localStorage !== 'undefined') {
        key ? localStorage.setItem('gemini_key', key) : localStorage.removeItem('gemini_key');
      }
    } catch {}
    setGeminiKey(key);
    set({ geminiKey: key, recipes: [] });
  },

  reset: () => set({ ...initialState, geminiKey: loadStoredKey() }),
}));

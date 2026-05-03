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
  clearIngredients: () => void;
  setSelectedStyle: (style: CookingStyleId) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  saveGeminiKey: (key: string) => void;
  reset: () => void;
}

function readStoredKey(): string {
  try {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('gemini_key')) || '';
  } catch {
    return '';
  }
}

export const useAppStore = create<AppState>((set) => {
  // Init provider from localStorage on first store creation (runs in browser, after hydration).
  const storedKey = readStoredKey();
  if (storedKey) setGeminiKey(storedKey);

  return {
    ingredients: [],
    selectedStyle: null,
    recipes: [],
    selectedRecipe: null,
    isLoading: false,
    error: null,
    geminiKey: storedKey,

    setIngredients: (ingredients) => set({ ingredients }),

    addIngredient: (ingredient) =>
      set((state) => {
        const normalized = ingredient.trim().toLowerCase();
        if (!normalized || state.ingredients.includes(normalized)) return state;
        return { ingredients: [...state.ingredients, normalized] };
      }),

    removeIngredient: (ingredient) =>
      set((state) => ({ ingredients: state.ingredients.filter((i) => i !== ingredient) })),

    clearIngredients: () => set({ ingredients: [] }),

    setSelectedStyle: (style) => set({ selectedStyle: style }),
    setRecipes: (recipes) => set({ recipes }),
    setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    saveGeminiKey: (key) => {
      const trimmed = key.trim();
      try {
        if (typeof localStorage !== 'undefined') {
          trimmed ? localStorage.setItem('gemini_key', trimmed) : localStorage.removeItem('gemini_key');
        }
      } catch {}
      setGeminiKey(trimmed);
      set({ geminiKey: trimmed, recipes: [] });
    },

    reset: () => {
      const key = readStoredKey();
      if (key) setGeminiKey(key);
      set({ ingredients: [], selectedStyle: null, recipes: [], selectedRecipe: null, isLoading: false, error: null, geminiKey: key });
    },
  };
});

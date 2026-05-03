import { create } from 'zustand';
import type { CookingStyleId } from '@/constants';
import type { Recipe } from '@/services/ai/types';
import { setGeminiKey } from '@/services/ai/recipeService';
import { readKey, writeKey } from './storage';

interface AppState {
  ingredients: string[];
  selectedStyle: CookingStyleId | null;
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  geminiKey: string;
  storageReady: boolean;

  setIngredients: (ingredients: string[]) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setSelectedStyle: (style: CookingStyleId) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  saveGeminiKey: (key: string) => Promise<void>;
  initStorage: () => Promise<void>;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  ingredients: [],
  selectedStyle: null,
  recipes: [],
  selectedRecipe: null,
  isLoading: false,
  error: null,
  geminiKey: '',
  storageReady: false,

  initStorage: async () => {
    const key = await readKey();
    if (key) setGeminiKey(key);
    set({ geminiKey: key, storageReady: true });
  },

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

  saveGeminiKey: async (key) => {
    const trimmed = key.trim();
    await writeKey(trimmed);
    setGeminiKey(trimmed);
    set({ geminiKey: trimmed, recipes: [] });
  },

  reset: () => {
    const { geminiKey } = get();
    set({ ingredients: [], selectedStyle: null, recipes: [], selectedRecipe: null, isLoading: false, error: null, geminiKey });
  },
}));

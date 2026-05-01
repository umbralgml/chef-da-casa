export * from './colors';

export const APP_NAME = 'Chef de Casa';

export const COOKING_STYLES = [
  {
    id: 'quick',
    label: 'Rápida e Simples',
    description: 'Pronta em até 20 minutos',
    emoji: '⚡',
    color: '#E8622A',
    tw: 'bg-orange-500',
  },
  {
    id: 'gourmet',
    label: 'Complexa (Gourmet)',
    description: 'Técnicas elaboradas e refinadas',
    emoji: '👨‍🍳',
    color: '#2D6A4F',
    tw: 'bg-green-800',
  },
  {
    id: 'creative',
    label: 'Diferente / Criativa',
    description: 'Combinações surpreendentes',
    emoji: '✨',
    color: '#9B59B6',
    tw: 'bg-purple-600',
  },
] as const;

export type CookingStyleId = (typeof COOKING_STYLES)[number]['id'];

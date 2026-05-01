import type { AIProvider, Recipe, RecipeRequest } from '../types';

// Zero-cost mock provider for development and testing.
// Returns hardcoded recipes without any API call.
export class MockAIProvider implements AIProvider {
  readonly name = 'Mock (Dev)';

  async generateRecipes(request: RecipeRequest): Promise<Recipe[]> {
    await new Promise((r) => setTimeout(r, 1500));

    const base = {
      cookingStyle: request.cookingStyle,
      servings: 2,
    };

    const mocks: Recipe[] = [
      {
        ...base,
        id: `mock-1-${Date.now()}`,
        title: 'Macarrão ao Alho e Óleo',
        description: 'Clássico italiano simples e irresistível.',
        ingredients: ['200g de macarrão', '4 dentes de alho', '3 colheres de azeite', 'Sal e pimenta', 'Salsinha'],
        steps: [
          { order: 1, instruction: 'Cozinhe o macarrão em água com sal até ficar al dente.', duration: '10 min' },
          { order: 2, instruction: 'Frite o alho picado no azeite em fogo baixo até dourar.', duration: '3 min' },
          { order: 3, instruction: 'Misture o macarrão escorrido com o azeite de alho e a salsinha.', duration: '2 min' },
        ],
        totalTime: '15 min',
        difficulty: 'Fácil',
      },
      {
        ...base,
        id: `mock-2-${Date.now()}`,
        title: 'Omelete de Queijo',
        description: 'Proteico, rápido e delicioso.',
        ingredients: ['3 ovos', '50g de queijo mussarela', '1 colher de manteiga', 'Sal e pimenta'],
        steps: [
          { order: 1, instruction: 'Bata os ovos com sal e pimenta.', duration: '1 min' },
          { order: 2, instruction: 'Derreta a manteiga na frigideira e despeje os ovos.', duration: '2 min' },
          { order: 3, instruction: 'Adicione o queijo e dobre a omelete ao meio.', duration: '1 min' },
        ],
        totalTime: '10 min',
        difficulty: 'Fácil',
      },
      {
        ...base,
        id: `mock-3-${Date.now()}`,
        title: 'Arroz Frito com Legumes',
        description: 'Receita asiática rápida para aproveitar sobras.',
        ingredients: ['2 xícaras de arroz cozido', '2 ovos', 'Cenoura', 'Ervilhas', 'Shoyu'],
        steps: [
          { order: 1, instruction: 'Refogue a cenoura em cubos na frigideira com óleo.', duration: '3 min' },
          { order: 2, instruction: 'Adicione o arroz e misture bem.', duration: '2 min' },
          { order: 3, instruction: 'Abra espaço, frite os ovos mexidos e misture tudo com shoyu.', duration: '3 min' },
        ],
        totalTime: '10 min',
        difficulty: 'Fácil',
      },
    ];

    return mocks;
  }
}

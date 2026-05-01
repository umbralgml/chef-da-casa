import type { AIProvider, Recipe, RecipeRequest } from '../types';

// Cost notice: OpenAI API usage incurs per-token charges.
// Enable only with explicit user authorization and a valid API key.
export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAI';

  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateRecipes(request: RecipeRequest): Promise<Recipe[]> {
    const styleLabels = {
      quick: 'rápida e simples, pronta em até 20 minutos',
      gourmet: 'elaborada e gourmet, com técnicas culinárias refinadas',
      creative: 'criativa e diferente, com combinações surpreendentes',
    };

    const prompt = `Você é um chef profissional. Com base nos ingredientes abaixo, sugira 3 receitas ${styleLabels[request.cookingStyle]}.

Ingredientes disponíveis: ${request.ingredients.join(', ')}

Responda APENAS com um JSON válido no seguinte formato:
{
  "recipes": [
    {
      "title": "Nome da Receita",
      "description": "Breve descrição apetitosa",
      "ingredients": ["ingrediente 1 com quantidade", "ingrediente 2 com quantidade"],
      "steps": [
        { "order": 1, "instruction": "Passo detalhado", "duration": "5 min" }
      ],
      "totalTime": "20 min",
      "difficulty": "Fácil",
      "servings": 2
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    return parsed.recipes.map((r: Omit<Recipe, 'id' | 'cookingStyle'>) => ({
      ...r,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      cookingStyle: request.cookingStyle,
    }));
  }
}

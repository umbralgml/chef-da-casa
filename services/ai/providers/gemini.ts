import type { AIProvider, Recipe, RecipeRequest } from '../types';

// Cost notice: Google Gemini API has a free tier (gemini-1.5-flash: 15 RPM, 1M TPM free).
// This provider uses the free tier by default.
export class GeminiProvider implements AIProvider {
  readonly name = 'Gemini';

  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateRecipes(request: RecipeRequest): Promise<Recipe[]> {
    const styleLabels = {
      quick: 'rápida e simples, pronta em até 20 minutos',
      gourmet: 'elaborada e gourmet, com técnicas culinárias refinadas',
      creative: 'criativa e diferente, com combinações surpreendentes',
    };

    const prompt = `Você é um chef profissional. Com base nos ingredientes abaixo, sugira 3 receitas ${styleLabels[request.cookingStyle]}.

Ingredientes disponíveis: ${request.ingredients.join(', ')}

Responda APENAS com um JSON válido no seguinte formato (sem markdown):
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(text);

    return parsed.recipes.map((r: Omit<Recipe, 'id' | 'cookingStyle'>) => ({
      ...r,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      cookingStyle: request.cookingStyle,
    }));
  }
}

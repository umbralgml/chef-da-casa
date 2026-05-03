import type { AIProvider, Recipe, RecipeRequest } from '../types';

// Free tier: gemini-1.5-flash — 15 RPM, 1.5k req/day, 1M tokens/day. Zero cost.
export class GeminiProvider implements AIProvider {
  readonly name = 'Gemini';

  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async testConnection(): Promise<void> {
    const response = await fetch(this.buildUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Responda só: ok' }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });
    if (!response.ok) throw await this.buildError(response);
  }

  async generateRecipes(request: RecipeRequest): Promise<Recipe[]> {
    const styleLabels = {
      quick: 'rápida e simples (máx. 20 minutos)',
      gourmet: 'elaborada e gourmet com técnicas refinadas',
      creative: 'criativa e diferente com combinações surpreendentes',
    };

    const prompt = `Você é um chef profissional brasileiro. Sugira 3 receitas ${styleLabels[request.cookingStyle]} usando os ingredientes disponíveis.

Ingredientes: ${request.ingredients.join(', ')}

Retorne SOMENTE JSON válido, sem markdown, no formato:
{"recipes":[{"title":"string","description":"string","ingredients":["string"],"steps":[{"order":1,"instruction":"string","duration":"string"}],"totalTime":"string","difficulty":"Fácil","servings":2}]}

O campo difficulty deve ser exatamente uma dessas strings: "Fácil", "Médio" ou "Difícil".`;

    const response = await fetch(this.buildUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) throw await this.buildError(response);

    const data = await response.json();
    const candidate = data?.candidates?.[0];

    if (!candidate) {
      const reason = data?.promptFeedback?.blockReason;
      throw new Error(reason ? `Conteúdo bloqueado pela API: ${reason}` : 'A API não retornou receitas. Tente novamente.');
    }

    const raw: string = candidate.content?.parts?.[0]?.text ?? '';
    const parsed = this.parseJSON(raw);

    if (!Array.isArray(parsed?.recipes) || parsed.recipes.length === 0) {
      throw new Error('A IA retornou um formato inesperado. Tente novamente.');
    }

    return parsed.recipes.map((r: Omit<Recipe, 'id' | 'cookingStyle'>) => ({
      ...r,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      cookingStyle: request.cookingStyle,
      difficulty: this.normalizeDifficulty(r.difficulty),
      servings: Number(r.servings) || 2,
      steps: (r.steps ?? []).map((s, i) => ({ order: i + 1, ...s })),
    }));
  }

  private buildUrl(): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
  }

  private async buildError(response: Response): Promise<Error> {
    let detail = `Erro ${response.status}`;
    try {
      const body = await response.json();
      detail = body?.error?.message ?? detail;
    } catch {}

    if (response.status === 400) return new Error(`Chave inválida ou mal formatada.\nDetalhe: ${detail}`);
    if (response.status === 403) return new Error(`Chave sem permissão. Verifique se a API "Generative Language" está ativada no Google AI Studio.\nDetalhe: ${detail}`);
    if (response.status === 429) return new Error('Limite gratuito atingido. Aguarde 1 minuto e tente novamente.');
    if (response.status === 503) return new Error('Serviço do Google indisponível. Tente em alguns instantes.');
    return new Error(`Erro na API Gemini (${response.status}): ${detail}`);
  }

  private parseJSON(raw: string): { recipes: Omit<Recipe, 'id' | 'cookingStyle'>[] } {
    const stripped = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();

    try {
      return JSON.parse(stripped);
    } catch {
      // Last resort: extract first {...} block
      const start = stripped.indexOf('{');
      const end = stripped.lastIndexOf('}');
      if (start !== -1 && end > start) {
        return JSON.parse(stripped.slice(start, end + 1));
      }
      throw new Error('Resposta da IA não é um JSON válido. Tente novamente.');
    }
  }

  private normalizeDifficulty(value: unknown): Recipe['difficulty'] {
    const map: Record<string, Recipe['difficulty']> = {
      fácil: 'Fácil', facil: 'Fácil', easy: 'Fácil', simples: 'Fácil',
      médio: 'Médio', medio: 'Médio', medium: 'Médio', moderado: 'Médio',
      difícil: 'Difícil', dificil: 'Difícil', hard: 'Difícil', avançado: 'Difícil',
    };
    return map[String(value).toLowerCase()] ?? 'Fácil';
  }
}

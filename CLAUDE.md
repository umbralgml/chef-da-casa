# Chef de Casa — Regras de Desenvolvimento

## Visão Geral

Aplicativo mobile em React Native / Expo que sugere receitas baseadas nos ingredientes disponíveis, usando IA para geração de conteúdo. MVP gratuito — qualquer custo de infraestrutura deve ser informado e aprovado antes de ser implementado.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Expo SDK 54 + Expo Router v4 |
| Linguagem | TypeScript (strict) |
| UI | React Native + NativeWind v4 (Tailwind CSS) |
| Estado | Zustand (local, sem backend) |
| IA (dev) | MockAIProvider (zero custo) |
| IA (prod) | Gemini 1.5 Flash (free tier) ou OpenAI (custo — requere aprovação) |

## Estrutura de Pastas

```
/app            → Telas (Expo Router file-based routing)
/components     → Componentes reutilizáveis de UI
/services/ai    → Provedores de IA e lógica de geração de receitas
/constants      → Cores, temas, dados estáticos
/store          → Estado global (Zustand)
```

## Regras de Código

### TypeScript
- `strict: true` sempre ativo — nunca use `any` explícito.
- Prefira `type` para shapes de dados simples; use `interface` apenas quando precisar de extensão/implements.
- Exporte tipos de domínio a partir de `services/ai/types.ts`.

### Componentes React Native
- Um arquivo = um componente exportado como named export.
- Props sempre tipadas com `interface Props` local.
- Sem `StyleSheet.create` — use inline styles ou NativeWind classes.
- Botões acessíveis: `Pressable` com `hitSlop` ≥ 8 para alvos pequenos.
- Nunca use `TouchableOpacity` ou `TouchableHighlight` (legado).

### Estado
- Todo estado de negócio vai em `useAppStore` (Zustand).
- Estado local de UI (texto de input, foco) fica em `useState` no componente.
- Nunca acesse o store diretamente fora de componentes/hooks — use seletores.

### Serviços de IA
- `MockAIProvider` é o padrão em desenvolvimento (zero custo, offline).
- Provedores reais (`GeminiProvider`, `OpenAIProvider`) são configurados via `setAIProvider()` e requerem chave de API.
- **Regra de custo:** qualquer integração que gere custo financeiro (API paga, banco de dados externo, CDN, storage) deve ser documentada com estimativa e aprovada antes de ser mergeada.

### Navegação
- Use `useRouter()` do Expo Router para navegação imperativa.
- Parâmetros simples passam via store; parâmetros de rota são usados apenas para IDs.

### Estilo e UX
- Paleta definida em `constants/colors.ts` — não use hex literals fora desse arquivo.
- Fonte do sistema (`System`) — não adicione fontes customizadas sem aprovação (impacta bundle size).
- Design mobile-first: botões com `paddingVertical` mínimo de 14px.
- `SafeAreaView` com `edges={['bottom']}` em telas com scroll; sem `edges` na home (header customizado).

## Convenções de Commit

```
feat: adiciona tela de detalhe da receita
fix: corrige parsing do JSON da Gemini API
chore: atualiza dependências do Expo
docs: atualiza CLAUDE.md com regras de IA
```

## O que NÃO fazer

- Não instale dependências sem verificar se já existe algo equivalente no projeto.
- Não use `console.log` em produção — use apenas em dev com comentário `// dev-only`.
- Não adicione animações complexas sem aprovar impacto em performance.
- Não implemente autenticação, backend próprio ou banco de dados sem aprovação — o MVP é totalmente offline/local.
- Não use `expo-av`, câmera ou recursos nativos pesados sem avaliar impacto no tamanho do app.

## Fluxo de Desenvolvimento

1. `npm install` para instalar dependências.
2. `npm start` → Expo Dev Client ou Expo Go.
3. Use o `MockAIProvider` para desenvolver sem API keys.
4. Para testar com IA real: configure a variável de ambiente `GEMINI_API_KEY` (free tier).

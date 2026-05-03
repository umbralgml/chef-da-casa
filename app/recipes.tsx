import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard } from '@/components/RecipeCard';
import { COOKING_STYLES } from '@/constants';
import { generateRecipes, getProviderName } from '@/services/ai/recipeService';
import { useAppStore } from '@/store/useAppStore';

export default function RecipesScreen() {
  const router = useRouter();
  const {
    ingredients, selectedStyle, recipes,
    isLoading, error,
    setRecipes, setSelectedRecipe, setLoading, setError,
  } = useAppStore();

  const fetchedRef = useRef(false);
  const styleInfo = COOKING_STYLES.find((s) => s.id === selectedStyle);
  const providerName = getProviderName();

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      if (recipes.length === 0 && selectedStyle) fetchRecipes();
    }
  }, []);

  async function fetchRecipes() {
    if (!selectedStyle) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateRecipes({ ingredients, cookingStyle: selectedStyle });
      setRecipes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar receitas.');
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    fetchedRef.current = true;
    fetchRecipes();
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 52, marginBottom: 20 }}>🍳</Text>
        <ActivityIndicator size="large" color="#E8622A" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#1A1A1A', fontWeight: '600', textAlign: 'center' }}>
          Gerando suas receitas...
        </Text>
        <Text style={{ marginTop: 6, fontSize: 14, color: '#6B6B6B', textAlign: 'center' }}>
          {providerName === 'Gemini' ? 'Consultando a IA do Google (alguns segundos)' : 'Carregando receitas de exemplo'}
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    const isKeyError = error.toLowerCase().includes('chave') || error.toLowerCase().includes('permissão') || error.toLowerCase().includes('403') || error.toLowerCase().includes('400');

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0', justifyContent: 'center', padding: 28 }}>
        <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#1A1A1A', textAlign: 'center', marginBottom: 10 }}>
          Não foi possível gerar receitas
        </Text>
        <View style={{ backgroundColor: '#FDECEA', borderRadius: 12, padding: 14, marginBottom: 24, borderWidth: 1, borderColor: '#F5C6CB' }}>
          <Text style={{ fontSize: 14, color: '#7B2D2D', lineHeight: 21 }}>{error}</Text>
        </View>

        <Pressable
          onPress={handleRetry}
          style={({ pressed }) => ({
            backgroundColor: '#E8622A', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginBottom: 12, opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Tentar novamente</Text>
        </Pressable>

        {isKeyError && (
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => ({
              backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1.5, borderColor: '#E5DDD4', opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ color: '#1A1A1A', fontWeight: '600', fontSize: 16 }}>Verificar chave da API ⚙️</Text>
          </Pressable>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0' }} edges={['bottom']}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          styleInfo ? (
            <View style={{ marginBottom: 16 }}>
              <View style={{ backgroundColor: styleInfo.color + '15', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 18 }}>{styleInfo.emoji}</Text>
                <Text style={{ color: styleInfo.color, fontWeight: '600', fontSize: 13, flex: 1 }} numberOfLines={1}>
                  {styleInfo.label} · {ingredients.join(', ')}
                </Text>
                {providerName === 'Gemini' && (
                  <View style={{ backgroundColor: styleInfo.color + '25', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: styleInfo.color }}>IA Real</Text>
                  </View>
                )}
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => { setSelectedRecipe(item); router.push('/recipe-detail'); }}
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 48 }}>🤔</Text>
            <Text style={{ fontSize: 16, color: '#6B6B6B', marginTop: 12, textAlign: 'center' }}>Nenhuma receita encontrada.</Text>
            <Pressable
              onPress={handleRetry}
              style={{ marginTop: 20, backgroundColor: '#E8622A', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Tentar novamente</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

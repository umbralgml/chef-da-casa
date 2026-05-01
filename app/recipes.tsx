import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard } from '@/components/RecipeCard';
import { COOKING_STYLES } from '@/constants';
import { generateRecipes } from '@/services/ai/recipeService';
import { useAppStore } from '@/store/useAppStore';

export default function RecipesScreen() {
  const router = useRouter();
  const {
    ingredients,
    selectedStyle,
    recipes,
    isLoading,
    error,
    setRecipes,
    setSelectedRecipe,
    setLoading,
    setError,
  } = useAppStore();

  const styleInfo = COOKING_STYLES.find((s) => s.id === selectedStyle);

  useEffect(() => {
    if (recipes.length === 0 && selectedStyle) {
      fetchRecipes();
    }
  }, []);

  async function fetchRecipes() {
    if (!selectedStyle) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateRecipes({
        ingredients,
        cookingStyle: selectedStyle,
      });
      setRecipes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar receitas.');
    } finally {
      setLoading(false);
    }
  }

  function handleSelectRecipe(recipe: (typeof recipes)[0]) {
    setSelectedRecipe(recipe);
    router.push('/recipe-detail');
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 20 }}>🍳</Text>
        <ActivityIndicator size="large" color="#E8622A" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#6B6B6B', textAlign: 'center' }}>
          Gerando receitas com seus ingredientes...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 16, color: '#1A1A1A', textAlign: 'center', marginBottom: 24 }}>{error}</Text>
        <Pressable
          onPress={fetchRecipes}
          style={{ backgroundColor: '#E8622A', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Tentar novamente</Text>
        </Pressable>
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
          <View style={{ marginBottom: 20 }}>
            {styleInfo && (
              <View
                style={{
                  backgroundColor: styleInfo.color + '15',
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 20 }}>{styleInfo.emoji}</Text>
                <Text style={{ color: styleInfo.color, fontWeight: '600', fontSize: 14 }}>
                  {styleInfo.label} · {ingredients.join(', ')}
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={() => handleSelectRecipe(item)} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 48 }}>🤔</Text>
            <Text style={{ fontSize: 16, color: '#6B6B6B', marginTop: 12 }}>
              Nenhuma receita encontrada.
            </Text>
            <Pressable
              onPress={fetchRecipes}
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

import { Pressable, Text, View } from 'react-native';
import type { Recipe } from '@/services/ai/types';

interface Props {
  recipe: Recipe;
  onPress: () => void;
}

const difficultyColor: Record<string, string> = {
  Fácil: '#2D6A4F',
  Médio: '#E8622A',
  Difícil: '#C0392B',
};

export function RecipeCard({ recipe, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E5DDD4',
        opacity: pressed ? 0.9 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#1A1A1A', flex: 1, marginRight: 8 }}>
          {recipe.title}
        </Text>
        <View
          style={{
            backgroundColor: difficultyColor[recipe.difficulty] + '20',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 8,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: difficultyColor[recipe.difficulty] }}>
            {recipe.difficulty}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 10, lineHeight: 20 }}>
        {recipe.description}
      </Text>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 13 }}>⏱</Text>
          <Text style={{ fontSize: 13, color: '#6B6B6B' }}>{recipe.totalTime}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 13 }}>🍽</Text>
          <Text style={{ fontSize: 13, color: '#6B6B6B' }}>{recipe.servings} porções</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 13 }}>📋</Text>
          <Text style={{ fontSize: 13, color: '#6B6B6B' }}>{recipe.steps.length} passos</Text>
        </View>
      </View>
    </Pressable>
  );
}

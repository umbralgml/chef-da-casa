import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';

export default function RecipeDetailScreen() {
  const { selectedRecipe } = useAppStore();

  if (!selectedRecipe) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 48 }}>🍽</Text>
        <Text style={{ fontSize: 16, color: '#6B6B6B', marginTop: 12 }}>Nenhuma receita selecionada.</Text>
      </SafeAreaView>
    );
  }

  const difficultyColor: Record<string, string> = {
    Fácil: '#2D6A4F',
    Médio: '#E8622A',
    Difícil: '#C0392B',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5, marginBottom: 8 }}>
          {selectedRecipe.title}
        </Text>
        <Text style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 22, marginBottom: 20 }}>
          {selectedRecipe.description}
        </Text>

        {/* Meta */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
          {[
            { icon: '⏱', label: selectedRecipe.totalTime },
            { icon: '🍽', label: `${selectedRecipe.servings} porções` },
            {
              icon: '📊',
              label: selectedRecipe.difficulty,
              color: difficultyColor[selectedRecipe.difficulty],
            },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#E5DDD4',
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: item.color ?? '#1A1A1A', textAlign: 'center' }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Ingredients */}
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 }}>
          🛒 Ingredientes
        </Text>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            padding: 16,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: '#E5DDD4',
          }}
        >
          {selectedRecipe.ingredients.map((ing, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: idx < selectedRecipe.ingredients.length - 1 ? 1 : 0,
                borderBottomColor: '#F0EAE4',
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#E8622A',
                  marginRight: 12,
                }}
              />
              <Text style={{ fontSize: 15, color: '#1A1A1A' }}>{ing}</Text>
            </View>
          ))}
        </View>

        {/* Steps */}
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 }}>
          📋 Modo de Preparo
        </Text>
        {selectedRecipe.steps.map((step) => (
          <View
            key={step.order}
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: '#E5DDD4',
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#E8622A',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
                flexShrink: 0,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>{step.order}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, color: '#1A1A1A', lineHeight: 22 }}>{step.instruction}</Text>
              {step.duration && (
                <Text style={{ fontSize: 12, color: '#6B6B6B', marginTop: 6 }}>⏱ {step.duration}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IngredientTag } from '@/components/IngredientTag';
import { useAppStore } from '@/store/useAppStore';

// Placeholder screen — OCR/camera integration will be added in a future sprint (zero-cost path: Expo Camera + on-device ML).
export default function PantryScreen() {
  const { ingredients, removeIngredient } = useAppStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 }}>
          Minha Despensa
        </Text>
        <Text style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 24 }}>
          Em breve: tire uma foto dos ingredientes e deixe a IA identificar para você. Por ora, adicione pela tela inicial.
        </Text>

        {ingredients.length > 0 ? (
          <>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 }}>
              Ingredientes adicionados ({ingredients.length})
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {ingredients.map((ing) => (
                <IngredientTag key={ing} label={ing} onRemove={() => removeIngredient(ing)} />
              ))}
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 48 }}>🥦</Text>
            <Text style={{ fontSize: 16, color: '#6B6B6B', marginTop: 12, textAlign: 'center' }}>
              Nenhum ingrediente adicionado ainda.{'\n'}Volte à tela inicial para começar.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

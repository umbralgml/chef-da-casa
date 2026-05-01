import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CookingStyleButton } from '@/components/CookingStyleButton';
import { IngredientTag } from '@/components/IngredientTag';
import { COOKING_STYLES, type CookingStyleId } from '@/constants';
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const router = useRouter();
  const { ingredients, selectedStyle, addIngredient, removeIngredient, setSelectedStyle } = useAppStore();
  const [inputText, setInputText] = useState('');

  function handleAddIngredient() {
    const trimmed = inputText.trim();
    if (trimmed.length > 0) {
      addIngredient(trimmed);
      setInputText('');
    }
  }

  function handleGenerate() {
    if (ingredients.length === 0 || !selectedStyle) return;
    router.push('/recipes');
  }

  const canGenerate = ingredients.length > 0 && selectedStyle !== null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 36, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 }}>
              Chef de Casa
            </Text>
            <Text style={{ fontSize: 16, color: '#6B6B6B', marginTop: 4 }}>
              O que tem na sua despensa hoje?
            </Text>
          </View>

          {/* Ingredient Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 10 }}>
              Ingredientes disponíveis
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleAddIngredient}
                placeholder="ex: frango, alho, azeite..."
                placeholderTextColor="#B0A8A0"
                returnKeyType="done"
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5DDD4',
                  borderWidth: 1.5,
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: '#1A1A1A',
                }}
              />
              <Pressable
                onPress={handleAddIngredient}
                style={({ pressed }) => ({
                  backgroundColor: '#E8622A',
                  borderRadius: 14,
                  paddingHorizontal: 18,
                  justifyContent: 'center',
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '600' }}>+</Text>
              </Pressable>
            </View>

            {ingredients.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
                {ingredients.map((ing) => (
                  <IngredientTag
                    key={ing}
                    label={ing}
                    onRemove={() => removeIngredient(ing)}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Cooking Style */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 }}>
              Que tipo de receita você quer?
            </Text>

            {COOKING_STYLES.map((style) => (
              <CookingStyleButton
                key={style.id}
                emoji={style.emoji}
                label={style.label}
                description={style.description}
                color={style.color}
                selected={selectedStyle === style.id}
                onPress={() => setSelectedStyle(style.id as CookingStyleId)}
              />
            ))}
          </View>

          {/* Generate Button */}
          <Pressable
            onPress={handleGenerate}
            disabled={!canGenerate}
            style={({ pressed }) => ({
              backgroundColor: canGenerate ? '#E8622A' : '#D4C9C0',
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
              shadowColor: canGenerate ? '#E8622A' : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: canGenerate ? 5 : 0,
            })}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.3 }}>
              {canGenerate ? 'Gerar Receitas 🍳' : 'Adicione ingredientes e escolha um estilo'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

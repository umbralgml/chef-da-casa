import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProviderName } from '@/services/ai/recipeService';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { geminiKey, saveGeminiKey } = useAppStore();
  const [inputKey, setInputKey] = useState(geminiKey);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    saveGeminiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleRemove() {
    setInputKey('');
    saveGeminiKey('');
    setSaved(false);
  }

  const providerName = getProviderName();
  const isUsingGemini = providerName === 'Gemini';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0' }} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">

          {/* Provider status */}
          <View
            style={{
              backgroundColor: isUsingGemini ? '#E8F5E9' : '#FFF3EE',
              borderRadius: 14,
              padding: 16,
              marginBottom: 32,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 28 }}>{isUsingGemini ? '🤖' : '🧪'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A' }}>
                Provedor ativo: {providerName}
              </Text>
              <Text style={{ fontSize: 13, color: '#6B6B6B', marginTop: 2 }}>
                {isUsingGemini
                  ? 'Receitas reais geradas por IA (Gemini 1.5 Flash — free tier)'
                  : 'Modo demonstração — receitas de exemplo, sem IA real'}
              </Text>
            </View>
          </View>

          {/* Gemini Key Section */}
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 }}>
            Chave da API Gemini
          </Text>
          <Text style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 20, marginBottom: 16 }}>
            Configure sua chave para gerar receitas reais com IA. O plano gratuito do Google AI Studio inclui{' '}
            <Text style={{ fontWeight: '600', color: '#2D6A4F' }}>1 milhão de tokens por dia</Text> — mais que suficiente para uso pessoal.
          </Text>

          <TextInput
            value={inputKey}
            onChangeText={(t) => { setInputKey(t); setSaved(false); }}
            placeholder="Cole sua chave aqui: AIza..."
            placeholderTextColor="#B0A8A0"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E5DDD4',
              borderWidth: 1.5,
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 15,
              color: '#1A1A1A',
              marginBottom: 12,
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            }}
          />

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 32 }}>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: saved ? '#2D6A4F' : '#E8622A',
                borderRadius: 14,
                paddingVertical: 15,
                alignItems: 'center',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                {saved ? '✓ Salvo!' : 'Salvar chave'}
              </Text>
            </Pressable>

            {geminiKey ? (
              <Pressable
                onPress={handleRemove}
                style={({ pressed }) => ({
                  backgroundColor: '#F5F0EB',
                  borderRadius: 14,
                  paddingVertical: 15,
                  paddingHorizontal: 18,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                  borderWidth: 1.5,
                  borderColor: '#E5DDD4',
                })}
              >
                <Text style={{ color: '#6B6B6B', fontWeight: '600', fontSize: 16 }}>Remover</Text>
              </Pressable>
            ) : null}
          </View>

          {/* How to get key */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              padding: 18,
              borderWidth: 1,
              borderColor: '#E5DDD4',
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 }}>
              Como obter a chave (gratuito)
            </Text>
            {[
              'Acesse aistudio.google.com',
              'Faça login com sua conta Google',
              'Clique em "Get API key" → "Create API key"',
              'Copie a chave gerada e cole aqui',
            ].map((step, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: '#E8622A',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>{i + 1}</Text>
                </View>
                <Text style={{ fontSize: 14, color: '#1A1A1A', flex: 1, lineHeight: 22 }}>{step}</Text>
              </View>
            ))}

            <Pressable
              onPress={() => Linking.openURL('https://aistudio.google.com/app/apikey')}
              style={({ pressed }) => ({
                backgroundColor: '#4285F4',
                borderRadius: 12,
                paddingVertical: 13,
                alignItems: 'center',
                marginTop: 8,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>
                Abrir Google AI Studio
              </Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 24, padding: 14, backgroundColor: '#F0EAE4', borderRadius: 12 }}>
            <Text style={{ fontSize: 12, color: '#6B6B6B', lineHeight: 18 }}>
              🔒 Sua chave é salva apenas neste dispositivo (localStorage) e nunca é enviada para servidores do Chef de Casa. As chamadas vão direto do seu navegador para a API do Google.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

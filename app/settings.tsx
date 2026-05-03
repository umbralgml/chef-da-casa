import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
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
import { getProviderName, testGeminiKey } from '@/services/ai/recipeService';
import { useAppStore } from '@/store/useAppStore';

type TestState = 'idle' | 'loading' | 'ok' | 'error';

export default function SettingsScreen() {
  const router = useRouter();
  const { geminiKey, saveGeminiKey } = useAppStore();

  const [inputKey, setInputKey] = useState(geminiKey);
  const [saved, setSaved] = useState(false);
  const [testState, setTestState] = useState<TestState>('idle');
  const [testMessage, setTestMessage] = useState('');

  // Re-read provider name on every render so it reflects current state.
  const providerName = getProviderName();
  const isUsingGemini = providerName === 'Gemini';

  async function handleTest() {
    const key = inputKey.trim();
    if (!key) { setTestMessage('Cole uma chave antes de testar.'); setTestState('error'); return; }
    setTestState('loading');
    setTestMessage('');
    try {
      await testGeminiKey(key);
      setTestState('ok');
      setTestMessage('Conexão bem-sucedida! A chave está funcionando.');
    } catch (err) {
      setTestState('error');
      setTestMessage(err instanceof Error ? err.message : 'Erro desconhecido.');
    }
  }

  async function handleSave() {
    await saveGeminiKey(inputKey);
    setSaved(true);
    setTestState('idle');
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleRemove() {
    setInputKey('');
    await saveGeminiKey('');
    setTestState('idle');
    setTestMessage('');
    setSaved(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F5F0' }} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Status do provedor */}
          <View
            style={{
              backgroundColor: isUsingGemini ? '#E8F5E9' : '#FFF3EE',
              borderRadius: 14,
              padding: 16,
              marginBottom: 28,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              borderWidth: 1,
              borderColor: isUsingGemini ? '#A5D6A7' : '#F4C5A8',
            }}
          >
            <Text style={{ fontSize: 28 }}>{isUsingGemini ? '🤖' : '🧪'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A' }}>
                Provedor: {providerName}
              </Text>
              <Text style={{ fontSize: 13, color: '#6B6B6B', marginTop: 2, lineHeight: 18 }}>
                {isUsingGemini
                  ? 'Receitas reais com Gemini 1.5 Flash (free tier)'
                  : 'Demonstração local — configure a chave para usar IA real'}
              </Text>
            </View>
          </View>

          {/* Campo da chave */}
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 }}>
            Chave da API Gemini
          </Text>
          <Text style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 20, marginBottom: 14 }}>
            Gratuito via Google AI Studio:{' '}
            <Text style={{ fontWeight: '600', color: '#2D6A4F' }}>1 milhão de tokens/dia</Text>.
            A chave fica salva só neste dispositivo.
          </Text>

          <TextInput
            value={inputKey}
            onChangeText={(t) => { setInputKey(t); setSaved(false); setTestState('idle'); }}
            placeholder="AIzaSy..."
            placeholderTextColor="#B0A8A0"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={false}
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: testState === 'ok' ? '#2D6A4F' : testState === 'error' ? '#C0392B' : '#E5DDD4',
              borderWidth: 1.5,
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 14,
              color: '#1A1A1A',
              marginBottom: 10,
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              letterSpacing: 0.5,
            }}
          />

          {/* Resultado do teste */}
          {testMessage ? (
            <View
              style={{
                backgroundColor: testState === 'ok' ? '#E8F5E9' : '#FDECEA',
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: testState === 'ok' ? '#A5D6A7' : '#F5C6CB',
              }}
            >
              <Text style={{ fontSize: 13, color: testState === 'ok' ? '#1B5E20' : '#7B2D2D', lineHeight: 19 }}>
                {testState === 'ok' ? '✓ ' : '✗ '}{testMessage}
              </Text>
            </View>
          ) : null}

          {/* Botões */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 28 }}>
            {/* Testar */}
            <Pressable
              onPress={handleTest}
              disabled={testState === 'loading'}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: '#F5F0EB',
                borderRadius: 14,
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed || testState === 'loading' ? 0.7 : 1,
                borderWidth: 1.5,
                borderColor: '#E5DDD4',
                flexDirection: 'row',
                gap: 8,
              })}
            >
              {testState === 'loading'
                ? <ActivityIndicator size="small" color="#6B6B6B" />
                : <Text style={{ color: '#6B6B6B', fontWeight: '700', fontSize: 15 }}>Testar</Text>}
            </Pressable>

            {/* Salvar */}
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => ({
                flex: 2,
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

            {/* Remover */}
            {geminiKey ? (
              <Pressable
                onPress={handleRemove}
                style={({ pressed }) => ({
                  paddingHorizontal: 14,
                  backgroundColor: '#F5F0EB',
                  borderRadius: 14,
                  paddingVertical: 15,
                  alignItems: 'center',
                  opacity: pressed ? 0.8 : 1,
                  borderWidth: 1.5,
                  borderColor: '#E5DDD4',
                })}
              >
                <Text style={{ color: '#C0392B', fontWeight: '600', fontSize: 14 }}>✕</Text>
              </Pressable>
            ) : null}
          </View>

          {/* Como obter */}
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E5DDD4' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 14 }}>
              Como obter a chave (gratuito)
            </Text>
            {[
              { n: 1, text: 'Acesse aistudio.google.com' },
              { n: 2, text: 'Faça login com sua conta Google' },
              { n: 3, text: 'Clique em "Get API key" → "Create API key"' },
              { n: 4, text: 'Copie a chave (começa com "AIza...") e cole acima' },
              { n: 5, text: 'Clique em "Testar" para confirmar que funciona, depois "Salvar"' },
            ].map(({ n, text }) => (
              <View key={n} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#E8622A', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0, marginTop: 1 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>{n}</Text>
                </View>
                <Text style={{ fontSize: 14, color: '#1A1A1A', flex: 1, lineHeight: 22 }}>{text}</Text>
              </View>
            ))}

            <Pressable
              onPress={() => Linking.openURL('https://aistudio.google.com/app/apikey')}
              style={({ pressed }) => ({
                backgroundColor: '#4285F4',
                borderRadius: 12,
                paddingVertical: 13,
                alignItems: 'center',
                marginTop: 6,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>
                Abrir Google AI Studio →
              </Text>
            </Pressable>
          </View>

          <Text style={{ fontSize: 12, color: '#9B8E86', lineHeight: 18, marginTop: 16, textAlign: 'center' }}>
            🔒 A chave fica apenas neste navegador (localStorage). Nenhum servidor do Chef de Casa tem acesso a ela.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

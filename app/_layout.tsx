import { Stack, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="dark" backgroundColor="#F9F5F0" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#F9F5F0' },
          headerTintColor: '#1A1A1A',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F9F5F0' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: 'Chef de Casa',
            headerTitleStyle: { fontWeight: '800', fontSize: 18 },
            headerRight: () => (
              <Pressable
                onPress={() => router.push('/settings')}
                hitSlop={12}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, marginRight: 4 })}
              >
                <Text style={{ fontSize: 22 }}>⚙️</Text>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen name="pantry" options={{ title: 'Minha Despensa' }} />
        <Stack.Screen name="recipes" options={{ title: 'Receitas Sugeridas' }} />
        <Stack.Screen name="recipe-detail" options={{ title: 'Receita' }} />
        <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
      </Stack>
    </>
  );
}

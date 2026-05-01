import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="pantry" options={{ title: 'Minha Despensa' }} />
        <Stack.Screen name="recipes" options={{ title: 'Receitas Sugeridas' }} />
        <Stack.Screen name="recipe-detail" options={{ title: 'Receita' }} />
      </Stack>
    </>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const GEMINI_KEY = 'gemini_key';

export async function readKey(): Promise<string> {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(GEMINI_KEY) ?? ''; } catch { return ''; }
  }
  return (await AsyncStorage.getItem(GEMINI_KEY)) ?? '';
}

export async function writeKey(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try { value ? localStorage.setItem(GEMINI_KEY, value) : localStorage.removeItem(GEMINI_KEY); } catch {}
    return;
  }
  value ? await AsyncStorage.setItem(GEMINI_KEY, value) : await AsyncStorage.removeItem(GEMINI_KEY);
}

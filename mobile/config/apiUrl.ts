import { Platform } from 'react-native';

/**
 * Expo only inlines env vars prefixed with EXPO_PUBLIC_.
 * Android emulator reaches the host machine at 10.0.2.2; iOS simulator uses localhost.
 */
export function getApiUrl(): string {
  if (Platform.OS === 'android') {
    return process.env.EXPO_PUBLIC_API_URL_ANDROID ?? 'http://10.0.2.2:3000';
  }

  return process.env.EXPO_PUBLIC_API_URL_IOS ?? 'http://localhost:3000';
}

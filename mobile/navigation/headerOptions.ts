import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/** Shared native stack toolbar (top bar) styling for every screen */
export const stackHeaderOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTitleStyle: {
    fontWeight: '600',
  },
  headerShadowVisible: true,
};

process.env.EXPO_PUBLIC_API_URL_IOS = 'https://api.test';
process.env.EXPO_PUBLIC_API_URL_ANDROID = 'https://api.test';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

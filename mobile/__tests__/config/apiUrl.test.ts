import { Platform } from 'react-native';
import { getApiUrl } from '../../config/apiUrl';

describe('getApiUrl', () => {
  const originalIos = process.env.EXPO_PUBLIC_API_URL_IOS;
  const originalAndroid = process.env.EXPO_PUBLIC_API_URL_ANDROID;

  afterEach(() => {
    process.env.EXPO_PUBLIC_API_URL_IOS = originalIos;
    process.env.EXPO_PUBLIC_API_URL_ANDROID = originalAndroid;
  });

  it('uses the Android URL on Android', () => {
    process.env.EXPO_PUBLIC_API_URL_ANDROID = 'http://10.0.2.2:3000';
    Platform.OS = 'android';

    expect(getApiUrl()).toBe('http://10.0.2.2:3000');
  });

  it('uses the iOS URL on iOS', () => {
    process.env.EXPO_PUBLIC_API_URL_IOS = 'http://localhost:3000';
    Platform.OS = 'ios';

    expect(getApiUrl()).toBe('http://localhost:3000');
  });
});

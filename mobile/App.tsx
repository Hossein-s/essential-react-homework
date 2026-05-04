import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackHeaderOptions } from './navigation/headerOptions';
import type { RootStackParamList } from './types';
import { AddLotteryScreen } from './screens/AddLotteryScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RegisterToLotteryScreen } from './screens/RegisterToLotteryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={stackHeaderOptions}>
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddLottery" component={AddLotteryScreen} />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            ...stackHeaderOptions,
            presentation: 'modal',
          }}
        >
          <Stack.Screen
            name="RegisterToLottery"
            component={RegisterToLotteryScreen}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

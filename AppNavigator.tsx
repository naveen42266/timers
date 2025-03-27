import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import HomeScreen from './pages/home';
import AddTimerScreen from './pages/addTimer';
import HistoryScreen from './pages/history';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTimer"
          component={AddTimerScreen}
          options={{ title: 'Add New Timer' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Timer History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default AppNavigator;
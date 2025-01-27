import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import History from '../Screen/History';
import HomeScreen from '../Screen/HomeScreen';
import SplashScreen from '../Screen/SplashScreen';

const Route = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          options={{
            headerBackVisible: false,
            gestureEnabled: true,
            navigationBarHidden: true,
            headerShown: false,
            animation: 'slide_from_right',
          }}
          name="SplashScreen"
          component={SplashScreen}
        />

        <Stack.Screen
          options={{
            headerBackVisible: false,
            gestureEnabled: true,
            navigationBarHidden: true,
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
          name="home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{
            headerBackVisible: false,
            gestureEnabled: true,
            navigationBarHidden: true,
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
          name="history"
          component={History}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Route;

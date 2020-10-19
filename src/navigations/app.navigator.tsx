import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './auth.navigator';
import { AppRoute } from './app.routes';
import { MainNavigator } from './main.navigator';
import { OnboardingNavigator } from './onboarding.navigator';

const Stack = createStackNavigator();

export const AppNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.ONBOARDING} component={OnboardingNavigator} options={{gestureEnabled: false}}/>
    <Stack.Screen name={AppRoute.MAIN} component={MainNavigator} options={{gestureEnabled: false}}/>
  </Stack.Navigator>
);
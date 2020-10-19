import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';
import { GetStartedScene } from '../scenes/Onboarding/GetStarted.scene';

const Stack = createStackNavigator();

export const OnboardingNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        {/* <Stack.Screen name={AppRoute.ONBOARDING_INTERESTS} component={OnboardingScene} options={{gestureEnabled: false}}/> */}
        <Stack.Screen name={AppRoute.ONBOARDING_GET_STARTED} component={GetStartedScene} options={{gestureEnabled: false}}/>
    </Stack.Navigator>
);
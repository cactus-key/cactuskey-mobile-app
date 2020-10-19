import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';
import { FlowScene } from '../scenes/flow';
import { ProfileScene } from '../scenes/profile';
import { SinglePostScene } from '../scenes/singlepost';
import { SettingsScene } from '../scenes/settings';

const Stack = createStackNavigator();

export const FlowNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.FLOW} component={FlowScene}/>
    <Stack.Screen name={AppRoute.PROFILE} component={ProfileScene}/>
    <Stack.Screen name={AppRoute.SINGLEPOST} component={SinglePostScene}/>
    <Stack.Screen name={AppRoute.SETTINGS} component={SettingsScene}/>
  </Stack.Navigator>
);
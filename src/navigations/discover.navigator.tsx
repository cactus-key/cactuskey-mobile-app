import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';
import { DiscoverScene } from '../scenes/discover';
import { ProfileScene } from '../scenes/profile';
import { SinglePostScene } from '../scenes/singlepost';

const Stack = createStackNavigator();

export const DiscoverNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.DISCOVER} component={DiscoverScene}/>
    <Stack.Screen name={AppRoute.PROFILE} component={ProfileScene}/>
    <Stack.Screen name={AppRoute.SINGLEPOST} component={SinglePostScene}/>
  </Stack.Navigator>
);
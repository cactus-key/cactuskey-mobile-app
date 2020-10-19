import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';
import { NotificationsScene } from '../scenes/notifications';
import { ProfileScene } from '../scenes/profile';
import { SinglePostScene } from '../scenes/singlepost';

const Stack = createStackNavigator();

export const NotificationsNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.NOTIFICATIONS} component={NotificationsScene}/>
    <Stack.Screen name={AppRoute.PROFILE} component={ProfileScene}/>
    <Stack.Screen name={AppRoute.SINGLEPOST} component={SinglePostScene}/>
  </Stack.Navigator>
);
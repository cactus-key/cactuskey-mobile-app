import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';
import { ListScene } from '../scenes/Services/List.scene';

const Stack = createStackNavigator();

export const ServicesNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.SERVICES} component={ListScene}/>
    {/* <Stack.Screen name={AppRoute.PROFILE} component={ProfileScene}/>
    <Stack.Screen name={AppRoute.SINGLEPOST} component={SinglePostScene}/>
    <Stack.Screen name={AppRoute.SETTINGS} component={SettingsScene}/> */}
  </Stack.Navigator>
);
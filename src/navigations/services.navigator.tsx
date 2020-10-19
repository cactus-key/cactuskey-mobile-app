import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';
import { ListScene } from '../scenes/Services/List.scene';
import { AddScene } from '../scenes/Services/Add.scene';

const Stack = createStackNavigator();

export const ServicesNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.SERVICES_LIST} component={ListScene}/>
    <Stack.Screen name={AppRoute.SERVICES_ADD} component={AddScene}/>
  </Stack.Navigator>
);
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';
import { ListScene } from '../scenes/Services/List.scene';
import { AddScene } from '../scenes/Services/Add.scene';
import { AddManual_IssuerScene } from '../scenes/Services/AddManual-Issuer.scene';
import { AddManual_InfoScene } from '../scenes/Services/AddManual-Info.scene';
import { EditScene } from '../scenes/Services/Edit.scene';

const Stack = createStackNavigator();

export const ServicesNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.SERVICES_LIST} component={ListScene}/>
    <Stack.Screen name={AppRoute.SERVICES_ADD} component={AddScene}/>
    <Stack.Screen name={AppRoute.SERVICES_ADD_MANUAL_ISSUER} component={AddManual_IssuerScene}/>
    <Stack.Screen name={AppRoute.SERVICES_ADD_MANUAL_INFO} component={AddManual_InfoScene}/>
    <Stack.Screen name={AppRoute.SERVICES_EDIT} component={EditScene}/>
  </Stack.Navigator>
);
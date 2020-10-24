import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';

import { OnboardingNavigator } from './onboarding.navigator';

import { ListScene } from '../scenes/Services/List.scene';
import { AddScene } from '../scenes/Services/Add.scene';
import { AddManual_IssuerScene } from '../scenes/Services/AddManual-Issuer.scene';
import { AddManual_InfoScene } from '../scenes/Services/AddManual-Info.scene';
import { EditScene } from '../scenes/Services/Edit.scene';

import { IndexScene } from '../scenes/Settings/Index.scene';

const Stack = createStackNavigator();

export const AppNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.ONBOARDING} component={OnboardingNavigator} options={{gestureEnabled: false}}/>
    
    <Stack.Screen name={AppRoute.SERVICES_LIST} component={ListScene} options={{gestureEnabled: true}}/>
    <Stack.Screen name={AppRoute.SERVICES_ADD} component={AddScene}/>
    <Stack.Screen name={AppRoute.SERVICES_ADD_MANUAL_ISSUER} component={AddManual_IssuerScene}/>
    <Stack.Screen name={AppRoute.SERVICES_ADD_MANUAL_INFO} component={AddManual_InfoScene}/>
    <Stack.Screen name={AppRoute.SERVICES_EDIT} component={EditScene}/>

    <Stack.Screen name={AppRoute.SETTINGS_INDEX} component={IndexScene}/>
    {/* <Stack.Screen name={AppRoute.MAIN} component={ServicesNavigator} options={{gestureEnabled: false}}/> */}
  </Stack.Navigator>
);
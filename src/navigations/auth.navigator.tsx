import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoute } from './app.routes';
import { EmailScene, PasswordScene, ResetPasswordScene, RegisterScene, LoadingScene, PhoneCaptchaScene, PhoneConfirmScene } from '../scenes/auth';

const Stack = createStackNavigator();

export const AuthNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    {/* <Stack.Screen name={AppRoute.AUTH_PHONE_CAPTCHA} component={PhoneCaptchaScene}/>
    <Stack.Screen name={AppRoute.AUTH_PHONE_CONFIRM} component={PhoneConfirmScene}/> */}
    <Stack.Screen name={AppRoute.AUTH_LOADING} component={LoadingScene} options={{gestureEnabled: false}}/>
    <Stack.Screen name={AppRoute.AUTH_EMAIL} component={EmailScene} options={{gestureEnabled: false}}/>
    <Stack.Screen name={AppRoute.AUTH_PASSWORD} component={PasswordScene}/>
    <Stack.Screen name={AppRoute.AUTH_RESET_PASSWORD} component={ResetPasswordScene}/>
    <Stack.Screen name={AppRoute.AUTH_REGISTER} component={RegisterScene}/>
  </Stack.Navigator>
);
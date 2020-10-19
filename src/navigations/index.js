console.log("H1");
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
console.log("H1");
import AuthNavigator from './auth-navigator';
import AppNavigator from './app-navigator';

console.log("H1");
const RootNavigator = createSwitchNavigator(
  // {
  //   Auth: AuthNavigator,
  //   App: AppNavigator,
  // },
  // {
  //   initialRouteName: 'Auth',
  // },
);
console.log("H2");

export default createAppContainer(RootNavigator);
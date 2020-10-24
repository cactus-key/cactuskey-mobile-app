import React from 'react';
import { AppRoute } from './app.routes';
import { Feather } from '@expo/vector-icons';
import { withStyles } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Tabs
import { ServicesNavigator } from './services.navigator';
import { SettingsNavigator } from './settings.navigator';

const BottomTab = createBottomTabNavigator();

const _MainNavigator = (props) => {
  const { theme } = props;
  return (
    <BottomTab.Navigator tabBarOptions={{
        activeBackgroundColor: theme['color-basic-800'],
        inactiveBackgroundColor: theme['color-basic-800'],
        activeTintColor: '#FFF',
        inactiveTintColor: theme['color-basic-300'],
        showLabel: false,
        showIcon: true,
      }}>

      <BottomTab.Screen
        name={AppRoute.SERVICES}
        component={ServicesNavigator}
        options={{tabBarIcon: (color) => (<Feather name="home" color={color.color} size={26}/>)}}
      />
      <BottomTab.Screen
        name={AppRoute.SETTINGS}
        component={SettingsNavigator}
        options={{tabBarIcon: (color) => (<Feather name="settings" color={color.color} size={26}/>)}}
      />

    </BottomTab.Navigator>
  );
}

export const MainNavigator = withStyles(_MainNavigator);

// export const MainNavigator = (): React.ReactElement => (
//   <BottomTab.Navigator tabBarOptions={{
//         activeBackgroundColor: customTheme['color-basic-800'],
//         inactiveBackgroundColor: customTheme['color-basic-800'],
//         activeTintColor: '#FFF',
//         inactiveTintColor: customTheme['color-basic-300'],
//         showLabel: false,
//         showIcon: true,
//         }}>

//         <BottomTab.Screen
//           name={AppRoute.SERVICES}
//           component={ServicesNavigator}
//           options={{tabBarIcon: (color) => (<Feather name="home" color={color.color} size={26}/>)}}
//         />
//         <BottomTab.Screen
//           name={AppRoute.SETTINGS}
//           component={SettingsNavigator}
//           options={{tabBarIcon: (color) => (<Feather name="settings" color={color.color} size={26}/>)}}
//         />

//     </BottomTab.Navigator>
// );
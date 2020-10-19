import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppRoute } from './app.routes';
import { default as customTheme } from '../styles/theme.json';
import { Feather, FontAwesome } from '@expo/vector-icons';

// Tabs
import { FlowNavigator } from './flow.navigator';
import { DiscoverNavigator } from './discover.navigator';
import { ContestScene } from '../scenes/contest';
import { GroupsScene } from '../scenes/groups';
import { NotificationsNavigator } from './notifications.navigator';
import { ServicesNavigator } from './services.navigator';

const BottomTab = createBottomTabNavigator();

export const MainNavigator = (): React.ReactElement => (
  <BottomTab.Navigator tabBarOptions={{
        activeBackgroundColor: customTheme['color-basic-800'],
        inactiveBackgroundColor: customTheme['color-basic-800'],
        activeTintColor: '#FFF',
        inactiveTintColor: customTheme['color-basic-300'],
        showLabel: false,
        showIcon: true,
        }}>

        <BottomTab.Screen
        name={AppRoute.SERVICES}
        component={ServicesNavigator}
        options={{tabBarIcon: (color) => (<Feather name="copy" color={color.color} size={26}/>)}}
        />
        {/* <BottomTab.Screen
        name={AppRoute.DISCOVER}
        component={DiscoverNavigator}
        options={{tabBarIcon: (color) => (<Feather name="search" color={color.color} size={26}/>)}}
        />
        <BottomTab.Screen
        name={AppRoute.CONTEST}
        component={ContestScene}
        options={{tabBarIcon: (color) => (<FontAwesome name="trophy" color={color.color} size={32}/>)}}
        />
        <BottomTab.Screen
        name={AppRoute.NOTIFICATIONS}
        component={NotificationsNavigator}
        options={{tabBarIcon: (color) => (<Feather name="bell" color={color.color} size={26}/>)}}
        />
        <BottomTab.Screen
        name={AppRoute.GROUPS}
        component={GroupsScene}
        options={{tabBarIcon: (color) => (<Feather name="grid" color={color.color} size={26}/>)}}
        /> */}

    </BottomTab.Navigator>
);
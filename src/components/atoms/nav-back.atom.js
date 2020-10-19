import React from 'react';
import { TopNavigationAction } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';

const NavBack = ({navigation}) => (
    <TopNavigationAction
        icon={() => (<Feather name="chevron-left" color='#CCC' size={26}/>)}
        onPress={navigation.goBack} />
);

export default NavBack;
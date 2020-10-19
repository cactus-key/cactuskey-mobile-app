import React from 'react';
import { View, StatusBar } from 'react-native';
import styles from '../styles/statusbar.style';

const AppStatusBar = () => (
    <View style={styles.statusBar}>
        <StatusBar translucent barStyle="light-content" />
    </View>
);

export default AppStatusBar;
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { default as customTheme } from './theme.json';
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

export default StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
        backgroundColor: customTheme['color-basic-800']
    }
});
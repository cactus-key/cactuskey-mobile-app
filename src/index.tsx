import React from 'react';
import { SafeAreaView } from 'react-native';
import { withStyles } from '@ui-kitten/components';

import * as ScreenOrientation from 'expo-screen-orientation';
import {NavigationContainer} from '@react-navigation/native';

import {connect} from 'react-redux';

import { AppNavigator } from './navigations/app.navigator';
import FlashMessage from "react-native-flash-message";

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as customDarkTheme } from './styles/dark-theme.json';
import { default as customLightTheme } from './styles/light-theme.json';
import { mapping, light as defaultLightTheme, dark as defaultDarkTheme } from '@eva-design/eva';
const lightTheme = {...defaultLightTheme, ...customLightTheme};
const darkTheme = {...defaultDarkTheme, ...customDarkTheme};

import AppStatusBar from './components/statusbar';
import * as Font from 'expo-font';

type AppProps = {current_theme: string, loading: boolean, theme: any};

class _App extends React.Component<AppProps> {
  constructor() {
    super({loading: true, current_theme: 'light', theme: {}});
    this.state = {};
  }

  async componentDidMount() {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    Font.loadAsync({
      Roboto_Black: require('./assets/fonts/Roboto-Black.ttf'),
      Roboto_Bold: require('./assets/fonts/Roboto-Bold.ttf'),
      Roboto_Medium: require('./assets/fonts/Roboto-Medium.ttf'),
      Roboto_Regular: require('./assets/fonts/Roboto-Regular.ttf'),
      Roboto_Light: require('./assets/fonts/Roboto-Light.ttf'),
    });
  }

  render() {
    return (         
      <ApplicationProvider
        mapping={mapping}
        theme={this.props.current_theme === 'dark' ? darkTheme : lightTheme}>
          <IconRegistry icons={EvaIconsPack} />
          <AppStatusBar/>
          <NavigationContainer>
            <SafeAreaView style={{
              flex: 1,
              backgroundColor: this.props.current_theme === 'dark' ? '#383838' : 'blue'
            }}>
              <AppNavigator/>
            </SafeAreaView>
              
          </NavigationContainer>
          <FlashMessage position="bottom" />
      </ApplicationProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    current_theme: state.settings.current_theme
  };
}
const App = withStyles(connect(mapStateToProps)(_App));
export default App;

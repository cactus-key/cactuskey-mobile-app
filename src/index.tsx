import React from 'react';
import bugsnag from '@bugsnag/expo';
import {NavigationContainer} from '@react-navigation/native';

import {Provider} from 'react-redux';
import {getStore, getPersistor} from './store/configure_store';
import { PersistGate } from 'redux-persist/integration/react'

import { AppNavigator } from './navigations/app.navigator';

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as customTheme } from './styles/theme.json';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';
const appTheme = { ...darkTheme, ...customTheme };

import AppStatusBar from './components/organisms/statusbar';

// Generate error boundary for bugsnag reporting
const ErrorBoundary = bugsnag().getPlugin('react');

// Disable all yellow warnings
console.disableYellowBox = true;

class App extends React.Component {
  constructor() {
    super({loading: true});
    this.state = { loading: true };
  }

  async componentDidMount() {
    // await Font.loadAsync({
    //   Roboto: require('native-base/Fonts/Roboto.ttf'),
    //   Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    //   Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    // });

    this.setState({ loading: false });
  }

  render() {
    // const { loading } = this.state;

    // if (loading) {
    //   return <Loading />;
    // }

    return (
        <ErrorBoundary>
            <Provider store={getStore()}>
                <PersistGate persistor={getPersistor()}>
                    <IconRegistry icons={EvaIconsPack} />
                    <ApplicationProvider mapping={mapping} theme={appTheme}>
                        <AppStatusBar/>
                        <NavigationContainer>
                            <AppNavigator/>
                        </NavigationContainer>
                    </ApplicationProvider>
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    );
  }
}

export default App;

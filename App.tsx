import React from 'react';
import Root from './src/index';
import bugsnag from '@bugsnag/expo';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {getStore, getPersistor} from './src/store/configure_store';

// Generate error boundary for bugsnag reporting
const ErrorBoundary = bugsnag().getPlugin('react');

// Disable all yellow warnings
console.disableYellowBox = true;

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={getStore()}>
        <PersistGate persistor={getPersistor()}>
          <Root/>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

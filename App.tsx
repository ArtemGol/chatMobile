/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {store} from './src/store';
import {Provider} from 'react-redux';
import {MainNavigator} from './src/components/MainNavigator.tsx';

const App = () => {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
};

export default App;

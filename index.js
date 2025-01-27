/**
 * @format
 */

import {AppRegistry, View} from 'react-native';

import {name as appName} from './app.json';
import React, {useEffect} from 'react';
import App from './App';

const index = () => {
  useEffect(() => {
    console.log('============================');
    console.log('Welcome to TickTock');
    console.log('============================');
  }, []);

  return (
    <View>
      <App />
    </View>
  );
};

AppRegistry.registerComponent(appName, () => index);

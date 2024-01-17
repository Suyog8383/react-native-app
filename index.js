/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';

// Register background handler

async function onMessageReceived(message) {
  // Do something
  console.log('@SN ', message);
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

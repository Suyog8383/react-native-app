/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
//import liraries
import React, {Component, useEffect, useState} from 'react';

import Home from './components/home';
import NoInternetComponent from './components/noInternet';
import WebViewComponent from './components/webView';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
import TouchID from 'react-native-touch-id';
import {BackHandler, Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

// create a component
const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="/webView" component={WebViewComponent} />
        <Stack.Screen name="/noInternet" component={NoInternetComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//make this component available to the app
export default App;

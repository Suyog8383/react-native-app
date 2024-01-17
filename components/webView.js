/* eslint-disable prettier/prettier */
//import liraries
import React, {useEffect, useRef, useState} from 'react';
import {Alert, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
import TouchID from 'react-native-touch-id';
import messaging from '@react-native-firebase/messaging';

// create a component
const WebViewComponent = ({navigation}) => {
  const webViewRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [auth, setAuth] = useState(false);

  const url = 'https://www.google.com/';

  //get firebase token start
  const getFirebaseToken = async () => {
    const token = await messaging().getToken();
    console.log('@SN token', token);
  };
  useEffect(() => {
    getFirebaseToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  //get firebase token end

  //biomatric handler start
  useEffect(() => {
    handleBioMatric();
  }, []);
  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false,
  };
  const handleBioMatric = () => {
    TouchID.isSupported(optionalConfigObject).then(biometryType => {
      // Success code
      if (biometryType === 'FaceID') {
        console.log('FaceID is supported.');
      } else {
        if (auth) {
          return null;
        }
        TouchID.authenticate('', optionalConfigObject)
          .then(success => {
            console.log('success', success);
            setAuth(success);
          })
          .catch(error => {
            console.log('error', error);
            BackHandler.exitApp();
          });
      }
    });
  };

  //biomatric handler end

  //webView navigation handler start
  const goBack = () => {
    if (currentUrl === url) {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'OK', onPress: () => BackHandler.exitApp()},
      ]);

      return true;
    }
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backAction = () => {
      goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  //webView navigation handler end

  //reload the webView start
  const reloadPage = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };
  //reload the webView end

  //event handler for no internet
  const handleError = () => {
    navigation.navigate('/noInternet');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {auth && (
        <WebView
          ref={webViewRef}
          source={{uri: url}}
          style={{flex: 1}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onError={handleError}
          onNavigationStateChange={navState => {
            setCurrentUrl(navState.url);
          }}
        />
      )}
    </SafeAreaView>
  );
};

//make this component available to the app
export default WebViewComponent;

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";

import { NavigationContainer } from "@react-navigation/native";

import MainStack from "./navigation/MainStack";

import { Platform, View } from "react-native";

import PushNotification from "react-native-push-notification";

import messaging from "@react-native-firebase/messaging";
import Alert from "./components/modal/Alert";


// Must be outside of any component LifeCycle (such as `componentDidMount`).
// PushNotification.configure({
//   onRegister: function (token) {
//     console.log("token:", token);
//   },

//   // (required) Called when a remote is received or opened, or local notification is opened
//   onNotification: function (notification) {
//     //
//     if (notification.action === "ReplyInput") {
//       console.log("texto", notification.reply_text); // this will contain the inline reply text.
//     }

//     // process the notification

//     // (required) Called when a remote is received or opened, or local notification is opened
//     // notification.finish(PushNotificationIOS.FetchResult.NoData);
//   },

//   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//   onAction: function (notification) {
//     console.log("act:", notification.action);
//     console.log("ntfact:", notification);

//     // process the action
//   },

//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: function (err) {
//     console.error(err.message, err);
//   },
//   popInitialNotification: true,
//   requestPermissions: Platform.OS === "ios",
// });

export default function App() {
  useEffect(() => {
   

    async function requestPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        
      }
    }

    requestPermission();
  }, []);
  return (
    <Provider store={store}>
      
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
      <Alert />
    </Provider>
  );
}

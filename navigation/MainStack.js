import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screen/Login";
import User from "../screen/User";
import { useDispatch, useSelector } from "react-redux";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import PushNotification, { Importance } from "react-native-push-notification";
import useFcmToken from "../hooks/useFcmToken";


const StackNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        statusBarColor: "#0163d2",
        headerShown: false,
        headerStyle: {
          backgroundColor: "#0163d2",
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="User"
        component={User}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen name="LoginUser" component={LoginNav} />
    </Stack.Navigator>
  );
};
const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="StackNav" component={StackNav} />
    </Stack.Navigator>
  );
};
const MainStack = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { accessToken } = useSelector(state => state.auth);
  useFcmToken();
  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
     
    } else {
      setIsLoggedIn(false);
    }
  }, [accessToken]); 
  const firebaseConfig = {
    apiKey: "AIzaSyBZCm0SGTZU7w2YzNmXXFsRiqa59oITRC8",
    authDomain: "pushnotifications-ef4ee.firebaseapp.com",
    projectId: "pushnotifications-ef4ee",
    storageBucket: "pushnotifications-ef4ee.appspot.com",
    messagingSenderId: "111660816777",
    appId: "1:111660816777:android:2941066c9637578edea958",
  };

  const createChannel = (channelId) => {
    PushNotification.createChannel({
      channelId: channelId, // (required)
      channelName: "My channel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: PushNotification.Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    });
  };
  const showNotification = (options) => {
    console.log("options", options);
  
    // Kanal oluşturma
    const channelId = options.channelId || "default-channel";
    createChannel(channelId);
  
    // Bildirimi gönderme
    PushNotification.localNotification({
      channelId: channelId,
      title: options.title,
      message: options.message,  // Buradaki hatayı düzelttik
      subText: options.subText,
      playSound: true,
      soundName: 'default',
      color: options.color || "red",  // Varsayılan renk kırmızı
      bigPictureUrl: options.bigImage,  // Büyük resim URL'si
      priority: "high",  // Yüksek öncelik
      vibrate: true,  // Bildirimde titreşim
      vibrateTimings: [200, 500, 800],
      imageUrl: options.bigImage,  // Görsel ekleme
    });
  };
  

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    messaging()
      .getToken()
      .then((token) => {
        console.log(`Token: ${token}`);
      });

      const unsubscribe = messaging().onMessage(async (remoteMsg) => {
        const channelId = Math.random().toString(36).substring(7);  // Kanal ID'si oluşturuluyor
        createChannel(channelId);  // Kanalı oluştur
      
        const options = {
          channelId: channelId,
          title: remoteMsg.notification?.android?.title,  // Başlık
          message: remoteMsg.notification?.android?.body,  // Mesaj içeriği
          subText: remoteMsg.data?.subTitle || "Aybars Gokce Erdemir",  // Alt metin
          color: remoteMsg.notification?.android?.color || "red",  // Renk
          bigImage: remoteMsg.notification?.android?.imageUrl || "Varsayılan Resim URL",  // Büyük resim
        };
      
        showNotification(options);  // Bildirimi tetikle
        console.log("remoteMsg", remoteMsg);  // Gelen mesajı konsola yazdır
      });
      
    messaging().setBackgroundMessageHandler(async (remoteMsg) => {
      console.log(`remoteMsg Background`, remoteMsg);
    });

    return unsubscribe;
  }, []);
  // useEffect(() => {
  //   const channelId = 'my-channel';
  // createChannel(channelId); // Kanalı oluştu
  //   PushNotification.localNotification({
  //     channelId: channelId,
  //     title: 'Test Notification',
  //     message: 'This is a test notification',
  //     playSound: true,
  //     soundName: 'default',
  //   });
  // },[])

  return isLoggedIn ? <StackNav /> : <LoginNav />;
};

export default MainStack;

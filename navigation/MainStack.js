import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import useFcmToken from "../hooks/useFcmToken";

import LoginNav from "./LoginNav";
import DrawerNav from "./DrawerNav";

const MainStack = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { accessToken } = useSelector((state) => state.auth);
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
    PushNotification.createChannel(
      {
        channelId: channelId, // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: PushNotification.Importance.HIGH, // (optional) default: Importance.HIGH
        vibrate: true, // (optional) default: true
      },
      (created) => console.log(`Channel created: ${created}`)
    );
    return channelId; // Kanal ID'sini döndür
  };
  const showNotification = (options) => {
    console.log("Notification Options:", options);
    PushNotification.localNotification({
      channelId: options.channelId, // Kanal ID
      title: options.title,
      message: options.message, 
      subText: options.subText,
      playSound: true,
      soundName: "default",
      color: options.color || "red",
      bigPictureUrl: options.bigImage,
      priority: "high",
      vibrate: true,
    });
  };
  

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  
    // Firebase token'ı al
    // messaging()
    //   .getToken()
    //   .then((token) => {
    //     console.log(`Token: ${token}`);
    //   });
  
    // Mesaj dinleyicisini ekle
    const unsubscribe = messaging().onMessage(async (remoteMsg) => {
      console.log("Received remote message:", remoteMsg);
  
      const channelId = Math.random().toString(36).substring(7); // Rastgele kanal ID oluştur
      createChannel(channelId); // Kanal oluştur
  
      const options = {
        channelId: channelId, // Kullanılacak kanal ID'si
        title: remoteMsg.notification?.title || "Varsayılan Başlık", // Bildirim başlığı
        message: remoteMsg.notification?.body || "Varsayılan Mesaj", // Bildirim mesajı
        subText: remoteMsg.data?.subTitle || "Alt Başlık Yok", // Alt başlık
        color: remoteMsg.notification?.android?.color || "red", // Renk
        bigImage: remoteMsg.notification?.android?.imageUrl || null, // Büyük resim
      };
  
      // Bildirimi göster
      showNotification(options);
    });
  
    messaging().setBackgroundMessageHandler(async (remoteMsg) => {
      console.log("Background message received:", remoteMsg);
    });
  
    return unsubscribe;
  }, []);
  

  return <>{isLoggedIn ? <DrawerNav /> : <LoginNav />}</>;
};

export default MainStack;

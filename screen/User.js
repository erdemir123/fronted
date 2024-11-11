import React from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useGetUsersQuery } from '../features/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../features/authSlice';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { useLogOutMutation } from '../features/apiSlice';


const User = () => {
  const navigation = useNavigation();
  const { data, error, isLoading } = useGetUsersQuery();
  const [logOut] = useLogOutMutation();
 

  const dispatch = useDispatch();

  const accessToken = useSelector(state => state.auth.accessToken);
  const user = useSelector(state => state.auth.user);
  console.log("accessToken====>",accessToken)

  const handleLogout = async () => {
    console.log("Çıkış işlemi başlıyor...");
    try {
      // Sunucudan çıkış yap
      await logOut().unwrap();
  
     
  
      // Giriş ekranına yönlendir
      navigation.navigate("LoginUser");
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    }
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
  const testNotification = () => {
   
    const channelId = 'my-channel';
    createChannel(channelId); // Kanalı oluştu
      PushNotification.localNotification({
        channelId: channelId,
        title: 'Test Notification',
        message: 'This is a test notification',
        playSound: true,
        soundName: 'default',
      }); 
  };
  


  return (
    <View style={styles.container}>
     <Text> {user?.username}</Text>
      <TouchableOpacity  onPress={handleLogout} className="bg-blue-500 px-4 py-2 rounded" ><Text>Çıkış Yap</Text></TouchableOpacity>
      
      <Text>k{accessToken}</Text>
      <Button title="Test Notification" onPress={testNotification} />
      <FlatList
        data={data?.data || []}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.username}>{item.username}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:"red"
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontWeight: 'bold',
  },
});

export default User;

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';  // `TouchableOpacity` ve `Text`'i import edin
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // navigation objesini almak için
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Habits from '../screen/Habits';
import User from '../screen/User';
import Icon from "react-native-vector-icons/MaterialIcons";
import Notification from '../screen/Notification';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = (props) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          flex: 1,
          overflow: "hidden",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        },
        props.style, // Ekstra stil verilirse burada birleştirilebilir.
      ]}
      activeOpacity={1} // Ripple etkisini kaldırır.
    >
      {props.children}
    </TouchableOpacity>
  );
};

const TabNav = () => {
    const navigation = useNavigation();  // navigation objesini almak için
  
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#fff",
            borderRadius: 20,
            position: "absolute",
            bottom: 10,
            marginHorizontal: 20,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
          },
          tabBarButton: (props) => <CustomTabBarButton {...props} />, // Tüm düğmeler için geçerli
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} className="w-12   ">
               <Icon name="menu" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      >
        <Tab.Screen
          name="Habit"
          component={Habits}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="user" size={22} color={color} />
            ),
           
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notification}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="calendar" size={22} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };
  
  export default TabNav;


  
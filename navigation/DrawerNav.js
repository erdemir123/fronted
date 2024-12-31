import { View, Text, Image } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack"; // Stack Navigator import
import TabNav from "./TabNav";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Settings from "../screen/Settings";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useLogOutMutation } from "../features/apiSlice";
import { logOutUser } from "../features/authSlice";
import TopNav from "./TopNav";

const DrawerContent = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const [logOut, { isLoading }] = useLogOutMutation();
  const dispatch = useDispatch();

  // Menü öğeleri
  const menuItems = [
    { id: 1, name: "Home", screen: "Notifications", icon: "🏠" },
    { id: 2, name: "Habit", screen: "Habit", icon: "📅" },
  ];
  const handleLogout = async () => {
    console.log("Çıkış işlemi başlıyor...");
    try {
      // Sunucudan çıkış yap
      await logOut().unwrap();
      dispatch(logOutUser());
      // Giriş ekranına yönlendir
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#AFDAEA", "#144677"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1 py-5 px-2 bg-[#AFDAEA]"
    >
      {/* Kullanıcı Bilgileri */}
      <View className="flex flex-row items-center justify-center p-2  space-x-2  rounded-md   bg-slate-700">
        <Image
          source={{ uri: `http://10.0.2.2:8000${user?.profileImage}` }}
          className="w-14 h-14 rounded-full border bg-white border-slate-500 "
          alt="userImage"
        />
        <View>
          <Text className="text-white text-lg font-semibold">
            {user?.username}
          </Text>
          <Text className="text-sm text-white">{user?.email}</Text>
        </View>
        <TouchableOpacity
          className="mt-2 flex-1  items-end "
          onPress={() => navigation.navigate("Main", { screen: "Settings" })}
        >
          <FontAwesome name="edit" size={30} color={"white"} />
        </TouchableOpacity>
      </View>
      <View className="w-full h-[2px]  bg-slate-600 my-2"></View>

      {/* Menü Öğeleri */}
      <View className="space-y-4 border flex-1 rounded-md bg-slate-800">
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row items-center p-3 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
            onPress={() => {
              navigation.navigate("Main", {
                screen: "TabNav",
                params: {
                  screen: item.screen,
                },
              });
              console.log("first", item.screen);
            }}
          >
            <Text className="text-2xl">{item.icon}</Text>
            <Text className="ml-4 text-white text-lg font-medium">
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          
          className="flex-row items-center p-3 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
          onPress={() => navigation.navigate("Main", { screen: "TopNav" })}
        >
          <Text className="text-2xl">icon koy</Text>
          <Text className="ml-4 text-white text-lg font-medium">
            TopNav
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => handleLogout()}
        className="flex-row  p-3 rounded-md border bg-slate-800 mt-2 justify-start items-center"
      >
        <Icon name="logout" size={20} color={"white"} />
        <Text className="text-white text-lg font-medium"> Çıkış Yap</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackScreens = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNav" component={TabNav} />

      <Stack.Screen name="TopNav" component={TopNav} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Main" component={StackScreens} />
    </Drawer.Navigator>
  );
};

export default DrawerNav;
